import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function MainLayout() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

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
    <div className="flex min-h-screen flex-col bg-space-950">
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      <Header />

      <main className="site-main flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
