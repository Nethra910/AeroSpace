function Vision2036() {
  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-400">
          Our Future
        </p>

        <h1 className="mt-6 text-5xl font-bold md:text-7xl">
          Vision <span className="text-cyan-400">2036</span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-400">
          Exploring the future of aerospace through engineering, research, and
          technological innovation.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Innovation",
              description:
                "Advancing aerospace technologies through innovative engineering.",
            },
            {
              title: "Research",
              description:
                "Supporting future-focused aerospace research and development.",
            },
            {
              title: "Excellence",
              description:
                "Building a foundation for future aerospace achievements.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900 p-8"
            >
              <h2 className="text-2xl font-semibold text-cyan-400">
                {item.title}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Vision2036;
