import useInView from "./useInView";

function Reveal({
  children,
  as: Component = "div",
  className = "",
  variant = "fade-up",
  delay = 0,
  once = true,
  rootMargin = "0px",
  threshold = 0.12,
  ...props
}) {
  const [ref, isInView] = useInView({ once, rootMargin, threshold });

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${variant} ${isInView ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Reveal;
