function TeamSimha() {
  return (
    <section className="min-h-screen bg-[#0A101D] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
          Our Team
        </p>

        <h1 className="mt-6 text-5xl font-bold md:text-7xl">
          Team <span className="text-cyan-400">SIMHA</span>
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">
              Engineering the Future Together
            </h2>

            <p className="mt-6 leading-relaxed text-slate-400">
              Team SIMHA brings together aerospace engineering, research, and
              innovation to explore next-generation technologies and future
              aerospace possibilities.
            </p>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-xl border border-white/10 bg-slate-900">
            <span className="text-6xl font-bold tracking-widest text-cyan-400">
              SIMHA
            </span>
          </div>
        </div>

        <div className="mt-20 rounded-xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold">Meet Our Team</h2>
          <p className="mt-4 text-slate-400">
            Team member profiles and engineering contributions will be added
            once the official team information is provided.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TeamSimha;
