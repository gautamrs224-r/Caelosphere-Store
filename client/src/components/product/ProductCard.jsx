import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiCheck, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import { useCart } from '../../context/CartContext'

const categoryThumbBg = {
  'ui-kits': 'from-[#1a1030] to-[#0b1023]',
  'landing-pages': 'from-[#e9e6fb] to-[#cfd9f7]',
  templates: 'from-[#e9e6fb] to-[#cfd9f7]',
  'react-components': 'from-[#1a1030] to-[#0b1023]',
  'icon-packs': 'from-[#1a1030] to-[#0b1023]',
  'design-systems': 'from-[#1a1030] to-[#0b1023]',
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (adding) return
    setAdding(true)
    try {
      await addToCart(product, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      console.error('Failed to add to cart:', err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="glass-card overflow-hidden group hover:border-aurora-purple/30 hover:shadow-glow-purple transition-shadow duration-300"
    >
      <Link to={`/product/${product.slug}`}>
        <div
          className={`relative aspect-[4/3] overflow-hidden ${
            !product.thumbnail ? `bg-gradient-to-br ${categoryThumbBg[product.category] || categoryThumbBg['ui-kits']}` : ''
          }`}
        >
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
          {product.badge && (
            <Badge variant={product.badge} className="absolute top-3 right-3 capitalize">
              {product.badge}
            </Badge>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-lg bg-black/30 backdrop-blur-sm text-white hover:text-error transition-colors"
            aria-label="Add to wishlist"
          >
            <FiHeart size={15} />
          </button>
        </div>

        <div className="p-5">
          <span className="text-xs font-medium text-aurora-purple">{product.categoryLabel}</span>
          <h3 className="mt-1.5 font-heading font-semibold text-heading-white leading-snug group-hover:text-aurora-purple transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-2 text-sm">
            <FiStar className="text-warning fill-warning" />
            <span className="text-soft-silver font-medium">{product.rating}</span>
            <span className="text-cool-gray">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="font-heading font-bold text-lg text-heading-white">
              ${product.price}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-aurora-purple/30 text-aurora-purple hover:bg-aurora-purple hover:text-white transition-colors disabled:opacity-60"
              aria-label="Add to cart"
            >
              {added ? <FiCheck size={15} /> : <FiShoppingCart size={15} />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
