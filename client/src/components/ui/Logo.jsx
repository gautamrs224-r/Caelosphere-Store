import { Link } from 'react-router-dom'
import planet from '../../assets/Logo.png'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group shrink-0 ${className}`}>
      <img
        src={planet}
        alt="Caelosphere"
        className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform duration-300"
      />
      <span className="font-heading font-semibold text-xl leading-tight text-heading-white whitespace-nowrap">
        Caelosphere
        <span className="block text-aurora-purple -mt-1">Store</span>
      </span>
    </Link>
  )
}
