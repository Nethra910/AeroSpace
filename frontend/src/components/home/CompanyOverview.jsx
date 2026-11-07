function CompanyOverview() {
  return (
    <section className="bg-[#0A101D] px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-cyan-400">
            Who We Are
          </p>

          <h2 className="text-4xl font-bold leading-tight">
            Building Tomorrow's Aerospace Technologies
          </h2>

          <p className="mt-6 leading-relaxed text-slate-400">
            MANI Aerospace is dedicated to aerospace engineering, advanced
            research, and innovative technologies that contribute to the future
            of aerospace exploration.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900 p-10">
          <p className="text-5xl font-bold text-cyan-400">2036</p>
          <h3 className="mt-4 text-xl font-semibold">
            Our Vision for the Future
          </h3>
          <p className="mt-3 text-slate-400">
            Exploring new possibilities through engineering, innovation, and
            scientific research.
          </p>
        </div>
      </div>
    </section>
  );
}

export default CompanyOverview;
