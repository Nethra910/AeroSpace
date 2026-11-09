function Research() {
  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-20 text-[#E9EEF6]">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#3EE0FF]">
          Innovation & Development
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Research Organization
        </h1>

        <p className="max-w-3xl text-lg leading-8 text-slate-400">
          Exploring advanced technologies and engineering solutions to
          contribute to the future of aerospace.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-[#1D2940] bg-[#0C1322] p-8">
            <h2 className="mb-4 text-2xl font-semibold text-[#3EE0FF]">
              Research & Innovation
            </h2>
            <p className="leading-8 text-slate-400">
              Research initiatives and innovation activities will be presented
              here.
            </p>
          </div>

          <div className="rounded-xl border border-[#1D2940] bg-[#0C1322] p-8">
            <h2 className="mb-4 text-2xl font-semibold text-[#3EE0FF]">
              Publications
            </h2>
            <p className="leading-8 text-slate-400">
              Research publications and technical contributions will be added
              here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Research;
