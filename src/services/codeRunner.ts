import { Quest } from '../types';

export interface RunResult {
  success: boolean;
  logs: string[];
  results: { [criterionId: string]: boolean };
  error?: string;
  renderHtml?: string;
}

export const executeQuestCode = (
  quest: Quest,
  code: { js: string; html: string; css: string }
): RunResult => {
  const logs: string[] = [];

  try {
    const validation = quest.validate(code);
    return {
      success: validation.success,
      results: validation.results,
      logs: [...logs, ...(validation.logs || [])],
      error: validation.error,
      renderHtml: generateRenderHtml(code.html, code.css, code.js),
    };
  } catch (err: any) {
    return {
      success: false,
      results: {},
      logs: [...logs, `[RUNTIME_ERROR] ${err.message}`],
      error: err.message,
      renderHtml: generateRenderHtml(code.html, code.css, code.js),
    };
  }
};

export const generateRenderHtml = (html: string, css: string, js: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 16px;
            font-family: 'Space Mono', monospace, sans-serif;
            background: #0b0e15;
            color: #e1e2ec;
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch(e) {
            console.error('Sandboxed Script Error:', e);
          }
        </script>
      </body>
    </html>
  `;
};
