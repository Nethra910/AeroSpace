function Skeleton({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse bg-white/10 ${className}`}
    />
  );
}

export default Skeleton;
