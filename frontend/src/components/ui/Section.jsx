import PageHeader from "./PageHeader";

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
        <PageHeader number={number} eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </section>
  );
}

export default Section;
