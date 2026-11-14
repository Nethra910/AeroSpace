import Reveal from "../motion/Reveal";
import { AerospaceLogo } from "../brand/Logos";

function CompanyOverview() {
  return (
    <section className="bg-space-900 px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <AerospaceLogo className="mb-10 max-w-sm" />
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-signal">
            Who We Are
          </p>

          <h2 className="text-4xl font-bold leading-tight">
            Building Tomorrow's Aerospace Technologies
          </h2>

          <p className="mt-6 leading-relaxed text-muted">
            MANI Aerospace is dedicated to aerospace engineering, advanced
            research, and innovative technologies that contribute to the future
            of aerospace exploration.
          </p>
        </Reveal>

        <Reveal delay={100} className="rounded-xl border border-white/10 bg-space-800 p-10">
          <p className="text-5xl font-bold text-signal">2036</p>
          <h3 className="mt-4 text-xl font-semibold">
            Our Vision for the Future
          </h3>
          <p className="mt-3 text-muted">
            Exploring new possibilities through engineering, innovation, and
            scientific research.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default CompanyOverview;
