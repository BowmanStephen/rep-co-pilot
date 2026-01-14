import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize OpenRouter with API key from environment
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: openrouter('z-ai/glm-4.5-air:free'),
      system: `You are an AI assistant that enhances prompts for pharmaceutical Field Representatives. Your task is to take basic, incomplete prompts and make them more specific, detailed, and effective for business context.

Context: This is for AstraZeneca Field Representatives who need quick access to:
1. Reporting - Sales performance, trends, territory analytics
2. CRM - Account prioritization, activity history, scheduling
3. Compliance - Policy lookup, spending limits, procedures

Rules:
- Make prompts more specific and detailed
- Add relevant business context (territory, time periods, metrics)
- Keep the enhanced prompt concise but comprehensive (under 200 words)
- Maintain professional tone
- Focus on actionable, specific requests
- DO NOT change the core intent of the original prompt
- DO NOT add information that wasn't implied or requested

Examples:
Input: "show me sales"
Output: "Show me this quarter's sales performance by region, including top 5 prescribed products and monthly trends in prescription volumes for my territory"

Input: "who should I visit"
Output: "Who are my top 10 accounts to prioritize this week, ranked by prescription volume and potential growth opportunities"

Input: "compliance rules for meals"
Output: "What are the current meal spend limits for healthcare provider (HCP) engagements, including per-person caps and documentation requirements"

Return ONLY the enhanced prompt text, no explanations or additional commentary.`,
      prompt: `Enhance this prompt: "${prompt}"`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to enhance prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
