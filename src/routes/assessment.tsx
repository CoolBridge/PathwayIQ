import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Check, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { runAssessment } from "../lib/api/pathwayiq";
import type { AssessmentResult, UserProfile } from "../lib/api/types";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "PathwayIQ — Build Your Career Profile" },
      { name: "description", content: "Tell us about yourself and get your personalised career intelligence report." },
    ],
  }),
  component: Assessment,
});

const DEGREES = [
  "Physiology",
  "Biomedical Science",
  "Medical Laboratory Science",
  "Anatomy",
  "Biochemistry",
  "Pharmacology",
  "Public Health",
  "Nutrition & Dietetics",
  "Health Information Management",
  "Nursing",
  "Medicine",
  "Physiotherapy",
  "Clinical Research",
  "Data Science",
];

const DEGREE_CLASSES = [
  "First Class",
  "Second Class Upper (2:1)",
  "Second Class Lower (2:2)",
  "Third Class",
  "Pass",
];

const ENGLISH_LEVELS = [
  "Native/Fluent",
  "High",
  "Medium",
  "Low",
];

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "UAE",
  "Nigeria",
  "South Africa",
  "No Preference",
];

const INTERESTS = [
  "Data & Analytics",
  "Clinical Practice",
  "Research & Science",
  "Pharmaceutical Industry",
  "Public Health & Policy",
  "Technology & Digital Health",
  "Global Health & NGOs",
  "Academia & Teaching",
  "Business & Management",
  "Community Health",
];

const SKILLS = [
  "Python",
  "SQL",
  "R",
  "Excel",
  "Power BI",
  "SPSS/STATA",
  "Laboratory techniques",
  "Clinical skills",
  "GCP certification",
  "Project management",
  "Research methodology",
  "Scientific writing",
  "Grant writing",
  "Epidemiology",
  "Patient care",
];

