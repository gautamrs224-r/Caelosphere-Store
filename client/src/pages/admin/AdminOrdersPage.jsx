import { useState, useEffect } from 'react'
import { FiShoppingBag, FiChevronDown } from 'react-icons/fi'
import * as orderService from '../../services/orderService'

const statusOptions = ['pending', 'paid', 'fulfilled', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    orderService
      .getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId)
    setError(null)
    try {
      const updated = await orderService.updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-aurora-purple/15 flex items-center justify-center text-aurora-purple">
          <FiShoppingBag />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-heading-white">Orders</h1>
          <p className="text-sm text-slate-gray">All orders placed in the store</p>
        </div>
      </div>

      {error && (
        <div className="glass-card p-6 mt-6 border border-error/30 text-error text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-gray">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-14 text-center mt-6">
          <p className="text-heading-white font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="glass-card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-cool-gray">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-6 py-4 text-soft-silver font-mono text-xs">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-heading-white">{order.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-cool-gray">{order.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-soft-silver">{order.products.length}</td>
                    <td className="px-6 py-4 text-heading-white font-medium">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-cool-gray">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-soft-silver capitalize cursor-pointer disabled:opacity-50"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cool-gray pointer-events-none" size={12} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
