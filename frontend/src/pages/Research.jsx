import Section from "../components/ui/Section";
import Reveal from "../components/motion/Reveal";

function Research() {
  return (
    <Section
      number="03"
      eyebrow="Innovation & Development"
      title="Research Organization"
      description="Exploring advanced technologies and engineering solutions to contribute to the future of aerospace."
      className="min-h-screen bg-space-950"
    >
        <div className="max-w-4xl divide-y divide-white/10 border-y border-white/10">
          {[
            ["01", "Research & Innovation", "Research initiatives and innovation activities will be presented here."],
            ["02", "Publications", "Research publications and technical contributions will be added here."],
          ].map(([number, title, description], index) => (
            <Reveal key={title} delay={index * 100} className="grid gap-6 py-8 md:grid-cols-[80px_1fr] md:items-start">
              <span className="font-mono text-sm text-signal">{number}</span>
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-ink">
                  {title}
                </h2>
                <p className="leading-8 text-muted">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
    </Section>
  );
}

export default Research;
