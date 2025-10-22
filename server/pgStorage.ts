import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
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

// Configure postgres client for Supabase with multiple connection strategies
const databaseUrl = process.env.DATABASE_URL!;

// Try transaction pooler URL first (port 6543) if it's a standard Supabase URL
const isSupabaseUrl = databaseUrl.includes('.supabase.co');
const connectionUrl = isSupabaseUrl 
  ? databaseUrl.replace(':5432/', ':6543/') // Use transaction pooler port
  : databaseUrl;

const client = postgres(connectionUrl, {
  prepare: false, // Required for transaction pooler mode
  ssl: isSupabaseUrl ? 'require' : false, // SSL required for Supabase
  max: 1, // Limit connections for serverless environments
  connect_timeout: 10, // 10 second timeout
  idle_timeout: 30, // 30 second idle timeout
  debug: process.env.NODE_ENV === 'development', // Enable debug logging
});
const db = drizzle(client);

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