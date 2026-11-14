function NotFound() {
  return (
    <div className="page-grid flex min-h-[70vh] items-center justify-center px-6 text-center">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#f0a35b]">
          Signal lost / 404
        </p>
        <h1 className="mt-6 text-6xl font-bold tracking-tight text-white md:text-8xl">
          Off trajectory.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          The requested coordinate does not exist in this mission.
        </p>
        <a
          href="/"
          className="mt-8 inline-block border border-signal px-5 py-3 text-sm text-signal"
        >
          Return to base ↗
        </a>
      </div>
    </div>
  );
}

export default NotFound;
