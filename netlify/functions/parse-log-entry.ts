import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

// A type guard to check if the parsed JSON has the expected structure.
interface ParsedLog {
  subjectName: string;
  chapterName: string;
  lectures: { name: string; platform?: string; faculty?: string; }[];
}

function isParsedLog(obj: any): obj is ParsedLog {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.subjectName === 'string' &&
    typeof obj.chapterName === 'string' &&
    Array.isArray(obj.lectures) &&
    obj.lectures.every((lec: any) => typeof lec.name === 'string')
  );
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY is not set in environment variables.' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const textLog = body.textLog;

    if (!textLog) {
      return { statusCode: 400, body: JSON.stringify({ error: 'textLog is required' }) };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.2,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
      response_mime_type: "application/json",
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const prompt = `
      You are an intelligent assistant for a medical student using a study tracker app.
      Your task is to parse a user's unstructured text log about their study session and convert it into a structured JSON object.

      The user will provide a text log. You must identify the following entities:
      1.  "subjectName": The main medical subject (e.g., Anatomy, Physiology).
      2.  "chapterName": The specific chapter or topic within that subject.
      3.  "lectures": A list of individual lectures watched. Each lecture should be an object with a "name" property. You can also optionally extract "platform" (e.g., Marrow, PrepLadder) and "faculty" (e.g., Dr. Rakesh).

      Here is the user's text log:
      ---
      ${textLog}
      ---

      Analyze the text and return a single JSON object with the keys "subjectName", "chapterName", and "lectures".
      The "lectures" value must be an array of objects.
      Do not include any other text or explanations in your response, only the raw JSON.
    `;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
    });

    const responseText = result.response.text();
    const parsedJson = JSON.parse(responseText);

    if (!isParsedLog(parsedJson)) {
        throw new Error("Gemini response did not match the expected format.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsedJson),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to parse log entry.', details: errorMessage }),
    };
  }
};

export { handler };
