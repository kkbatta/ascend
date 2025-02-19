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

export const prospects = pgTable("prospects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  stage: text("stage").notNull(),
  potentialScore: integer("potential_score"),
  assignedTo: integer("assigned_to").references(() => orgMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prospectActivities = pgTable("prospect_activities", {
  id: serial("id").primaryKey(),
  prospectId: integer("prospect_id").references(() => prospects.id).notNull(),
  type: text("type").notNull(), 
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdBy: integer("created_by").references(() => orgMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prospectRelations = relations(prospects, ({ one, many }) => ({
  assignedMember: one(orgMembers, {
    fields: [prospects.assignedTo],
    references: [orgMembers.id],
  }),
  activities: many(prospectActivities),
}));

export const prospectActivityRelations = relations(prospectActivities, ({ one }) => ({
  prospect: one(prospects, {
    fields: [prospectActivities.prospectId],
    references: [prospects.id],
  }),
  creator: one(orgMembers, {
    fields: [prospectActivities.createdBy],
    references: [orgMembers.id],
  }),
}));

export const insertProspectSchema = createInsertSchema(prospects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProspectActivitySchema = createInsertSchema(prospectActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertOrgMember = z.infer<typeof insertOrgMemberSchema>;
export type OrgMember = typeof orgMembers.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type TeamStats = typeof teamStats.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProspect = z.infer<typeof insertProspectSchema>;
export type Prospect = typeof prospects.$inferSelect;
export type ProspectActivity = typeof prospectActivities.$inferSelect;
export type InsertProspectActivity = z.infer<typeof insertProspectActivitySchema>;