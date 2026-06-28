import { Link, Outlet } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Logo from '../components/ui/Logo'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="w-full border-b border-white/[0.04]">
        <div className="container-page w-full flex items-center h-20">
          <div className="flex-1 flex justify-start">
            <Logo />
          </div>
          <Link
            to="/"
            className="flex-1 flex items-center justify-end gap-2 text-sm font-medium text-soft-silver hover:text-heading-white transition-colors whitespace-nowrap"
          >
            <FiArrowLeft /> Back to Store
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
