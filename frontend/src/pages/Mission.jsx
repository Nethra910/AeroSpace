import { useEffect, useState } from "react";
import contentService from "../services/contentService";
import Section from "../components/ui/Section";
import Reveal from "../components/motion/Reveal";

function Mission() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService
      .getMissionContent()
      .then((response) => setMission(response.data))
      .catch((error) => console.error("Mission loading failed:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-space-950 p-20 text-ink">Loading mission...</div>
    );
  }

  if (!mission) {
    return (
      <div className="bg-space-950 p-20 text-ink">
        Mission content unavailable.
      </div>
    );
  }

  return (
    <Section
      number="01"
      eyebrow="Mission"
      title={mission.title}
      description={mission.description}
      className="min-h-screen bg-space-950"
    >
      <div className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[180px_1fr]">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Purpose / 2036
        </p>
        <Reveal className="max-w-3xl border-l border-signal/50 pl-6 text-lg leading-9 text-muted">
          We build the conditions for ambitious aerospace research to become
          practical, measurable, and useful.
        </Reveal>
      </div>
    </Section>
  );
}

export default Mission;
