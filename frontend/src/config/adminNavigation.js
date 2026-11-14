// Single source of truth for admin-panel navigation (independent of config/navigation.js).
// `end: true` stops a parent route from also highlighting on its nested child route.

export const adminHomeRoute = "/admin/dashboard";
export const adminLoginRoute = "/admin/login";
export const publicSiteRoute = "/";

export const adminNavGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" }],
  },
  {
    label: "Content",
    items: [
      { name: "News Management", path: "/admin/news", icon: "newspaper" },
      { name: "Home Management", path: "/admin/home", icon: "home" },
      { name: "Mission Management", path: "/admin/mission", icon: "target" },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Team Management", path: "/admin/team", icon: "users" },
      { name: "Board Members", path: "/admin/board-members", icon: "briefcase" },
    ],
  },
  {
    label: "Research",
    items: [
      { name: "Research Paper Management", path: "/admin/research-papers", icon: "flask", end: true },
      { name: "Publish Paper", path: "/admin/research-papers/publish", icon: "upload" },
    ],
  },
];
