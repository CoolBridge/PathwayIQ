// Types matching our Python agent outputs exactly

export interface UserProfile {
  name: string;
  degree: string;
  degreeClass: string;
  graduationYear: number;
  university: string;
  experienceYears: number;
  experienceField: string;
  skills: string[];
  interests: string[];
  englishLevel: string;
  budgetUsd: number;
  timelineMonths: number;
  preferredCountries: string[];
  careerGoal: string;
}

export interface CareerMatch {
  career: string;
  score: number;
  salaryRange: string;
  growth: string;
  timeline: string;
  eligible: boolean;
  minDegreeClass: string;
}

export interface CountryMatch {
  country: string;
  flag: string;
  score: number;
  budgetOk: boolean;
  timelineOk: boolean;
  strengths: string[];
  challenges: string[];
  visaDifficulty: string;
  prPathway: string;
  bestFor: string[];
}

export interface ExamRequirements {
  country: string;
  career: string;
  degree: string;
  englishTest: string;
  englishAlternative: string;
  gradExam: string;
  credentialEval: string;
  clinicalLicense: string;
  totalCostEstimate: string;
  prepTime: string;
  tips: string[];
}

export interface SalaryData {
  career: string;
  country: string;
  entrySalary: string;
  midSalary: string;
  seniorSalary: string;
  currency: string;
  nairComparison: string;
  roiNote: string;
}

export interface SkillsGap {
  career: string;
  readinessScore: number;
  essentialHave: string[];
  essentialMissing: string[];
  importantHave: string[];
  importantMissing: string[];
  recommendedCertifications: string[];
  freeResources: string[];
  prioritySkills: string[];
}

export interface Opportunity {
  name: string;
  type: string;
  country: string;
  value: string;
  deadline: string;
  link: string;
  score: number;
  tags: string[];
}

export interface ProfileResult {
  name: string;
  degree: string;
  degreeClass: string;
  academicScore: number;
  experienceScore: number;
  englishScore: number;
  budgetCategory: string;
  timelineCategory: string;
  overallReadiness: number;
}

export interface AssessmentResult {
  profile: ProfileResult;
  careers: CareerMatch[];
  countries: CountryMatch[];
  examRequirements: ExamRequirements;
  salary: SalaryData;
  skillsGap: SkillsGap;
  opportunities: Opportunity[];
}

export interface TierAccess {
  tier: 'free' | 'starter' | 'premium' | 
        'student' | 'professional' | 'global';
  canAccessSkillsGap: boolean;
  canAccessOpportunities: boolean;
  canAccessRoadmap: boolean;
  canAccessInterview: boolean;
  canAccessPersonalStatement: boolean;
  canExportPDF: boolean;
  reportsRemaining: number;
}