import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import newsService from "../services/newsService";
import Reveal from "../components/motion/Reveal";
import Badge from "../components/ui/Badge";
import { publicPage } from "../components/ui/pageStyles";

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
      <section className="flex min-h-screen items-center justify-center bg-space-950 text-signal">
        Loading article...
      </section>
    );
  }

  if (error || !news) {
    return (
      <section className={publicPage}>
        <p className="text-muted">{error || "News article not found."}</p>
        <Link to="/news" className="mt-6 inline-block text-signal">
          ← Back to News
        </Link>
      </section>
    );
  }

  return (
    <section className={publicPage}>
      <article className="mx-auto max-w-4xl">
        <Link to="/news" className="font-mono text-xs uppercase tracking-wider text-signal hover:text-white">
          ← Back to News
        </Link>

        <div className="mt-12"><Badge tone="signal">{news.category}</Badge></div>

        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
          {news.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs text-muted">
          <span>By {news.author}</span>
          {news.created_at && (
            <span>{new Date(news.created_at).toLocaleDateString()}</span>
          )}
        </div>

        {news.image_url && (
          <img
            src={news.image_url}
            alt={news.title}
            className="mt-10 max-h-[500px] w-full border border-white/10 object-cover"
          />
        )}

        <Reveal className="mt-10 border-t border-white/10 pt-8">
          <p className="whitespace-pre-line text-lg leading-9 text-muted">
            {news.content}
          </p>
        </Reveal>
      </article>
    </section>
  );
}

export default NewsDetails;