function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    degree: "",
    degreeClass: "",
    graduationYear: new Date().getFullYear(),
    university: "",
    experienceYears: 0,
    experienceField: "",
    skills: [] as string[],
    interests: [] as string[],
    englishLevel: "",
    budgetUsd: 5000,
    timelineMonths: 12,
    preferredCountries: [] as string[],
    careerGoal: "",
  });

  const steps = [
    "About You",
    "Your Degree",
    "Experience",
    "Skills & Interests",
    "Goals & Budget",
  ];

  function toggleArrayItem<T>(arr: T[], item: T): T[] {
    return arr.includes(item)
      ? arr.filter(i => i !== item)
      : [...arr, item];
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const result = await runAssessment({
        data: {
          ...form,
          preferredCountries: form.preferredCountries.filter(
            c => c !== "No Preference"
          ),
        },
      });

      // Store result in sessionStorage to pass to results page
      sessionStorage.setItem(
        "pathwayiq_result",
        JSON.stringify(result)
      );
      sessionStorage.setItem(
        "pathwayiq_profile",
        JSON.stringify(form)
      );

      navigate({ to: "/results" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b border-foreground/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <a href="/" className="font-display text-xl font-extrabold tracking-[-0.05em]">
            PATHWAY<span className="text-primary">IQ</span>
          </a>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-foreground/10">
        <motion.div
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          className="h-full bg-primary transition-all"
        />
      </div>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <AnimatePresence mode="wait">
          {/* STEP 0 — About You */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                01 / About You
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                Let's start with you.
              </h1>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Amara Okonkwo"
                    className="w-full border border-foreground/20 bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Your University
                  </label>
                  <input
                    type="text"
                    value={form.university}
                    onChange={e => setForm({ ...form, university: e.target.value })}
                    placeholder="e.g. University of Lagos"
                    className="w-full border border-foreground/20 bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    English Proficiency
                  </label>
                  <div className="grid gap-2">
                    {ENGLISH_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => setForm({ ...form, englishLevel: level })}
                        className={`border px-4 py-3 text-left font-semibold transition-colors ${
                          form.englishLevel === level
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-foreground/20 hover:border-foreground/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={form.graduationYear}
                    onChange={e => setForm({
                      ...form,
                      graduationYear: parseInt(e.target.value)
                    })}
                    min={1990}
                    max={2030}
                    className="w-full border border-foreground/20 bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <Button
                size="large"
                className="mt-10"
                disabled={!form.name || !form.englishLevel}
                onClick={() => setStep(1)}
              >
                Next <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          )}

          {/* STEP 1 — Degree */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                02 / Your Degree
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                What did you study?
              </h1>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DEGREES.map(d => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, degree: d })}
                    className={`border px-5 py-4 text-left font-semibold transition-colors ${
                      form.degree === d
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-foreground/15 hover:border-foreground/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Degree Classification
                </label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {DEGREE_CLASSES.map(dc => (
                    <button
                      key={dc}
                      onClick={() => setForm({ ...form, degreeClass: dc })}
                      className={`border px-4 py-3 text-left font-semibold transition-colors ${
                        form.degreeClass === dc
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-foreground/15 hover:border-foreground/50"
                      }`}
                    >
                      {dc}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="large" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button
                  size="large"
                  disabled={!form.degree || !form.degreeClass}
                  onClick={() => setStep(2)}
                >
                  Next <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Experience */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                03 / Experience
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                Your experience.
              </h1>
              <div className="mt-10 grid gap-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Years of Work Experience
                  </label>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {[0, 1, 2, 3, 4, 5, 7, 10].map(yr => (
                      <button
                        key={yr}
                        onClick={() => setForm({ ...form, experienceYears: yr })}
                        className={`border py-3 text-center font-bold transition-colors ${
                          form.experienceYears === yr
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-foreground/20 hover:border-foreground/50"
                        }`}
                      >
                        {yr === 10 ? "10+" : yr}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Field of Experience
                  </label>
                  <input
                    type="text"
                    value={form.experienceField}
                    onChange={e => setForm({ ...form, experienceField: e.target.value })}
                    placeholder="e.g. Hospital, Research, Pharmaceutical, NGO"
                    className="w-full border border-foreground/20 bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Career Goal (in your own words)
                  </label>
                  <textarea
                    value={form.careerGoal}
                    onChange={e => setForm({ ...form, careerGoal: e.target.value })}
                    placeholder="e.g. I want to work in health data analytics in the UK within 18 months"
                    rows={3}
                    className="w-full border border-foreground/20 bg-transparent px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="large" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  size="large"
                  disabled={!form.experienceField || !form.careerGoal}
                  onClick={() => setStep(3)}
                >
                  Next <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Skills & Interests */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                04 / Skills & Interests
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                What do you bring?
              </h1>
              <div className="mt-10 grid gap-8">
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Your Current Skills (select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map(skill => (
                      <button
                        key={skill}
                        onClick={() => setForm({
                          ...form,
                          skills: toggleArrayItem(form.skills, skill),
                        })}
                        className={`border px-3 py-2 text-sm font-semibold transition-colors ${
                          form.skills.includes(skill)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-foreground/20 hover:border-foreground/50"
                        }`}
                      >
                        {form.skills.includes(skill) && (
                          <Check className="mr-1 inline size-3" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Your Interests (select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map(interest => (
                      <button
                        key={interest}
                        onClick={() => setForm({
                          ...form,
                          interests: toggleArrayItem(form.interests, interest),
                        })}
                        className={`border px-3 py-2 text-sm font-semibold transition-colors ${
                          form.interests.includes(interest)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-foreground/20 hover:border-foreground/50"
                        }`}
                      >
                        {form.interests.includes(interest) && (
                          <Check className="mr-1 inline size-3" />
                        )}
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="large" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  size="large"
                  disabled={form.interests.length === 0}
                  onClick={() => setStep(4)}
                >
                  Next <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Goals & Budget */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                05 / Goals & Budget
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase sm:text-6xl">
                Your plan.
              </h1>
              <div className="mt-10 grid gap-8">
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Preferred Destinations (select all that interest you)
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {COUNTRIES.map(country => (
                      <button
                        key={country}
                        onClick={() => setForm({
                          ...form,
                          preferredCountries: toggleArrayItem(
                            form.preferredCountries, country
                          ),
                        })}
                        className={`border px-4 py-3 text-left font-semibold transition-colors ${
                          form.preferredCountries.includes(country)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-foreground/15 hover:border-foreground/50"
                        }`}
                      >
                        {form.preferredCountries.includes(country) && (
                          <Check className="mr-2 inline size-4" />
                        )}
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Available Budget (USD): ${form.budgetUsd.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={500}
                    value={form.budgetUsd}
                    onChange={e => setForm({
                      ...form,
                      budgetUsd: parseInt(e.target.value)
                    })}
                    className="w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>$30,000+</span>
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Timeline: {form.timelineMonths} months
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={36}
                    step={3}
                    value={form.timelineMonths}
                    onChange={e => setForm({
                      ...form,
                      timelineMonths: parseInt(e.target.value)
                    })}
                    className="w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>3 months</span>
                    <span>36 months</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="large" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  size="large"
                  disabled={loading || form.preferredCountries.length === 0}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Analysing your profile...
                    </>
                  ) : (
                    <>
                      Generate my intelligence report
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}