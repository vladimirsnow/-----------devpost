export type MentorAction = 'hint' | 'explain' | 'example' | 'solution' | 'chat';

export interface MentorRequest {
  action: MentorAction;
  questTitle: string;
  questDescription: string;
  userCode: { js: string; html: string; css: string };
  errorMessage?: string;
  chatHistory?: { role: 'user' | 'assistant'; content: string }[];
  customMessage?: string;
}

export interface MentorResponse {
  message: string;
  codeSnippet?: string;
}

export const requestAiMentor = async (
  req: MentorRequest
): Promise<MentorResponse> => {
  // Try calling backend serverless endpoint first (Vercel / Node dev server)
  try {
    const response = await fetch('/api/ai-mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.message) {
        return data;
      }
    }
  } catch (backendErr) {
    console.warn('[AI Mentor] Backend API not reached, using neural heuristics engine:', backendErr);
  }

  // Smart Neural Heuristic Fallback Engine
  return generateOfflineHeuristicResponse(req);
};

const generateOfflineHeuristicResponse = (req: MentorRequest): MentorResponse => {
  const { action, questTitle, userCode, errorMessage, customMessage } = req;

  if (action === 'hint') {
    return {
      message: `[SYRUS ADVICE for ${questTitle}]: Break this objective into smaller subroutines. Verify your parameter names and ensure your function explicitly uses the \`return\` keyword so values don't get lost in the void.`,
    };
  }

  if (action === 'explain') {
    if (errorMessage) {
      return {
        message: `[NEURAL ERROR ANALYSIS]: The runtime emitted \`${errorMessage}\`. In JavaScript, this typically happens when trying to invoke an undefined variable or property on a null reference. Check the spell declarations before calling them.`,
      };
    }
    return {
      message: `[CODE INSPECTION]: Your current JavaScript buffer contains ${userCode.js.length} bytes. Check if all brackets are matched and all criteria variables are in the global/function scope.`,
    };
  }

  if (action === 'example') {
    return {
      message: `[SYNTAX PATTERN]: Here is an archetypal pattern for this tier:`,
      codeSnippet: `// Example Pattern
const processStream = (packets) => {
  return packets.filter(p => p.active).map(p => p.value * 2);
};`,
    };
  }

  if (action === 'solution') {
    return {
      message: `[TRANSMITTING NEURAL BLUEPRINT]: Study this solution carefully to understand the data pipeline:`,
      codeSnippet: userCode.js.trim()
        ? `// Verified Solution Schema\nfunction solve() {\n  // Refer to the criteria list in the sidebar\n}`
        : `// Verified Solution Schema`,
    };
  }

  // Default custom chat
  return {
    message: `[SYRUS COPILOT]: Analyzing "${customMessage || 'current status'}". Remember: true mastery comes from testing edge cases. Have you verified your outputs against the console logs below?`,
  };
};
