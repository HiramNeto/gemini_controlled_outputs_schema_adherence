/*********************************************************************
 *  1) Install dependencies:
 *     npm install dotenv @google/generative-ai
 *
 *  2) Set your environment variable (e.g., in a .env file):
 *     GEMINI_API_KEY=YOUR_API_KEY_HERE
 *
 *  3) Run:
 *     node geminiTutorialExample.js
 *********************************************************************/

import dotenv from 'dotenv';
dotenv.config();

import { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold, 
  SchemaType 
} from '@google/generative-ai';

// Grab your Gemini API key from the environment
const API_KEY = process.env.GEMINI_API_KEY;

// We’ll call the latest Gemini 1.5 Pro in this example:
const MODEL_ID = "gemini-1.5-pro-latest";

/**
 * Below is a JSON schema tailored to generating a simple meal plan.
 * The response must be an array. Each item includes the course,
 * recipe name, ingredients list, and steps. We also include an enum
 * to constrain the "course" field.
 */
const recipeResponseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    description: "Data about a particular meal course",
    properties: {
      course: {
        type: SchemaType.STRING,
        enum: ["appetizer", "salad", "soup", "main", "dessert"]
      },
      name: {
        type: SchemaType.STRING
      },
      ingredients: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            unit: {
              type: SchemaType.STRING,
              enum: ["count", "cup", "tablespoon", "teaspoon", "pound", "ounce"]
            },
            amount: {
              type: SchemaType.NUMBER
            },
            name: {
              type: SchemaType.STRING
            },
          },
          required: ["name"]
        }
      },
      steps: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING
        }
      },
    },
    required: ["course", "name"]
  }
};

/**
 * This is our user prompt. It’s fairly open-ended, but
 * the response schema will keep the final output structured.
 */
const userPrompt = "Some friends are visiting, and I need a simple 3-course meal plan. Can you propose something straightforward to cook?";

async function callGeminiWithSchema() {
  try {
    // 1) Create the client
    const genAI = new GoogleGenerativeAI(API_KEY);

    // 2) Reference the Gemini model
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    // 3) Create the request configuration, with schema enforced
    const systemPrompt = "You are a helpful culinary assistant. Return strictly valid JSON that matches the given schema.";

    const requestConfig = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userPrompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeResponseSchema,
        temperature: 0.7
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
      ],
      systemInstruction: {
        parts: [
          { text: systemPrompt },
        ],
        role: "model",
      }
    };

    // 4) Call the generateContent API
    const responseData = await model.generateContent(requestConfig);

    // 5) The top candidate's text should be valid JSON
    const responseText = responseData.response.text();
    console.log("----------- Raw JSON Response -----------");
    console.log(responseText);

    // 6) You can parse it into a JavaScript object, if desired
    let parsed;
    try {
      parsed = JSON.parse(responseText);
      console.log("\n----------- Parsed JSON Object -----------");
      console.log(parsed);
    } catch (err) {
      console.error("Error parsing JSON:", err.message);
    }

    // Additional metadata
    const usage = responseData.response.usageMetadata;
    const finishReason = responseData.response.candidates[0].finishReason;
    console.log("\nFinish Reason:", finishReason);
    console.log("Input Tokens Billed:", usage.promptTokenCount);
    console.log("Output Tokens Billed:", usage.candidatesTokenCount);
    console.log("Total Tokens Billed:", usage.totalTokenCount);

  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
  }
}

// Kick off the demonstration
callGeminiWithSchema();