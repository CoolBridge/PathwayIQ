// Main API client — connects UI to our Python agents
// Uses TanStack createServerFn for server-side execution

import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import type {
  AssessmentResult,
  CareerMatch,
  CountryMatch,
  ExamRequirements,
  Opportunity,
  SalaryData,
  SkillsGap,
  UserProfile,
} from './types';

// --- VALIDATION SCHEMAS ---

const ProfileSchema = z.object({
  name: z.string().min(1),
  degree: z.string().min(1),
  degreeClass: z.string().min(1),
  graduationYear: z.number().int().min(1990).max(2030),
  university: z.string().min(1),
  experienceYears: z.number().min(0).max(50),
  experienceField: z.string().min(1),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  englishLevel: z.string().min(1),
  budgetUsd: z.number().min(0),
  timelineMonths: z.number().min(1).max(120),
  preferredCountries: z.array(z.string()),
  careerGoal: z.string().min(1),
});

// --- CAREER MATCHING (Rules-based, no AI cost) ---

const CAREER_DATABASE: Record<string, {
  degrees: Record<string, number>;
  interests: string[];
  skillsBonus: string[];
  salaryRange: string;
  growth: string;
  timeline: string;
  minDegreeClass: string;
}> = {
  'Health Data Analytics': {
    degrees: {
      'Physiology': 85,
      'Biomedical Science': 80,
      'Biochemistry': 75,
      'Health Information Management': 95,
      'Public Health': 80,
      'Medical Laboratory Science': 70,
      'Pharmacology': 70,
      'Anatomy': 60,
      'Nutrition & Dietetics': 60,
      'Nursing': 65,
      'Medicine': 70,
      'Physiotherapy': 65,
      'Clinical Research': 80,
      'Data Science': 95,
    },
    interests: ['data', 'technology', 'analytics',
      'computers', 'statistics', 'programming'],
    skillsBonus: ['python', 'sql', 'excel',
      'power bi', 'r', 'statistics', 'tableau'],
    salaryRange: '£35,000–£90,000',
    growth: 'Very High',
    timeline: '6–18 months to first role',
    minDegreeClass: 'Second Class Lower (2:2)',
  },
  'Pharmaceutical Industry': {
    degrees: {
      'Pharmacology': 95,
      'Biochemistry': 85,
      'Biomedical Science': 80,
      'Physiology': 75,
      'Medical Laboratory Science': 70,
      'Anatomy': 60,
      'Public Health': 65,
      'Nursing': 55,
      'Medicine': 75,
      'Clinical Research': 85,
      'Data Science': 65,
    },
    interests: ['drugs', 'research', 'industry',
      'pharma', 'clinical trials', 'medicine'],
    skillsBonus: ['gcp', 'clinical research',
      'regulatory', 'pharmacovigilance', 'laboratory'],
    salaryRange: '£32,000–£85,000',
    growth: 'High',
    timeline: '6–18 months to first role',
    minDegreeClass: 'Second Class Upper (2:1)',
  },
  'Clinical Research': {
    degrees: {
      'Pharmacology': 90,
      'Biomedical Science': 85,
      'Biochemistry': 80,
      'Physiology': 80,
      'Medical Laboratory Science': 75,
      'Public Health': 75,
      'Nursing': 80,
      'Medicine': 90,
      'Clinical Research': 100,
      'Data Science': 70,
    },
    interests: ['clinical trials', 'research',
      'pharma', 'medicine', 'evidence'],
    skillsBonus: ['gcp', 'clinical trials',
      'data management', 'regulatory', 'protocol writing'],
    salaryRange: '£28,000–£65,000',
    growth: 'High',
    timeline: '3–12 months to first role',
    minDegreeClass: 'Second Class Upper (2:1)',
  },
  'Public Health & Epidemiology': {
    degrees: {
      'Public Health': 95,
      'Physiology': 70,
      'Biomedical Science': 70,
      'Biochemistry': 65,
      'Nutrition & Dietetics': 80,
      'Medical Laboratory Science': 70,
      'Nursing': 80,
      'Medicine': 85,
      'Data Science': 75,
    },
    interests: ['population health', 'policy',
      'global health', 'ngo', 'un', 'who',
      'community', 'epidemiology'],
    skillsBonus: ['epidemiology', 'stata',
      'public health', 'research', 'project management'],
    salaryRange: '£28,000–£70,000',
    growth: 'High',
    timeline: '6–18 months to first role',
    minDegreeClass: 'Second Class Lower (2:2)',
  },
  'Health Informatics & Digital Health': {
    degrees: {
      'Health Information Management': 100,
      'Physiology': 70,
      'Biomedical Science': 70,
      'Public Health': 75,
      'Biochemistry': 65,
      'Nursing': 70,
      'Medicine': 65,
      'Data Science': 90,
      'Clinical Research': 70,
    },
    interests: ['technology', 'digital health',
      'ehr', 'informatics', 'systems', 'innovation'],
    skillsBonus: ['ehr systems', 'sql', 'python',
      'hl7', 'fhir', 'project management'],
    salaryRange: '£30,000–£75,000',
    growth: 'Very High',
    timeline: '6–18 months to first role',
    minDegreeClass: 'Second Class Lower (2:2)',
  },
  'Research & Academia': {
    degrees: {
      'Physiology': 85,
      'Biomedical Science': 85,
      'Biochemistry': 90,
      'Pharmacology': 85,
      'Anatomy': 80,
      'Medical Laboratory Science': 75,
      'Public Health': 80,
      'Nutrition & Dietetics': 75,
      'Medicine': 90,
      'Data Science': 80,
    },
    interests: ['research', 'science', 'academia',
      'teaching', 'discovery', 'publishing'],
    skillsBonus: ['research methodology', 'statistics',
      'publications', 'laboratory', 'grant writing'],
    salaryRange: '£28,000–£65,000',
    growth: 'Medium',
    timeline: '2–5 years (MSc/PhD usually required)',
    minDegreeClass: 'Second Class Upper (2:1)',
  },
  'Global Health & International Development': {
    degrees: {
      'Public Health': 95,
      'Physiology': 65,
      'Nutrition & Dietetics': 80,
      'Medical Laboratory Science': 65,
      'Nursing': 80,
      'Medicine': 85,
      'Data Science': 70,
    },
    interests: ['global health', 'who', 'un',
      'unicef', 'ngo', 'africa', 'development', 'policy'],
    skillsBonus: ['french', 'project management',
      'grant writing', 'epidemiology', 'field experience'],
    salaryRange: '£28,000–£80,000',
    growth: 'High',
    timeline: '12–24 months (MPH recommended)',
    minDegreeClass: 'Second Class Lower (2:2)',
  },
  'Clinical Practice (Nursing/Medicine)': {
    degrees: {
      'Nursing': 100,
      'Medicine': 100,
      'Physiotherapy': 85,
      'Physiology': 60,
      'Biomedical Science': 55,
    },
    interests: ['patients', 'clinical', 'healthcare',
      'hospital', 'direct care', 'treatment'],
    skillsBonus: ['clinical skills', 'patient care',
      'medical knowledge', 'procedures'],
    salaryRange: '£28,000–£120,000',
    growth: 'Stable',
    timeline: '6–18 months (registration required)',
    minDegreeClass: 'Second Class Lower (2:2)',
  },
};

