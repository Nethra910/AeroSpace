import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MobileTopBar from "../components/layout/MobileTopBar";
import Footer from "../components/layout/Footer";
import { useSidebarState } from "../hooks/useSidebarState";

function MainLayout() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile } = useSidebarState(
    "aerospace.sidebar.collapsed",
  );

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
