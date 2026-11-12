import { useEffect, useState } from "react";
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
    <section className="page-grid relative flex min-h-[85vh] items-center overflow-hidden bg-[#060A13] px-6 text-[#E9EEF6]">
      <div className="hero-orbit pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-cyan-400/20 md:right-0">
        <div className="absolute inset-12 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-[#f0a35b]" />
      </div>
      <div className="mx-auto w-full max-w-7xl">
        <p className="signal-rule mb-6 font-mono text-sm uppercase tracking-[0.3em] text-[#3EE0FF]">
          {content.subtitle}
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] md:text-8xl">
          {content.title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
          {content.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/mission"
            className="rounded-md bg-[#f0a35b] px-6 py-3 font-semibold text-[#060A13] transition hover:bg-white"
          >
            Explore Our Mission <span className="ml-3">↗</span>
          </a>
        </div>
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">06° 31′ 12″ N&nbsp;&nbsp; / &nbsp;&nbsp;77° 34′ 09″ E&nbsp;&nbsp; / &nbsp;&nbsp;SCROLL TO EXPLORE</p>
      </div>
    </section>
  );
}

export default HeroSection;
