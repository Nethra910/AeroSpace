import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import contentService from "../../services/contentService";
import logo from "../../assets/brand/mani-aerospace-logo.jpeg";

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
    <section className="page-grid relative isolate flex min-h-[85vh] items-center overflow-hidden bg-space-950 px-6 text-ink">
      {/* Decorative brand watermark; styling lives in `.hero-watermark` (index.css). */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        width="1015"
        height="451"
        decoding="async"
        draggable="false"
        className="hero-watermark pointer-events-none absolute right-0 top-1/2 w-[min(46rem,100%)] -translate-y-1/2 select-none md:right-6"
      />
      <div className="relative mx-auto w-full max-w-7xl">
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
