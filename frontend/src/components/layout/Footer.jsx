import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer border-t border-white/10 bg-space-950 text-muted">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-mono text-sm font-semibold tracking-[0.18em] text-white">MANI / AEROSPACE</p>
          <p className="mt-5 max-w-sm text-sm leading-7">Advancing aerospace innovation through technology and research.</p>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">REV 2036 · ORBITAL RESEARCH</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">Explore</p>
          <div className="mt-5 grid gap-3 text-sm">
            <Link to="/mission">Mission</Link><Link to="/vision-2036">Vision 2036</Link><Link to="/team-simha">Team SIMHA</Link><Link to="/directors">Directors</Link><Link to="/parent-company">Parent Company</Link>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">Connect</p>
          <div className="mt-5 grid gap-3 text-sm">
            <Link to="/research">Research</Link><Link to="/news">News</Link><Link to="/published-papers">Published Papers</Link><Link to="/simulation">Live Simulation</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/10 px-6 py-5 font-mono text-xs text-muted">
        <span>© {new Date().getFullYear()} MANI Aerospace. All rights reserved.</span><span>EARTH / ORBIT / BEYOND</span>
      </div>
    </footer>
  );
}

export default Footer;
