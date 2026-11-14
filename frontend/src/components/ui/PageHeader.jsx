// Page title block (eyebrow, h1, description, rule). Shared by Section and the app-style pages
// so every page title uses the same type scale and spacing.
function PageHeader({ number, eyebrow, title, description, className = "" }) {
  return (
    <div className={`mb-14 max-w-4xl ${className}`}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        {number ? `${number} / ` : ""}
        {eyebrow}
      </p>
      <h1 className="mt-5 text-5xl font-bold leading-[0.98] md:text-7xl">{title}</h1>
      {description && (
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">{description}</p>
      )}
      <div className="mt-8 h-px w-20 origin-left bg-signal" />
    </div>
  );
}

export default PageHeader;
