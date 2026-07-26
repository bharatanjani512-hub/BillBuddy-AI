function PageHeader({
  badge,
  title,
  description,
}) {
  return (
    <div className="mb-5">
      {badge && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary-light)]">
          {badge}
        </p>
      )}

      <h1 className="text-5xl font-bold leading-tight tracking-tight text-white lg:text-[3.2rem]">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default PageHeader;