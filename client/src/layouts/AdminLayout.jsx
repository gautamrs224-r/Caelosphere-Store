import { Link, NavLink, Outlet, Navigate } from 'react-router-dom'
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiArrowLeft,
  FiLock,
} from 'react-icons/fi'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: FiGrid, end: true },
  { label: 'Products', to: '/admin/products', icon: FiBox },
  { label: 'Orders', to: '/admin/orders', icon: FiShoppingBag },
  { label: 'Users', to: '/admin/users', icon: FiUsers },
]

export default function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-gray">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto">
            <FiLock className="text-error text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-heading-white mt-6">Admin access required</h1>
          <p className="text-slate-gray mt-2">Your account doesn't have permission to view this page.</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 text-aurora-purple hover:underline">
            <FiArrowLeft /> Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-deep-space">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/[0.06] bg-midnight-navy/60 shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
          <Logo />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-aurora-purple/15 text-aurora-purple'
                    : 'text-slate-gray hover:bg-white/[0.04] hover:text-heading-white'
                }`
              }
            >
              <item.icon size={16} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-gray hover:bg-white/[0.04] hover:text-heading-white transition-colors"
          >
            <FiArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-16 flex items-center justify-between px-4 border-b border-white/[0.06] bg-deep-space/90 backdrop-blur-xl">
        <Logo />
        <Link to="/" className="text-sm text-slate-gray flex items-center gap-1.5">
          <FiArrowLeft size={14} /> Store
        </Link>
      </div>

      <div className="flex-1 min-w-0">
        {/* Mobile nav tabs */}
        <nav className="md:hidden fixed top-16 inset-x-0 z-30 flex overflow-x-auto border-b border-white/[0.06] bg-deep-space px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive ? 'text-aurora-purple border-aurora-purple' : 'text-slate-gray border-transparent'
                }`
              }
            >
              <item.icon size={14} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="pt-16 md:pt-0 mt-12 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
