import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// HARDCODED API KEY AS REQUESTED (Note: In production, use ENV variables)
const GEMINI_API_KEY = "AIzaSyBcK8XpxhqINlIC-sqPRpA9rKpMq0T2TNo";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// Simple in-memory cache to prevent duplicate API calls for the same image
// Key: base64 string, Value: { score, feedback }
const resultCache = new Map();

export const scoreHandwriting = async (base64Image, targetWord) => {
    try {
        // 1. Check Cache
        // Create a unique key for this specific request
        // We use a substring of the base64 to save memory/time while staying unique enough for this session
        const cacheKey = `${targetWord.arabic}_${base64Image.substring(0, 50)}_${base64Image.length}`;

        if (resultCache.has(cacheKey)) {
            console.log("Returning cached scoring result");
            return resultCache.get(cacheKey);
        }

        console.log("Analyzing new image with Gemini...");

        // 2. Incremental Completion Prompt Engineering
        const prompt = `
      You are an automated Arabic handwriting evaluator.
      The student is trying to write the text: "${targetWord.arabic}" (${targetWord.english}).
      
      SCORING ALGORITHM (Incremental Style):
      
      STEP 1: CALCULATE BASE SCORE (Based on Quantity/Completeness)
      - Start with 0.
      - If the ENTIRE letter is drawn (all strokes, dots present): Score = 60.
      - If mostly drawn but missing small details (like a dot): Score = 40-50.
      - If half drawn: Score = 30.
      - If barely started: Score = 10.
      
      STEP 2: ADD QUALITY BONUSES (Only adds to the base)
      - Lines are smooth and confident: +10
      - Proportions are accurate: +10
      - Beautiful/Professional Style: +10 to +20
      
      STEP 3: DEDUCT PENALTIES (Subtract from total)
      - Shaky/Wobbly lines: -5
      - Wrong dot placement: -5
      
      FINAL SCORE = (Base Score) + (Bonuses) - (Penalties).
      Max Score is 100.

      OUTPUT FORMAT:
      Return ONLY a JSON object. No markdown.
      {
        "score": (integer 0-100),
        "feedback": "" 
      }
      (Feedback MUST remain an empty string).
    `;

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1000,
            }
        };

        const response = await axios.post(API_URL, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (textResponse) {
            // Clean markdown if present
            console.log("Gemini Raw Response:", textResponse); // Debug what AI actually sent
            try {
                // Clean markdown if present (e.g., ```json ... ```)
                const cleanJson = textResponse.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
                const result = JSON.parse(cleanJson);

                // 3. Store in Cache
                resultCache.set(cacheKey, result);

                return result;
            } catch (err) {
                console.error("JSON Parse Error:", err);
                console.error("Failed text:", textResponse);
                return {
                    score: 0,
                    feedback: "AI response format error. Please try again."
                };
            }
        }

        return { score: 0, feedback: "AI evaluation failed. Please try again." };

    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);

        // Handle Quota/Rate Limits specifically
        if (error.response?.status === 429) {
            return {
                score: 0,
                feedback: "Usage limit reached. Please wait a moment and try again."
            };
        }

        return {
            score: 0,
            feedback: "Connection error. Please check your internet."
        };
    }
};
