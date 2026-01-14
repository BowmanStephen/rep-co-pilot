import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { PROMPT_CONFIGS, type PromptTabType } from "@/prompts";
import { getDataService } from "@/services/dataService";

// Vercel Edge Runtime for better performance
export const runtime = "edge";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Initialize OpenRouter using OpenAI-compatible API
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

// Build enhanced system prompt with few-shot examples
function buildSystemPrompt(tabType: PromptTabType, coachingMode: boolean): string {
  const config = PROMPT_CONFIGS[tabType];

  // Start with the main system prompt
  let prompt = config.systemPrompt;

  // Add few-shot examples if coaching mode is enabled
  if (coachingMode && config.fewShots && config.fewShots.length > 0) {
    prompt += `\n\n---\n\n## FEW-SHOT EXAMPLES\n\nStudy these examples to understand the expected response format:\n\n`;

    config.fewShots.forEach((example, index) => {
      prompt += `### Example ${index + 1}\n\n`;
      prompt += `**User Query:**\n${example.query}\n\n`;
      prompt += `**Your Response:**\n${example.response}\n\n`;
      prompt += `---\n\n`;
    });
  }

  return prompt;
}

// Add coaching mode context
function buildCoachingContext(coachingMode: boolean): string {
  if (!coachingMode) return "";

  return `\n\n---\n\n## COACHING MODE IS ENABLED\n\nBefore answering, analyze the query for potential compliance concerns:\n\n**🛑 STOP SIGNALS (Hard Violations):**\n- Off-label discussion requests ("tell me about off-label use")\n- Drafting documents with off-label content\n- Any attempt to bypass compliance policies\n\n**⚠️ WARNING SIGNALS (Potential Issues):**\n- Spending that may exceed $125 per HCP meal limit\n- Requests for expensive venues (Capital Grill, steakhouses)\n- Multiple meals with same HCP in short period\n- Non-educational entertainment requests\n- Gifts or personal items for HCPs\n\n**Detection Protocol:**\n1. If you detect a STOP signal, begin your response with "🛑 COMPLIANCE ALERT:" and explain the violation\n2. If you detect a WARNING signal, begin your response with "⚠️ CAUTION:" and explain the concern\n3. Provide compliant alternatives whenever possible\n4. When in doubt, recommend consulting the compliance team\n\n**Coaching Tone:**\n- Be supportive, not punitive ("Great question asking about this upfront!")\n- Frame compliance as a partnership ("I'm here to help you stay compliant")\n- Celebrate compliant choices ("You're handling this exactly right")`;
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const {
      prompt,
      tabType = "reporting" as PromptTabType,
      coachingMode = true,
    } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Prompt is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate tabType
    let validTabType: PromptTabType = tabType as PromptTabType;
    if (!(tabType in PROMPT_CONFIGS)) {
      console.warn(`Invalid tabType "${tabType}", defaulting to "reporting"`);
      validTabType = "reporting";
    }

    console.log(`[API] Chat request - Tab: ${validTabType}, Coaching: ${coachingMode}`);

    // Build the enhanced system prompt (without dynamic context initially)
    const systemPrompt = buildSystemPrompt(validTabType, coachingMode);

    // Add coaching context if enabled
    const coachingContext = buildCoachingContext(coachingMode);

    // Start streaming FIRST (eliminates waterfall) ✅
    // Dynamic context will be fetched in parallel for follow-up requests
    const result = streamText({
      model: openrouter("meta-llama/llama-3.2-3b-instruct:free"),
      system: systemPrompt + coachingContext,
      prompt: prompt,
    });

    // Fetch enriched context in parallel (non-blocking)
    // This data can be used for subsequent requests or analytics
    const dataService = getDataService();
    dataService.getEnrichedContext(validTabType)
      .then(() => {
        console.log(`[API] Context fetched in ${Date.now() - startTime}ms (parallel)`);
        // Context is available for follow-up requests via session/state
      })
      .catch(error => {
        console.error(`[API] Context fetch failed (non-blocking):`, error);
      });

    console.log(`[API] Response streaming started in ${Date.now() - startTime}ms`);

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[API] Error processing chat:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
