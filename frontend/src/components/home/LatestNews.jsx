import { useEffect, useState } from "react";
import newsService from "../../services/newsService";

function LatestNews() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    newsService
      .getPublishedNews()
      .then((response) => setNewsItems(response.data))
      .catch(() => setError("Unable to load latest news."))
      .finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <p className="mt-12 text-slate-400">Loading news...</p>
        ) : error ? (
          <p className="mt-12 text-red-400">{error}</p>
        ) : newsItems.length === 0 ? (
          <p className="mt-12 text-slate-400">No published news available.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {newsItems.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-cyan-400/50"
              >
                <p className="text-sm text-cyan-400">{item.category}</p>

                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

                <p className="mt-4 leading-relaxed text-slate-400">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestNews;
