import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MobileTopBar from "../components/layout/MobileTopBar";
import Footer from "../components/layout/Footer";

const COLLAPSED_KEY = "aerospace.sidebar.collapsed";

function MainLayout() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  // Desktop: expanded by default, preference remembered between visits.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Mobile drawer: tied to the path it was opened on, so any navigation closes it.
  const [drawerPath, setDrawerPath] = useState(null);
  const mobileOpen = drawerPath === location.pathname;
  const openMobile = () => setDrawerPath(location.pathname);
  const closeMobile = useCallback(() => setDrawerPath(null), []);
  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    } catch {
      /* storage unavailable: preference just won't persist */
    }
  }, [collapsed]);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [location.pathname]);

  return (
    <div className="app-shell flex min-h-screen flex-col bg-space-950" data-collapsed={collapsed}>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />

      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />
      <MobileTopBar open={mobileOpen} onMenuClick={openMobile} />

      <main className="site-main flex-1">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
