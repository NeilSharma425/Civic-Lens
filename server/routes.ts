import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSubmissionSchema, insertAnalysisResultSchema } from "@shared/schema";
import { translateText, rewriteInclusive } from "./services/openai";
import { performSentimentAnalysis, detectDemographicTags } from "./services/sentiment";
import { processCSVFile, processTextFile } from "./services/fileProcessor";
import multer from 'multer';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit text feedback for processing
  app.post("/api/feedback/text", async (req, res) => {
    try {
      const validation = insertFeedbackSubmissionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid input data",
          details: validation.error.issues 
        });
      }

      const submission = await storage.createFeedbackSubmission(validation.data);
      
      // Process the feedback asynchronously
      processSubmission(submission.id);
      
      res.json({ 
        success: true, 
        submissionId: submission.id,
        message: "Feedback submitted for processing"
      });
    } catch (error) {
      console.error("Error submitting text feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Upload file for processing
  app.post("/api/feedback/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();
      
      let processingResult;
      if (fileExtension === 'csv') {
        processingResult = await processCSVFile(fileContent);
      } else if (fileExtension === 'txt') {
        processingResult = await processTextFile(fileContent);
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload CSV or TXT files." });
      }

      if (!processingResult.success) {
        return res.status(400).json({ error: processingResult.error });
      }

      // Process each feedback item
      const submissionIds: string[] = [];
      for (const item of processingResult.data!) {
        const submission = await storage.createFeedbackSubmission({
          originalText: item.feedback,
          originalLanguage: item.language,
          demographicTags: item.demographic ? [item.demographic] : [],
        });
        submissionIds.push(submission.id);
        processSubmission(submission.id);
      }

      res.json({ 
        success: true, 
        submissionIds,
        count: submissionIds.length,
        message: `${submissionIds.length} feedback items submitted for processing`
      });
    } catch (error) {
      console.error("Error processing file upload:", error);
      res.status(500).json({ error: "Failed to process uploaded file" });
    }
  });

  // Get processing status
  app.get("/api/feedback/:id", async (req, res) => {
    try {
      const submission = await storage.getFeedbackSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  // Get all processed feedback
  app.get("/api/feedback", async (req, res) => {
    try {
      const submissions = await storage.getAllFeedbackSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching all submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Get dashboard analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const submissions = await storage.getAllFeedbackSubmissions();
      const completed = submissions.filter(s => s.processingStatus === 'completed');
      
      if (completed.length === 0) {
        return res.json({
          totalFeedback: 0,
          translatedCount: 0,
          demographicGroups: 0,
          representationGaps: 0,
          sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
          demographicSentiment: {},
          insights: [],
          recommendations: [],
        });
      }

      // Calculate analytics
      const totalFeedback = completed.length;
      const translatedCount = completed.filter(s => s.translatedText && s.translatedText !== s.originalText).length;
      
      // Get unique demographic groups
      const allTags = completed.flatMap(s => s.demographicTags || []);
      const uniqueTags = [...new Set(allTags)];
      const demographicGroups = uniqueTags.length;

      // Calculate sentiment distribution
      const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
      completed.forEach(s => {
        if (s.sentimentLabel) {
          sentimentCounts[s.sentimentLabel as keyof typeof sentimentCounts]++;
        }
      });

      const sentimentDistribution = {
        positive: Math.round((sentimentCounts.positive / totalFeedback) * 100),
        neutral: Math.round((sentimentCounts.neutral / totalFeedback) * 100),
        negative: Math.round((sentimentCounts.negative / totalFeedback) * 100),
      };

      // Calculate demographic sentiment
      const demographicSentiment: Record<string, {positive: number, neutral: number, negative: number}> = {};
      uniqueTags.forEach(tag => {
        const tagSubmissions = completed.filter(s => s.demographicTags?.includes(tag));
        const tagCounts = { positive: 0, neutral: 0, negative: 0 };
        tagSubmissions.forEach(s => {
          if (s.sentimentLabel) {
            tagCounts[s.sentimentLabel as keyof typeof tagCounts]++;
          }
        });
        
        if (tagSubmissions.length > 0) {
          demographicSentiment[tag] = {
            positive: Math.round((tagCounts.positive / tagSubmissions.length) * 100),
            neutral: Math.round((tagCounts.neutral / tagSubmissions.length) * 100),
            negative: Math.round((tagCounts.negative / tagSubmissions.length) * 100),
          };
        }
      });

      // Generate insights and recommendations
      const insights: string[] = [];
      const recommendations: string[] = [];

      // Detect representation gaps
      Object.entries(demographicSentiment).forEach(([group, sentiment]) => {
        if (sentiment.negative > 30) {
          insights.push(`${group} communities report ${sentiment.negative}% negative sentiment`);
        }
        if (sentiment.positive < 40) {
          insights.push(`${group} communities show low satisfaction (${sentiment.positive}% positive)`);
          recommendations.push(`Implement targeted engagement programs for ${group} communities`);
        }
      });

      // Count representation gaps
      const representationGaps = insights.filter(insight => 
        insight.includes('negative sentiment') || insight.includes('low satisfaction')
      ).length;

      const analytics = {
        totalFeedback,
        translatedCount,
        demographicGroups,
        representationGaps,
        sentimentDistribution,
        demographicSentiment,
        insights,
        recommendations,
      };

      // Store the analytics result
      await storage.createAnalysisResult({
        submissionId: null,
        ...analytics,
      });

      res.json(analytics);
    } catch (error) {
      console.error("Error generating analytics:", error);
      res.status(500).json({ error: "Failed to generate analytics" });
    }
  });

  // Export data as CSV
  app.get("/api/export/csv", async (req, res) => {
    try {
      const submissions = await storage.getAllFeedbackSubmissions();
      const completed = submissions.filter(s => s.processingStatus === 'completed');
      
      let csv = 'Original Text,Original Language,Translated Text,Sentiment Label,Sentiment Score,Inclusive Rewrite,Demographic Tags\n';
      
      completed.forEach(submission => {
        const row = [
          `"${submission.originalText?.replace(/"/g, '""') || ''}"`,
          `"${submission.originalLanguage || ''}"`,
          `"${submission.translatedText?.replace(/"/g, '""') || ''}"`,
          `"${submission.sentimentLabel || ''}"`,
          submission.sentimentScore || '',
          `"${submission.inclusiveRewrite?.replace(/"/g, '""') || ''}"`,
          `"${(submission.demographicTags || []).join('; ')}"`,
        ].join(',');
        csv += row + '\n';
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="civic-feedback-analysis.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Async function to process submissions
async function processSubmission(submissionId: string) {
  try {
    await storage.updateFeedbackSubmission(submissionId, { processingStatus: 'processing' });
    
    const submission = await storage.getFeedbackSubmission(submissionId);
    if (!submission) return;

    let textToAnalyze = submission.originalText;
    let detectedLanguage = submission.originalLanguage;
    let translatedText = submission.originalText;

    // Translate if needed
    if (!submission.originalLanguage || submission.originalLanguage !== 'English') {
      const translation = await translateText(submission.originalText);
      translatedText = translation.translatedText;
      detectedLanguage = translation.detectedLanguage;
      textToAnalyze = translatedText;
    }

    // Perform sentiment analysis
    const sentiment = await performSentimentAnalysis(textToAnalyze);

    // Generate inclusive rewrite
    const inclusiveRewrite = await rewriteInclusive(textToAnalyze);

    // Detect demographic tags
    const detectedTags = detectDemographicTags(submission.originalText, detectedLanguage || undefined);
    const allTags = [...new Set([...(submission.demographicTags || []), ...detectedTags])];

    // Update submission with results
    await storage.updateFeedbackSubmission(submissionId, {
      translatedText,
      originalLanguage: detectedLanguage,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment.label,
      inclusiveRewrite,
      demographicTags: allTags,
      processingStatus: 'completed',
    });

  } catch (error) {
    console.error(`Error processing submission ${submissionId}:`, error);
    await storage.updateFeedbackSubmission(submissionId, { processingStatus: 'failed' });
  }
}
