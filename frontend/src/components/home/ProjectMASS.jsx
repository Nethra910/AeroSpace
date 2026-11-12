import Reveal from "../motion/Reveal";

function ProjectMASS() {
  return (
    <section className="bg-[#0A101D] px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
            Interactive Experience
          </p>

          <h2 className="mt-4 text-4xl font-bold">Project MASS</h2>

          <p className="mt-6 leading-relaxed text-slate-400">
            Explore the Project MASS simulator and discover aerospace concepts
            through an interactive experience.
          </p>

          <a
            href="/project-mass"
            className="mt-8 inline-block rounded-md border border-cyan-400 px-6 py-3 text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
          >
            Explore Simulator
          </a>
        </Reveal>

        <Reveal delay={100} className="flex min-h-72 items-center justify-center rounded-xl border border-cyan-400/20 bg-slate-950">
          <div className="text-center">
            <div className="text-5xl text-cyan-400">MASS</div>
            <p className="mt-4 font-mono text-sm text-slate-500">
              SIMULATION MODULE
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default ProjectMASS;
