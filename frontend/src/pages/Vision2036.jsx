import Reveal from "../components/motion/Reveal";
import Section from "../components/ui/Section";

function Vision2036() {
  return (
    <Section
      number="02"
      eyebrow="Our Future"
      title={<>Vision <span className="text-signal">2036</span></>}
      description="Exploring the future of aerospace through engineering, research, and technological innovation."
      className="min-h-screen bg-space-950"
    >
        <div className="relative mt-10 grid gap-0 border-l border-signal/40 md:grid-cols-3">
          {[
            {
              title: "Innovation",
              description:
                "Advancing aerospace technologies through innovative engineering.",
            },
            {
              title: "Research",
              description:
                "Supporting future-focused aerospace research and development.",
            },
            {
              title: "Excellence",
              description:
                "Building a foundation for future aerospace achievements.",
            },
          ].map((item) => (
            <Reveal
              key={item.title}
              as="article"
              delay={["Innovation", "Research", "Excellence"].indexOf(item.title) * 90}
              className="relative border-b border-white/10 p-8 md:border-b-0 md:border-r"
            >
              <span className="font-mono text-xs text-muted">20{36 + ["Innovation", "Research", "Excellence"].indexOf(item.title)}</span>
              <h2 className="mt-10 text-2xl font-semibold text-signal">
                {item.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                {item.description}
              </p>
            </Reveal>
          ))}
        </div>
    </Section>
  );
}

export default Vision2036;
