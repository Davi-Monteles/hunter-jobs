import type { OpportunityInput, ScoredOpportunity, TargetProfile, Tier } from "./types.js";

const normalize = (value: string) => value.trim().toLowerCase();

export function scoreOpportunity(input: OpportunityInput, profile: TargetProfile): ScoredOpportunity {
  const reasons: string[] = [];
  const matchedSkills = input.skills.filter((skill) =>
    profile.preferredSkills.some((preferred) => normalize(preferred) === normalize(skill))
  );

  const hardBlockers: string[] = [];
  if (input.seniority === "senior") hardBlockers.push("Senioridade acima do perfil-alvo");
  if (input.remoteType === "onsite") hardBlockers.push("Vaga presencial");
  if (profile.blockedLanguageRequirements.includes(input.languageRequirement)) {
    hardBlockers.push("Inglês fluente obrigatório");
  }

  let score = 0;
  if (profile.preferredSeniorities.includes(input.seniority)) {
    score += 25;
    reasons.push("Senioridade prioritária");
  } else if (input.seniority === "mid") {
    score -= 15;
    reasons.push("Senioridade requer avaliação");
  }

  if (profile.preferredRemoteTypes.includes(input.remoteType)) {
    score += input.remoteType === "remote" ? 20 : 10;
    reasons.push(input.remoteType === "remote" ? "Trabalho remoto" : "Trabalho híbrido");
  }

  if (profile.preferredCountries.map(normalize).includes(normalize(input.country))) {
    score += 10;
    reasons.push("País prioritário");
  }

  if (profile.preferredEmploymentTypes.includes(input.employmentType)) {
    score += 10;
    reasons.push(`Contratação ${input.employmentType}`);
  }

  score += Math.min(matchedSkills.length * 7, 28);
  if (matchedSkills.length) reasons.push(`${matchedSkills.length} competência(s) compatível(is)`);

  const text = `${input.title} ${input.description} ${input.skills.join(" ")}`;
  if (/\b(?:AI|IA|LLM|automação|automation)\b/i.test(text)) {
    score += 7;
    reasons.push("IA ou automação no escopo");
  }

  if (input.postedHoursAgo !== null && input.postedHoursAgo <= 48) {
    score += 5;
    reasons.push("Publicação recente");
  }

  const boundedScore = Math.max(0, Math.min(score, 100));
  const tier = chooseTier(boundedScore, hardBlockers);
  return {
    ...input,
    score: hardBlockers.length ? Math.min(boundedScore, 30) : boundedScore,
    tier,
    matchedSkills,
    reasons: [...hardBlockers, ...reasons],
    requiresHumanReview: tier !== "Rejected"
  };
}

export function scoreOpportunities(inputs: OpportunityInput[], profile: TargetProfile): ScoredOpportunity[] {
  return inputs.map((input) => scoreOpportunity(input, profile)).sort((a, b) => b.score - a.score);
}

function chooseTier(score: number, blockers: string[]): Tier {
  if (blockers.length) return "Rejected";
  if (score >= 75) return "A";
  if (score >= 55) return "B";
  if (score >= 35) return "C";
  return "Rejected";
}
