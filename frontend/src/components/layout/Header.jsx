import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Mission", path: "/mission" },
  { name: "Vision 2036", path: "/vision-2036" },
  { name: "Team SIMHA", path: "/team-simha" },
  { name: "Directors", path: "/directors" },
  { name: "Parent Company", path: "/parent-company" },
  { name: "Research", path: "/research" },
  { name: "News", path: "/news" },
  { name: "Published Papers", path: "/published-papers" },
  { name: "Live Simulation", path: "/simulation" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `text-sm transition hover:text-cyan-400 ${
      isActive ? "text-cyan-400" : "text-slate-300"
    }`;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const userActions = (
    <div className="flex items-center gap-3">
      {!loading && user ? (
        <>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src={user.profile_image}
              alt={user.name}
              className="h-9 w-9 rounded-full border border-cyan-400 object-cover"
            />
            <span className="max-w-28 truncate text-sm text-white hover:text-cyan-400">
              {user.name}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-400"
          >
            Logout
          </button>
        </>
      ) : !loading ? (
        <Link
          to="/login"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Login
        </Link>
      ) : null}
    </div>
  );

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

        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} className={navClass}>
              {item.name}
            </NavLink>
          ))}

          {!loading && user && (
            <>
              <NavLink
                to="/submit-research-paper"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Submit Paper
              </NavLink>

              <NavLink
                to="/my-submissions"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                My Submissions
              </NavLink>
            </>
          )}

          {userActions}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-2xl text-cyan-400 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

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

            {!loading && user && (
              <NavLink
                to="/submit-research-paper"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Submit Paper
              </NavLink>
            )}

            {userActions}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
