# 🚨 Supabase Schema Cache Issue

## Current Status

❌ **Your data is NOT being saved to Supabase**  
⚠️ **App is using temporary in-memory storage**

## The Problem

The Supabase tables exist but there's a schema cache error:
```
Could not find the table 'public.feedback_submissions' in the schema cache
```

## ✅ Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor

**Click this link:**  
👉 https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/sql/new

### Step 2: Copy and Run This SQL

Open the file `create-supabase-tables.sql` in your project, copy ALL the SQL code, and paste it into the SQL Editor.

**OR** copy this simplified version:

```sql
-- Drop existing tables and recreate them properly
DROP TABLE IF EXISTS analysis_results CASCADE;
DROP TABLE IF EXISTS feedback_submissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback_submissions table
CREATE TABLE feedback_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_text TEXT NOT NULL,
  original_language TEXT,
  translated_text TEXT,
  sentiment_score REAL,
  sentiment_label TEXT,
  inclusive_rewrite TEXT,
  demographic_tags JSONB DEFAULT '[]'::jsonb,
  processing_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES feedback_submissions(id),
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

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "anon_select_users" ON users FOR SELECT USING (true);
CREATE POLICY "anon_insert_users" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_select_feedback" ON feedback_submissions FOR SELECT USING (true);
CREATE POLICY "anon_insert_feedback" ON feedback_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_feedback" ON feedback_submissions FOR UPDATE USING (true);

CREATE POLICY "anon_select_analysis" ON analysis_results FOR SELECT USING (true);
CREATE POLICY "anon_insert_analysis" ON analysis_results FOR INSERT WITH CHECK (true);
```

### Step 3: Click "RUN" in SQL Editor

Wait for it to complete (should take 1-2 seconds).

You should see:
```
Success. No rows returned
```

### Step 4: Restart Your Server

In your terminal:
```bash
# Stop current server (Ctrl+C)
# Then:
npm run dev
```

### Step 5: Verify

Run this to check:
```bash
npx tsx check-supabase-data.ts
```

You should see:
```
✅ DATA IS BEING SAVED TO SUPABASE!
```

---

## What This Does

- **Drops** any corrupted/cached tables
- **Recreates** all tables fresh
- **Enables** Row Level Security (RLS)
- **Creates** policies for public access
- **Clears** the schema cache issue

---

## After the Fix

Once this is done:
1. ✅ All data will save to Supabase
2. ✅ Data persists across server restarts
3. ✅ You can view data in Supabase dashboard
4. ✅ No more "in-memory storage" message

---

**Need help?** The SQL code is in: `create-supabase-tables.sql`






