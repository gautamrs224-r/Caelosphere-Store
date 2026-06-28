export default function Loader({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' }
  return (
    <div
      className={`${sizes[size]} rounded-full border-aurora-purple/20 border-t-aurora-purple animate-spin ${className}`}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/[0.04]" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-white/[0.06] rounded" />
        <div className="h-4 w-2/3 bg-white/[0.08] rounded" />
        <div className="h-5 w-1/4 bg-white/[0.08] rounded" />
      </div>
    </div>
  )
}
