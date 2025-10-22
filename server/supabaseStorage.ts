import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  type User, 
  type InsertUser, 
  type FeedbackSubmission, 
  type InsertFeedbackSubmission, 
  type AnalysisResult, 
  type InsertAnalysisResult 
} from "@shared/schema";
import { IStorage } from "./storage";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // No rows found
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await this.client
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    return data as User;
  }

  async createFeedbackSubmission(submission: InsertFeedbackSubmission): Promise<FeedbackSubmission> {
    const { data, error } = await this.client
      .from('feedback_submissions')
      .insert([{
        original_text: submission.originalText,
        original_language: submission.originalLanguage || null,
        demographic_tags: submission.demographicTags || [],
        translated_text: null,
        sentiment_score: null,
        sentiment_label: null,
        inclusive_rewrite: null,
        processing_status: 'pending',
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create feedback submission: ${error.message}`);
    }
    
    return this.mapFeedbackSubmission(data);
  }

  async getFeedbackSubmission(id: string): Promise<FeedbackSubmission | undefined> {
    const { data, error } = await this.client
      .from('feedback_submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching feedback submission:', error);
      return undefined;
    }
    
    return this.mapFeedbackSubmission(data);
  }

  async updateFeedbackSubmission(id: string, updates: Partial<FeedbackSubmission>): Promise<FeedbackSubmission | undefined> {
    // Convert camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.translatedText !== undefined) dbUpdates.translated_text = updates.translatedText;
    if (updates.originalLanguage !== undefined) dbUpdates.original_language = updates.originalLanguage;
    if (updates.sentimentScore !== undefined) dbUpdates.sentiment_score = updates.sentimentScore;
    if (updates.sentimentLabel !== undefined) dbUpdates.sentiment_label = updates.sentimentLabel;
    if (updates.inclusiveRewrite !== undefined) dbUpdates.inclusive_rewrite = updates.inclusiveRewrite;
    if (updates.demographicTags !== undefined) dbUpdates.demographic_tags = updates.demographicTags;
    if (updates.processingStatus !== undefined) dbUpdates.processing_status = updates.processingStatus;

    const { data, error } = await this.client
      .from('feedback_submissions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating feedback submission:', error);
      return undefined;
    }
    
    return this.mapFeedbackSubmission(data);
  }

  async getAllFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    const { data, error } = await this.client
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all feedback submissions:', error);
      return [];
    }
    
    return data.map(item => this.mapFeedbackSubmission(item));
  }

  async createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult> {
    const { data, error } = await this.client
      .from('analysis_results')
      .insert([{
        submission_id: result.submissionId || null,
        total_feedback: result.totalFeedback || 0,
        translated_count: result.translatedCount || 0,
        demographic_groups: result.demographicGroups || 0,
        representation_gaps: result.representationGaps || 0,
        sentiment_distribution: result.sentimentDistribution || null,
        demographic_sentiment: result.demographicSentiment || null,
        insights: result.insights || [],
        recommendations: result.recommendations || [],
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create analysis result: ${error.message}`);
    }
    
    return this.mapAnalysisResult(data);
  }

  async getLatestAnalysisResult(): Promise<AnalysisResult | undefined> {
    const { data, error } = await this.client
      .from('analysis_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching latest analysis result:', error);
      return undefined;
    }
    
    return this.mapAnalysisResult(data);
  }

  async getAnalysisResultBySubmissionId(submissionId: string): Promise<AnalysisResult | undefined> {
    const { data, error } = await this.client
      .from('analysis_results')
      .select('*')
      .eq('submission_id', submissionId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching analysis result by submission:', error);
      return undefined;
    }
    
    return this.mapAnalysisResult(data);
  }

  // Helper method to map database snake_case to camelCase
  private mapFeedbackSubmission(data: any): FeedbackSubmission {
    return {
      id: data.id,
      originalText: data.original_text,
      originalLanguage: data.original_language,
      translatedText: data.translated_text,
      sentimentScore: data.sentiment_score,
      sentimentLabel: data.sentiment_label,
      inclusiveRewrite: data.inclusive_rewrite,
      demographicTags: data.demographic_tags || [],
      processingStatus: data.processing_status,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    };
  }

  private mapAnalysisResult(data: any): AnalysisResult {
    return {
      id: data.id,
      submissionId: data.submission_id,
      totalFeedback: data.total_feedback,
      translatedCount: data.translated_count,
      demographicGroups: data.demographic_groups,
      representationGaps: data.representation_gaps,
      sentimentDistribution: data.sentiment_distribution,
      demographicSentiment: data.demographic_sentiment,
      insights: data.insights || [],
      recommendations: data.recommendations || [],
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    };
  }
}






