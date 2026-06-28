import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiChevronDown, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { categories } from '../../services/categoryConfig'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'All Products', to: '/marketplace' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/marketplace?search=${encodeURIComponent(search.trim())}`)
    setMobileOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-deep-space/80 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between h-20 gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-7 shrink-0">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-aurora-purple' : 'text-soft-silver hover:text-heading-white'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-aurora-purple' : 'text-soft-silver hover:text-heading-white'
              }`
            }
          >
            Marketplace
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-soft-silver hover:text-heading-white transition-colors whitespace-nowrap">
              Categories <FiChevronDown className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            {categoriesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56">
                <div className="glass-card-elevated p-2 shadow-glow-purple">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/marketplace?category=${cat.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-soft-silver hover:bg-white/[0.05] hover:text-heading-white transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/marketplace"
            className="text-sm font-medium text-soft-silver hover:text-heading-white transition-colors whitespace-nowrap"
          >
            All Products
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-soft-silver hover:text-heading-white transition-colors whitespace-nowrap"
          >
            Contact
          </Link>
        </nav>

        {/* Search (desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 min-w-0 max-w-xs">
          <FiSearch className="absolute left-4 text-cool-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm
                       text-heading-white placeholder:text-cool-gray focus:border-aurora-purple/60 focus:outline-none transition-colors"
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors"
            aria-label="View cart"
          >
            <FiShoppingCart className="text-xl text-soft-silver" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[11px] font-bold rounded-full bg-gradient-premium text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors">
                <span className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm text-soft-silver whitespace-nowrap">{user.name}</span>
                <FiChevronDown className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} size={14} />
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 pt-3 w-48">
                  <div className="glass-card-elevated p-2 shadow-glow-purple">
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-soft-silver hover:bg-white/[0.05] hover:text-heading-white transition-colors"
                    >
                      <FiPackage size={15} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-soft-silver hover:bg-white/[0.05] hover:text-heading-white transition-colors"
                      >
                        <FiSettings size={15} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-soft-silver hover:bg-white/[0.05] hover:text-error transition-colors"
                    >
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button as={Link} to="/login" variant="secondary" className="hidden sm:flex !px-5 !py-2.5 text-sm whitespace-nowrap">
                Sign In
              </Button>
              <Button as={Link} to="/register" className="hidden sm:flex !px-5 !py-2.5 text-sm whitespace-nowrap">
                Get Started
              </Button>
            </>
          )}

          <button
            className="xl:hidden p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-white/[0.06] bg-deep-space px-6 py-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cool-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-heading-white placeholder:text-cool-gray focus:outline-none"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-soft-silver hover:text-heading-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-3">
            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-soft-silver"
                >
                  <FiPackage size={15} /> My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-soft-silver"
                  >
                    <FiSettings size={15} /> Admin Panel
                  </Link>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleLogout()
                    setMobileOpen(false)
                  }}
                >
                  <FiLogOut /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Button>
                <Button as={Link} to="/register" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
