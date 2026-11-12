import Reveal from "../motion/Reveal";

function ProjectMASS() {
  return (
    <section className="bg-space-900 px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-widest text-signal">
            Interactive Experience
          </p>

          <h2 className="mt-4 text-4xl font-bold">Project MASS</h2>

          <p className="mt-6 leading-relaxed text-muted">
            Explore the Project MASS simulator and discover aerospace concepts
            through an interactive experience.
          </p>

          <a
            href="/project-mass"
            className="mt-8 inline-block rounded-md border border-signal px-6 py-3 text-signal transition hover:bg-signal hover:text-space-950"
          >
            Explore Simulator
          </a>
        </Reveal>

        <Reveal delay={100} className="flex min-h-72 items-center justify-center rounded-xl border border-signal/20 bg-space-950">
          <div className="text-center">
            <div className="text-5xl text-signal">MASS</div>
            <p className="mt-4 font-mono text-sm text-muted">
              SIMULATION MODULE
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ProjectMASS;
