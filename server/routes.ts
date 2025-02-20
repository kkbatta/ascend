import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { insertUserSchema } from "@shared/schema";
import { orgMembers } from "@shared/schema";
import { asc, eq } from "drizzle-orm";
import { db } from './db';

export async function registerRoutes(app: Express): Promise<Server> {
  // Code generation endpoint
  app.post('/api/generate-code', async (req, res) => {
    try {
      const apiKey = req.headers['x-openai-key'];
      if (!apiKey || typeof apiKey !== 'string') {
        return res.status(400).json({ error: 'OpenAI API key is required' });
      }

      const { idea, context } = req.body;

      // Initialize OpenAI client with the provided API key
      const openai = new OpenAI({ apiKey });

      // Create a prompt for code generation
      const prompt = `
        You are an expert software developer. Please implement the following enhancement:
        "${idea}"

        Context: This enhancement is for the ${context} page of our MLM team performance application.

        Please provide:
        1. List of files that need to be modified
        2. Code changes for each file
        3. Any new files that need to be created

        Respond in JSON format with the following structure:
        {
          "files": [
            {
              "path": "string",
              "content": "string",
              "type": "modify" | "create"
            }
          ],
          "description": "string"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      // Parse the response and apply changes
      const result = JSON.parse(response.choices[0].message.content ?? '{}');
      res.json(result);
    } catch (error) {
      console.error('Code generation error:', error);
      res.status(500).json({ error: 'Failed to generate code' });
    }
  });

  // Referral system endpoints
  app.post('/api/users/:userId/referral-code', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const referralCode = await storage.generateReferralCode(userId);
      res.json({ referralCode });
    } catch (error) {
      console.error('Referral code generation error:', error);
      res.status(500).json({ error: 'Failed to generate referral code' });
    }
  });

  app.get('/api/referral/:code', async (req, res) => {
    try {
      const referralCode = req.params.code;
      const referrer = await storage.getUserByReferralCode(referralCode);

      if (!referrer) {
        return res.status(404).json({ error: 'Invalid referral code' });
      }

      res.json({ 
        valid: true,
        referrerId: referrer.id,
        referrerUsername: referrer.username 
      });
    } catch (error) {
      console.error('Referral code validation error:', error);
      res.status(500).json({ error: 'Failed to validate referral code' });
    }
  });

  // Register with referral code
  app.post('/api/register', async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: 'Invalid user data' });
      }

      const { referralCode, ...userData } = result.data;

      // Create the user first without a referrer
      const user = await storage.createUser({
        ...userData,
        referredBy: null // Initialize with no referrer
      });

      try {
        // Find the top-level user (the one whose org member has lowest level number)
        const [topAgent] = await db
          .select({
            userId: orgMembers.id,
            level: orgMembers.level
          })
          .from(orgMembers)
          .orderBy(asc(orgMembers.level))
          .limit(1);

        if (!topAgent) {
          // If no org structure exists, create the first member
          await storage.createMember({
            id: user.id,
            name: userData.fullName,
            designation: "CEO",
            compensationPercentage: 78.0,
            yearlyIncome: 0,
            level: 1,
            parentId: null
          });
        } else {
          // Create regular member under top agent
          await storage.createMember({
            id: user.id,
            name: userData.fullName,
            designation: "Associate",
            compensationPercentage: 5.0,
            yearlyIncome: 0,
            level: topAgent.level + 1,
            parentId: topAgent.userId
          });

          // Update user with referrer's user ID
          await storage.updateUser(user.id, {
            referredBy: topAgent.userId
          });
        }

        // Generate a referral code for the new user
        const newReferralCode = await storage.generateReferralCode(user.id);

        res.json({ 
          ...user, 
          referralCode: newReferralCode 
        });
      } catch (error) {
        // If org member creation fails, clean up the user
        await storage.deleteUser(user.id);
        throw error;
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  // Add new endpoint for fetching organization hierarchy
  app.get('/api/org-hierarchy', async (req, res) => {
    try {
      // Get all org members ordered by level
      const members = await db
        .select()
        .from(orgMembers)
        .orderBy(asc(orgMembers.level));

      // Transform flat data into hierarchical structure
      const buildHierarchy = (parentId: number | null = null) => {
        return members
          .filter(m => m.parentId === parentId)
          .map(member => ({
            id: member.id.toString(),
            name: member.name,
            designation: member.designation,
            compensationPercentage: member.compensationPercentage,
            yearlyIncome: member.yearlyIncome,
            level: member.level,
            children: buildHierarchy(member.id)
          }));
      };

      const hierarchy = buildHierarchy();
      res.json(hierarchy);
    } catch (error) {
      console.error('Error fetching org hierarchy:', error);
      res.status(500).json({ error: 'Failed to fetch organization hierarchy' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}