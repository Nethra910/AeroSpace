import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import newsService from "../services/newsService";

function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    newsService
      .getNewsById(id)
      .then((response) => setNews(response.data))
      .catch(() => setError("Unable to load this news article."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#060A13] text-cyan-400">
        Loading article...
      </section>
    );
  }

  if (error || !news) {
    return (
      <section className="min-h-screen bg-[#060A13] px-6 py-32 text-white">
        <p className="text-slate-400">{error || "News article not found."}</p>
        <Link to="/news" className="mt-6 inline-block text-cyan-400">
          ← Back to News
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#060A13] px-6 py-24 text-white">
      <article className="mx-auto max-w-4xl">
        <Link to="/news" className="text-sm text-cyan-400 hover:text-white">
          ← Back to News
        </Link>

        <p className="mt-12 font-mono text-sm uppercase tracking-widest text-cyan-400">
          {news.category}
        </p>

        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
          {news.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>By {news.author}</span>
          {news.created_at && (
            <span>{new Date(news.created_at).toLocaleDateString()}</span>
          )}
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <p className="whitespace-pre-line text-lg leading-9 text-slate-300">
            {news.content}
          </p>
        </div>
      </article>
    </section>
  );
}

export default NewsDetails;
