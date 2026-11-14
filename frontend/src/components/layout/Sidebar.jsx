import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { accountNav, loginRoute, primaryNav, profileRoute } from "../../config/navigation";
import Icon from "../ui/Icon";
import Brand from "./Brand";
import RailTooltip from "./RailTooltip";

const DESKTOP_QUERY = "(min-width: 1024px)";

function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Collapsing only applies to the desktop sidebar; the mobile drawer is always full width.
  const rail = isDesktop && collapsed;
  const drawerOpen = !isDesktop && mobileOpen;

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onMobileClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, onMobileClose]);

  const handleLogout = () => {
    logout();
    onMobileClose();
    navigate("/");
  };

  const renderLink = (item) => (
    <RailTooltip key={item.path} label={item.name} enabled={rail}>
      <NavLink
        to={item.path}
        end={item.path === "/"}
        onClick={onMobileClose}
        className="sidebar-link"
      >
        <Icon name={item.icon} />
        <span className="sidebar-label">{item.name}</span>
      </NavLink>
    </RailTooltip>
  );

  const signedIn = !loading && user;

  return (
    <>
      <div
        className={`sidebar-backdrop ${drawerOpen ? "is-open" : ""}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        id="site-sidebar"
        className="sidebar"
        data-rail={rail}
        data-open={drawerOpen}
        aria-label="Site navigation"
        inert={!isDesktop && !mobileOpen}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          className="sidebar-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls="site-sidebar"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
        </button>

        <div className="flex h-full flex-col">
          <div className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-white/10 px-5">
            <Brand onClick={onMobileClose} />
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-signal lg:hidden"
              aria-label="Close menu"
            >
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3">
            <p className="sidebar-eyebrow">Navigate</p>
            {primaryNav.map(renderLink)}

            {signedIn && (
              <>
                <p className="sidebar-eyebrow">Account</p>
                {accountNav.map(renderLink)}
              </>
            )}
          </nav>

          <div className="shrink-0 border-t border-white/10 px-3 py-3">
            {signedIn ? (
              <>
                <RailTooltip label={profileRoute.name} enabled={rail}>
                  <NavLink
                    to={profileRoute.path}
                    onClick={onMobileClose}
                    className="sidebar-link sidebar-link--profile"
                  >
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full border border-signal object-cover"
                      />
                    ) : (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-signal font-mono text-sm uppercase text-signal">
                        {user.name?.charAt(0) ?? "?"}
                      </span>
                    )}
                    <span className="sidebar-label flex flex-col leading-tight">
                      <span className="max-w-36 truncate text-white">{user.name}</span>
                      <span className="mt-1 font-mono text-[11px] uppercase tracking-widest text-quiet">
                        {profileRoute.name}
                      </span>
                    </span>
                  </NavLink>
                </RailTooltip>

                <RailTooltip label="Logout" enabled={rail}>
                  <button type="button" onClick={handleLogout} className="sidebar-link sidebar-link--danger">
                    <Icon name="logout" />
                    <span className="sidebar-label">Logout</span>
                  </button>
                </RailTooltip>
              </>
            ) : (
              !loading && (
                <RailTooltip label={loginRoute.name} enabled={rail}>
                  <Link
                    to={loginRoute.path}
                    onClick={onMobileClose}
                    className="sidebar-link sidebar-link--cta"
                  >
                    <Icon name="login" />
                    <span className="sidebar-label">{loginRoute.name}</span>
                  </Link>
                </RailTooltip>
              )
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
