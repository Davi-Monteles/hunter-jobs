import type { ScoredOpportunity } from "./types.js";

interface LlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function readLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig | null {
  const baseUrl = env.LLM_BASE_URL?.trim();
  const apiKey = env.LLM_API_KEY?.trim();
  const model = env.LLM_MODEL?.trim();
  return baseUrl && apiKey && model ? { baseUrl, apiKey, model } : null;
}

export async function generateSummary(opportunity: ScoredOpportunity, config: LlmConfig): Promise<string> {
  const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      messages: [
        { role: "system", content: "Resuma a vaga sem inventar requisitos, experiência ou resultados." },
        { role: "user", content: JSON.stringify({ title: opportunity.title, description: opportunity.description, matchedSkills: opportunity.matchedSkills }) }
      ]
    })
  });
  if (!response.ok) throw new Error(`LLM request failed with status ${response.status}`);
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return payload.choices?.[0]?.message?.content?.trim() || "";
}
