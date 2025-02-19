import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  orgMembers,
  teamStats,
  achievements,
  memberAchievements,
  prospectNotes,
  prospectDocuments,
  type User,
  type InsertUser,
  type OrgMember,
  type InsertOrgMember,
  type TeamStats,
  type Achievement,
  type ProspectNote,
  type InsertProspectNote,
  type ProspectDocument,
  type InsertProspectDocument
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Organization member operations
  getMember(id: number): Promise<OrgMember | undefined>;
  getMembers(): Promise<OrgMember[]>;
  getMembersByDesignation(designation: string): Promise<OrgMember[]>;
  getMemberChildren(parentId: number): Promise<OrgMember[]>;
  createMember(member: InsertOrgMember): Promise<OrgMember>;

  // Team stats operations
  getTeamStats(memberId: number): Promise<TeamStats[]>;
  createTeamStats(stats: TeamStats): Promise<TeamStats>;

  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getMemberAchievements(memberId: number): Promise<Achievement[]>;
  addMemberAchievement(memberId: number, achievementId: number): Promise<void>;

  // Prospect notes operations
  getProspectNotes(prospectId: number): Promise<ProspectNote[]>;
  createProspectNote(note: InsertProspectNote): Promise<ProspectNote>;

  // Prospect documents operations
  getProspectDocuments(prospectId: number): Promise<ProspectDocument[]>;
  createProspectDocument(document: InsertProspectDocument): Promise<ProspectDocument>;
  getProspectDocument(id: number): Promise<ProspectDocument | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Organization member operations
  async getMember(id: number): Promise<OrgMember | undefined> {
    const [member] = await db.select().from(orgMembers).where(eq(orgMembers.id, id));
    return member;
  }

  async getMembers(): Promise<OrgMember[]> {
    return await db.select().from(orgMembers);
  }

  async getMembersByDesignation(designation: string): Promise<OrgMember[]> {
    return await db.select().from(orgMembers).where(eq(orgMembers.designation, designation));
  }

  async getMemberChildren(parentId: number): Promise<OrgMember[]> {
    return await db.select().from(orgMembers).where(eq(orgMembers.parentId, parentId));
  }

  async createMember(member: InsertOrgMember): Promise<OrgMember> {
    const [newMember] = await db.insert(orgMembers).values(member).returning();
    return newMember;
  }

  // Team stats operations
  async getTeamStats(memberId: number): Promise<TeamStats[]> {
    return await db.select().from(teamStats).where(eq(teamStats.memberId, memberId));
  }

  async createTeamStats(stats: TeamStats): Promise<TeamStats> {
    const [newStats] = await db.insert(teamStats).values(stats).returning();
    return newStats;
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getMemberAchievements(memberId: number): Promise<Achievement[]> {
    const memberAchievs = await db
      .select()
      .from(memberAchievements)
      .where(eq(memberAchievements.memberId, memberId))
      .leftJoin(achievements, eq(memberAchievements.achievementId, achievements.id));

    return memberAchievs.map(({ achievements }) => achievements);
  }

  async addMemberAchievement(memberId: number, achievementId: number): Promise<void> {
    await db.insert(memberAchievements).values({
      memberId,
      achievementId,
    });
  }

  // Prospect notes methods
  async getProspectNotes(prospectId: number): Promise<ProspectNote[]> {
    return await db
      .select()
      .from(prospectNotes)
      .where(eq(prospectNotes.prospectId, prospectId))
      .orderBy(prospectNotes.createdAt);
  }

  async createProspectNote(note: InsertProspectNote): Promise<ProspectNote> {
    const [newNote] = await db
      .insert(prospectNotes)
      .values(note)
      .returning();
    return newNote;
  }

  // Prospect documents methods
  async getProspectDocuments(prospectId: number): Promise<ProspectDocument[]> {
    return await db
      .select()
      .from(prospectDocuments)
      .where(eq(prospectDocuments.prospectId, prospectId))
      .orderBy(prospectDocuments.uploadedAt);
  }

  async createProspectDocument(document: InsertProspectDocument): Promise<ProspectDocument> {
    const [newDocument] = await db
      .insert(prospectDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async getProspectDocument(id: number): Promise<ProspectDocument | undefined> {
    const [document] = await db
      .select()
      .from(prospectDocuments)
      .where(eq(prospectDocuments.id, id));
    return document;
  }
}

export const storage = new DatabaseStorage();