function Footer() {
  return (
    <footer className="site-footer border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-mono text-sm font-semibold tracking-[0.18em] text-white">MANI / AEROSPACE</p>
          <p className="mt-5 max-w-sm text-sm leading-7">Advancing aerospace innovation through technology and research.</p>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-slate-500">REV 2036 · SYSTEM ONLINE</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Explore</p>
          <div className="mt-5 grid gap-3 text-sm">
            <a href="/mission">Mission</a><a href="/vision-2036">Vision 2036</a><a href="/team-simha">Team SIMHA</a><a href="/research">Research</a>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Connect</p>
          <div className="mt-5 grid gap-3 text-sm">
            <a href="/news">News</a><a href="/published-papers">Published Papers</a><a href="/simulation">Live Simulation</a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/10 px-6 py-5 font-mono text-xs text-slate-500">
        <span>© {new Date().getFullYear()} MANI Aerospace. All rights reserved.</span><span>EARTH / ORBIT / BEYOND</span>
      </div>
    </footer>
  );
}

export default Footer;
