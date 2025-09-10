import { type User, type InsertUser, type FeedbackSubmission, type InsertFeedbackSubmission, type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
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

export const storage = new MemStorage();
