import Icon from "../ui/Icon";
import AdminBrand from "./AdminBrand";

// Slim bar shown below the lg breakpoint so the admin drawer can be opened.
function AdminTopBar({ open, onMenuClick }) {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-space-950/90 px-4 backdrop-blur lg:hidden">
      <AdminBrand />
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/10 text-signal"
        aria-label="Open admin menu"
        aria-expanded={open}
        aria-controls="admin-sidebar"
      >
        <Icon name="menu" />
      </button>
    </div>
  );
}

export default AdminTopBar;
