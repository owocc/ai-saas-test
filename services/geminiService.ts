import { GoogleGenAI, Type, FunctionDeclaration, Part, Content } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("Configuration Error: The API_KEY environment variable is not set. Please ensure it is configured in your deployment environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A local type definition to match the one in AIChat.tsx, avoiding circular dependencies.
interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Local Calculation Tool ---
// This function is now called directly in our code, not as a tool by the AI.
const calculate = (expression: string): string | number => {
  try {
    // Basic sanitization. For a production app, a proper math parsing library is safer.
    const sanitizedExpression = String(expression).replace(/[^-()\d/*+.]/g, '');
    if (sanitizedExpression !== String(expression)) {
      return "Invalid characters in expression.";
    }
    // Using new Function is safer than eval
    return new Function('return ' + sanitizedExpression)();
  } catch (e) {
    return "Invalid mathematical expression";
  }
};


// --- Step 1: System instruction to formulate the expression ---
const systemInstructionForFormula = `You are a world-class multilingual mathematical formulation expert. Your sole purpose is to analyze a user's question and conversation history, convert all textual and unit-based numbers into digits, and then construct a single, precise mathematical expression to solve the problem.

**Your STRICT Three-Step Process:**

**Step 1: Number & Unit Conversion**
-   First, meticulously scan the user's request and the conversation history.
-   Identify ALL numbers, whether they are digits, words, or include units.
-   Your primary task is to convert every number into its standard digit form.
-   This is the MOST critical step. Be extremely thorough.

    **Examples of Conversions:**
    *   **Chinese:**
        *   "十" -> \`10\`
        *   "一百" -> \`100\`
        *   "一千" -> \`1000\`
        *   "一万" -> \`10000\`
        *   "10万" -> \`100000\`
        *   "1000万" -> \`10000000\`
        *   "一亿" -> \`100000000\`
    *   **English:**
        *   "one thousand" -> \`1000\`
        *   "twelve hundred" -> \`1200\`
        *   "2.5 million" -> \`2500000\`
    *   **General:**
        *   Handle thousands separators (e.g., "1,000,000" -> \`1000000\`).
        *   Handle decimal separators (e.g., "1.5" -> \`1.5\`).

**Step 2: Mathematical Expression Construction**
-   After converting all numbers to digits, use these digits to build a single, complete mathematical expression that solves the user's entire problem.
-   Use parentheses \`()\` to ensure the correct order of operations.
-   **Example:** For "我有1000万token,我消耗了10万,而100万token卖10$,那么我现在的token还值多少钱?" (I have 10 million tokens, I used 100 thousand, and 1 million tokens sell for $10. How much are my remaining tokens worth?)
    *   After Step 1, you have the numbers: \`10000000\`, \`100000\`, \`1000000\`, \`10\`.
    *   You MUST formulate the expression: \`(10000000 - 100000) * (10 / 1000000)\`.

**Step 3: Output JSON**
-   Your ONLY output must be a valid JSON object with a single key "expression" containing the final formula string from Step 2.
-   Do NOT solve the expression.
-   Do NOT include any conversational text, explanations, or reasoning in your final output. Just the JSON.`;


// --- Step 3: System instruction to synthesize the final response ---
const systemInstructionForResponse = `You are a friendly, helpful, and multilingual AI assistant. Your task is to provide a clear and conversational response to a user's mathematical question.

You will be given:
1.  The user's original question.
2.  The final, calculated numerical answer.
3.  The full conversation history for context.

**Your Process:**
1.  **Identify Language:** Determine the user's language from their original question and the history.
2.  **Formulate Response:** Craft a natural-sounding response in the user's language. The response must directly answer their original question and seamlessly integrate the provided calculated result.
    *   **Example:** If the user asked about token value and the result is 99, you should say something like: "Of course! After using 100,000 tokens, your remaining 9,900,000 tokens are worth $99." (or its equivalent in the user's language).
3.  **Be Conversational:** Do not just state the number. Explain what it means in the context of their question.`;

export const getAiCalculation = async (prompt: string, history: Message[]): Promise<string> => {
  try {
    const contents: Content[] = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    // --- Step 1: Call AI to get the mathematical formula ---
    const formulaResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstructionForFormula,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                expression: {
                    type: Type.STRING,
                    description: "The mathematical expression to evaluate.",
                }
            },
            required: ["expression"]
        },
        temperature: 0,
      },
    });
    
    let expression = "";
    try {
        const jsonText = formulaResponse.text.trim();
        const parsedJson = JSON.parse(jsonText);
        expression = parsedJson.expression;
    } catch (e) {
        // If the model fails to return a valid JSON, it might be a direct answer.
        return formulaResponse.text || "I had trouble understanding that. Could you rephrase the calculation?";
    }

    if (!expression) {
        return "I couldn't determine a formula for your question. Please try asking in a different way.";
    }

    // --- Step 2: Calculate the result locally for 100% accuracy ---
    const calculationResult = calculate(expression);
    
    // --- Step 3: Call AI again to get a conversational response ---
    const synthesisPrompt = `The user's original question was: "${prompt}". The final calculated result is: ${calculationResult}. Please formulate a helpful, conversational response.`;
    
    const finalContents: Content[] = [
        ...contents, // We include the full history for conversational context
        { role: 'user', parts: [{ text: synthesisPrompt }] }
    ];

    const finalResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: finalContents,
        config: {
          systemInstruction: systemInstructionForResponse,
        }
    });
    
    return finalResponse.text;

  } catch (error) {
    console.error("Error in AI calculation pipeline:", error);
    if (error instanceof Error && error.message.includes('400 Bad Request')) {
        return "Sorry, your request was not understood by the AI. Please try rephrasing it.";
    }
    return "Sorry, something went wrong while processing your request. Please try again.";
  }
};