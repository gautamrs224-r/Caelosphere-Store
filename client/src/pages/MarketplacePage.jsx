import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiGrid, FiList, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCard from '../components/product/ProductCard'
import { CardSkeleton } from '../components/ui/Loader'
import * as productService from '../services/productService'
import { categories as categoryConfig } from '../services/categoryConfig'

const licenses = ['Standard License', 'Extended License', 'Commercial License']
const compatList = ['React', 'Next.js', 'Figma', 'HTML', 'Vue']
const PAGE_SIZE = 8

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState('popular')
  const [view, setView] = useState('grid')
  const [maxPrice, setMaxPrice] = useState(100)
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ total: 0, pages: 1 })
  const [categoryCounts, setCategoryCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Re-sync from the URL whenever the navbar (or any link) sets ?search=,
  // even when already on this route — useState's initializer only runs once.
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    setSearchInput(urlSearch)
    setSearch(urlSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('search')])

  // Debounce free-text search so we don't hit the API on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 350)
    return () => clearTimeout(handle)
  }, [searchInput])

  // Reset to page 1 whenever a filter changes.
  useEffect(() => {
    setPage(1)
  }, [activeCategory, sort, maxPrice])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productService.getProducts({
        category: activeCategory,
        search: search || undefined,
        maxPrice,
        sort,
        page,
        limit: PAGE_SIZE,
      })
      setProducts(data.products)
      setMeta({ total: data.total, pages: data.pages })
    } catch (err) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [activeCategory, search, maxPrice, sort, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    productService
      .getCategoryCounts()
      .then((counts) => {
        const map = Object.fromEntries(counts.map((c) => [c._id, c.count]))
        setCategoryCounts(map)
      })
      .catch(() => setCategoryCounts({}))
  }, [])

  const totalCount = Object.values(categoryCounts).reduce((sum, n) => sum + n, 0)

  const setCategory = (id) => {
    if (id === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="container-page py-10">
      <div className="text-sm text-cool-gray mb-3">
        Home <span className="mx-1">›</span> <span className="text-soft-silver">Marketplace</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-heading-white">Marketplace</h1>
      <p className="text-slate-gray mt-2">Discover premium digital assets for your next project</p>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8 mt-8">
        {/* Sidebar filters */}
        <aside className="glass-card p-6 h-fit space-y-7 hidden lg:block">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-heading-white">Filters</h3>
            <button
              onClick={() => {
                setCategory('all')
                setMaxPrice(100)
                setSearchInput('')
              }}
              className="text-xs text-aurora-purple hover:underline"
            >
              Clear All
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-soft-silver mb-3">Categories</h4>
            <div className="space-y-1">
              <FilterRow
                active={activeCategory === 'all'}
                label="All Categories"
                count={totalCount}
                onClick={() => setCategory('all')}
              />
              {categoryConfig.map((cat) => (
                <FilterRow
                  key={cat.id}
                  active={activeCategory === cat.id}
                  label={cat.name}
                  count={categoryCounts[cat.id] || 0}
                  onClick={() => setCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-soft-silver mb-3">Price</h4>
            <input
              type="range"
              min={0}
              max={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-aurora-purple"
            />
            <div className="flex justify-between text-xs text-cool-gray mt-1">
              <span>$0</span>
              <span>${maxPrice}{maxPrice === 100 ? '+' : ''}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-soft-silver mb-3">License</h4>
            <div className="space-y-2">
              {licenses.map((l) => (
                <label key={l} className="flex items-center gap-2.5 text-sm text-slate-gray cursor-pointer">
                  <input type="checkbox" className="accent-aurora-purple w-4 h-4 rounded" />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-soft-silver mb-3">Compatibility</h4>
            <div className="space-y-2">
              {compatList.map((c) => (
                <label key={c} className="flex items-center gap-2.5 text-sm text-slate-gray cursor-pointer">
                  <input type="checkbox" className="accent-aurora-purple w-4 h-4 rounded" />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cool-gray" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="input-field pl-11"
              />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                <option value="popular">Sort: Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-cool-gray pointer-events-none" />
            </div>
            <div className="flex gap-1 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-aurora-purple text-white' : 'text-cool-gray'}`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 rounded-lg transition-colors ${view === 'list' ? 'bg-aurora-purple text-white' : 'text-cool-gray'}`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 text-sm text-slate-gray">
            <span>{loading ? 'Searching…' : `${meta.total} products found`}</span>
          </div>

          {error && (
            <div className="glass-card p-6 mt-6 border border-error/30">
              <p className="text-error text-sm">
                Couldn't reach the server: {error}. Is the backend running on the URL set in{' '}
                <code className="text-soft-silver">VITE_API_BASE_URL</code>?
              </p>
            </div>
          )}

          {loading ? (
            <div
              className={`grid gap-5 mt-6 ${
                view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
              }`}
            >
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card p-14 text-center mt-6">
              <p className="text-heading-white font-medium">No products match your filters</p>
              <p className="text-sm text-slate-gray mt-2">Try adjusting your search or clearing filters.</p>
            </div>
          ) : (
            <div
              className={`grid gap-5 mt-6 ${
                view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && meta.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-cool-gray hover:text-heading-white disabled:opacity-40"
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: meta.pages }, (_, i) => i + 1)
                .slice(0, 5)
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
                      n === page
                        ? 'bg-aurora-purple text-white'
                        : 'border border-white/10 text-soft-silver hover:border-white/20'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                disabled={page === meta.pages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-cool-gray hover:text-heading-white disabled:opacity-40"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterRow({ active, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active ? 'bg-aurora-purple/15 text-aurora-purple font-medium' : 'text-slate-gray hover:bg-white/[0.03]'
      }`}
    >
      <span>{label}</span>
      <span className="text-xs text-cool-gray">{count}</span>
    </button>
  )
}
