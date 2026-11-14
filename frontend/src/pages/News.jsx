import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newsService from "../services/newsService";
import Section from "../components/ui/Section";
import Reveal from "../components/motion/Reveal";
import Badge from "../components/ui/Badge";

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
    <Section
      number="04"
      eyebrow="Updates"
      title="Latest News"
      description="Signals from the MANI Aerospace research and engineering program."
      className="min-h-screen bg-space-950"
    >

        {loading ? (
          <p className="mt-12 text-muted">Loading news...</p>
        ) : news.length === 0 ? (
          <p className="mt-12 text-muted">No news available.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {news.map((item, index) => (
              <Reveal
                key={item.id}
                as="article"
                delay={index * 70}
                className={`overflow-hidden border border-white/10 bg-space-800 ${index === 0 ? "md:col-span-2" : ""}`}
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-8">
                  <Badge tone="signal">{item.category}</Badge>

                  <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>

                  <p className="mt-4 line-clamp-3 text-muted">
                    {item.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="min-w-0 font-mono text-xs text-muted">{item.author}</p>

                    <Link
                      to={`/news/${item.id}`}
                      className="shrink-0 whitespace-nowrap text-sm font-medium text-signal hover:text-white"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
    </Section>
  );
}

export default News;