const COUNTRY_DATABASE: Record<string, {
  budgetMin: number;
  timelineMin: number;
  baseScore: number;
  flag: string;
  strengths: string[];
  challenges: string[];
  visaDifficulty: string;
  prPathway: string;
  bestFor: string[];
  salary: string;
  entryTime: string;
  difficulty: number;
}> = {
  'United Kingdom': {
    budgetMin: 5000,
    timelineMin: 6,
    baseScore: 85,
    flag: '🇬🇧',
    strengths: ['NHS employment', 'fast pathway',
      'no GRE required', 'graduate visa'],
    challenges: ['high cost of living',
      'competitive job market'],
    visaDifficulty: 'Medium',
    prPathway: '5 years',
    bestFor: ['clinical', 'research', 'pharma',
      'health data', 'public health'],
    salary: '$54K',
    entryTime: '8–14 mo',
    difficulty: 72,
  },
  'Canada': {
    budgetMin: 8000,
    timelineMin: 12,
    baseScore: 82,
    flag: '🇨🇦',
    strengths: ['PR pathway', 'PGWP 3 years',
      'multicultural', 'quality of life'],
    challenges: ['cold weather', 'credential recognition'],
    visaDifficulty: 'Medium',
    prPathway: '3–5 years',
    bestFor: ['clinical', 'lab science',
      'public health', 'research'],
    salary: '$68K',
    entryTime: '12–18 mo',
    difficulty: 64,
  },
  'Australia': {
    budgetMin: 10000,
    timelineMin: 12,
    baseScore: 80,
    flag: '🇦🇺',
    strengths: ['Australia Awards scholarship',
      'quality of life', '485 visa 4 years'],
    challenges: ['distance', 'VETASSESS assessment'],
    visaDifficulty: 'Medium',
    prPathway: '4–6 years',
    bestFor: ['clinical', 'lab science',
      'public health', 'nutrition'],
    salary: '$71K',
    entryTime: '9–16 mo',
    difficulty: 58,
  },
  'Germany': {
    budgetMin: 3000,
    timelineMin: 12,
    baseScore: 78,
    flag: '🇩🇪',
    strengths: ['FREE university tuition',
      'DAAD scholarship', 'strong pharma industry'],
    challenges: ['German language needed',
      'APS certificate required'],
    visaDifficulty: 'Medium',
    prPathway: '5 years',
    bestFor: ['research', 'pharma', 'biotech',
      'health data', 'academia'],
    salary: '$57K',
    entryTime: '10–18 mo',
    difficulty: 51,
  },
  'Netherlands': {
    budgetMin: 5000,
    timelineMin: 12,
    baseScore: 76,
    flag: '🇳🇱',
    strengths: ['Orange Knowledge Programme',
      'English-friendly', 'pharma multinationals'],
    challenges: ['expensive housing', 'Dutch helps'],
    visaDifficulty: 'Low',
    prPathway: '5 years',
    bestFor: ['pharma', 'research', 'health data'],
    salary: '$62K',
    entryTime: '8–12 mo',
    difficulty: 67,
  },
  'United States': {
    budgetMin: 15000,
    timelineMin: 18,
    baseScore: 80,
    flag: '🇺🇸',
    strengths: ['highest salaries', 'top universities',
      'NIH funding', 'STEM OPT'],
    challenges: ['H-1B lottery', 'high cost', 'GRE required'],
    visaDifficulty: 'High',
    prPathway: '5–10 years',
    bestFor: ['research', 'pharma', 'health data',
      'academia'],
    salary: '$84K',
    entryTime: '18–30 mo',
    difficulty: 82,
  },
  'UAE': {
    budgetMin: 2000,
    timelineMin: 3,
    baseScore: 75,
    flag: '🇦🇪',
    strengths: ['tax-free salary', 'fastest employment',
      'large Nigerian community'],
    challenges: ['professional licensing exam',
      'no PR pathway'],
    visaDifficulty: 'Low',
    prPathway: 'No PR (Golden Visa 10yr)',
    bestFor: ['clinical', 'lab science',
      'nutrition', 'health data'],
    salary: '$76K',
    entryTime: '6–10 mo',
    difficulty: 45,
  },
  'Nigeria': {
    budgetMin: 0,
    timelineMin: 0,
    baseScore: 70,
    flag: '🇳🇬',
    strengths: ['no relocation', 'NYSC completion',
      'growing health tech', 'international org offices'],
    challenges: ['lower salaries', 'infrastructure'],
    visaDifficulty: 'None',
    prPathway: 'N/A (home country)',
    bestFor: ['early career', 'NYSC', 'experience building'],
    salary: '$8K',
    entryTime: '1–3 mo',
    difficulty: 20,
  },
  'South Africa': {
    budgetMin: 2000,
    timelineMin: 6,
    baseScore: 72,
    flag: '🇿🇦',
    strengths: ['Critical Skills Visa',
      'English speaking', 'stepping stone'],
    challenges: ['safety concerns', 'SAQA evaluation'],
    visaDifficulty: 'Low',
    prPathway: '5 years',
    bestFor: ['early international experience',
      'research', 'lab science'],
    salary: '$18K',
    entryTime: '4–8 mo',
    difficulty: 35,
  },
};

