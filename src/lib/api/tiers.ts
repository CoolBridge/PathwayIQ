// Tier access control — matches our revenue model

import type { TierAccess } from './types';

export const TIER_LIMITS = {
  free: {
    reportsPerDay: 5,
    canAccessSkillsGap: false,
    canAccessOpportunities: false,
    canAccessRoadmap: false,
    canAccessInterview: false,
    canAccessPersonalStatement: false,
    canExportPDF: false,
  },
  starter: {
    // ₦3,500 one-time
    reportsPerDay: 999,
    canAccessSkillsGap: false,
    canAccessOpportunities: true,
    canAccessRoadmap: true,
    canAccessInterview: false,
    canAccessPersonalStatement: false,
    canExportPDF: true,
  },
  premium: {
    // ₦10,000 one-time
    reportsPerDay: 999,
    canAccessSkillsGap: true,
    canAccessOpportunities: true,
    canAccessRoadmap: true,
    canAccessInterview: false,
    canAccessPersonalStatement: true,
    canExportPDF: true,
  },
  student: {
    // ₦5,000/month
    reportsPerDay: 50,
    canAccessSkillsGap: true,
    canAccessOpportunities: true,
    canAccessRoadmap: true,
    canAccessInterview: false,
    canAccessPersonalStatement: false,
    canExportPDF: true,
  },
  professional: {
    // ₦12,000/month
    reportsPerDay: 200,
    canAccessSkillsGap: true,
    canAccessOpportunities: true,
    canAccessRoadmap: true,
    canAccessInterview: true,
    canAccessPersonalStatement: true,
    canExportPDF: true,
  },
  global: {
    // ₦25,000/month
    reportsPerDay: 999,
    canAccessSkillsGap: true,
    canAccessOpportunities: true,
    canAccessRoadmap: true,
    canAccessInterview: true,
    canAccessPersonalStatement: true,
    canExportPDF: true,
  },
} as const;

export function getTierAccess(
  tier: TierAccess['tier']
): TierAccess {
  const limits = TIER_LIMITS[tier];
  return {
    tier,
    ...limits,
    reportsRemaining: limits.reportsPerDay,
  };
}

export const TIER_PRICES = {
  starter: { ngn: 3500, usd: 2.5 },
  premium: { ngn: 10000, usd: 7 },
  student: { ngn: 5000, usd: 4, monthly: true },
  professional: { ngn: 12000, usd: 10, monthly: true },
  global: { ngn: 25000, usd: 19, monthly: true },
} as const;

export const TOKEN_COSTS = {
  careerReport: 3,
  countryComparison: 2,
  interviewSession: 1,
  roadmapGeneration: 2,
  premiumSimulation: 5,
} as const;

export const TOKEN_PACKS = [
  { credits: 20, ngnPrice: 2000, usdPrice: 1.5 },
  { credits: 50, ngnPrice: 4500, usdPrice: 3.5 },
  { credits: 100, ngnPrice: 8000, usdPrice: 6 },
] as const;