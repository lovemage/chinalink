export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <header className="border-b border-brand-rule">
      <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-10 sm:px-6 lg:pb-10 lg:pt-14">
        <h1 className="font-serif text-[2rem] font-bold leading-tight text-brand-text text-balance sm:text-[2.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-8 text-brand-muted">{description}</p>
        )}
        {children}
      </div>
    </header>
  )
}
