function TeamSimha() {
  return (
    <section className="bg-[#0A101D] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
          Our Team
        </p>

        <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-4xl font-bold">Meet Team SIMHA</h2>

            <p className="mt-6 leading-relaxed text-slate-400">
              A team dedicated to aerospace engineering, innovation, and
              developing technologies for the future.
            </p>

            <a
              href="/team-simha"
              className="mt-8 inline-block rounded-md border border-cyan-400 px-6 py-3 text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
            >
              Explore Team SIMHA
            </a>
          </div>

          <div className="flex min-h-64 items-center justify-center rounded-xl border border-white/10 bg-slate-900">
            <span className="text-5xl font-bold tracking-widest text-cyan-400">
              SIMHA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamSimha;
