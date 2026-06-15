import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ChevronRight, Globe2, LockKeyhole, Menu, MoveRight, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from '@tanstack/react-router'

import pathwayPortrait from "../assets/pathway-portrait.jpg";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PathwayIQ — Career Intelligence Without Borders" },
      { name: "description", content: "Discover career, salary, licensing and migration pathways built for healthcare and life sciences graduates." },
      { property: "og:title", content: "PathwayIQ — Career Intelligence Without Borders" },
      { property: "og:description", content: "Turn your healthcare degree into a clear global career roadmap." },
    ],
  }),
  component: Index,
});

const pathways = [
  { name: "Nursing", roles: "42 global roles", match: "96%" },
  { name: "Medicine", roles: "31 global roles", match: "91%" },
  { name: "Physiology", roles: "33 global roles", match: "95%" },
  { name: "Public Health", roles: "27 global roles", match: "94%" },
  { name: "Physiotherapy", roles: "19 global roles", match: "89%" },
  { name: "Pharmacy", roles: "34 global roles", match: "93%" },
  { name: "Biomedical Science", roles: "28 global roles", match: "88%" },
  { name: "Health Informatics", roles: "36 global roles", match: "97%" },
  { name: "Clinical Research", roles: "23 global roles", match: "92%" },
  { name: "Data Science", roles: "45 global roles", match: "95%" },
];

const countries = [
  { name: "United Kingdom", code: "GBR", salary: "$54K", entry: "8–14 mo", difficulty: 72 },
  { name: "Canada", code: "CAN", salary: "$68K", entry: "12–18 mo", difficulty: 64 },
  { name: "Australia", code: "AUS", salary: "$71K", entry: "9–16 mo", difficulty: 58 },
  { name: "Germany", code: "DEU", salary: "$57K", entry: "10–18 mo", difficulty: 51 },
  { name: "Netherlands", code: "NLD", salary: "$62K", entry: "8–12 mo", difficulty: 67 },
  { name: "United States", code: "USA", salary: "$84K", entry: "18–30 mo", difficulty: 82 },
  { name: "UAE", code: "ARE", salary: "$76K", entry: "6–10 mo", difficulty: 45 },
];

