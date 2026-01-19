import axios from 'axios';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export const scoreHandwriting = async (base64Image, targetWord) => {
    try {
        const prompt = `
      Act as a strict Arabic calligraphy teacher.
      Analyze this handwritten image. The user was trying to write the Arabic word: "${targetWord.arabic}" (${targetWord.english}).
      
      Evaluate widely based on:
      1. Letter Shape Accuracy (Do the curves match the standard Arabic script?)
      2. Dot Placement (Are the Nuqtas in the correct position?)
      3. Proportions (Is the word balanced?)

      Provide a strict, fair score. Do not be overly generous.
      If the drawing is barely visible or irrelevant, score it below 20.
      
      Return a PURE JSON object (no markdown, no backticks) with:
      - score: A number between 0 and 100.
      - feedback: Specific feedback on which letter needs improvement (e.g., "The letter Meem is too small" or "Good shape, but check the dot position").
    `;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.1, // Low temperature for consistent, deterministic results
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 200,
            }
        };

        const response = await axios.post(API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (textResponse) {
            // Clean up potential markdown code blocks if the model ignores the "no markdown" rule
            const cleanJson = textResponse.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
            return JSON.parse(cleanJson);
        }

        return { score: 0, feedback: "Could not analyze the image. Please try again." };

    } catch (error) {
        console.error("Gemini AI API Error:", error);
        if (error.response) {
            console.error("Error Data:", error.response.data);
        }
        throw new Error("Failed to connect to AI scoring service.");
    }
};
