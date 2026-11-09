function Directors() {
  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-20 text-[#E9EEF6]">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#3EE0FF]">
          Leadership
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Board of Directors
        </h1>

        <p className="mb-16 max-w-2xl text-lg leading-8 text-slate-400">
          Meet the leadership guiding MANI Aerospace toward innovation,
          excellence, and the future of aerospace engineering.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2].map((director) => (
            <div
              key={director}
              className="rounded-xl border border-[#1D2940] bg-[#0C1322] p-8"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#3EE0FF]/30 bg-[#060A13] text-3xl text-[#3EE0FF]">
                {director}
              </div>

              <h2 className="mb-2 text-2xl font-semibold">
                Director {director}
              </h2>

              <p className="text-slate-400">
                Official director information will be added soon.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Directors;
