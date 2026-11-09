import { Link, NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Mission", path: "/mission" },
  { name: "Vision 2036", path: "/vision-2036" },
  { name: "Projects", path: "/projects" },
  { name: "Research", path: "/research" },
  { name: "News", path: "/news" },
];

function Header() {
  return (
    <header className="border-b border-white/10 bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-xl font-bold tracking-wider">
          MANI <span className="text-cyan-400">AEROSPACE</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm transition hover:text-cyan-400 ${
                  isActive ? "text-cyan-400" : "text-slate-300"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
