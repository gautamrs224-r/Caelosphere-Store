export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="badge border border-aurora-purple/30 bg-aurora-purple/10 text-aurora-purple">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-balance max-w-2xl">
          {title}{' '}
          {highlight && <span className="text-gradient-marketplace">{highlight}</span>}
        </h2>
      )}
      {subtitle && (
        <p className="text-slate-gray max-w-xl text-base md:text-lg">{subtitle}</p>
      )}
    </div>
  )
}
