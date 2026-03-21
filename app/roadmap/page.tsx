"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";

type RoadmapItem = {
  year: string;
  phase: string;
  title: string;
  objective: string;
  milestones: string[];
  outcome: string;
};

export default function RoadmapPage() {
  const [activeYear, setActiveYear] = useState<string>("2026");

  const roadmap = useMemo<RoadmapItem[]>(
    () => [
      {
        year: "2026",
        phase: "Phase 1",
        title: "Foundation and Market Establishment",
        objective:
          "Establish RISEN as a credible digital asset ecosystem with working infrastructure, clear market visibility, and early utility activation.",
        milestones: [
          "Official token launch and liquidity establishment",
          "Premium multi-language website rollout",
          "Live market data integration and analytics visibility",
          "Telegram utility bot deployment and expansion",
          "RISEN Rush launch as an engagement-based earning and ecosystem activity layer",
          "Initial RISEN AI development and ecosystem intelligence framework",
          "Launch of early utility products including Memecoin Bridger and Dust Sweeper",
          "Community growth campaigns and ambassador activation",
          "Brand positioning, ecosystem messaging, and foundational trust layer refinement",
        ],
        outcome:
          "By the end of 2026, RISEN should be recognized not only as a launched token, but as an emerging ecosystem with visible utility, active engagement, and a disciplined long-term direction.",
      },
      {
        year: "2027",
        phase: "Phase 2",
        title: "Utility Expansion and User Infrastructure",
        objective:
          "Expand RISEN from a market-facing asset into a more functional user ecosystem with stronger participation loops and platform utility.",
        milestones: [
          "Beta release of RISEN AI",
          "Expansion of RISEN Rush with stronger profile, scoring, and reward systems",
          "Launch of wallet-linked ecosystem profile infrastructure",
          "Introduction of quests, missions, and structured reward mechanics",
          "Development of the RISEN Dashboard / Terminal",
          "Utility integrations connecting token, game, and user activity",
          "Strengthened transparency and ecosystem reporting systems",
          "Broader multilingual accessibility and global onboarding improvements",
          "Deeper community operations structure and contributor programs",
        ],
        outcome:
          "By the end of 2027, RISEN should evolve from a launch-stage project into a usable and interactive ecosystem where holders, players, and contributors all have practical reasons to remain active.",
      },
      {
        year: "2028",
        phase: "Phase 3",
        title: "Intelligence, Education, and Ecosystem Structuring",
        objective:
          "Deepen the ecosystem through AI, education, and internal structure, while creating more organized pathways for participation and growth.",
        milestones: [
          "Full expansion of RISEN AI into a practical ecosystem intelligence layer",
          "Launch of RISEN Academy",
          "Educational tracks focused on digital assets, ecosystem onboarding, AI literacy, and Web3 participation",
          "Contributor learning and certification pathways",
          "Structured recognition systems including ranks, badges, and participation milestones",
          "Introduction of ecosystem research, market insights, and knowledge tools",
          "Advanced community and builder support programs",
          "Stronger data, analytics, and user engagement intelligence systems",
        ],
        outcome:
          "By the end of 2028, RISEN should stand as a more intelligent and educationally enabled ecosystem, capable of onboarding users, guiding participation, and reinforcing retention through knowledge and structure.",
      },
      {
        year: "2029",
        phase: "Phase 4",
        title: "Institutional Growth and Community Capital",
        objective:
          "Build the trust, stewardship, and long-term social capital required for RISEN to mature beyond product development into sustainable ecosystem leadership.",
        milestones: [
          "Launch and formalization of the RISEN Foundation",
          "Grant, support, or impact-driven ecosystem initiatives",
          "Expansion of contributor, builder, and creator support programs",
          "Community chapter development across regions and languages",
          "Long-term partnership framework development",
          "Enhanced treasury visibility and sustainability initiatives",
          "Recognition programs for major contributors and ecosystem builders",
          "Structured pathways for ecosystem participation at a deeper strategic level",
        ],
        outcome:
          "By the end of 2029, RISEN should be more than a utility ecosystem; it should become a more durable digital institution with organized stewardship, stronger community capital, and credible long-term structure.",
      },
      {
        year: "2030",
        phase: "Phase 5",
        title: "Network Expansion and Long-Term Relevance",
        objective:
          "Position RISEN as a resilient, intelligent, and expandable digital asset ecosystem with lasting relevance across evolving market cycles.",
        milestones: [
          "Broader ecosystem expansion and interoperability strategy",
          "Deeper AI-native infrastructure and ecosystem automation",
          "Expansion of ecosystem utilities into more mature user and market workflows",
          "Cross-platform and cross-ecosystem integration opportunities",
          "Stronger public relevance through education, tools, and community presence",
          "Consolidation of RISEN’s identity as a long-term digital ecosystem brand",
          "Sustainable utility loops connecting token value, participation, intelligence, and community development",
        ],
        outcome:
          "By the end of 2030, RISEN should be positioned as a lasting ecosystem with real infrastructure, recognizable utility, institutional support, and the ability to remain relevant through continuous evolution.",
      },
    ],
    []
  );

  const active = roadmap.find((item) => item.year === activeYear) ?? roadmap[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020B1A] text-white">
      <div className="absolute inset-0 -z-30">
        <Image
          src="/bg.png"
          alt="RISEN Background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover opacity-80"
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(2,11,26,0.88),rgba(2,11,26,0.94))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_center,rgba(46,219,255,0.12),transparent_35%)]" />

      <section className="relative px-5 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-risen-primary/30 hover:bg-white/10"
            >
              <Image
                src={logo}
                alt="RISEN Logo"
                className="w-8 drop-shadow-[0_0_18px_rgba(46,219,255,0.38)]"
                priority
              />
              <span className="text-sm font-semibold text-white">Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#A9F3FF]">
              <span className="inline-block h-2 w-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)] animate-pulse" />
              RISEN Roadmap 2026–2030
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] xl:gap-14">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-risen-primary/80">
                Long-term direction
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[3.7rem]">
                Building RISEN into a resilient digital asset ecosystem.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                This roadmap defines the strategic path from launch to long-term
                relevance: infrastructure, utility, intelligence, education,
                institutional strength, and ecosystem expansion.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_0_24px_rgba(46,219,255,0.05)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Strategic Logic
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Asset → Utility → Intelligence → Institution → Network
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_0_24px_rgba(46,219,255,0.05)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Core Aim
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Sustain relevance across market cycles through real tools,
                    disciplined structure, and continuous evolution.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Timeline
                </p>

                <div className="mt-5 space-y-4">
                  {roadmap.map((item, index) => {
                    const isActive = activeYear === item.year;

                    return (
                      <button
                        key={item.year}
                        type="button"
                        onClick={() => setActiveYear(item.year)}
                        className={`group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                          isActive
                            ? "border-risen-primary/30 bg-[linear-gradient(180deg,rgba(46,219,255,0.10),rgba(255,255,255,0.04))] shadow-[0_0_35px_rgba(46,219,255,0.10)]"
                            : "border-white/10 bg-white/5 hover:border-risen-primary/20 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="relative flex flex-col items-center pt-1">
                          <span
                            className={`h-3 w-3 rounded-full ${
                              isActive
                                ? "bg-risen-primary shadow-[0_0_16px_rgba(46,219,255,0.95)]"
                                : "bg-white/35"
                            }`}
                          />
                          {index !== roadmap.length - 1 && (
                            <span className="mt-2 h-14 w-px bg-white/10" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-bold text-white">
                              {item.year}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/60">
                              {item.phase}
                            </span>
                          </div>

                          <p className="mt-2 text-base font-semibold text-white">
                            {item.title}
                          </p>

                          <p className="mt-2 text-sm leading-relaxed text-white/58">
                            {item.objective}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[30px] bg-risen-primary/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] backdrop-blur-xl shadow-[0_0_50px_rgba(46,219,255,0.10)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.12),transparent_40%)] pointer-events-none" />

                <div className="relative border-b border-white/10 px-6 py-6 sm:px-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#A9F3FF]">
                      <span className="inline-block h-2 w-2 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                      {active.phase}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/50">
                      {active.year}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                    {active.title}
                  </h2>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/68 sm:text-base">
                    {active.objective}
                  </p>
                </div>

                <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                  <div className="rounded-2xl border border-white/10 bg-[#07111f]/85 p-5 shadow-[0_0_24px_rgba(46,219,255,0.05)]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Key Milestones
                    </p>

                    <div className="mt-5 space-y-3">
                      {active.milestones.map((milestone) => (
                        <div
                          key={milestone}
                          className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                        >
                          <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-risen-primary shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                          <p className="text-sm leading-relaxed text-white/78 sm:text-[15px]">
                            {milestone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-risen-primary/15 bg-[linear-gradient(180deg,rgba(46,219,255,0.09),rgba(255,255,255,0.03))] p-5 shadow-[0_0_28px_rgba(46,219,255,0.08)]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#A9F3FF]">
                      Strategic Outcome
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/82 sm:text-base">
                      {active.outcome}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Utility Track
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-white/82">
                    RISEN Rush, Memecoin Bridger, Dust Sweeper, Dashboard,
                    missions, and evolving ecosystem tools.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Intelligence Track
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-white/82">
                    RISEN AI, analytics, onboarding intelligence, ecosystem
                    assistance, and smarter participation systems.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Community Track
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-white/82">
                    Academy, Foundation, contributor pathways, regional growth,
                    partnerships, and long-term social capital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}