import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiChevronRight, FiLock } from 'react-icons/fi'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import * as orderService from '../services/orderService'

const statusVariant = {
  pending: 'default',
  paid: 'bestseller',
  fulfilled: 'sale',
  cancelled: 'default',
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading) {
    return <div className="container-page py-24 text-center text-slate-gray">Loading…</div>
  }

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-aurora-purple/10 flex items-center justify-center mx-auto">
          <FiLock className="text-aurora-purple text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-heading-white mt-6">Sign in to view your orders</h1>
        <Button as={Link} to="/login" className="mt-6">
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <div className="text-sm text-cool-gray mb-3">
        Home <span className="mx-1">›</span> <span className="text-soft-silver">My Orders</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-aurora-purple/15 flex items-center justify-center text-aurora-purple">
          <FiPackage />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-heading-white">My Orders</h1>
          <p className="text-sm text-slate-gray">Your order history and downloads</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-gray">Loading your orders…</div>
      ) : error ? (
        <div className="glass-card p-6 mt-8 border border-error/30 text-error text-sm">{error}</div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-14 text-center mt-8">
          <p className="text-heading-white font-medium">No orders yet</p>
          <p className="text-sm text-slate-gray mt-2">Once you check out, your orders will show up here.</p>
          <Button as={Link} to="/marketplace" className="mt-6">
            Explore Marketplace
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-cool-gray">
                    Order #{order._id.slice(-8).toUpperCase()} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="font-heading font-semibold text-heading-white mt-1">
                    ${order.total.toFixed(2)} · {order.products.length} item
                    {order.products.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Badge variant={statusVariant[order.status] || 'default'} className="capitalize">
                  {order.status}
                </Badge>
              </div>

              <div className="border-t border-white/[0.06] mt-4 pt-4 space-y-2">
                {order.products.map((item) => (
                  <div key={item.product} className="flex items-center justify-between text-sm">
                    <span className="text-soft-silver flex items-center gap-2">
                      {item.title} <span className="text-cool-gray">× {item.quantity}</span>
                    </span>
                    <span className="text-heading-white font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
