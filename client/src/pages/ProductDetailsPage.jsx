import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiZap,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiDownload,
  FiCheck,
} from 'react-icons/fi'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ProductCard from '../components/product/ProductCard'
import * as productService from '../services/productService'
import { useCart } from '../context/CartContext'

const tabs = ['Description', 'Features', "What's Included", 'Reviews', 'Support']

const categoryThumbBg = {
  'ui-kits': 'from-[#1a1030] to-[#0b1023]',
  'landing-pages': 'from-[#e9e6fb] to-[#cfd9f7]',
  templates: 'from-[#e9e6fb] to-[#cfd9f7]',
  'react-components': 'from-[#1a1030] to-[#0b1023]',
  'icon-packs': 'from-[#1a1030] to-[#0b1023]',
  'design-systems': 'from-[#1a1030] to-[#0b1023]',
}

const reviewBreakdown = [
  { stars: 5, pct: 88, count: 185 },
  { stars: 4, pct: 10, count: 21 },
  { stars: 3, pct: 2, count: 4 },
  { stars: 2, pct: 0, count: 0 },
  { stars: 1, pct: 0, count: 0 },
]

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Description')
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setActiveTab('Description')

    productService
      .getProductBySlug(slug)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
        return productService.getRelatedProducts(slug, 3)
      })
      .then((relatedData) => {
        if (!cancelled && relatedData) setRelated(relatedData)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (notFound) navigate('/marketplace', { replace: true })
  }, [notFound, navigate])

  if (loading) {
    return (
      <div className="container-page py-24 text-center text-slate-gray">
        Loading product…
      </div>
    )
  }

  if (!product) return null

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAdd = async () => {
    if (adding) return
    setAdding(true)
    try {
      await addToCart(product, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    } catch (err) {
      console.error('Failed to add to cart:', err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="container-page py-10">
      <div className="text-sm text-cool-gray mb-6">
        Home <span className="mx-1">›</span> Marketplace <span className="mx-1">›</span>{' '}
        <span className="text-soft-silver">{product.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr_360px] gap-10">
        {/* Hero image */}
        <div className="lg:col-span-2">
          <div
            className={`relative aspect-[16/10] rounded-2xl overflow-hidden ${
              !product.thumbnail ? `bg-gradient-to-br ${categoryThumbBg[product.category]}` : ''
            }`}
          >
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-cool-gray text-sm">
                No image yet
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/[0.06] mt-10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-aurora-purple border-aurora-purple'
                    : 'text-slate-gray border-transparent hover:text-soft-silver'
                }`}
              >
                {tab === 'Reviews' ? `Reviews (${product.reviews})` : tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'Description' && (
              <>
                <p className="text-slate-gray leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8">
                  {Object.entries(product.stats).map(([key, val]) => (
                    <div key={key} className="glass-card p-4 text-center">
                      <div className="font-heading font-bold text-heading-white text-lg">{val}</div>
                      <div className="text-xs text-cool-gray mt-1 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'Features' && (
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-gray">
                    <FiCheck className="text-aurora-purple shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "What's Included" && (
              <ul className="space-y-3">
                {product.tags.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-slate-gray">
                    <FiCheck className="text-aurora-purple shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'Support' && (
              <p className="text-slate-gray leading-relaxed">
                Need help with this product? Our support team responds within 24 hours.
                Reach out via the contact page and we'll take care of you.
              </p>
            )}
            {activeTab === 'Reviews' && (
              <div className="grid md:grid-cols-[280px_1fr] gap-10">
                <div>
                  <div className="text-4xl font-bold text-heading-white">{product.rating}</div>
                  <div className="flex gap-1 text-warning mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className="fill-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-cool-gray mt-1">Based on {product.reviews} reviews</p>
                  <div className="space-y-2 mt-5">
                    {reviewBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-3 text-xs text-cool-gray">
                        <span className="w-10">{r.stars} Stars</span>
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full bg-aurora-purple" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="w-12 text-right">{r.pct}% ({r.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white font-semibold">
                        R
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-heading-white text-sm">Rohit Sharma</span>
                          <Badge variant="bestseller" className="!bg-success/15 !text-success">Verified Buyer</Badge>
                        </div>
                        <div className="flex gap-0.5 text-warning text-xs mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar key={i} className="fill-warning" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-cool-gray">2 days ago</span>
                  </div>
                  <p className="text-sm text-slate-gray mt-4 leading-relaxed">
                    Absolutely stunning! Everything is well organized and easy to customize.
                    Saved me a lot of time on my project. Highly recommended for anyone building fast.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buy box */}
        <div className="glass-card-elevated p-6 h-fit space-y-5 sticky top-24">
          <div>
            {product.badge && (
              <Badge variant={product.badge} className="capitalize mb-3">
                {product.badge}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-heading-white leading-snug">{product.title}</h1>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <FiStar className="text-warning fill-warning" />
              <span className="text-soft-silver font-medium">{product.rating}</span>
              <span className="text-cool-gray">({product.reviews} reviews)</span>
              <span className="text-cool-gray">·</span>
              <span className="text-cool-gray">{product.sales} Sales</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="badge bg-white/[0.05] text-soft-silver">
                {t}
              </span>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-heading-white">${product.price}</span>
              <span className="text-cool-gray line-through text-sm">${product.originalPrice}</span>
              <Badge variant="bestseller">{discountPct}% OFF</Badge>
            </div>
            <p className="text-xs text-cool-gray mt-1">Lifetime Access · Free Updates</p>
          </div>

          <Button onClick={handleAdd} disabled={adding} className="w-full">
            <FiShoppingCart /> {added ? 'Added to Cart!' : adding ? 'Adding…' : 'Add to Cart'}
          </Button>
          <Button as={Link} to="/checkout" variant="secondary" className="w-full">
            Buy Now
          </Button>

          <div className="space-y-3 pt-2">
            {[
              { icon: FiZap, text: 'Instant Download' },
              { icon: FiShield, text: 'Lifetime Access' },
              { icon: FiRefreshCw, text: 'Free Updates' },
              { icon: FiDownload, text: 'Commercial License' },
              { icon: FiHeadphones, text: 'Premium Support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-slate-gray">
                <item.icon className="text-aurora-purple shrink-0" size={15} /> {item.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-success border-t border-white/[0.06] pt-4">
            <FiShield /> Secure Checkout — your payment information is 100% secure
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-heading-white">You May Also Like</h2>
            <Link to="/marketplace" className="text-sm text-aurora-purple hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
