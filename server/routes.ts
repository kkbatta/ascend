import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

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

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      // Parse the response and apply changes
      const result = JSON.parse(response.choices[0].message.content);

      // TODO: Apply the changes to the files
      // For now, just return the generated code
      res.json(result);
    } catch (error) {
      console.error('Code generation error:', error);
      res.status(500).json({ error: 'Failed to generate code' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}