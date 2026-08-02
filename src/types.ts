export type Seniority = "junior" | "mid" | "senior" | "unknown";
export type RemoteType = "remote" | "hybrid" | "onsite" | "unknown";
export type EmploymentType = "CLT" | "PJ" | "contract" | "unknown";
export type LanguageRequirement = "technical" | "intermediate" | "fluent_required" | "unspecified";
export type Tier = "A" | "B" | "C" | "Rejected";

export interface OpportunityInput {
  id: string;
  title: string;
  company: string;
  country: string;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  seniority: Seniority;
  languageRequirement: LanguageRequirement;
  skills: string[];
  description: string;
  postedHoursAgo: number | null;
  url: string;
  synthetic: boolean;
}

export interface TargetProfile {
  preferredSkills: string[];
  preferredCountries: string[];
  preferredEmploymentTypes: EmploymentType[];
  preferredRemoteTypes: RemoteType[];
  preferredSeniorities: Seniority[];
  blockedLanguageRequirements: LanguageRequirement[];
}

export interface ScoredOpportunity extends OpportunityInput {
  score: number;
  tier: Tier;
  matchedSkills: string[];
  reasons: string[];
  requiresHumanReview: boolean;
}
