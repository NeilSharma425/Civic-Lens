export interface FeedbackSubmission {
  id: string;
  originalText: string;
  originalLanguage?: string;
  translatedText?: string;
  sentimentScore?: number;
  sentimentLabel?: 'positive' | 'neutral' | 'negative';
  inclusiveRewrite?: string;
  demographicTags?: string[];
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Analytics {
  totalFeedback: number;
  translatedCount: number;
  demographicGroups: number;
  representationGaps: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  demographicSentiment: Record<string, {
    positive: number;
    neutral: number;
    negative: number;
  }>;
  insights: string[];
  recommendations: string[];
}

export interface ProcessingResult {
  success: boolean;
  submissionId?: string;
  submissionIds?: string[];
  count?: number;
  message: string;
  error?: string;
}
