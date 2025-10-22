-- CivicLens Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/sql

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback_submissions table (main complaints table)
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_text TEXT NOT NULL,
  original_language TEXT,
  translated_text TEXT,
  sentiment_score REAL,
  sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
  inclusive_rewrite TEXT,
  demographic_tags JSONB DEFAULT '[]'::jsonb,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES feedback_submissions(id) ON DELETE CASCADE,
  total_feedback INTEGER DEFAULT 0,
  translated_count INTEGER DEFAULT 0,
  demographic_groups INTEGER DEFAULT 0,
  representation_gaps INTEGER DEFAULT 0,
  sentiment_distribution JSONB,
  demographic_sentiment JSONB,
  insights JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_status ON feedback_submissions(processing_status);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_created_at ON feedback_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_sentiment ON feedback_submissions(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_analysis_results_submission_id ON analysis_results(submission_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous access (you can customize these later)
-- For now, we'll allow all operations for the anon key

-- Users table policies
CREATE POLICY "Allow anonymous read access to users" 
  ON users FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous insert to users" 
  ON users FOR INSERT 
  WITH CHECK (true);

-- Feedback submissions policies
CREATE POLICY "Allow anonymous read access to feedback_submissions" 
  ON feedback_submissions FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous insert to feedback_submissions" 
  ON feedback_submissions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update to feedback_submissions" 
  ON feedback_submissions FOR UPDATE 
  USING (true);

-- Analysis results policies
CREATE POLICY "Allow anonymous read access to analysis_results" 
  ON analysis_results FOR SELECT 
  USING (true);

CREATE POLICY "Allow anonymous insert to analysis_results" 
  ON analysis_results FOR INSERT 
  WITH CHECK (true);

-- Create a function to clean old analysis results (optional)
CREATE OR REPLACE FUNCTION cleanup_old_analysis()
RETURNS void AS $$
BEGIN
  DELETE FROM analysis_results 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ CivicLens database schema created successfully!';
  RAISE NOTICE '📊 Tables created: users, feedback_submissions, analysis_results';
  RAISE NOTICE '🔒 Row Level Security enabled with anonymous access policies';
END $$;






