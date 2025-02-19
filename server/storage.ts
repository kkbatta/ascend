import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  orgMembers,
  teamStats,
  achievements,
  memberAchievements,
  type User,
  type InsertUser,
  type OrgMember,
  type InsertOrgMember,
  type TeamStats,
  type Achievement
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
}

export const storage = new DatabaseStorage();