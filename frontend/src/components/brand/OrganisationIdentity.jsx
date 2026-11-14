import { Link } from "react-router-dom";
import { organisation } from "../../config/organisation";
import { ResearchOrganisationLogo } from "./Logos";

// Identity block for MANI Research Organisation: official logo + full name.
// Stacks on small screens and sits side by side from `sm` upwards, so the
// organisation stays visible at every viewport size.
function OrganisationIdentity({ className = "" }) {
  return (
    <aside
      aria-label={organisation.name}
      className={`grid items-center gap-6 border border-white/10 bg-space-900 p-5 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-8 sm:p-6 lg:grid-cols-[minmax(0,20rem)_1fr] ${className}`}
    >
      <ResearchOrganisationLogo priority />

      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
          Published under
        </p>
        <p className="mt-3 text-xl font-semibold leading-snug text-ink sm:text-2xl">
          {organisation.fullName}
        </p>
        <Link
          to={organisation.route}
          className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-signal"
        >
          About the organisation <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </aside>
  );
}

export default OrganisationIdentity;
