import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi'
import * as productService from '../../services/productService'
import * as orderService from '../../services/orderService'
import * as authService from '../../services/authService'
import Badge from '../../components/ui/Badge'

const statusVariant = {
  pending: 'default',
  paid: 'bestseller',
  fulfilled: 'sale',
  cancelled: 'default',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      productService.getProducts({ limit: 1 }),
      orderService.getAllOrders(),
      authService.getAllUsers(),
    ])
      .then(([productData, orders, users]) => {
        if (cancelled) return
        const revenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0)

        setStats({
          productCount: productData.total,
          orderCount: orders.length,
          userCount: users.length,
          revenue,
        })
        setRecentOrders(orders.slice(0, 5))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-heading-white">Dashboard</h1>
      <p className="text-slate-gray mt-2">An overview of your store</p>

      {error && (
        <div className="glass-card p-6 mt-8 border border-error/30 text-error text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-gray">Loading dashboard…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            <StatCard icon={FiDollarSign} label="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} color="#22C55E" />
            <StatCard icon={FiShoppingBag} label="Orders" value={stats.orderCount} color="#8B5CF6" />
            <StatCard icon={FiBox} label="Products" value={stats.productCount} color="#3B82F6" />
            <StatCard icon={FiUsers} label="Users" value={stats.userCount} color="#06B6D4" />
          </div>

          <div className="glass-card p-6 mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-heading-white">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-aurora-purple hover:underline flex items-center gap-1">
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-gray text-center py-8">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.06] last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-heading-white truncate">
                        #{order._id.slice(-8).toUpperCase()} · {order.userId?.name || 'Unknown user'}
                      </p>
                      <p className="text-xs text-cool-gray mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-heading-white">${order.total.toFixed(2)}</span>
                      <Badge variant={statusVariant[order.status] || 'default'} className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-6">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon size={18} />
      </div>
      <p className="text-2xl font-heading font-bold text-heading-white">{value}</p>
      <p className="text-sm text-slate-gray mt-1">{label}</p>
    </div>
  )
}
