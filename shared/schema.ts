import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalText: text("original_text").notNull(),
  originalLanguage: text("original_language"),
  translatedText: text("translated_text"),
  sentimentScore: real("sentiment_score"),
  sentimentLabel: text("sentiment_label"), // positive, neutral, negative
  inclusiveRewrite: text("inclusive_rewrite"),
  demographicTags: jsonb("demographic_tags").$type<string[]>().default([]),
  processingStatus: text("processing_status").default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").references(() => feedbackSubmissions.id),
  totalFeedback: integer("total_feedback").default(0),
  translatedCount: integer("translated_count").default(0),
  demographicGroups: integer("demographic_groups").default(0),
  representationGaps: integer("representation_gaps").default(0),
  sentimentDistribution: jsonb("sentiment_distribution").$type<{positive: number, neutral: number, negative: number}>(),
  demographicSentiment: jsonb("demographic_sentiment").$type<Record<string, {positive: number, neutral: number, negative: number}>>(),
  insights: jsonb("insights").$type<string[]>().default([]),
  recommendations: jsonb("recommendations").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFeedbackSubmissionSchema = createInsertSchema(feedbackSubmissions).pick({
  originalText: true,
  originalLanguage: true,
  demographicTags: true,
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFeedbackSubmission = z.infer<typeof insertFeedbackSubmissionSchema>;
export type FeedbackSubmission = typeof feedbackSubmissions.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;
