import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Globe2,
  Loader2,
  LockKeyhole,
  Map,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { generateRoadmap } from "../lib/api/pathwayiq";
import type { AssessmentResult, UserProfile } from "../lib/api/types";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [{ title: "PathwayIQ — Your Career Intelligence Report" }],
  }),
  component: Results,
});

type TabId = "careers" | "countries" | "exams" | "salary" | "skills" | "opportunities";

function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("careers");
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("pathwayiq_result");
    const storedProfile = sessionStorage.getItem("pathwayiq_profile");
    if (!stored) {
      void navigate({ to: "/assessment" });
      return;
    }
    setResult(JSON.parse(stored) as AssessmentResult);
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile) as UserProfile);
    }
  }, [navigate]);

  async function handleGenerateRoadmap() {
    if (!result || !profile) return;
    setRoadmapLoading(true);
    try {
      const res = await generateRoadmap({
        data: {
          profile: {
            name: profile.name,
            degree: profile.degree,
            degreeClass: profile.degreeClass,
            graduationYear: profile.graduationYear,
            university: profile.university,
            experienceYears: profile.experienceYears,
            experienceField: profile.experienceField,
            skills: profile.skills,
            interests: profile.interests,
            englishLevel: profile.englishLevel,
            budgetUsd: profile.budgetUsd,
            timelineMonths: profile.timelineMonths,
            preferredCountries: profile.preferredCountries,
            careerGoal: profile.careerGoal,
          },
          career: result.careers[0]?.career ?? "",
          country: result.countries[0]?.country ?? "",
          skillsGap: result.skillsGap.essentialMissing,
        },
      });
      setRoadmap(res.roadmap);
    } catch {
      setRoadmap("Error generating roadmap. Please try again.");
    } finally {
      setRoadmapLoading(false);
    }
  }

  if (!result) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const topCareer = result.careers[0];
  const topCountry = result.countries[0];

  const readinessLabel =
    result.profile.overallReadiness >= 85 ? "Highly Ready"
    : result.profile.overallReadiness >= 70 ? "Ready"
    : result.profile.overallReadiness >= 55 ? "Developing"
    : "Early Stage";

  const tabs: { id: TabId; label: string; icon: React.ElementType; locked?: boolean }[] = [
    { id: "careers", label: "Careers", icon: TrendingUp },
    { id: "countries", label: "Countries", icon: Globe2 },
    { id: "exams", label: "Exams", icon: BookOpen },
    { id: "salary", label: "Salary", icon: Award },
    { id: "skills", label: "Skills Gap", icon: Sparkles, locked: true },
    { id: "opportunities", label: "Opportunities", icon: Map },
  ];

  return (
    <div className="min-h-dvh bg-background">

      <header className="border-b border-foreground/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="font-display text-xl font-extrabold tracking-[-0.05em]">
            PATHWAY<span className="text-primary">IQ</span>
          </a>
          <Button size="default" onClick={() => void navigate({ to: "/assessment" })}>
            New report <ArrowRight className="size-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
            Intelligence Report — {result.profile.name}
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl">
            {result.profile.degree} → {topCareer?.career}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Best destination: {topCountry?.flag} {topCountry?.country}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-px bg-foreground/10 sm:grid-cols-4">
            <div className="bg-card p-5 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Career Match</p>
              <p className="mt-3 font-display text-3xl font-bold text-primary">{topCareer?.score}%</p>
            </div>
            <div className="bg-card p-5 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Overall Readiness</p>
              <p className="mt-3 font-display text-3xl font-bold">{result.profile.overallReadiness}%</p>
              <p className="text-xs text-muted-foreground">{readinessLabel}</p>
            </div>
            <div className="bg-card p-5 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Entry Salary</p>
              <p className="mt-3 font-display text-2xl font-bold">{result.salary.entrySalary}</p>
            </div>
            <div className="bg-card p-5 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Country Score</p>
              <p className="mt-3 font-display text-3xl font-bold">{topCountry?.score}%</p>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 flex overflow-x-auto border-b border-foreground/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
              {tab.locked && <LockKeyhole className="size-3 text-muted-foreground" />}
            </button>
          ))}
        </div>

        {activeTab === "careers" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold uppercase">Your Top Career Matches</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on your {result.profile.degree} degree and experience
            </p>
            <div className="mt-6 space-y-3">
              {result.careers.map((career, i) => (
                <div
                  key={career.career}
                  className={`border p-5 ${i === 0 ? "border-primary" : "border-foreground/15"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                        <h3 className="font-display text-xl font-bold uppercase">{career.career}</h3>
                        {i === 0 && (
                          <span className="bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                            Best Match
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>💰 {career.salaryRange}</span>
                        <span>📈 Growth: {career.growth}</span>
                        <span>⏱ {career.timeline}</span>
                      </div>
                      {!career.eligible && (
                        <p className="mt-2 text-xs text-amber-500">
                          ⚠️ Requires {career.minDegreeClass} minimum
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold text-primary">{career.score}%</span>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1 bg-foreground/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${career.score}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "countries" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold uppercase">Your Best Country Matches</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Based on your budget of ${profile?.budgetUsd?.toLocaleString() ?? "0"} and {profile?.timelineMonths ?? 12}-month timeline
            </p>
            <div className="mt-6 space-y-4">
              {result.countries.map((country, i) => (
                <div
                  key={country.country}
                  className={`border p-5 sm:p-7 ${i === 0 ? "border-primary" : "border-foreground/15"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <h3 className="font-display text-xl font-bold uppercase">{country.country}</h3>
                        {i === 0 && (
                          <span className="bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                            Top Pick
                          </span>
                        )}
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Strengths</p>
                          <ul className="mt-2 space-y-1">
                            {country.strengths.map((s) => (
                              <li key={s} className="flex items-center gap-2 text-sm">
                                <Check className="size-3 text-primary" /> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Challenges</p>
                          <ul className="mt-2 space-y-1">
                            {country.challenges.map((c) => (
                              <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ChevronRight className="size-3" /> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>🛂 Visa: {country.visaDifficulty}</span>
                        <span>🏠 PR: {country.prPathway}</span>
                        {!country.budgetOk && <span className="text-amber-500">⚠️ Budget may be tight</span>}
                        {!country.timelineOk && <span className="text-amber-500">⚠️ Timeline may be short</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-3xl font-bold text-primary">{country.score}%</span>
                      <p className="text-xs text-muted-foreground">fit score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "exams" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold uppercase">Exams & Requirements</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For {topCareer?.career} in {topCountry?.country}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "English Test", value: result.examRequirements.englishTest, alt: result.examRequirements.englishAlternative },
                { label: "Graduate Exam", value: result.examRequirements.gradExam, alt: null },
                { label: "Credential Evaluation", value: result.examRequirements.credentialEval, alt: null },
                { label: "Professional License", value: result.examRequirements.clinicalLicense, alt: null },
              ].map((item) => (
                <div key={item.label} className="border border-foreground/15 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-semibold">{item.value}</p>
                  {item.alt && <p className="mt-1 text-xs text-muted-foreground">Alternative: {item.alt}</p>}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border border-foreground/15 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Cost Estimate</p>
                <p className="mt-2 font-display text-2xl font-bold text-primary">{result.examRequirements.totalCostEstimate}</p>
              </div>
              <div className="border border-foreground/15 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preparation Time</p>
                <p className="mt-2 font-display text-2xl font-bold">{result.examRequirements.prepTime}</p>
              </div>
            </div>
            <div className="mt-4 border border-foreground/15 p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Expert Tips</p>
              <ul className="space-y-2">
                {result.examRequirements.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === "salary" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold uppercase">Salary Intelligence</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.salary.career} in {result.salary.country}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Entry Level (0–2 years)", value: result.salary.entrySalary },
                { label: "Mid Level (3–5 years)", value: result.salary.midSalary },
                { label: "Senior Level (6+ years)", value: result.salary.seniorSalary },
              ].map((item) => (
                <div key={item.label} className="border border-foreground/15 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                  <p className="mt-3 font-display text-2xl font-bold text-primary">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border border-primary/30 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-primary">💡 {result.salary.nairComparison}</p>
              <p className="mt-1 text-sm text-muted-foreground">{result.salary.roiNote}</p>
            </div>
          </motion.div>
        )}

        {activeTab === "skills" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center">
            <LockKeyhole className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-6 font-display text-3xl font-bold uppercase">Unlock Skills Gap Analysis</h2>
            <p className="mt-3 text-muted-foreground">
              See exactly what skills you are missing and how to get them fast.
            </p>
            <div className="mx-auto mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
              {[
                { name: "Starter Report", price: "₦3,500", note: "One-time • PDF export", highlight: false },
                { name: "Premium Report", price: "₦10,000", note: "Includes skills gap + roadmap", highlight: true },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`border p-5 text-left ${plan.highlight ? "border-primary" : "border-foreground/15"}`}
                >
                  <p className="font-bold">{plan.name}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-primary">{plan.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.note}</p>
                  <Button className="mt-4 w-full" size="default">Get Report</Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "opportunities" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl font-bold uppercase">Matched Opportunities</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Scholarships, fellowships and graduate schemes for your profile
            </p>
            <div className="mt-6 space-y-4">
              {result.opportunities.map((opp, i) => (
                <div
                  key={opp.name}
                  className={`border p-5 sm:p-7 ${i === 0 ? "border-primary" : "border-foreground/15"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-foreground/10 px-2 py-0.5 text-[10px] font-bold uppercase">{opp.type}</span>
                        <span className="text-xs text-muted-foreground">{opp.country}</span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold">{opp.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-primary">{opp.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Deadline: {opp.deadline}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {opp.tags.map((tag) => (
                          <span key={tag} className="bg-foreground/5 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a href={`https://${opp.link}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <Button size="default" variant="outline">
                        Apply <ArrowRight className="size-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-16 border border-foreground/15 p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">AI-Generated</p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">Your 12-Month Roadmap</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Powered by Azure OpenAI — personalised to your exact profile
              </p>
            </div>
            <Sparkles className="size-8 text-primary" />
          </div>

          {!roadmap ? (
            <Button
              size="large"
              className="mt-6"
              disabled={roadmapLoading}
              onClick={() => void handleGenerateRoadmap()}
            >
              {roadmapLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Azure AI is building your roadmap...
                </>
              ) : (
                <>
                  Generate my roadmap <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          ) : (
            <div className="mt-6 space-y-4">
              {roadmap
                .split(/MONTH \d+[-–]\d+:/)
                .filter(Boolean)
                .map((section, i) => (
                  <div key={i} className="border border-foreground/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      MONTH {["1–2", "3–4", "5–6", "7–8", "9–10", "11–12"][i] ?? `${i + 1}`}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{section.trim().split("\n")[0]}</p>
                  </div>
                ))}
              {roadmap.includes("FIRST STEP:") && (
                <div className="border border-primary bg-primary/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Your First Step — Do This Today
                  </p>
                  <p className="mt-2 font-semibold">
                    {roadmap.split("FIRST STEP:")[1]?.split("BUDGET")[0]?.trim()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-10 bg-primary p-8 text-primary-foreground sm:p-12">
          <h2 className="font-display text-3xl font-bold uppercase sm:text-5xl">Ready to go deeper?</h2>
          <p className="mt-3 text-lg opacity-80">
            Get your full intelligence report with skills gap analysis, personal statement, and interview prep.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="inverse" size="large">Get Starter Report — ₦3,500</Button>
            <Button variant="inverse" size="large">Get Premium Report — ₦10,000</Button>
          </div>
        </div>

      </main>
    </div>
  );
}