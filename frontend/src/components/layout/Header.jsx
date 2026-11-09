import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Mission", path: "/mission" },
  { name: "Vision 2036", path: "/vision-2036" },
  { name: "Team SIMHA", path: "/team-simha" },
  { name: "Directors", path: "/directors" },
  { name: "Parent Company", path: "/parent-company" },
  { name: "Projects", path: "/projects" },
  { name: "Research", path: "/research" },
  { name: "News", path: "/news" },
  { name: "Published Papers", path: "/published-papers" },
  { name: "Live Simulation", path: "/simulation" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `text-sm transition hover:text-cyan-400 ${
      isActive ? "text-cyan-400" : "text-slate-300"
    }`;

  return (
    <header className="border-b border-white/10 bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="text-xl font-bold tracking-wider"
          onClick={() => setMenuOpen(false)}
        >
          MANI <span className="text-cyan-400">AEROSPACE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} className={navClass}>
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-2xl text-cyan-400 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-5">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
