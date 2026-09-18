// Serverless API route for Vercel & Node server: /api/ai-mentor
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, questTitle, questDescription, userCode, errorMessage, customMessage } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      message: `[SYRUS OFFLINE HEURISTIC]: API key not detected in server environment. Syrus is operating in Local Neural Matrix mode. Check MANUAL_SETUP.md to connect your Gemini API Key!`,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are SYRUS, an elite Cyberpunk Neural AI Mentor in the DevQuest gamified coding platform.
Your persona is a brilliant, encouraging, cyber-themed senior coding architect.
IMPORTANT PEDAGOGICAL RULE:
- For 'hint': Never give the full code solution. Give a Socratic hint or point out a logic flaw.
- For 'explain': Explain the error or logic in simple beginner-friendly terms.
- For 'example': Provide a small abstract code snippet demonstrating the relevant syntax or pattern.
- For 'solution': Provide the clean working solution with a step-by-step breakdown.
Keep responses concise, formatted in markdown with code blocks where appropriate.`;

    const promptText = `
Task: ${action}
Quest: ${questTitle}
Quest Objective: ${questDescription}
User's Current Code:
\`\`\`javascript
${userCode?.js || '// empty'}
\`\`\`
${errorMessage ? `Reported Error: ${errorMessage}` : ''}
${customMessage ? `User Query: ${customMessage}` : ''}

Respond as SYRUS now:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${promptText}` }] },
      ],
    });

    const outputText = response.text || "Neural connection degraded. Retry query.";

    return res.status(200).json({
      message: outputText,
    });
  } catch (err) {
    console.error('Gemini API execution error:', err);
    return res.status(200).json({
      message: `[SYRUS BACKUP]: Neural bridge experienced interference (${err.message}). Check your parameters and try again.`,
    });
  }
}
