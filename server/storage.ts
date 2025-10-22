// Load environment variables first
import "./env";

import { type User, type InsertUser, type FeedbackSubmission, type InsertFeedbackSubmission, type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
import { PostgreSQLStorage } from "./pgStorage";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFeedbackSubmission(submission: InsertFeedbackSubmission): Promise<FeedbackSubmission>;
  getFeedbackSubmission(id: string): Promise<FeedbackSubmission | undefined>;
  updateFeedbackSubmission(id: string, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission | undefined>;
  getAllFeedbackSubmissions(): Promise<FeedbackSubmission[]>;
  
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getLatestAnalysisResult(): Promise<AnalysisResult | undefined>;
  getAnalysisResultBySubmissionId(submissionId: string): Promise<AnalysisResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private feedbackSubmissions: Map<string, FeedbackSubmission>;
  private analysisResults: Map<string, AnalysisResult>;

  constructor() {
    this.users = new Map();
    this.feedbackSubmissions = new Map();
    this.analysisResults = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFeedbackSubmission(insertSubmission: InsertFeedbackSubmission): Promise<FeedbackSubmission> {
    const id = randomUUID();
    const submission: FeedbackSubmission = {
      id,
      originalText: insertSubmission.originalText,
      originalLanguage: insertSubmission.originalLanguage || null,
      demographicTags: (insertSubmission.demographicTags as string[]) || [],
      translatedText: null,
      sentimentScore: null,
      sentimentLabel: null,
      inclusiveRewrite: null,
      processingStatus: "pending",
      createdAt: new Date(),
    };
    this.feedbackSubmissions.set(id, submission);
    return submission;
  }

  async getFeedbackSubmission(id: string): Promise<FeedbackSubmission | undefined> {
    return this.feedbackSubmissions.get(id);
  }

  async updateFeedbackSubmission(id: string, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission | undefined> {
    const existing = this.feedbackSubmissions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.feedbackSubmissions.set(id, updated);
    return updated;
  }

  async getAllFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    return Array.from(this.feedbackSubmissions.values());
  }

  async createAnalysisResult(insertResult: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = randomUUID();
    const result: AnalysisResult = {
      id,
      submissionId: insertResult.submissionId || null,
      totalFeedback: insertResult.totalFeedback || 0,
      translatedCount: insertResult.translatedCount || 0,
      demographicGroups: insertResult.demographicGroups || 0,
      representationGaps: insertResult.representationGaps || 0,
      sentimentDistribution: insertResult.sentimentDistribution || null,
      demographicSentiment: insertResult.demographicSentiment || null,
      insights: (insertResult.insights as string[]) || [],
      recommendations: (insertResult.recommendations as string[]) || [],
      createdAt: new Date(),
    };
    this.analysisResults.set(id, result);
    return result;
  }

  async getLatestAnalysisResult(): Promise<AnalysisResult | undefined> {
    const results = Array.from(this.analysisResults.values());
    return results.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())[0];
  }

  async getAnalysisResultBySubmissionId(submissionId: string): Promise<AnalysisResult | undefined> {
    return Array.from(this.analysisResults.values()).find(
      (result) => result.submissionId === submissionId,
    );
  }
}

// Storage factory with runtime fallback
async function createStorage(): Promise<IStorage> {
  // Check if we should use Supabase (preferred method)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    try {
      console.log('Attempting to connect to Supabase...');
      const { SupabaseStorage } = await import('./supabaseStorage');
      const supabaseStorage = new SupabaseStorage();
      
      // Test the connection by trying a simple query
      await supabaseStorage.getAllFeedbackSubmissions();
      console.log('✅ Supabase connection successful!');
      return supabaseStorage;
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      console.log('🔄 Falling back to in-memory storage...');
    }
  }
  
  // Fallback to direct PostgreSQL if DATABASE_URL is provided
  const useDatabase = process.env.DATABASE_URL && process.env.USE_DATABASE !== 'false';
  
  if (useDatabase) {
    try {
      console.log('Attempting to connect to PostgreSQL database...');
      const { PostgreSQLStorage } = await import('./pgStorage');
      const pgStorage = new PostgreSQLStorage();
      
      // Test the connection by trying a simple query
      await pgStorage.getAllFeedbackSubmissions();
      console.log('✅ PostgreSQL connection successful!');
      return pgStorage;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
      console.log('🔄 Falling back to in-memory storage...');
    }
  }
  
  console.log('📝 Using in-memory storage');
  return new MemStorage();
}

// Initialize storage with fallback
export const storage = await createStorage();
