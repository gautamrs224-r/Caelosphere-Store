import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiLock, FiCheckCircle, FiCreditCard, FiAlertCircle } from 'react-icons/fi'
import { FaPaypal, FaStripe } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import * as orderService from '../services/orderService'

const steps = ['Information', 'Payment', 'Review']

const categoryThumbBg = {
  'ui-kits': 'from-[#1a1030] to-[#0b1023]',
  'landing-pages': 'from-[#e9e6fb] to-[#cfd9f7]',
  templates: 'from-[#e9e6fb] to-[#cfd9f7]',
  'react-components': 'from-[#1a1030] to-[#0b1023]',
  'icon-packs': 'from-[#1a1030] to-[#0b1023]',
  'design-systems': 'from-[#1a1030] to-[#0b1023]',
}

export default function CheckoutPage() {
  const { items, subtotal, discount, taxes, total, refreshCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [placing, setPlacing] = useState(false)
  const [placeError, setPlaceError] = useState(null)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: user?.email || '', fullName: user?.name || '', country: 'United States' },
  })

  if (authLoading) {
    return <div className="container-page py-24 text-center text-slate-gray">Loading…</div>
  }

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-aurora-purple/10 flex items-center justify-center mx-auto">
          <FiLock className="text-aurora-purple text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-heading-white mt-6">Sign in to check out</h1>
        <p className="text-slate-gray mt-2">Your cart will carry over automatically once you sign in.</p>
        <Button as={Link} to="/login" className="mt-6">
          Sign In
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-heading-white">Nothing to check out yet</h1>
        <p className="text-slate-gray mt-2">Add a product to your cart first.</p>
        <Button as={Link} to="/marketplace" className="mt-6">
          Explore Marketplace
        </Button>
      </div>
    )
  }

  const onSubmit = async (formData) => {
    setPlacing(true)
    setPlaceError(null)
    try {
      const { email, fullName, company, address, city, state, zip, country, phone } = formData
      await orderService.createOrder({
        billingInfo: { email, fullName, company, address, city, state, zip, country, phone },
        paymentMethod,
      })
      await refreshCart()
      navigate('/', { state: { orderPlaced: true } })
    } catch (err) {
      setPlaceError(err.message)
      setPlacing(false)
    }
  }

  return (
    <div className="container-page py-10">
      <div className="text-sm text-cool-gray mb-3">
        Home <span className="mx-1">›</span> Cart <span className="mx-1">›</span>{' '}
        <span className="text-soft-silver">Checkout</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-aurora-purple/15 flex items-center justify-center text-aurora-purple">
            <FiLock />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-heading-white">Checkout</h1>
            <p className="text-sm text-slate-gray">Complete your purchase by providing your details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i === 0 ? 'bg-aurora-purple text-white' : 'bg-white/[0.06] text-cool-gray'
                }`}
              >
                {i + 1}
              </span>
              <span className={`text-sm hidden sm:inline ${i === 0 ? 'text-heading-white' : 'text-cool-gray'}`}>
                {step}
              </span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-white/10 hidden sm:inline" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-heading-white">Contact Information</h3>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email && 'Email is required'}
              {...register('email', { required: true })}
            />
            <label className="flex items-center gap-2.5 text-sm text-slate-gray cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-aurora-purple w-4 h-4 rounded" />
              Send me product updates and exclusive offers
            </label>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-heading-white">Billing Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="Jane Doe" {...register('fullName', { required: true })} />
              <Input label="Company (Optional)" placeholder="Acme Inc." {...register('company')} />
            </div>
            <Input label="Address" placeholder="221B Baker Street" {...register('address', { required: true })} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="City" placeholder="London" {...register('city', { required: true })} />
              <Input label="State / Province" placeholder="Greater London" {...register('state')} />
              <Input label="ZIP / Postal Code" placeholder="NW1 6XE" {...register('zip', { required: true })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-soft-silver">Country</label>
                <select className="input-field" {...register('country')}>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>
              <Input label="Phone Number" placeholder="+1 555 123 4567" {...register('phone')} />
            </div>
          </div>

          <div className="glass-card p-6 space-y-3">
            <h3 className="font-heading font-semibold text-heading-white">Payment Method</h3>
            <p className="text-xs text-cool-gray flex items-center gap-1.5 mb-2">
              <FiLock size={12} /> All transactions are secure and encrypted.
            </p>
            {[
              { id: 'card', label: 'Credit / Debit Card', desc: 'Pay securely using your card', icon: FiCreditCard },
              { id: 'paypal', label: 'PayPal', desc: 'Pay easily with your PayPal account', icon: FaPaypal },
              { id: 'stripe', label: 'Stripe', desc: 'Pay securely using Stripe', icon: FaStripe },
            ].map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === m.id ? 'border-aurora-purple/50 bg-aurora-purple/5' : 'border-white/10'
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id)}
                  className="accent-aurora-purple w-4 h-4"
                />
                <m.icon className="text-xl text-soft-silver" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-heading-white">{m.label}</div>
                  <div className="text-xs text-cool-gray">{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="glass-card-elevated p-6 h-fit space-y-5 sticky top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-heading-white">Order Summary</h3>
            <Link to="/cart" className="text-xs text-aurora-purple hover:underline">
              Edit Cart
            </Link>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className={`relative w-12 h-10 rounded-lg overflow-hidden shrink-0 ${
                    !item.thumbnail ? `bg-gradient-to-br ${categoryThumbBg[item.category]}` : ''
                  }`}
                >
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-aurora-purple text-white text-[10px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-heading-white truncate">{item.title}</p>
                  <p className="text-xs text-cool-gray">{item.categoryLabel}</p>
                </div>
                <span className="text-sm font-medium text-heading-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-4 space-y-3 text-sm">
            <Row label={`Subtotal (${items.reduce((s, i) => s + i.quantity, 0)} items)`} value={`$${subtotal.toFixed(2)}`} />
            <Row label="Discount" value={`-$${discount.toFixed(2)}`} valueClass="text-success" />
            <Row label="Taxes" value={`$${taxes.toFixed(2)}`} />
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
            <span className="font-semibold text-heading-white">Total</span>
            <span className="text-2xl font-bold text-heading-white">USD ${total.toFixed(2)}</span>
          </div>

          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            {[
              { title: 'Secure Checkout', desc: 'Your payment information is 100% secure' },
              { title: 'Instant Download', desc: 'Access your files immediately after purchase' },
              { title: '30-Day Money Back', desc: 'Not satisfied? Get a full refund within 30 days' },
              { title: '24/7 Support', desc: "We're here to help you anytime" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <FiCheckCircle className="text-success shrink-0 mt-0.5" size={15} />
                <div>
                  <div className="text-sm font-medium text-heading-white">{f.title}</div>
                  <div className="text-xs text-cool-gray">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {placeError && (
            <p className="flex items-start gap-2 text-xs text-error">
              <FiAlertCircle className="shrink-0 mt-0.5" /> {placeError}
            </p>
          )}

          <Button type="submit" disabled={placing} className="w-full">
            <FiLock /> {placing ? 'Placing Order…' : 'Place Order'}
          </Button>
          <p className="text-center text-xs text-cool-gray flex items-center justify-center gap-1.5">
            <FiLock size={11} /> SSL encrypted and secure checkout
          </p>
        </div>
      </form>
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
