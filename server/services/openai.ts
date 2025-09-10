import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function translateText(text: string, targetLanguage: string = "English"): Promise<{
  translatedText: string;
  detectedLanguage: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given text to ${targetLanguage} and detect the original language. Respond with JSON in this format: { "translatedText": "translated content", "detectedLanguage": "language name" }`
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      translatedText: result.translatedText || text,
      detectedLanguage: result.detectedLanguage || "Unknown",
    };
  } catch (error) {
    console.error("Translation failed:", error);
    return {
      translatedText: text,
      detectedLanguage: "Unknown",
    };
  }
}

export async function rewriteInclusive(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in inclusive language and civic communication. Rewrite the following community feedback in clear, respectful, culturally inclusive language without changing the core meaning. Make it appropriate for policymaker review. Respond with JSON in this format: { \"rewrittenText\": \"your rewritten version\" }"
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.rewrittenText || text;
  } catch (error) {
    console.error("Inclusive rewriting failed:", error);
    return text;
  }
}

export async function analyzeSentiment(text: string): Promise<{
  score: number;
  label: string;
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a score from -1 to 1 (negative to positive), a label (positive, neutral, or negative), and a confidence score between 0 and 1. Respond with JSON in this format: { \"score\": number, \"label\": \"positive|neutral|negative\", \"confidence\": number }"
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: Math.max(-1, Math.min(1, result.score || 0)),
      label: result.label || "neutral",
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
    };
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return {
      score: 0,
      label: "neutral",
      confidence: 0,
    };
  }
}
