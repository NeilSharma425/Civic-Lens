# 🌐 How to Use Your CivicLens Web App

## 🚀 Quick Start

### **Open your browser and visit:**
```
http://localhost:5000
```

---

## 📱 Features Available

### 1. **Home Page / Hero Section**
Your landing page with:
- Project overview
- Call-to-action to submit feedback
- Navigation to different sections

### 2. **Upload/Submit Feedback**
Two ways to submit citizen complaints/feedback:

#### **Option A: Text Input**
- Enter feedback directly in the text area
- Select demographic tags (optional)
- Click "Submit" to process

#### **Option B: File Upload**
- Upload CSV or TXT file with bulk feedback
- Supported formats:
  - **CSV:** `feedback, language, demographic`
  - **TXT:** One feedback per line

### 3. **Dashboard / Analytics**
View comprehensive analytics:
- **Total feedback count**
- **Sentiment distribution** (positive/neutral/negative)
- **Demographic breakdown**
- **Representation gaps** identified
- **AI-generated insights**
- **Recommendations** for action

### 4. **Data Export**
- Download all processed feedback as CSV
- Export analytics reports
- Share insights with stakeholders

---

## 🎯 Step-by-Step Usage

### **Step 1: Submit Test Feedback**

1. **Open:** http://localhost:5000
2. **Find the feedback submission form**
3. **Enter some test feedback:**
   ```
   The potholes on Main Street need urgent repair!
   ```
4. **Click "Submit"**
5. **Wait for processing** (translation, sentiment analysis, demographic detection)

### **Step 2: View Processing Results**

After submission, you should see:
- ✅ Submission ID
- ⏳ Processing status
- 📊 Sentiment analysis results
- 🏷️ Detected demographic tags

### **Step 3: Check the Dashboard**

1. **Navigate to Dashboard/Analytics section**
2. **See real-time statistics:**
   - Total feedback received
   - Sentiment distribution chart
   - Demographic sentiment breakdown
   - AI-generated insights

### **Step 4: View Data in Supabase**

To see the raw data:
1. **Open:** https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/editor
2. **Select `feedback_submissions` table**
3. **See all your submissions** with full details

---

## 📊 Example Data Flow

```
1. You submit: "The park needs better lighting!"
   ↓
2. App saves to Supabase (feedback_submissions)
   ↓
3. AI Processing:
   - Detects language: English
   - Sentiment: Negative (-0.65)
   - Tags: ["safety", "infrastructure"]
   ↓
4. Results updated in database
   ↓
5. Analytics recalculated
   ↓
6. Dashboard shows updated stats
```

---

## 🎨 UI Components

Your app includes these modern UI components:

### **Charts**
- `DemographicChart.tsx` - Visual breakdown by demographic
- `SentimentChart.tsx` - Sentiment distribution pie/bar chart

### **Sections**
- `Hero.tsx` - Landing page hero section
- `UploadSection.tsx` - File upload interface
- `Dashboard.tsx` - Analytics dashboard
- `ProcessingResults.tsx` - Show processing status
- `InsightsExport.tsx` - Export functionality

### **Layout**
- `Header.tsx` - Navigation bar
- `Footer.tsx` - Footer with links

---

## 🧪 Test Scenarios

### **Scenario 1: Single Text Feedback**
```
Input: "We need more accessible ramps at the library"
Expected:
- Sentiment: Neutral to slightly negative
- Tags: ["accessibility", "infrastructure"]
- Status: Completed
```

### **Scenario 2: Bulk Upload (CSV)**
Create a file `test-feedback.csv`:
```csv
feedback,language,demographic
"The traffic lights are broken",English,infrastructure
"More wheelchair ramps needed",English,accessibility
"El parque necesita limpieza",Spanish,environment
```
Upload this file and watch multiple items get processed.

### **Scenario 3: Non-English Feedback**
```
Input: "Les routes ont besoin de réparation"
Expected:
- Detected: French
- Translated: "The roads need repair"
- Processed in English
- Original preserved
```

---

## 🔍 Troubleshooting

### **Can't Access http://localhost:5000**

**Check if server is running:**
```bash
# In your terminal, you should see:
Attempting to connect to Supabase...
✅ Supabase connection successful!
serving on port 5000
```

**If not running:**
```bash
npm run dev
```

---

### **No Data Showing**

1. **Submit some test feedback first**
2. **Wait a few seconds for processing**
3. **Refresh the dashboard**
4. **Check browser console for errors** (F12)

---

### **API Errors**

**Check Supabase connection:**
```bash
npm run test:supabase
```

**Should show:**
```
✅ API connection successful!
✅ All tables accessible
```

---

## 🌐 API Endpoints

Your app exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/feedback/text` | POST | Submit text feedback |
| `/api/feedback/upload` | POST | Upload CSV/TXT file |
| `/api/feedback` | GET | Get all feedback |
| `/api/feedback/:id` | GET | Get specific feedback |
| `/api/analytics` | GET | Get dashboard analytics |
| `/api/export/csv` | GET | Export as CSV |

### **Example API Call (Text Feedback):**
```javascript
fetch('http://localhost:5000/api/feedback/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    originalText: "The library needs more books",
    demographicTags: ["education"]
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📱 Mobile Access

**Access from your phone on the same network:**

1. **Find your computer's IP address:**
   ```bash
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **On your phone's browser:**
   ```
   http://YOUR_IP_ADDRESS:5000
   ```

---

## 🎯 Best Practices

### **For Testing:**
1. Start with simple text feedback
2. Test different languages
3. Try bulk upload with CSV
4. Check analytics after each submission

### **For Production:**
1. Add OpenAI API key for better AI features
2. Customize demographic tags for your use case
3. Set up proper authentication (optional)
4. Configure production environment variables

---

## 🚀 Quick Commands

```bash
# Start the app
npm run dev

# Test Supabase connection
npm run test:supabase

# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Related Documentation

- **Setup Guide:** `SUPABASE-SETUP-COMPLETE.md`
- **Database Info:** `DATABASE-STATUS.md`
- **Quick Start:** `START-HERE.md`

---

## 🎉 You're Ready!

**Your CivicLens app is now running at:**
### **http://localhost:5000**

**Open it in your browser and start collecting citizen feedback!** 🚀

---

**Need help?** Check the browser console (F12) for any errors or the terminal for server logs.






