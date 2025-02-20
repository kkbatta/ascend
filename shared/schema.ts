import { pgTable, text, serial, integer, boolean, real, timestamp, foreignKey, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  aboutMe: text("about_me"),
  membershipPaid: boolean("membership_paid").default(false),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
    dateOfBirth: true,
    aboutMe: true,
    referralCode: true,
    referredBy: true,
  })
  .extend({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    dateOfBirth: z.string().transform((str) => new Date(str)),
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

export const prospectNotes = pgTable("prospect_notes", {
  id: serial("id").primaryKey(),
  prospectId: integer("prospect_id").references(() => prospects.id).notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by").references(() => orgMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const prospectDocuments = pgTable("prospect_documents", {
  id: serial("id").primaryKey(),
  prospectId: integer("prospect_id").references(() => prospects.id).notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  storageKey: text("storage_key").notNull(),
  uploadedBy: integer("uploaded_by").references(() => orgMembers.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const prospectRelations = relations(prospects, ({ one, many }) => ({
  assignedMember: one(orgMembers, {
    fields: [prospects.assignedTo],
    references: [orgMembers.id],
  }),
  activities: many(prospectActivities),
  notes: many(prospectNotes),
  documents: many(prospectDocuments),
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

export const insertProspectNoteSchema = createInsertSchema(prospectNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProspectDocumentSchema = createInsertSchema(prospectDocuments).omit({
  id: true,
  uploadedAt: true,
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
export type ProspectNote = typeof prospectNotes.$inferSelect;
export type InsertProspectNote = z.infer<typeof insertProspectNoteSchema>;
export type ProspectDocument = typeof prospectDocuments.$inferSelect;
export type InsertProspectDocument = z.infer<typeof insertProspectDocumentSchema>;

export const retiredCustomers = pgTable("retired_customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  retirementYear: integer("retirement_year").notNull(),
  netWorth: integer("net_worth").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => retiredCustomers.id).notNull(),
  type: text("type").notNull(),
  startDate: timestamp("start_date").notNull(),
  value: integer("value").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const retiredCustomerRelations = relations(retiredCustomers, ({ many }) => ({
  policies: many(policies),
}));

export const policyRelations = relations(policies, ({ one }) => ({
  customer: one(retiredCustomers, {
    fields: [policies.customerId],
    references: [retiredCustomers.id],
  }),
}));

export const insertRetiredCustomerSchema = createInsertSchema(retiredCustomers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRetiredCustomer = z.infer<typeof insertRetiredCustomerSchema>;
export type RetiredCustomer = typeof retiredCustomers.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policies.$inferSelect;

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  pagePath: text("page_path").notNull(),
  content: text("content").notNull(),
  isCustom: boolean("is_custom").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertIdeaSchema = createInsertSchema(ideas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIdea = z.infer<typeof insertIdeaSchema>;
export type Idea = typeof ideas.$inferSelect;


export const providerMetrics = pgTable("provider_metrics", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  productType: text("product_type").notNull(),
  revenue: integer("revenue").notNull(),
  policyCount: integer("policy_count").notNull(),
  averagePremium: real("average_premium").notNull(),
  month: timestamp("month").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProviderMetricsSchema = createInsertSchema(providerMetrics).omit({
  id: true,
  createdAt: true,
});

export const organizationRevenue = pgTable("organization_revenue", {
  id: serial("id").primaryKey(),
  orgMemberId: integer("org_member_id").references(() => orgMembers.id).notNull(),
  revenue: integer("revenue").notNull(),
  commissions: integer("commissions").notNull(),
  newPolicies: integer("new_policies").notNull(),
  renewals: integer("renewals").notNull(),
  month: timestamp("month").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrgRevenueSchema = createInsertSchema(organizationRevenue).omit({
  id: true,
  createdAt: true,
});

export const aiActionItems = pgTable("ai_action_items", {
  id: serial("id").primaryKey(),
  orgMemberId: integer("org_member_id").references(() => orgMembers.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  dueDate: timestamp("due_date"),
  aiSuggestion: json("ai_suggestion").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAiActionItemSchema = createInsertSchema(aiActionItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ProviderMetrics = typeof providerMetrics.$inferSelect;
export type InsertProviderMetrics = z.infer<typeof insertProviderMetricsSchema>;
export type OrganizationRevenue = typeof organizationRevenue.$inferSelect;
export type InsertOrganizationRevenue = z.infer<typeof insertOrgRevenueSchema>;
export type AiActionItem = typeof aiActionItems.$inferSelect;
export type InsertAiActionItem = z.infer<typeof insertAiActionItemSchema>;

export const achAccounts = pgTable("ach_accounts", {
  id: serial("id").primaryKey(),
  orgMemberId: integer("org_member_id").references(() => orgMembers.id).notNull(),
  bankName: text("bank_name").notNull(),
  accountType: text("account_type").notNull(), 
  routingNumber: text("routing_number").notNull(),
  accountNumber: text("account_number").notNull(),
  isVerified: boolean("is_verified").default(false),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achTransactions = pgTable("ach_transactions", {
  id: serial("id").primaryKey(),
  achAccountId: integer("ach_account_id").references(() => achAccounts.id).notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(), 
  status: text("status").notNull(), 
  description: text("description"),
  transactionDate: timestamp("transaction_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achAccountRelations = relations(achAccounts, ({ one, many }) => ({
  orgMember: one(orgMembers, {
    fields: [achAccounts.orgMemberId],
    references: [orgMembers.id],
  }),
  transactions: many(achTransactions),
}));

export const achTransactionRelations = relations(achTransactions, ({ one }) => ({
  account: one(achAccounts, {
    fields: [achTransactions.achAccountId],
    references: [achAccounts.id],
  }),
}));

export const insertAchAccountSchema = createInsertSchema(achAccounts).omit({
  id: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  routingNumber: z.string().length(9, "Routing number must be 9 digits"),
  accountNumber: z.string().min(4, "Account number must be at least 4 digits"),
});

export const insertAchTransactionSchema = createInsertSchema(achTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAchAccount = z.infer<typeof insertAchAccountSchema>;
export type AchAccount = typeof achAccounts.$inferSelect;
export type InsertAchTransaction = z.infer<typeof insertAchTransactionSchema>;
export type AchTransaction = typeof achTransactions.$inferSelect;

export const compensationPlans = pgTable("compensation_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  effectiveDate: timestamp("effective_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const compensationTiers = pgTable("compensation_tiers", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").references(() => compensationPlans.id).notNull(),
  level: integer("level").notNull(),
  personalSalesRequirement: integer("personal_sales_requirement").notNull(),
  teamSalesRequirement: integer("team_sales_requirement").notNull(),
  baseCommissionRate: real("base_commission_rate").notNull(),
  overrideRate: real("override_rate"),
  bonusRate: real("bonus_rate"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productCommissionRates = pgTable("product_commission_rates", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").references(() => compensationPlans.id).notNull(),
  productType: text("product_type").notNull(),
  commissionRate: real("commission_rate").notNull(),
  minimumPremium: integer("minimum_premium"),
  bonusThreshold: integer("bonus_threshold"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissionEntries = pgTable("commission_entries", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => orgMembers.id).notNull(),
  planId: integer("plan_id").references(() => compensationPlans.id).notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(), 
  source: text("source").notNull(), 
  status: text("status").notNull(), 
  transactionDate: timestamp("transaction_date").notNull(),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const compensationPlanRelations = relations(compensationPlans, ({ many }) => ({
  tiers: many(compensationTiers),
  productRates: many(productCommissionRates),
}));

export const compensationTierRelations = relations(compensationTiers, ({ one }) => ({
  plan: one(compensationPlans, {
    fields: [compensationTiers.planId],
    references: [compensationPlans.id],
  }),
}));

export const insertCompensationPlanSchema = createInsertSchema(compensationPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompensationTierSchema = createInsertSchema(compensationTiers).omit({
  id: true,
  createdAt: true,
});

export const insertProductCommissionRateSchema = createInsertSchema(productCommissionRates).omit({
  id: true,
  createdAt: true,
});

export const insertCommissionEntrySchema = createInsertSchema(commissionEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertCompensationPlan = z.infer<typeof insertCompensationPlanSchema>;
export type CompensationPlan = typeof compensationPlans.$inferSelect;
export type InsertCompensationTier = z.infer<typeof insertCompensationTierSchema>;
export type CompensationTier = typeof compensationTiers.$inferSelect;
export type InsertProductCommissionRate = z.infer<typeof insertProductCommissionRateSchema>;
export type ProductCommissionRate = typeof productCommissionRates.$inferSelect;
export type InsertCommissionEntry = z.infer<typeof insertCommissionEntrySchema>;
export type CommissionEntry = typeof commissionEntries.$inferSelect;

export const commissionTemplates = pgTable("commission_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const commissionRules = pgTable("commission_rules", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => commissionTemplates.id).notNull(),
  agentLevel: text("agent_level").notNull(), 
  baseCommissionRate: real("base_commission_rate").notNull(),
  personalProductionRequirement: integer("personal_production_requirement"),
  teamProductionRequirement: integer("team_production_requirement"),
  overrideRate: real("override_rate"), 
  maxOverrideDepth: integer("max_override_depth"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const bonusRules = pgTable("bonus_rules", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => commissionTemplates.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  threshold: integer("threshold").notNull(), 
  bonusType: text("bonus_type").notNull(), 
  bonusValue: real("bonus_value").notNull(),
  isPeriodic: boolean("is_periodic").default(false),
  periodType: text("period_type"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissionTemplateRelations = relations(commissionTemplates, ({ many }) => ({
  rules: many(commissionRules),
  bonuses: many(bonusRules),
}));

export const insertCommissionTemplateSchema = createInsertSchema(commissionTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionRuleSchema = createInsertSchema(commissionRules).omit({
  id: true,
  createdAt: true,
});

export const insertBonusRuleSchema = createInsertSchema(bonusRules).omit({
  id: true,
  createdAt: true,
});

export type InsertCommissionTemplate = z.infer<typeof insertCommissionTemplateSchema>;
export type CommissionTemplate = typeof commissionTemplates.$inferSelect;
export type InsertCommissionRule = z.infer<typeof insertCommissionRuleSchema>;
export type CommissionRule = typeof commissionRules.$inferSelect;
export type InsertBonusRule = z.infer<typeof insertBonusRuleSchema>;
export type BonusRule = typeof bonusRules.$inferSelect;