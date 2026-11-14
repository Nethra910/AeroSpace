import { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import authService from "../../services/authService";
import { useDrawerLock } from "../../hooks/useDrawerLock";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { adminLoginRoute, adminNavGroups, publicSiteRoute } from "../../config/adminNavigation";
import Icon from "../ui/Icon";
import RailTooltip from "../layout/RailTooltip";
import AdminBrand from "./AdminBrand";

const DESKTOP_QUERY = "(min-width: 1024px)";

function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Collapsing only applies to the desktop sidebar; the mobile drawer is always full width.
  const rail = isDesktop && collapsed;
  const drawerOpen = !isDesktop && mobileOpen;

  useDrawerLock(drawerOpen, onMobileClose);

  // Same sign-out flow as the Dashboard's own Logout button, but always leaves the
  // admin area: authService clears the token in `finally`, even if the API call fails.
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* token already cleared; redirect regardless */
    }
    window.location.href = adminLoginRoute;
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${drawerOpen ? "is-open" : ""}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        id="admin-sidebar"
        className="sidebar"
        data-rail={rail}
        data-open={drawerOpen}
        aria-label="Admin navigation"
        inert={!isDesktop && !mobileOpen}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          className="sidebar-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls="admin-sidebar"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
        </button>

        <div className="flex h-full flex-col">
          <div className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-white/10 px-5">
            <AdminBrand onClick={onMobileClose} />
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-signal lg:hidden"
              aria-label="Close admin menu"
            >
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Admin" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
            {adminNavGroups.map((group) => (
              <Fragment key={group.label}>
                <p className="sidebar-eyebrow">{group.label}</p>
                {group.items.map((item) => (
                  <RailTooltip key={item.path} label={item.name} enabled={rail}>
                    <NavLink to={item.path} end={item.end} onClick={onMobileClose} className="sidebar-link">
                      <Icon name={item.icon} />
                      <span className="sidebar-label">{item.name}</span>
                    </NavLink>
                  </RailTooltip>
                ))}
              </Fragment>
            ))}
          </nav>

          <div className="shrink-0 border-t border-white/10 px-3 py-3">
            <RailTooltip label="View Site" enabled={rail}>
              <Link to={publicSiteRoute} onClick={onMobileClose} className="sidebar-link">
                <Icon name="globe" />
                <span className="sidebar-label">View Site</span>
              </Link>
            </RailTooltip>

            <RailTooltip label="Logout" enabled={rail}>
              <button type="button" onClick={handleLogout} className="sidebar-link sidebar-link--danger">
                <Icon name="logout" />
                <span className="sidebar-label">Logout</span>
              </button>
            </RailTooltip>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