function Index() {
  const [activePath, setActivePath] = useState(0);
  const [activeCountry, setActiveCountry] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [degree, setDegree] = useState("Nursing");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()
  return (
    <div className="bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto grid h-16 max-w-[1920px] grid-cols-[1fr_auto] items-center px-5 sm:h-20 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-12" aria-label="Main navigation">
          <a href="#top" className="font-display text-xl font-extrabold tracking-[-0.05em] sm:text-2xl">PATHWAY<span className="text-primary">IQ</span></a>
          <div className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.16em] lg:flex">
            <a href="#possibilities" className="transition-colors hover:text-primary">Pathways</a>
            <a href="#countries" className="transition-colors hover:text-primary">Countries</a>
            <a href="#roadmap" className="transition-colors hover:text-primary">Roadmap</a>
          </div>
          <div className="hidden justify-end lg:flex"><Button size="default">Find my path <ArrowRight className="size-4" /></Button></div>
          <button className="grid size-11 place-items-center lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
        <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-foreground/10 bg-background px-5 py-6 lg:hidden"><div className="flex flex-col gap-5 text-lg"><a href="#possibilities" onClick={() => setMenuOpen(false)}>Pathways</a><a href="#countries" onClick={() => setMenuOpen(false)}>Countries</a><a href="#roadmap" onClick={() => setMenuOpen(false)}>Roadmap</a></div></motion.div>}</AnimatePresence>
      </header>

      <main id="top">
        <section className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pb-14 lg:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-45" aria-hidden="true"><svg className="size-full" viewBox="0 0 1600 900" preserveAspectRatio="none"><path d="M-50 730 C 220 730, 240 260, 520 260 S 860 690, 1120 470 S 1400 220, 1670 230" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1"/><path d="M-50 755 C 250 755, 260 310, 530 310 S 870 730, 1140 510 S 1400 280, 1670 280" fill="none" stroke="var(--color-primary)" strokeWidth="2"/><circle cx="530" cy="310" r="7" fill="var(--color-primary)" className="animate-path-pulse"/><circle cx="1140" cy="510" r="7" fill="var(--color-secondary)" className="animate-path-pulse"/></svg></div>
          <div className="relative mx-auto w-full max-w-[1920px]">
            <div className="mb-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"><span className="h-px w-10 bg-primary" /> Career intelligence without borders</div>
            <motion.h1 animate={{ opacity: [0.45, 1], y: [20, 0] }} transition={{ duration: .8 }} className="max-w-[1500px] font-display text-[clamp(3.5rem,10.2vw,12rem)] font-extrabold uppercase leading-[0.83] tracking-[-0.055em]">Find the career path <span className="text-primary">nobody</span> showed you.</motion.h1>
            <div className="mt-10 grid gap-8 border-t border-foreground/20 pt-6 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-xl">Your degree is a starting point. See the roles, countries, salaries, and steps that can turn it into a global career.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
  <Button
    size="large"
    onClick={() => navigate({ to: "/src/routes/assessment.tsx" })}
  >
    Explore my future
    <ArrowRight className="size-4" />
  </Button>

  <Button
    variant="outline"
    size="large"
    onClick={() => document.querySelector("#roadmap")?.scrollIntoView()}
  >
    See sample roadmap
  </Button>
</div>
            </div>
          </div>
          <ArrowDown className="absolute bottom-6 right-6 hidden size-5 animate-bounce text-muted-foreground lg:block" aria-hidden="true" />
        </section>

        <section id="possibilities" className="bg-foreground py-24 text-background sm:py-32 lg:py-40">
          <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">01 / Career possibilities</p><h2 className="mt-6 max-w-lg font-display text-5xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl lg:text-8xl">One degree. More futures than you think.</h2></div><div className="lg:pt-12"><p className="max-w-xl text-lg leading-relaxed text-background/60">Explore adjacent roles, emerging fields, and international opportunities your university never mapped out.</p></div></div>
            <div className="mt-16 border-t border-background/20 sm:mt-24">
              {pathways.map((pathway, index) => <button key={pathway.name} onClick={() => setActivePath(index)} className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-background/20 py-5 text-left transition-all hover:px-2 sm:py-7" aria-expanded={activePath === index}><span className="text-xs text-background/40">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl">{pathway.name}</span><ChevronRight className={`size-5 transition-transform ${activePath === index ? "rotate-90 text-primary" : "text-background/30"}`} />{activePath === index && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="col-start-2 col-span-2 flex flex-wrap gap-6 pb-3 text-sm text-background/60"><span>{pathway.roles}</span><span className="text-primary">{pathway.match} top match potential</span><span>View intelligence report →</span></motion.div>}</button>)}
            </div>
          </div>
        </section>

        <section id="countries" className="py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">02 / Country intelligence</p><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end"><h2 className="font-display text-5xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl lg:text-9xl">See beyond borders.</h2><p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Compare the complete picture—not just salary. Licensing, migration friction, and time-to-entry change everything.</p></div>
            <div className="mt-16 grid gap-px overflow-hidden border border-foreground/15 bg-foreground/15 lg:grid-cols-[.7fr_1.3fr]">
              <div className="bg-background">{countries.map((country, index) => <button key={country.code} onClick={() => setActiveCountry(index)} className={`grid w-full grid-cols-[3rem_1fr_auto] items-center border-b border-foreground/10 px-4 py-5 text-left transition-colors last:border-0 sm:px-6 ${activeCountry === index ? "bg-foreground text-background" : "hover:bg-muted"}`}><span className="text-[10px] font-bold tracking-widest opacity-50">{country.code}</span><span className="font-semibold">{country.name}</span>{activeCountry === index && <MoveRight className="size-4 text-primary" />}</button>)}</div>
              <div className="relative min-h-[500px] bg-card p-6 sm:p-10 lg:p-14"><div className="flex items-start justify-between"><div><span className="text-xs uppercase tracking-[.2em] text-muted-foreground">Selected pathway</span><h3 className="mt-2 font-display text-4xl font-bold uppercase sm:text-6xl">{countries[activeCountry].name}</h3></div><Globe2 className="size-8 text-primary" /></div><div className="mt-16 grid grid-cols-2 gap-px bg-foreground/10"><Metric label="Median salary" value={countries[activeCountry].salary} /><Metric label="Time to entry" value={countries[activeCountry].entry} /><Metric label="Migration fit" value={`${100 - countries[activeCountry].difficulty}%`} /><Metric label="Licensing" value={activeCountry === 6 ? "DHA / DOH" : "Registration"} /></div><div className="mt-10"><div className="mb-3 flex justify-between text-xs uppercase tracking-widest text-muted-foreground"><span>Entry complexity</span><span>{countries[activeCountry].difficulty}/100</span></div><div className="h-1 bg-foreground/10"><motion.div animate={{ width: `${countries[activeCountry].difficulty}%` }} className="h-full bg-primary" /></div></div><Button className="mt-10">Compare this country <ArrowRight className="size-4" /></Button></div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[760px] overflow-hidden" aria-labelledby="story-title"><img src={pathwayPortrait} alt="Healthcare graduate moving confidently toward her next career chapter" width={1600} height={1067} loading="lazy" className="absolute inset-0 size-full object-cover object-[58%_center]"/><div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"/><div className="relative mx-auto flex min-h-[760px] max-w-[1920px] items-end px-5 py-16 sm:px-8 lg:px-12 lg:py-24"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">A transformation, not a testimonial</p><h2 id="story-title" className="mt-6 font-display text-5xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl">From uncertain graduate to clinical research lead.</h2><p className="mt-8 max-w-lg text-lg leading-relaxed text-foreground/70">Amara turned a biomedical science degree into a sponsored role in London—with a pathway that made every requirement visible before she took the first step.</p><div className="mt-10 flex gap-10"><div><strong className="font-display text-3xl">11 mo</strong><p className="text-sm text-muted-foreground">to employment</p></div><div><strong className="font-display text-3xl">2.4×</strong><p className="text-sm text-muted-foreground">salary growth</p></div></div></div></div></section>

        <section id="roadmap" className="bg-secondary py-24 text-secondary-foreground sm:py-32 lg:py-40"><div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12"><p className="text-xs font-bold uppercase tracking-[.2em]">03 / Living roadmap</p><div className="mt-6 grid gap-8 lg:grid-cols-2"><h2 className="font-display text-5xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl lg:text-9xl">Turn ambition into a roadmap.</h2><p className="max-w-lg self-end text-lg leading-relaxed opacity-65">Not another checklist. A pathway that adapts as your goals, readiness, and opportunities evolve.</p></div><div className="mt-20 overflow-x-auto pb-4"><div className="relative flex min-w-[900px] items-start justify-between before:absolute before:left-4 before:right-4 before:top-4 before:h-px before:bg-secondary-foreground/30">{["Today", "Next month", "6 months", "12 months", "Migration", "Employment"].map((step, i) => <div key={step} className="relative w-32"><div className={`size-8 rounded-full border-4 border-secondary ${i < 2 ? "bg-primary" : "bg-secondary-foreground"}`} /><p className="mt-5 font-display text-xl font-bold uppercase">{step}</p><p className="mt-2 text-xs leading-relaxed opacity-60">{["Profile mapped", "Credentials begin", "Language ready", "License approved", "Visa secured", "Career launched"][i]}</p></div>)}</div></div></div></section>

        <section id="demo" className="py-24 sm:py-32 lg:py-40"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">04 / Your intelligence preview</p><h2 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl">What could your future look like?</h2></div><div className="mt-16 border border-foreground/15 bg-card p-5 sm:p-10 lg:p-14">
          {demoStep === 0 ? (
  <div>
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">Step 1 of 4</p>
      <span className="text-xs uppercase tracking-widest text-primary">Degree</span>
    </div>
    <h3 className="mt-8 font-display text-3xl font-bold uppercase sm:text-5xl">
      What did you study?
    </h3>
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {[
        "Nursing", "Medicine", "Physiology", "Public Health",
        "Biomedical Science", "Pharmacology", "Biochemistry",
        "Anatomy", "Medical Laboratory Science",
        "Nutrition & Dietetics", "Health Information Management",
        "Clinical Research",
      ].map(item => (
        <button
          key={item}
          onClick={() => setDegree(item)}
          className={`min-h-16 border px-5 text-left font-semibold transition-colors ${
            degree === item
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/15 hover:border-foreground/50"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
    <Button
      size="large"
      className="mt-8 w-full sm:w-auto"
      onClick={() => setDemoStep(1)}
    >
      Generate my preview <Sparkles className="size-4" />
    </Button>
  </div>
) : demoStep === 1 ? (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center gap-2 text-secondary">
      <Check className="size-5" />
      <span className="text-sm font-semibold uppercase tracking-widest">
        Preview ready
      </span>
    </div>
    <h3 className="mt-6 font-display text-4xl font-bold uppercase sm:text-6xl">
      Your strongest route: {degree} → Health Informatics
    </h3>
    <div className="mt-10 grid gap-px bg-foreground/10 sm:grid-cols-3">
      <Metric label="Career match" value="94%" />
      <Metric label="Best-fit country" value="Canada" />
      <Metric label="Readiness" value="68%" />
    </div>
    <div className="relative mt-8 overflow-hidden border border-foreground/10 p-6">
      <p className="text-sm leading-7 text-muted-foreground">
        Your degree creates a strong foundation for digital health roles.
        With focused analytics training and one industry credential,
        your fastest path could unlock roles in clinical data operations...
      </p>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
        <LockKeyhole className="size-3" /> Unlock full report
      </div>
    </div>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button size="large" onClick={() => setDemoStep(2)}>
        Build my full roadmap <ArrowRight className="size-4" />
      </Button>
      <Button variant="outline" size="large" onClick={() => setDemoStep(0)}>
        Try another degree
      </Button>
    </div>
  </motion.div>
) : (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center gap-2">
      <LockKeyhole className="size-5 text-primary" />
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">
        Full Intelligence Report
      </span>
    </div>
    <h3 className="mt-6 font-display text-3xl font-bold uppercase sm:text-5xl">
      Unlock your complete pathway
    </h3>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {[
        { name: "Starter Report", price: "₦3,500", features: ["Career recommendations", "Country match", "Exam requirements", "PDF export"] },
        { name: "Premium Report", price: "₦10,000", features: ["Everything in Starter", "Skills gap analysis", "Scholarships matched", "AI roadmap generated"] },
      ].map(tier => (
        <div key={tier.name} className="border border-foreground/15 p-6">
          <p className="font-display text-2xl font-bold">{tier.name}</p>
          <p className="mt-1 text-3xl font-bold text-primary">{tier.price}</p>
          <ul className="mt-4 space-y-2">
            {tier.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full">Get this report</Button>
        </div>
      ))}
    </div>
    <Button variant="outline" className="mt-4 w-full" onClick={() => setDemoStep(0)}>
      Start over
    </Button>
  </motion.div>
)}
        </div></div></section>

        <section className="border-t border-foreground/15 py-24 sm:py-32"><div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12"><div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">The complete intelligence layer</p><h2 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[.9] tracking-[-.05em] sm:text-7xl">Everything between where you are and where you want to be.</h2></div><div className="border-t border-foreground/20">{["Career Intelligence Reports", "Country Comparison Engine", "Salary Intelligence", "Opportunity Matching", "Migration Roadmaps", "Progress Tracking", "Application Planner"].map((feature, i) => <div key={feature} className="grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-foreground/20 py-6"><span className="text-xs text-muted-foreground">0{i + 1}</span><span className="font-display text-xl font-bold uppercase sm:text-2xl">{feature}</span><ArrowRight className="size-4 text-primary" /></div>)}</div></div></div></section>

        <section className="bg-primary py-24 text-primary-foreground sm:py-32"><div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12"><h2 className="max-w-6xl font-display text-6xl font-extrabold uppercase leading-[.85] tracking-[-.06em] sm:text-8xl lg:text-[9rem]">Your degree is not your destination.</h2><div className="mt-12 flex flex-col gap-6 border-t border-primary-foreground/30 pt-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-lg">Get early access to PathwayIQ and start building a future you can see clearly.</p><form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}><label htmlFor="email" className="sr-only">Email address</label><input id="email" type="email" required placeholder="Your email address" className="min-h-14 flex-1 rounded-full border border-primary-foreground/40 bg-transparent px-6 placeholder:text-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary-foreground"/><Button type="submit" variant="inverse" size="large">Join the movement</Button></form></div></div></section>
      </main>

      <footer className="px-5 py-10 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1920px] gap-8 border-b border-foreground/15 pb-10 sm:grid-cols-[1fr_auto] sm:items-end"><p className="font-display text-3xl font-extrabold tracking-[-.05em]">PATHWAY<span className="text-primary">IQ</span></p><div className="flex flex-wrap gap-6 text-sm text-muted-foreground"><a href="#possibilities">Pathways</a><a href="#countries">Countries</a><a href="#demo">Intelligence preview</a></div></div><div className="mx-auto mt-6 flex max-w-[1920px] flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between"><span>© 2026 PathwayIQ. Your future, made visible.</span><span>Built for healthcare & life sciences graduates.</span></div></footer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-card p-5 sm:p-7"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">{label}</p><p className="mt-3 font-display text-2xl font-bold uppercase sm:text-3xl">{value}</p></div>;
}
