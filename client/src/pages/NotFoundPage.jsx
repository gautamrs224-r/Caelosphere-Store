import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="container-page py-32 text-center">
      <h1 className="text-7xl font-bold text-gradient-marketplace">404</h1>
      <h2 className="text-2xl font-bold text-heading-white mt-4">Page not found</h2>
      <p className="text-slate-gray mt-2">The page you're looking for doesn't exist or has moved.</p>
      <Button as={Link} to="/" className="mt-8">
        <FiArrowLeft /> Back to Home
      </Button>
    </div>
  )
}
