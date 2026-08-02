import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_PROFILE } from "./profile.js";
import { scoreOpportunity } from "./scoring.js";
import type { OpportunityInput } from "./types.js";

function opportunity(overrides: Partial<OpportunityInput> = {}): OpportunityInput {
  return {
    id: "synthetic-test",
    title: "Desenvolvedor Full-Stack Júnior",
    company: "Empresa Fictícia",
    country: "Brazil",
    remoteType: "remote",
    employmentType: "CLT",
    seniority: "junior",
    languageRequirement: "technical",
    skills: ["Python", "React", "PostgreSQL", "AI"],
    description: "Vaga sintética para testar o motor de scoring.",
    postedHoursAgo: 12,
    url: "https://example.invalid/jobs/synthetic-test",
    synthetic: true,
    ...overrides
  };
}

test("strong junior remote match becomes Tier A", () => {
  const result = scoreOpportunity(opportunity(), DEMO_PROFILE);
  assert.equal(result.tier, "A");
  assert.ok(result.score >= 75);
});

test("senior role is rejected", () => {
  const result = scoreOpportunity(opportunity({ seniority: "senior" }), DEMO_PROFILE);
  assert.equal(result.tier, "Rejected");
  assert.ok(result.reasons.includes("Senioridade acima do perfil-alvo"));
});

test("onsite role is rejected", () => {
  const result = scoreOpportunity(opportunity({ remoteType: "onsite" }), DEMO_PROFILE);
  assert.equal(result.tier, "Rejected");
});

test("fluent English requirement is rejected but intermediate is not", () => {
  assert.equal(scoreOpportunity(opportunity({ languageRequirement: "fluent_required" }), DEMO_PROFILE).tier, "Rejected");
  assert.notEqual(scoreOpportunity(opportunity({ languageRequirement: "intermediate" }), DEMO_PROFILE).tier, "Rejected");
});
