import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
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
            <Link
              key={item.path}
              to={item.path}
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