// --- SERVER FUNCTIONS ---

export const runAssessment = createServerFn({ method: 'POST' })
  .inputValidator(ProfileSchema)
  .handler(async ({ data }): Promise<AssessmentResult> => {

    // 1. BUILD PROFILE
    const classOrder = [
      'First Class',
      'Second Class Upper (2:1)',
      'Second Class Lower (2:2)',
      'Third Class',
      'Pass',
    ];

    const classScores: Record<string, number> = {
      'First Class': 100,
      'Second Class Upper (2:1)': 80,
      'Second Class Lower (2:2)': 60,
      'Third Class': 40,
      'Pass': 30,
    };

    const englishScores: Record<string, number> = {
      'Native/Fluent': 100,
      'High': 85,
      'Medium': 65,
      'Low': 40,
    };

    const expScore = data.experienceYears >= 10 ? 100
      : data.experienceYears >= 5 ? 80
      : data.experienceYears >= 3 ? 65
      : data.experienceYears >= 1 ? 50 : 30;

    const academicScore = classScores[data.degreeClass] ?? 50;
    const englishScore = englishScores[data.englishLevel] ?? 65;
    const overallReadiness = Math.round(
      academicScore * 0.35 + expScore * 0.30 + englishScore * 0.35
    );

    const profile = {
      name: data.name,
      degree: data.degree,
      degreeClass: data.degreeClass,
      academicScore,
      experienceScore: expScore,
      englishScore,
      budgetCategory: data.budgetUsd >= 20000 ? 'High'
        : data.budgetUsd >= 10000 ? 'Medium'
        : data.budgetUsd >= 3000 ? 'Low' : 'Very Low',
      timelineCategory: data.timelineMonths <= 6 ? 'Urgent'
        : data.timelineMonths <= 12 ? 'Short'
        : data.timelineMonths <= 24 ? 'Medium' : 'Flexible',
      overallReadiness,
    };

    // 2. MATCH CAREERS
    const userClassIdx = classOrder.indexOf(data.degreeClass);
    const userSkills = data.skills.map(s => s.toLowerCase());
    const userInterests = data.interests.map(i => i.toLowerCase());

    const careerResults: CareerMatch[] = Object.entries(CAREER_DATABASE)
      .map(([career, cData]) => {
        let score = 0;
        const degreeScore = cData.degrees[data.degree] ?? 40;
        score += degreeScore * 0.40;

        const interestMatches = cData.interests.filter(interest =>
          userInterests.some(i => i.includes(interest) || interest.includes(i))
        ).length;
        score += Math.min(interestMatches * 25, 100) * 0.25;

        const skillMatches = cData.skillsBonus.filter(skill =>
          userSkills.some(s => s.includes(skill) || skill.includes(s))
        ).length;
        score += Math.min(skillMatches * 20, 100) * 0.20;

        if (data.experienceField &&
          career.toLowerCase().includes(
            data.experienceField.toLowerCase().split(' ')[0]
          )) score += 10;

        if (data.careerGoal &&
          career.toLowerCase().includes(
            data.careerGoal.toLowerCase().split(' ')[0]
          )) score += 5;

        const minClassIdx = classOrder.indexOf(cData.minDegreeClass);
        const eligible = userClassIdx <= minClassIdx || minClassIdx === -1;
        if (!eligible) score *= 0.75;

        return {
          career,
          score: Math.round(Math.min(score, 100) * 10) / 10,
          salaryRange: cData.salaryRange,
          growth: cData.growth,
          timeline: cData.timeline,
          eligible,
          minDegreeClass: cData.minDegreeClass,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 3. MATCH COUNTRIES
    const topCareer = careerResults[0]?.career ?? '';
    const preferred = data.preferredCountries.map(c => c.toLowerCase());

    const countryResults: CountryMatch[] = Object.entries(COUNTRY_DATABASE)
      .map(([country, cData]) => {
        let score = cData.baseScore;
        const budgetOk = data.budgetUsd >= cData.budgetMin;
        const timelineOk = data.timelineMonths >= cData.timelineMin;
        if (!budgetOk) score -= 25;
        if (!timelineOk) score -= 20;

        const englishLevels: Record<string, number> = {
          'Native/Fluent': 3, 'High': 2, 'Medium': 1, 'Low': 0,
        };
        if ((englishLevels[data.englishLevel] ?? 1) < 2 &&
          country === 'United Kingdom') score -= 15;

        if (cData.bestFor.some(b =>
          topCareer.toLowerCase().includes(b)
        )) score += 10;

        if (preferred.some(p =>
          country.toLowerCase().includes(p) || p.includes(country.toLowerCase())
        )) score += 8;

        return {
          country,
          flag: cData.flag,
          score: Math.round(Math.min(score, 100) * 10) / 10,
          budgetOk,
          timelineOk,
          strengths: cData.strengths.slice(0, 3),
          challenges: cData.challenges.slice(0, 2),
          visaDifficulty: cData.visaDifficulty,
          prPathway: cData.prPathway,
          bestFor: cData.bestFor.slice(0, 3),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 4. EXAM REQUIREMENTS
    const examMatrix: Record<string, ExamRequirements> = {
      'United Kingdom': {
        country: 'United Kingdom',
        career: topCareer,
        degree: data.degree,
        englishTest: 'IELTS Academic 6.5+ (7.0 for clinical)',
        englishAlternative: 'OET Grade B / TOEFL 90+',
        gradExam: 'GRE not required for most UK MSc programs',
        credentialEval: 'UK ENIC evaluation (£150–200)',
        clinicalLicense: 'HCPC registration for clinical roles',
        totalCostEstimate: '$300–700',
        prepTime: '2–4 months',
        tips: ['IELTS Academic (not General Training)',
          'OET better for clinical backgrounds',
          'UK ENIC takes 2–4 weeks'],
      },
      'Canada': {
        country: 'Canada',
        career: topCareer,
        degree: data.degree,
        englishTest: 'IELTS Academic 6.5+ or CELPIP 7+',
        englishAlternative: 'TOEFL iBT 86+',
        gradExam: 'GRE required for some programs only',
        credentialEval: 'WES Canada (CAD $220–300)',
        clinicalLicense: 'Provincial license (varies)',
        totalCostEstimate: '$700–1,200',
        prepTime: '3–6 months',
        tips: ['WES evaluation needed for Express Entry',
          'PGWP gives 3 years post-study work permit',
          'Ontario and BC most popular provinces'],
      },
      'Australia': {
        country: 'Australia',
        career: topCareer,
        degree: data.degree,
        englishTest: 'IELTS 6.5–7.0 or OET Grade B',
        englishAlternative: 'PTE Academic 58–65+',
        gradExam: 'GRE for some research programs',
        credentialEval: 'VETASSESS skills assessment (AUD $500–800)',
        clinicalLicense: 'AHPRA registration for clinical roles',
        totalCostEstimate: '$1,000–2,000',
        prepTime: '4–8 months',
        tips: ['Australia Awards fully funded — apply first',
          'VETASSESS takes 10–12 weeks',
          '485 visa gives 2–4 years post-study'],
      },
      'Germany': {
        country: 'Germany',
        career: topCareer,
        degree: data.degree,
        englishTest: 'IELTS 6.0–6.5 (English programs)',
        englishAlternative: 'TOEFL 80+',
        gradExam: 'GRE not required for most German programs',
        credentialEval: 'APS Certificate MANDATORY (€75)',
        clinicalLicense: 'Approbation + German B2/C1',
        totalCostEstimate: '$400–800',
        prepTime: '4–8 months',
        tips: ['APS Certificate is MANDATORY — start first',
          'Most public university MSc programs are FREE',
          'DAAD scholarship is excellent — apply early'],
      },
      'United States': {
        country: 'United States',
        career: topCareer,
        degree: data.degree,
        englishTest: 'TOEFL iBT 80–100+',
        englishAlternative: 'IELTS Academic 6.5–7.0',
        gradExam: 'GRE General Test required for most MSc/PhD',
        credentialEval: 'WES or ECE ($200–300)',
        clinicalLicense: 'State license + ASCP/USMLE',
        totalCostEstimate: '$800–1,500',
        prepTime: '4–8 months',
        tips: ['TOEFL preferred over IELTS for US universities',
          'GRE prep takes 3–6 months minimum',
          'STEM OPT gives 3 years post-study work'],
      },
      'UAE': {
        country: 'UAE',
        career: topCareer,
        degree: data.degree,
        englishTest: 'IELTS Academic 6.0+ or OET Grade B',
        englishAlternative: 'TOEFL iBT 79+',
        gradExam: 'GRE not usually required',
        credentialEval: 'Ministry of Education + MOFA attestation',
        clinicalLicense: 'DHA (Dubai) or HAAD (Abu Dhabi) exam',
        totalCostEstimate: '$800–1,500',
        prepTime: '3–6 months',
        tips: ['Start Nigerian attestation chain early',
          'DHA Prometric exam for Dubai clinical roles',
          'Tax-free salary is significant advantage'],
      },
    };

    const topCountry = countryResults[0]?.country ?? 'United Kingdom';
    const examRequirements = examMatrix[topCountry] ?? examMatrix['United Kingdom'];

    // 5. SALARY DATA
    const salaryMap: Record<string, Record<string, {
      entry: string; mid: string; senior: string; currency: string;
    }>> = {
      'Health Data Analytics': {
        'United Kingdom': { entry: '£32,000–£42,000', mid: '£42,000–£65,000', senior: '£65,000–£95,000', currency: 'GBP' },
        'United States': { entry: '$60,000–$85,000', mid: '$85,000–$120,000', senior: '$120,000–$180,000', currency: 'USD' },
        'Canada': { entry: 'CAD $55,000–$75,000', mid: 'CAD $75,000–$105,000', senior: 'CAD $105,000–$145,000', currency: 'CAD' },
        'Australia': { entry: 'AUD $65,000–$85,000', mid: 'AUD $85,000–$115,000', senior: 'AUD $115,000–$155,000', currency: 'AUD' },
        'Germany': { entry: '€42,000–€58,000', mid: '€58,000–€80,000', senior: '€80,000–€110,000', currency: 'EUR' },
        'UAE': { entry: 'AED 12,000–20,000/mo (tax free)', mid: 'AED 20,000–32,000/mo', senior: 'AED 32,000–50,000/mo', currency: 'AED' },
      },
      'Pharmaceutical Industry': {
        'United Kingdom': { entry: '£32,000–£42,000', mid: '£42,000–£65,000', senior: '£65,000–£100,000', currency: 'GBP' },
        'United States': { entry: '$58,000–$80,000', mid: '$80,000–$115,000', senior: '$115,000–$175,000', currency: 'USD' },
        'Germany': { entry: '€42,000–€58,000', mid: '€58,000–€80,000', senior: '€80,000–€115,000', currency: 'EUR' },
        'UAE': { entry: 'AED 10,000–18,000/mo (tax free)', mid: 'AED 18,000–28,000/mo', senior: 'AED 28,000–45,000/mo', currency: 'AED' },
      },
    };

    const careerSalary = salaryMap[topCareer] ?? salaryMap['Health Data Analytics'];
    const countrySalary = careerSalary?.[topCountry] ?? {
      entry: '£26,000–£38,000', mid: '£38,000–£58,000',
      senior: '£58,000–£90,000', currency: 'GBP',
    };

    const salary: SalaryData = {
      career: topCareer,
      country: topCountry,
      entrySalary: countrySalary.entry,
      midSalary: countrySalary.mid,
      seniorSalary: countrySalary.senior,
      currency: countrySalary.currency,
      nairComparison: 'Entry level abroad is typically 10–30x Nigerian salary',
      roiNote: 'MSc investment typically recovered within 12–18 months',
    };

    // 6. SKILLS GAP
    const skillsMap: Record<string, {
      essential: string[];
      important: string[];
      certifications: string[];
      freeResources: string[];
    }> = {
      'Health Data Analytics': {
        essential: ['SQL', 'Python or R', 'Excel (advanced)',
          'Power BI or Tableau', 'Statistics'],
        important: ['Machine learning basics', 'Healthcare data standards',
          'Data cleaning', 'Research methodology'],
        certifications: ['Google Data Analytics Certificate',
          'Microsoft Power BI (PL-300)', 'IBM Data Science Professional'],
        freeResources: ['Khan Academy Statistics',
          'W3Schools SQL Tutorial', 'Python.org official tutorial'],
      },
      'Pharmaceutical Industry': {
        essential: ['GCP certification', 'Clinical trial methodology',
          'Regulatory guidelines', 'Scientific writing'],
        important: ['Pharmacovigilance basics', 'Data management',
          'Protocol writing', 'Adverse event reporting'],
        certifications: ['ACRP CRC Certification',
          'Transcelerate GCP Course (free)', 'RAPS RAC Certification'],
        freeResources: ['Transcelerate GCP training (free)',
          'FDA guidance documents', 'EMA guidelines website'],
      },
      'Public Health & Epidemiology': {
        essential: ['Epidemiology fundamentals', 'Biostatistics',
          'Research methods', 'Health data analysis', 'Report writing'],
        important: ['GIS mapping', 'Survey design',
          'Project management', 'Health economics'],
        certifications: ['Johns Hopkins PH Certificate',
          'Epidemiology in Public Health (edX)', 'PMP Certification'],
        freeResources: ['CDC PHIL resources', 'WHO Open Learning',
          'Coursera Public Health (audit free)'],
      },
    };

    const careerSkills = skillsMap[topCareer] ?? skillsMap['Health Data Analytics'];
    const essentialMissing = careerSkills.essential.filter(skill =>
      !userSkills.some(s => skill.toLowerCase().includes(s) || s.includes(skill.toLowerCase()))
    );
    const essentialHave = careerSkills.essential.filter(skill =>
      userSkills.some(s => skill.toLowerCase().includes(s) || s.includes(skill.toLowerCase()))
    );
    const readinessScore = Math.round(
      (essentialHave.length / careerSkills.essential.length) * 100
    );

    const skillsGap: SkillsGap = {
      career: topCareer,
      readinessScore,
      essentialHave,
      essentialMissing,
      importantHave: [],
      importantMissing: careerSkills.important,
      recommendedCertifications: careerSkills.certifications,
      freeResources: careerSkills.freeResources,
      prioritySkills: essentialMissing.slice(0, 3),
    };

    // 7. OPPORTUNITIES
    const opportunities: Opportunity[] = [
      {
        name: 'Chevening Scholarship',
        type: 'Scholarship',
        country: 'United Kingdom',
        value: 'Full funding (tuition + living + flights)',
        deadline: 'November each year',
        link: 'chevening.org',
        score: 90,
        tags: ['funded', 'uk', 'prestigious'],
      },
      {
        name: 'DAAD Scholarship',
        type: 'Scholarship',
        country: 'Germany',
        value: '€934/month + tuition + travel',
        deadline: 'October–November each year',
        link: 'daad.de/en',
        score: 85,
        tags: ['funded', 'germany', 'research'],
      },
      {
        name: 'Australia Awards',
        type: 'Scholarship',
        country: 'Australia',
        value: 'Full funding (tuition + living + flights)',
        deadline: 'April–June each year',
        link: 'australiaawardsnigeria.org',
        score: 88,
        tags: ['funded', 'australia', 'nigerian'],
      },
      {
        name: 'Orange Knowledge Programme',
        type: 'Scholarship',
        country: 'Netherlands',
        value: 'Full funding — specifically targets Nigeria',
        deadline: 'February each year',
        link: 'nuffic.nl',
        score: 92,
        tags: ['funded', 'netherlands', 'nigerian'],
      },
      {
        name: 'Fulbright Foreign Student Program',
        type: 'Scholarship',
        country: 'United States',
        value: 'Full funding (tuition + living + flights)',
        deadline: 'February–May each year',
        link: 'fulbright.org.ng',
        score: 87,
        tags: ['funded', 'usa', 'prestigious'],
      },
      {
        name: 'NHS Graduate Management Training Scheme',
        type: 'Graduate Scheme',
        country: 'United Kingdom',
        value: '£32,000/year salary',
        deadline: 'October–November each year',
        link: 'nhsgraduates.nhs.uk',
        score: 80,
        tags: ['graduate scheme', 'nhs', 'uk'],
      },
    ].filter(opp =>
      opp.country === topCountry ||
      opp.country === 'Global' ||
      countryResults.slice(0, 3).some(c => c.country === opp.country)
    ).slice(0, 4);

    return {
      profile,
      careers: careerResults,
      countries: countryResults,
      examRequirements,
      salary,
      skillsGap,
      opportunities,
    };
  });

// --- AI ROADMAP (Azure OpenAI) ---

export const generateRoadmap = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    profile: ProfileSchema,
    career: z.string(),
    country: z.string(),
    skillsGap: z.array(z.string()),
  }))
  .handler(async ({ data }) => {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_API_KEY;
    const deployment = process.env.AZURE_MODEL_DEPLOYMENT ?? 'gpt-4o';

    if (!endpoint || !apiKey) {
      throw new Error('Azure credentials not configured');
    }

    const prompt = `You are PathwayIQ, an expert career advisor for African life sciences graduates.

Generate a detailed 12-month career roadmap for:
- Degree: ${data.profile.degree} (${data.profile.degreeClass})
- Experience: ${data.profile.experienceYears} years in ${data.profile.experienceField}
- Target Career: ${data.career}
- Target Country: ${data.country}
- Budget: $${data.profile.budgetUsd} USD
- Missing Skills: ${data.skillsGap.join(', ')}

Format EXACTLY like this:

MONTH 1-2: [Phase Name]
[Specific actions]

MONTH 3-4: [Phase Name]
[Specific actions]

MONTH 5-6: [Phase Name]
[Specific actions]

MONTH 7-8: [Phase Name]
[Specific actions]

MONTH 9-10: [Phase Name]
[Specific actions]

MONTH 11-12: [Phase Name]
[Specific actions]

FIRST STEP:
[Single most important thing to do TODAY]

BUDGET BREAKDOWN:
[How to spend the budget]`;

    const response = await fetch(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-05-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are PathwayIQ, expert career advisor for African life sciences graduates.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status}`);
    }

    const result = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    return { roadmap: result.choices[0]?.message?.content ?? '' };
  });

// --- EMAIL WAITLIST ---

export const joinWaitlist = createServerFn({ method: 'POST' })
  .inputValidator(z.object({
    email: z.string().email(),
    degree: z.string().optional(),
    country: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    // Log for now — connect to database later
    console.log('Waitlist signup:', data);
    return { success: true, message: 'Welcome to PathwayIQ!' };
  });