import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import { 
  users, 
  feedbackSubmissions, 
  analysisResults, 
  type User, 
  type InsertUser, 
  type FeedbackSubmission, 
  type InsertFeedbackSubmission, 
  type AnalysisResult, 
  type InsertAnalysisResult 
} from "@shared/schema";
import { IStorage } from "./storage";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class PostgreSQLStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values([user]).returning();
    return result[0];
  }

  async createFeedbackSubmission(submission: InsertFeedbackSubmission): Promise<FeedbackSubmission> {
    const result = await db.insert(feedbackSubmissions).values([submission]).returning();
    return result[0];
  }

  async getFeedbackSubmission(id: string): Promise<FeedbackSubmission | undefined> {
    const result = await db.select().from(feedbackSubmissions).where(eq(feedbackSubmissions.id, id)).limit(1);
    return result[0];
  }

  async updateFeedbackSubmission(id: string, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission | undefined> {
    const result = await db.update(feedbackSubmissions)
      .set(updates)
      .where(eq(feedbackSubmissions.id, id))
      .returning();
    return result[0];
  }

  async getAllFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    return await db.select().from(feedbackSubmissions).orderBy(desc(feedbackSubmissions.createdAt));
  }

  async createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult> {
    const insertResult = await db.insert(analysisResults).values([result]).returning();
    return insertResult[0];
  }

  async getLatestAnalysisResult(): Promise<AnalysisResult | undefined> {
    const result = await db.select().from(analysisResults)
      .orderBy(desc(analysisResults.createdAt))
      .limit(1);
    return result[0];
  }

  async getAnalysisResultBySubmissionId(submissionId: string): Promise<AnalysisResult | undefined> {
    const result = await db.select().from(analysisResults)
      .where(eq(analysisResults.submissionId, submissionId))
      .limit(1);
    return result[0];
  }
}