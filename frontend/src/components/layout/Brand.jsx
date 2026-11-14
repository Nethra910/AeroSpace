import { Link } from "react-router-dom";

// AeroSpace logo + wordmark. Shared by the sidebar and the mobile top bar.
function Brand({ onClick, className = "" }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="MANI Aerospace home"
      className={`brand flex items-center gap-3 ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-signal/40 bg-signal/5 text-signal">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="hero-orbit h-5 w-5"
          aria-hidden="true"
        >
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-30 12 12)" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="sidebar-label font-mono text-sm font-semibold tracking-[0.18em] text-white">
        MANI <span className="text-signal">/ AEROSPACE</span>
      </span>
    </Link>
  );
}

export default Brand;
