const focusAreas = [
  {
    title: "Aerospace Engineering",
    description:
      "Developing advanced aerospace concepts and engineering solutions.",
  },
  {
    title: "Research & Innovation",
    description:
      "Exploring emerging technologies through research and experimentation.",
  },
  {
    title: "Advanced Simulation",
    description:
      "Using simulation and computational technologies to explore aerospace systems.",
  },
];

function FocusAreas() {
  return (
    <section className="bg-[#060A13] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
          Our Expertise
        </p>

        <h2 className="mt-4 text-4xl font-bold">Engineering the Future</h2>

        <div className="stagger mt-12 grid gap-6 md:grid-cols-3">
          {focusAreas.map((area, index) => (
            <Reveal
              key={area.title}
              as="article"
              delay={index * 80}
              className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-cyan-400/50"
            >
              <span className="font-mono text-cyan-400">0{index + 1}</span>

              <h3 className="mt-6 text-xl font-semibold">{area.title}</h3>

              <p className="mt-4 leading-relaxed text-slate-400">
                {area.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FocusAreas;
import Reveal from "../motion/Reveal";
