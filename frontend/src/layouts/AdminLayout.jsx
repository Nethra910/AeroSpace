import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopBar from "../components/admin/AdminTopBar";
import { useSidebarState } from "../hooks/useSidebarState";

// Shared shell for every authenticated admin page. Page content renders unchanged in <Outlet />.
function AdminLayout() {
  const { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile } = useSidebarState(
    "aerospace.admin.sidebar.collapsed",
  );

  return (
    <div className="app-shell admin-shell flex min-h-screen flex-col bg-space-950" data-collapsed={collapsed}>
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />
      <AdminTopBar open={mobileOpen} onMenuClick={openMobile} />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
