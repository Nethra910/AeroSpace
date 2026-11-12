function Panel({ children, className = "" }) {
  return (
    <div className={`border border-white/10 bg-space-800 p-6 ${className}`}>
      {children}
    </div>
  );
}

export default Panel;
