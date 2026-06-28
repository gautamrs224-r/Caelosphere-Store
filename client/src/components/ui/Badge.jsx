const styles = {
  bestseller: 'bg-gradient-premium text-white',
  new: 'bg-warning text-deep-space',
  trending: 'bg-royal-blue text-white',
  sale: 'bg-success text-deep-space',
  default: 'bg-white/10 text-soft-silver',
}

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`badge ${styles[variant] || styles.default} ${className}`}>
      {children}
    </span>
  )
}
