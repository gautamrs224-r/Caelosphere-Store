import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiGrid, FiArrowRight } from 'react-icons/fi'
import SectionHeader from '../ui/SectionHeader'
import Button from '../ui/Button'
import ProductCard from '../product/ProductCard'
import { CardSkeleton } from '../ui/Loader'
import * as productService from '../../services/productService'
import { categories } from '../../services/categoryConfig'

const tabs = [{ id: 'all', name: 'All Assets' }, ...categories]

export default function FeaturedProducts() {
  const [active, setActive] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    productService
      .getProducts({ category: active, sort: 'popular', limit: 10 })
      .then((data) => {
        if (!cancelled) setProducts(data.products)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [active])

  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader
          eyebrow="Featured Assets"
          title="Handpicked Premium"
          highlight="Products"
          subtitle="Top quality digital assets trusted by developers and designers worldwide."
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-10">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active === tab.id
                    ? 'bg-gradient-premium text-white'
                    : 'text-soft-silver bg-white/[0.03] border border-white/10 hover:border-white/20'
                }`}
              >
                {tab.id === 'all' && <FiGrid size={14} />}
                {tab.name}
              </button>
            ))}
          </div>
          <Button as={Link} to="/marketplace" variant="secondary" className="!px-5 !py-2.5 text-sm">
            View All Products <FiArrowRight />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-10">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {!loading && products.length === 0 && (
          <div className="glass-card p-10 text-center mt-6">
            <p className="text-slate-gray text-sm">No products in this category yet.</p>
          </div>
        )}

        <div className="glass-card flex flex-col sm:flex-row items-center justify-between gap-6 p-8 mt-10 bg-gradient-to-r from-aurora-purple/10 to-royal-blue/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center text-white text-xl shrink-0">
              ◆
            </div>
            <div>
              <h3 className="font-heading font-semibold text-heading-white">
                Want more premium assets?
              </h3>
              <p className="text-sm text-slate-gray">
                Explore our complete collection of 500+ digital products.
              </p>
            </div>
          </div>
          <Button as={Link} to="/marketplace" className="whitespace-nowrap">
            Explore All Products <FiArrowRight />
          </Button>
        </div>
      </div>
    </section>
  )
}
