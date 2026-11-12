import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import contentService from "../../services/contentService";

function HeroSection() {
  const [content, setContent] = useState({
    title: "Beyond Earth. Beyond Limits.",
    subtitle: "Engineering the Future of Aerospace",
    description:
      "Discover MANI Aerospace — advancing aerospace innovation, engineering research, and next-generation technologies.",
  });

  useEffect(() => {
    contentService
      .getHomeContent()
      .then((response) => setContent(response.data))
      .catch((error) => console.error("Failed to load home content:", error));
  }, []);

  return (
    <section className="page-grid relative flex min-h-[85vh] items-center overflow-hidden bg-space-950 px-6 text-ink">
      <div className="hero-orbit pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-signal/20 md:right-0">
        <div className="absolute inset-12 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-warm" />
      </div>
      <div className="mx-auto w-full max-w-7xl">
        <p className="signal-rule mb-6 font-mono text-sm uppercase tracking-[0.3em] text-signal">
          {content.subtitle}
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] md:text-8xl">
          {content.title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          {content.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/mission"
            className="rounded-md bg-warm px-6 py-3 font-semibold text-space-950 transition hover:bg-white"
          >
            Explore Our Mission <span className="ml-3">↗</span>
          </Link>
        </div>
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-muted">01 / SCROLL TO EXPLORE</p>
      </div>
    </section>
  );
}

export default HeroSection;
