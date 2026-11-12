function Badge({ children, tone = "neutral" }) {
  const toneClass = {
    neutral: "border-white/15 text-muted",
    signal: "border-signal/40 text-signal",
    warm: "border-warm/40 text-warm",
    success: "border-success/40 text-success",
    danger: "border-danger/40 text-danger",
  }[tone];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-xs uppercase tracking-wider ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default Badge;
