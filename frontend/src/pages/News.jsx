import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newsService from "../services/newsService";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService
      .getPublishedNews()
      .then((response) => setNews(response.data))
      .catch((error) => console.error("News loading failed:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-32 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono uppercase tracking-widest text-cyan-400">
          Updates
        </p>

        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Latest News</h1>

        {loading ? (
          <p className="mt-12 text-slate-400">Loading news...</p>
        ) : news.length === 0 ? (
          <p className="mt-12 text-slate-400">No news available.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/50"
              >
                <p className="text-sm text-cyan-400">{item.category}</p>

                <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>

                <p className="mt-4 line-clamp-3 text-slate-400">
                  {item.summary}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-slate-500">{item.author}</p>

                  <Link
                    to={`/news/${item.id}`}
                    className="text-sm font-medium text-cyan-400 hover:text-white"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default News;
