# Google Gemini JSON Schema Reference

This repository contains example Node.js code demonstrating how to call the [Google Gemini 1.5 API](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/models/gemini) and enforce strict JSON output with a controlled schema. It is intended as a reference for developers who want structured, predictable responses from a large language model (LLM).

---

## Overview

- **Goal**: Show how to integrate and configure a Gemini model call in Node.js, specifying both a textual prompt and a JSON schema to control the response format.
- **Tech Stack**: 
  - [Node.js](https://nodejs.org/en/) (v16+ recommended)
  - [dotenv](https://www.npmjs.com/package/dotenv) for environment variables
  - [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) for Gemini interactions

---

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/<YourUsername>/<YourRepoName>.git
   cd <YourRepoName>

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a .env file at the root of the project with the following content:

   ```ini
   GEMINI_API_KEY=YOUR_API_KEY
   ```

   Replace YOUR_API_KEY with your actual Google Gemini API key.

4. **Run the Example**

   ```bash
   node geminiTutorialExample.js
   ```

   This script will:

   - Load your API key from the .env file.
   - Define a response schema to control the output format.
   - Call the Gemini model with a user prompt and system instructions.
   - Print the raw JSON response and parsed object to your console.

5. **Code Explanation**

   ```javascript
   geminiTutorialExample.js
   ```

   - Imports & Configuration
     - Uses dotenv to load environment variables and @google/generative-ai to communicate with the Gemini endpoint.

   - Schema Definition
     - Demonstrates how to build a JSON schema object using SchemaType (a subset of OpenAPI 3.0). You can customize it for arrays, objects, required fields, and enum constraints.

   - Prompt Configuration
     - The systemPrompt instructs the model to return a strictly valid JSON. The userPrompt is where your end-user’s actual question or request goes.

   - Model Call
     - Uses model.generateContent(...) with responseMimeType: "application/json" and a responseSchema to ensure the output follows the specified structure.

   - Response Handling
     - Logs the raw text output, attempts to parse the JSON, and prints usage metadata such as token counts.

6. **Usage Notes**

   - Feel free to modify the prompt or schema to fit your application’s needs (e.g., extracting specific entities, generating a fixed set of fields).
   - If you require advanced features (such as complex nested schemas, function calling, or safety settings), you can easily extend this reference code.
   - For production use, always handle errors and edge cases (e.g., invalid JSON, rate limits, etc.).