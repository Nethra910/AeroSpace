function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-lg font-bold text-white">MANI Aerospace</h2>

        <p className="mt-3 text-sm">
          Advancing aerospace innovation through technology and research.
        </p>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm">
          © {new Date().getFullYear()} MANI Aerospace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
