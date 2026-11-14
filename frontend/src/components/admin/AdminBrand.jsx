import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { adminHomeRoute } from "../../config/adminNavigation";

// Admin-console branding. Shared by AdminSidebar and AdminTopBar.
function AdminBrand({ onClick }) {
  return (
    <Link
      to={adminHomeRoute}
      onClick={onClick}
      aria-label="MANI Aerospace admin dashboard"
      className="brand flex items-center gap-3"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-warm/40 bg-warm/5 text-warm">
        <Icon name="shield" className="h-5 w-5" />
      </span>
      <span className="sidebar-label flex flex-col leading-none">
        <span className="font-mono text-sm font-semibold tracking-[0.18em] text-white">
          MANI <span className="text-signal">/ AEROSPACE</span>
        </span>
        <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-warm">
          Admin Console
        </span>
      </span>
    </Link>
  );
}

export default AdminBrand;
