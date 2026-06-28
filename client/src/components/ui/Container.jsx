export default function Container({ className = '', children, as: Component = 'div' }) {
  return <Component className={`container-page ${className}`}>{children}</Component>
}
