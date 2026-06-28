import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertTriangle } from 'react-icons/fi'
import * as productService from '../../services/productService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productService.getProducts({ search: search || undefined, limit: 100 })
      setProducts(data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const handle = setTimeout(fetchProducts, 300)
    return () => clearTimeout(handle)
  }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productService.deleteProduct(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-heading-white">Products</h1>
          <p className="text-slate-gray mt-2">Manage your store's catalog</p>
        </div>
        <Button as={Link} to="/admin/products/new">
          <FiPlus /> Add Product
        </Button>
      </div>

      <div className="relative mt-8 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cool-gray" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-11"
        />
      </div>

      {error && (
        <div className="glass-card p-6 mt-6 border border-error/30 text-error text-sm">{error}</div>
      )}

      <div className="glass-card mt-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-gray">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-heading-white font-medium">No products found</p>
            <p className="text-sm text-slate-gray mt-2">Try a different search, or add your first product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-cool-gray">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-md bg-white/[0.04] overflow-hidden shrink-0">
                          {p.thumbnail && (
                            <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-heading-white font-medium">{p.title}</span>
                        {p.badge && (
                          <Badge variant={p.badge} className="capitalize !text-[10px] !py-0.5">
                            {p.badge}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-soft-silver">{p.categoryLabel}</td>
                    <td className="px-6 py-4 text-heading-white font-medium">${p.price}</td>
                    <td className="px-6 py-4 text-soft-silver">
                      {p.rating} <span className="text-cool-gray">({p.reviews})</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="p-2 rounded-lg text-soft-silver hover:bg-white/[0.05] hover:text-aurora-purple transition-colors"
                          aria-label="Edit"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg text-soft-silver hover:bg-white/[0.05] hover:text-error transition-colors"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-card-elevated p-6 max-w-sm w-full">
            <div className="w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <FiAlertTriangle />
            </div>
            <h3 className="font-heading font-semibold text-heading-white mt-4">Delete product?</h3>
            <p className="text-sm text-slate-gray mt-2">
              This will permanently remove "{deleteTarget.title}". This can't be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </Button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-error text-white font-semibold text-sm hover:bg-error/90 transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
