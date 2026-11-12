import { useEffect, useState } from "react";
import newsService from "../../services/newsService";
import Reveal from "../motion/Reveal";

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
    <section className="bg-space-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-signal">
              Updates
            </p>
            <h2 className="mt-4 text-4xl font-bold">Latest News</h2>
          </div>

          <a href="/news" className="text-signal hover:text-white">
            View All News →
          </a>
        </div>

        {loading ? (
          <p className="mt-12 text-muted">Loading news...</p>
        ) : error ? (
          <p className="mt-12 text-red-400">{error}</p>
        ) : newsItems.length === 0 ? (
          <p className="mt-12 text-muted">No published news available.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {newsItems.slice(0, 3).map((item, index) => (
              <Reveal
                key={item.id}
                as="article"
                delay={index * 80}
                className="rounded-xl border border-white/10 bg-space-800 p-8 transition hover:border-signal/50"
              >
                <p className="text-sm text-signal">{item.category}</p>

                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

                <p className="mt-4 leading-relaxed text-muted">
                  {item.summary}
                </p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestNews;
