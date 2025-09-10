import { analyzeSentiment } from './openai';

export interface SentimentResult {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export async function performSentimentAnalysis(text: string): Promise<SentimentResult> {
  const result = await analyzeSentiment(text);
  
  // Ensure label is one of the expected values
  let label: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (result.label === 'positive' || result.label === 'negative' || result.label === 'neutral') {
    label = result.label;
  }
  
  return {
    score: result.score,
    label,
    confidence: result.confidence,
  };
}

export function detectDemographicTags(text: string, language?: string): string[] {
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Language-based tags
  if (language && language !== 'English') {
    tags.push(`${language} Speaker`);
  }
  
  // Age-related keywords
  if (lowerText.includes('senior') || lowerText.includes('elderly') || lowerText.includes('old')) {
    tags.push('Elderly (65+)');
  }
  if (lowerText.includes('young') || lowerText.includes('youth') || lowerText.includes('student')) {
    tags.push('Youth (18-25)');
  }
  
  // Community-related keywords
  if (lowerText.includes('immigrant') || lowerText.includes('foreign')) {
    tags.push('Immigrant');
  }
  if (lowerText.includes('low income') || lowerText.includes('poor') || lowerText.includes('affordable')) {
    tags.push('Low Income');
  }
  if (lowerText.includes('suburban') || lowerText.includes('suburb')) {
    tags.push('Suburban');
  }
  if (lowerText.includes('urban') || lowerText.includes('city')) {
    tags.push('Urban');
  }
  if (lowerText.includes('rural') || lowerText.includes('country')) {
    tags.push('Rural');
  }
  
  return tags;
}
