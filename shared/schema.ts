import { pgTable, text, serial, integer, boolean, real, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const orgMembers = pgTable("org_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  compensationPercentage: real("compensation_percentage").notNull(),
  bonusPercentage: real("bonus_percentage"),
  yearlyIncome: integer("yearly_income").notNull(),
  level: integer("level").notNull(),
  parentId: integer("parent_id").references(() => orgMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const memberRelations = relations(orgMembers, ({ one, many }) => ({
  parent: one(orgMembers, {
    fields: [orgMembers.parentId],
    references: [orgMembers.id],
  }),
  children: many(orgMembers),
}));

export const teamStats = pgTable("team_stats", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => orgMembers.id).notNull(),
  teamSize: integer("team_size").notNull(),
  monthlyRevenue: integer("monthly_revenue").notNull(),
  newRecruits: integer("new_recruits").notNull(),
  teamProduction: integer("team_production").notNull(),
  month: timestamp("month").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  type: text("type").notNull(),
  rarity: text("rarity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memberAchievements = pgTable("member_achievements", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => orgMembers.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const insertOrgMemberSchema = createInsertSchema(orgMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertTeamStatsSchema = createInsertSchema(teamStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrgMember = z.infer<typeof insertOrgMemberSchema>;
export type OrgMember = typeof orgMembers.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type TeamStats = typeof teamStats.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;