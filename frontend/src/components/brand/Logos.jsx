import aerospaceLogo from "../../assets/brand/mani-aerospace-logo.jpeg";
import researchOrganisationLogo from "../../assets/brand/mani-research-organisation-logo.jpeg";

// The official logos are used exactly as supplied. They are opaque images with
// their own backgrounds, so they are shown as framed tiles on the dark theme:
// width is capped by the parent, height follows the intrinsic aspect ratio, and
// nothing is cropped or stretched.

export function AerospaceLogo({ className = "" }) {
  return (
    <img
      src={aerospaceLogo}
      alt="MANI Aerospace logo"
      width="1015"
      height="451"
      decoding="async"
      className={`block h-auto w-full rounded-md border border-white/10 bg-[#f7f7f7] ${className}`}
    />
  );
}

export function ResearchOrganisationLogo({ className = "", priority = false }) {
  return (
    <img
      src={researchOrganisationLogo}
      alt="MANI Research Organisation logo"
      width="1600"
      height="535"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      className={`block h-auto w-full rounded-md border border-white/10 bg-white ${className}`}
    />
  );
}
