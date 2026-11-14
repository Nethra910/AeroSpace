import { Link } from "react-router-dom";
import Section from "../components/ui/Section";
import Panel from "../components/ui/Panel";
import Badge from "../components/ui/Badge";
import Reveal from "../components/motion/Reveal";
import { ResearchOrganisationLogo } from "../components/brand/Logos";
import { organisation } from "../config/organisation";

// Copy below is drawn from content already on the site (Mission, Vision 2036,
// Home focus areas). Anything the organisation has not supplied is shown as an
// explicit placeholder rather than invented.

const objectives = [
  "Advance aerospace concepts and engineering solutions.",
  "Explore emerging technologies through research and experimentation.",
  "Use simulation and computational technologies to study aerospace systems.",
  "Share research publications and technical contributions through the Published Papers library.",
];

const researchAreas = [
  {
    title: "Aerospace Engineering",
    description:
      "Developing advanced aerospace concepts and engineering solutions.",
  },
  {
    title: "Research & Innovation",
    description:
      "Exploring emerging technologies through research and experimentation.",
  },
  {
    title: "Advanced Simulation",
    description:
      "Using simulation and computational technologies to explore aerospace systems.",
  },
];

const profile = [
  ["Established", "To be provided"],
  ["Headquarters", "To be provided"],
  ["Leadership", "To be provided"],
];

function Placeholder({ children }) {
  return (
    <p className="mt-5 border-l border-warm/50 pl-4 text-sm leading-6 text-quiet">
      {children}
    </p>
  );
}

function Research() {
  return (
    <Section
      number="03"
      eyebrow="Innovation & Development"
      title="Research Organisation"
      description="Exploring advanced technologies and engineering solutions to contribute to the future of aerospace."
      className="min-h-screen bg-space-950"
    >
      {/* Identity */}
      <div className="grid gap-8 border border-white/10 bg-space-900 p-5 sm:p-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-center lg:gap-12">
        <ResearchOrganisationLogo priority />

        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            Full name
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug text-ink md:text-3xl">
            {organisation.fullName}
          </h2>

          <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-3">
            {profile.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-xs uppercase tracking-widest text-quiet">
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Overview */}
      <div className="mt-20 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[180px_1fr]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          01 / Overview
        </p>
        <Reveal className="max-w-3xl">
          <p className="text-lg leading-9 text-muted">
            {organisation.name} brings research into the MANI Aerospace
            platform, connecting aerospace engineering, advanced simulation and
            scientific inquiry with published work that anyone can read.
          </p>
          <Placeholder>
            A detailed organisational overview, including history, structure
            and leadership, will be added once provided by the organisation.
          </Placeholder>
        </Reveal>
      </div>

      {/* Mission & vision */}
      <div className="mt-20 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[180px_1fr]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          02 / Mission &amp; Vision
        </p>
        <div>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <Panel className="h-full">
                <Badge tone="signal">Mission</Badge>
                <p className="mt-5 leading-8 text-muted">
                  We build the conditions for ambitious aerospace research to
                  become practical, measurable, and useful.
                </p>
              </Panel>
            </Reveal>
            <Reveal delay={90}>
              <Panel className="h-full">
                <Badge tone="signal">Vision</Badge>
                <p className="mt-5 leading-8 text-muted">
                  Exploring new possibilities through engineering, innovation,
                  and scientific research.
                </p>
              </Panel>
            </Reveal>
          </div>
          <Placeholder>
            Taken from the MANI Aerospace mission and Vision 2036 pages. The
            organisation&apos;s own official statements will replace these once
            provided.
          </Placeholder>
        </div>
      </div>

      {/* Objectives */}
      <div className="mt-20 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[180px_1fr]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          03 / Research Objectives
        </p>
        <div>
          <ol className="max-w-4xl divide-y divide-white/10 border-y border-white/10">
            {objectives.map((objective, index) => (
              <Reveal
                key={objective}
                as="li"
                delay={index * 80}
                className="grid gap-4 py-6 sm:grid-cols-[64px_1fr] sm:items-baseline"
              >
                <span className="font-mono text-sm text-signal">
                  0{index + 1}
                </span>
                <span className="text-lg leading-8 text-ink">{objective}</span>
              </Reveal>
            ))}
          </ol>
          <Placeholder>
            Official research objectives will be confirmed by the organisation.
          </Placeholder>
        </div>
      </div>

      {/* Research areas */}
      <div className="mt-20 border-t border-white/10 pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          04 / Research Areas &amp; Multidisciplinary Focus
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {researchAreas.map((area, index) => (
            <Reveal
              key={area.title}
              as="article"
              delay={index * 80}
              className="border border-white/10 bg-space-800 p-7"
            >
              <span className="font-mono text-signal">0{index + 1}</span>
              <h3 className="mt-6 text-xl font-semibold text-ink">
                {area.title}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">
                {area.description}
              </p>
            </Reveal>
          ))}

          <Reveal
            delay={240}
            className="border border-dashed border-white/20 p-7"
          >
            <span className="font-mono text-warm">+</span>
            <h3 className="mt-6 text-xl font-semibold text-ink">
              Multidisciplinary Focus
            </h3>
            <p className="mt-4 leading-relaxed text-quiet">
              Additional disciplines and cross-field research themes will be
              listed here once provided.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Collaboration */}
      <div className="mt-20 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[180px_1fr]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          05 / Collaboration
        </p>
        <Reveal>
          <Panel className="max-w-3xl p-8">
            <h2 className="text-2xl font-semibold text-ink">
              Research &amp; collaboration opportunities
            </h2>
            <p className="mt-4 leading-8 text-muted">
              Researchers can contribute work through the platform and explore
              what has already been published.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/published-papers"
                className="rounded-md bg-warm px-6 py-3 font-semibold text-space-950 transition hover:bg-white"
              >
                Browse Published Papers <span className="ml-2">↗</span>
              </Link>
              <Link
                to="/submit-research-paper"
                className="rounded-md border border-signal px-6 py-3 font-semibold text-signal transition hover:bg-signal hover:text-space-950"
              >
                Submit a Research Paper
              </Link>
            </div>

            <Placeholder>
              Contact details for collaboration enquiries will be added once
              provided.
            </Placeholder>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}

export default Research;
