import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Collapse (desktop, persisted per `storageKey`) and drawer (mobile) state for a sidebar layout.
export function useSidebarState(storageKey) {
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });

  // The drawer is tied to the path it was opened on, so any navigation closes it.
  const [drawerPath, setDrawerPath] = useState(null);
  const mobileOpen = drawerPath === pathname;
  const openMobile = useCallback(() => setDrawerPath(pathname), [pathname]);
  const closeMobile = useCallback(() => setDrawerPath(null), []);
  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(collapsed));
    } catch {
      /* storage unavailable: preference just won't persist */
    }
  }, [collapsed, storageKey]);

  return { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile };
}
