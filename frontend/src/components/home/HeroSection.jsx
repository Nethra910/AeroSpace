function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#060A13] px-6 text-[#E9EEF6]">
      <div className="mx-auto w-full max-w-7xl">
        <p className="mb-6 font-mono text-sm uppercase tracking-[0.3em] text-[#3EE0FF]">
          Engineering the Future of Aerospace
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Beyond Earth.
          <span className="block text-[#3EE0FF]">Beyond Limits.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
          Discover MANI Aerospace — advancing aerospace innovation, engineering
          research, and next-generation technologies.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/about"
            className="rounded-md bg-[#3EE0FF] px-6 py-3 font-semibold text-[#060A13] transition hover:bg-white"
          >
            Explore Our Mission
          </a>

          <a
            href="/projects"
            className="rounded-md border border-[#1D2940] px-6 py-3 transition hover:border-[#3EE0FF]"
          >
            Discover Projects
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
