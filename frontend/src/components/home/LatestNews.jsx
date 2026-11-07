const newsItems = [
  {
    title: "Aerospace Research",
    category: "Research",
    description: "Discover our latest aerospace research activities.",
  },
  {
    title: "Engineering Innovation",
    category: "Innovation",
    description: "Explore developments in aerospace engineering.",
  },
  {
    title: "Project Updates",
    category: "Projects",
    description: "Stay updated with our ongoing initiatives.",
  },
];

function LatestNews() {
  return (
    <section className="bg-[#060A13] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
              Updates
            </p>

            <h2 className="mt-4 text-4xl font-bold">Latest News</h2>
          </div>

          <a href="/news" className="text-cyan-400 hover:text-white">
            View All News →
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-cyan-400/50"
            >
              <p className="text-sm text-cyan-400">{item.category}</p>

              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

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

export default LatestNews;
