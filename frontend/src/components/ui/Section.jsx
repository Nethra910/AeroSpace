function Section({
  number,
  eyebrow,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section className={`px-6 py-24 text-ink ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {number} / {eyebrow}
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-[0.98] md:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
              {description}
            </p>
          )}
          <div className="mt-8 h-px w-20 origin-left bg-signal" />
        </div>
        {children}
      </div>
    </section>
  );
}

export default Section;
