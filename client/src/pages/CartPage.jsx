import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiTag,
  FiArrowLeft,
  FiLock,
  FiDownload,
  FiShield,
  FiUsers,
} from 'react-icons/fi'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useCart } from '../context/CartContext'

const categoryThumbBg = {
  'ui-kits': 'from-[#1a1030] to-[#0b1023]',
  'landing-pages': 'from-[#e9e6fb] to-[#cfd9f7]',
  templates: 'from-[#e9e6fb] to-[#cfd9f7]',
  'react-components': 'from-[#1a1030] to-[#0b1023]',
  'icon-packs': 'from-[#1a1030] to-[#0b1023]',
  'design-systems': 'from-[#1a1030] to-[#0b1023]',
}

export default function CartPage() {
  const { items, syncing, updateQuantity, removeFromCart, clearCart, subtotal, discount, taxes, total } =
    useCart()
  const [coupon, setCoupon] = useState('')
  const [actionError, setActionError] = useState(null)

  const runAction = async (fn) => {
    setActionError(null)
    try {
      await fn()
    } catch (err) {
      setActionError(err.message)
    }
  }

  if (syncing) {
    return (
      <div className="container-page py-24 text-center text-slate-gray">
        Syncing your cart…
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-aurora-purple/10 flex items-center justify-center mx-auto">
          <FiShoppingCart className="text-aurora-purple text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-heading-white mt-6">Your cart is empty</h1>
        <p className="text-slate-gray mt-2">Browse the marketplace and add something you love.</p>
        <Button as={Link} to="/marketplace" className="mt-6">
          Explore Marketplace
        </Button>
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <div className="text-sm text-cool-gray mb-3">
        Home <span className="mx-1">›</span> <span className="text-soft-silver">Cart</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-aurora-purple/15 flex items-center justify-center text-aurora-purple">
          <FiShoppingCart />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-heading-white">Your Cart</h1>
          <p className="text-sm text-slate-gray">Review your items and proceed to checkout</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-8">
        <div className="glass-card divide-y divide-white/[0.06] p-2">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-5 p-4">
              <div
                className={`relative w-24 h-20 rounded-lg overflow-hidden shrink-0 ${
                  !item.thumbnail ? `bg-gradient-to-br ${categoryThumbBg[item.category]}` : ''
                }`}
              >
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-heading-white">{item.title}</h3>
                  {item.badge && (
                    <Badge variant={item.badge} className="capitalize !text-[10px] !py-0.5">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-gray mt-1">{item.categoryLabel}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-semibold text-heading-white">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-cool-gray line-through">${item.originalPrice}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => item.quantity > 1 && runAction(() => updateQuantity(item.id, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center text-cool-gray hover:text-heading-white disabled:opacity-30"
                >
                  <FiMinus size={13} />
                </button>
                <span className="w-6 text-center text-sm text-heading-white">{item.quantity}</span>
                <button
                  onClick={() => runAction(() => updateQuantity(item.id, item.quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center text-cool-gray hover:text-heading-white"
                >
                  <FiPlus size={13} />
                </button>
              </div>
              <div className="font-semibold text-heading-white w-16 text-right">
                ${(item.price * item.quantity).toFixed(0)}
              </div>
              <button
                onClick={() => runAction(() => removeFromCart(item.id))}
                className="p-2 text-cool-gray hover:text-error transition-colors"
                aria-label="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}

          {actionError && (
            <p className="px-4 py-2 text-xs text-error">{actionError}</p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-2 flex-1 w-full">
              <div className="relative flex-1">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-cool-gray" size={14} />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="input-field pl-9 !py-2.5 text-sm"
                />
              </div>
              <Button variant="secondary" className="!px-5 !py-2.5 text-sm whitespace-nowrap">
                Apply
              </Button>
            </div>
            <button
              onClick={() => runAction(clearCart)}
              className="flex items-center gap-2 text-sm text-cool-gray hover:text-error transition-colors whitespace-nowrap"
            >
              <FiTrash2 size={14} /> Clear Cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="glass-card-elevated p-6 h-fit space-y-5">
          <h3 className="font-heading font-semibold text-heading-white">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <Row label={`Subtotal (${items.reduce((s, i) => s + i.quantity, 0)} items)`} value={`$${subtotal.toFixed(2)}`} />
            <Row label="Discount" value={`-$${discount.toFixed(2)}`} valueClass="text-success" />
            <Row label="Taxes" value={`$${taxes.toFixed(2)}`} />
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
            <span className="font-semibold text-heading-white">Total</span>
            <span className="text-2xl font-bold text-heading-white">${total.toFixed(2)}</span>
          </div>
          <Button as={Link} to="/checkout" className="w-full">
            <FiLock /> Proceed to Checkout
          </Button>
          <Button as={Link} to="/marketplace" variant="secondary" className="w-full">
            <FiArrowLeft /> Continue Shopping
          </Button>

          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            {[
              { icon: FiShield, title: 'Secure Checkout', desc: 'Your payment information is 100% secure' },
              { icon: FiDownload, title: 'Instant Download', desc: 'Access your files immediately' },
              { icon: FiUsers, title: 'Trusted by Developers', desc: 'Join 10,000+ happy customers' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <f.icon className="text-aurora-purple shrink-0 mt-0.5" size={15} />
                <div>
                  <div className="text-sm font-medium text-heading-white">{f.title}</div>
                  <div className="text-xs text-cool-gray">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, valueClass = 'text-heading-white' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-gray">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}
