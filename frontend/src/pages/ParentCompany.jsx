import Section from "../components/ui/Section";
import { AerospaceLogo } from "../components/brand/Logos";

function ParentCompany() {
  return (
    <Section number="08" eyebrow="About Us" title="Our Parent Company" description="MANI Aerospace operates with a vision to contribute to the future of aerospace innovation through engineering, research, and technological development." className="min-h-screen bg-space-950">
        <div className="mt-16 grid gap-12 border-y border-white/10 py-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <AerospaceLogo className="max-w-md" />
          </div>
          <div>
          <h2 className="mb-4 text-2xl font-semibold text-ink">
            About the Company
          </h2>

          <p className="leading-8 text-muted">
            Official parent company information, background, and organizational
            details will be added once provided by the client.
          </p>
          </div>
        </div>
    </Section>
  );
}

export default ParentCompany;
