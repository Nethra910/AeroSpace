// Single source of truth for site navigation.
// `icon` values map to glyphs in components/ui/Icon.jsx.

export const primaryNav = [
  { name: "Home", path: "/", icon: "home" },
  { name: "Mission", path: "/mission", icon: "target" },
  { name: "Vision 2036", path: "/vision-2036", icon: "eye" },
  { name: "Team SIMHA", path: "/team-simha", icon: "users" },
  { name: "Directors", path: "/directors", icon: "briefcase" },
  { name: "Parent Company", path: "/parent-company", icon: "building" },
  { name: "Research Organisation", path: "/research", icon: "flask" },
  { name: "News", path: "/news", icon: "newspaper" },
  { name: "Published Papers", path: "/published-papers", icon: "fileText" },
  { name: "Live Simulation", path: "/simulation", icon: "orbit" },
];

// Shown only when a user is signed in.
export const accountNav = [
  { name: "Submit Paper", path: "/submit-research-paper", icon: "upload" },
  { name: "My Submissions", path: "/my-submissions", icon: "folder" },
];

export const profileRoute = { name: "Profile", path: "/profile" };
export const loginRoute = { name: "Login", path: "/login" };
