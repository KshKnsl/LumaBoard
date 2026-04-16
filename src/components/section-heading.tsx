export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-(--font-heading) text-3xl tracking-[-0.04em]">
        {title}
      </h2>
      <p className="mt-2 max-w-[60ch] text-sm leading-6 text-(--text-secondary)">
        {description}
      </p>
    </div>
  );
}
