# 🎯 Your CivicLens Database Setup

## ✅ Project Identified

**Supabase Project:** `fhajbtyjhwgasdmhxnuw`  
**Project URL:** https://fhajbtyjhwgasdmhxnuw.supabase.co  
**Dashboard:** https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw  

---

## 📊 What's Being Created

Your Supabase database will store **citizen complaints and feedback** with these tables:

### Table 1: `feedback_submissions` (Main Complaints Table)

This is where all citizen complaints/feedback are stored:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique complaint ID |
| `original_text` | TEXT | The actual complaint/feedback text |
| `original_language` | TEXT | Language detected (if not English) |
| `translated_text` | TEXT | English translation (if needed) |
| `sentiment_score` | DECIMAL | Sentiment score (0.0 to 1.0) |
| `sentiment_label` | TEXT | positive/neutral/negative |
| `inclusive_rewrite` | TEXT | AI-improved version |
| `demographic_tags` | JSONB | Array of demographic categories |
| `processing_status` | TEXT | pending/processing/completed/failed |
| `created_at` | TIMESTAMP | When complaint was submitted |

**Example data:**
```json
{
  "id": "abc123...",
  "original_text": "The potholes on Main St need urgent fixing!",
  "sentiment_label": "negative",
  "demographic_tags": ["infrastructure", "urban"],
  "processing_status": "completed",
  "created_at": "2025-10-01T10:30:00Z"
}
```

---

### Table 2: `analysis_results` (Analytics & Insights)

Stores aggregated analytics and AI-generated insights:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique analysis ID |
| `submission_id` | UUID | Links to a specific complaint (optional) |
| `total_feedback` | INTEGER | Total number of complaints analyzed |
| `translated_count` | INTEGER | How many needed translation |
| `demographic_groups` | INTEGER | Number of unique demographic groups |
| `representation_gaps` | INTEGER | Underrepresented groups identified |
| `sentiment_distribution` | JSONB | % breakdown of sentiments |
| `demographic_sentiment` | JSONB | Sentiment by demographic group |
| `insights` | JSONB | Array of AI-generated insights |
| `recommendations` | JSONB | Array of recommended actions |
| `created_at` | TIMESTAMP | When analysis was run |

**Example data:**
```json
{
  "total_feedback": 150,
  "sentiment_distribution": {
    "positive": 35,
    "neutral": 40,
    "negative": 25
  },
  "insights": [
    "Infrastructure concerns highest in urban communities",
    "Transportation issues show 65% negative sentiment"
  ],
  "recommendations": [
    "Implement targeted road repair program",
    "Increase public transportation frequency"
  ]
}
```

---

### Table 3: `users` (Optional - for future use)

User authentication and profiles (for future admin features):

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique user ID |
| `username` | TEXT | Username |
| `password` | TEXT | Hashed password |

---

## 🔧 Setup Instructions

### Step 1: Get Database Password

**IMPORTANT:** The API keys you provided are for **client-side** access. We need the **database password**.

1. **Go to your database settings:**
   ```
   https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/settings/database
   ```

2. **Find your password:**
   - Scroll to **"Connection String"** section
   - Click **"URI"** tab
   - Your password is in the connection string:
     ```
     postgresql://postgres:YOUR_PASSWORD_HERE@db.fhajbtyjhwgasdmhxnuw.supabase.co:5432/postgres
     ```

3. **Can't see it?**
   - Click **"Reset Database Password"**
   - Create a new password (save it!)

---

### Step 2: Run Setup Script

```bash
node setup-my-database.js
```

This will:
- ✅ Prompt you for your database password
- ✅ Create `.env` file with correct configuration
- ✅ Set up connection to your Supabase project

---

### Step 3: Create Database Tables

```bash
npm run db:push
```

This will create all 3 tables in your Supabase database.

---

### Step 4: Test Connection

```bash
npm run db:test
```

You should see:
```
✅ DATABASE_URL is set
✅ Detected Supabase URL
✅ Connection successful
✅ Found 3 tables in database
   Tables:
     - users
     - feedback_submissions
     - analysis_results
✅ All tests passed!
```

---

### Step 5: Start Your App

```bash
npm run dev
```

Your app is now connected to Supabase! 🎉

---

## 📱 How It Works

### User Flow:

1. **Citizen submits complaint**
   - Via web form or file upload (CSV/TXT)
   - Saved to `feedback_submissions` table with status "pending"

2. **AI Processing**
   - Detects language and translates if needed
   - Analyzes sentiment (positive/neutral/negative)
   - Identifies demographic categories
   - Generates inclusive rewrite
   - Updates status to "completed"

3. **Analytics Dashboard**
   - Aggregates all feedback
   - Calculates sentiment distribution
   - Identifies representation gaps
   - Generates insights and recommendations
   - Saves to `analysis_results` table

4. **Data Export**
   - Download analytics as CSV
   - View charts and visualizations
   - Track trends over time

---

## 🔍 Query Examples

Once your database is set up, you can query it from Supabase SQL Editor:

### Get all complaints from today:
```sql
SELECT * FROM feedback_submissions 
WHERE created_at >= CURRENT_DATE 
ORDER BY created_at DESC;
```

### Count complaints by sentiment:
```sql
SELECT sentiment_label, COUNT(*) 
FROM feedback_submissions 
WHERE processing_status = 'completed'
GROUP BY sentiment_label;
```

### Find most common demographic tags:
```sql
SELECT 
  jsonb_array_elements_text(demographic_tags) as tag,
  COUNT(*) as count
FROM feedback_submissions
GROUP BY tag
ORDER BY count DESC;
```

---

## 🎨 View in Supabase Dashboard

After running `npm run db:push`, you can view your tables:

**Table Editor:**
```
https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/editor
```

**SQL Editor:**
```
https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/sql
```

---

## 🔒 Security Notes

### Row Level Security (RLS)

By default, your tables are **not** protected by RLS. For production:

1. Go to: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/auth/policies
2. Enable RLS on each table
3. Create policies for who can read/write

### Connection Security

✅ **Already configured:**
- SSL encryption enabled
- Server-side access only (not exposed to client)
- Credentials stored in `.env` (gitignored)

---

## 📊 Expected Data Volume

Based on typical civic feedback applications:

| Metric | Estimate |
|--------|----------|
| Complaints per day | 10-100 |
| Storage per complaint | ~2 KB |
| Monthly storage | ~60-600 KB |
| Supabase free tier | 500 MB (plenty!) |

---

## 🚀 You're Ready!

**Current Status:**
- ✅ Supabase project identified: `fhajbtyjhwgasdmhxnuw`
- ✅ Database schema defined (3 tables)
- ✅ Setup script created: `setup-my-database.js`
- ✅ Connection code configured with SSL
- ⏳ **Waiting for:** Your database password to complete setup

**Next Action:**
```bash
node setup-my-database.js
```

---

## 📚 Reference Files

- **Quick Start:** `START-HERE.md` ⭐ **Read this first!**
- **Get Password:** `GET-DATABASE-PASSWORD.md`
- **Manual Setup:** `MANUAL-ENV-SETUP.md`
- **Full Guide:** `README-SUPABASE.md`
- **Test Results:** Run `npm run db:test` after setup

---

**Questions?** Check `START-HERE.md` for step-by-step instructions!






