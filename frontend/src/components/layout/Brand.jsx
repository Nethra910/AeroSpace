import { Link } from "react-router-dom";
import logo from "../../assets/brand/mani-aerospace-logo.jpeg";

// Official MANI / AEROSPACE logo. Shared by the sidebar and the mobile top bar.
//
// The logo is an opaque, wide (1015x451) image, so it is shown as a framed tile
// on the dark theme. When the desktop sidebar collapses to its narrow rail the
// full logo no longer fits, so CSS swaps it for `.brand-mark`: a crop of the
// same file showing just the "A" emblem (see index.css).
function Brand({ onClick, className = "", logoClassName = "h-[52px]" }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="MANI Aerospace home"
      className={`brand flex items-center ${className}`}
    >
      <img
        src={logo}
        alt="MANI Aerospace logo"
        width="1015"
        height="451"
        decoding="async"
        className={`brand-logo block w-auto max-w-none rounded-sm border border-white/10 bg-[#ececec] ${logoClassName}`}
      />
      <span
        className="brand-mark"
        style={{ backgroundImage: `url(${logo})` }}
        aria-hidden="true"
      />
    </Link>
  );
}

export default Brand;
