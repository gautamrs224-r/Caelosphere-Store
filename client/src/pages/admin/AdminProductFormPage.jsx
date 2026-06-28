import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiArrowLeft, FiSave, FiAlertCircle, FiUpload, FiX, FiImage } from 'react-icons/fi'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import * as productService from '../../services/productService'
import * as uploadService from '../../services/uploadService'
import { categories } from '../../services/categoryConfig'

const categoryLabels = {
  'ui-kits': 'UI Kit',
  templates: 'Template',
  'landing-pages': 'Landing Page',
  'react-components': 'Components',
  'icon-packs': 'Icon Pack',
  'design-systems': 'Design System',
}

const badgeOptions = ['', 'bestseller', 'new', 'trending', 'sale']

export default function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [thumbnail, setThumbnail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'ui-kits',
      price: '',
      originalPrice: '',
      badge: '',
      description: '',
      features: '',
      tags: '',
      compatibility: '',
    },
  })

  const selectedCategory = watch('category')

  useEffect(() => {
    if (!isEdit) return
    productService
      .getProductById(id)
      .then((product) => {
        reset({
          title: product.title,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || '',
          badge: product.badge || '',
          description: product.description,
          features: (product.features || []).join('\n'),
          tags: (product.tags || []).join(', '),
          compatibility: (product.compatibility || []).join(', '),
        })
        setThumbnail(product.thumbnail || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEdit, reset])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploading(true)
    try {
      const result = await uploadService.uploadImage(file)
      setThumbnail(result.url)
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      // Reset the input so selecting the same file again still fires onChange
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (formData) => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        categoryLabel: categoryLabels[formData.category],
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        badge: formData.badge || null,
        thumbnail: thumbnail || '',
        description: formData.description,
        features: formData.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        compatibility: formData.compatibility
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      }

      if (isEdit) {
        await productService.updateProduct(id, payload)
      } else {
        await productService.createProduct(payload)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container-page py-24 text-center text-slate-gray">Loading product…</div>
  }

  return (
    <div className="container-page py-10 max-w-3xl">
      <Link to="/admin/products" className="flex items-center gap-2 text-sm text-slate-gray hover:text-heading-white transition-colors">
        <FiArrowLeft size={14} /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-heading-white mt-4">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 md:p-8 mt-6 space-y-5">
        <Input
          label="Title"
          placeholder="Aurora Dashboard UI Kit"
          error={errors.title && 'Title is required'}
          {...register('title', { required: true })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-soft-silver">Product Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            id="thumbnail-upload"
          />

          {thumbnail ? (
            <div className="relative w-full max-w-xs aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group">
              <img src={thumbnail} alt="Product thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setThumbnail('')}
                  className="px-3 py-1.5 rounded-lg bg-error/80 text-white text-xs font-medium hover:bg-error transition-colors flex items-center gap-1"
                >
                  <FiX size={12} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="thumbnail-upload"
              className="flex flex-col items-center justify-center gap-2 w-full max-w-xs aspect-[4/3] rounded-xl border-2 border-dashed border-white/15 text-cool-gray hover:border-aurora-purple/40 hover:text-aurora-purple transition-colors cursor-pointer"
            >
              {uploading ? (
                <span className="text-sm">Uploading…</span>
              ) : (
                <>
                  <FiImage size={24} />
                  <span className="text-sm flex items-center gap-1.5">
                    <FiUpload size={13} /> Click to upload
                  </span>
                  <span className="text-xs text-cool-gray/70">JPEG, PNG, WEBP, or GIF — max 5MB</span>
                </>
              )}
            </label>
          )}

          {uploadError && (
            <p className="flex items-start gap-2 text-xs text-error">
              <FiAlertCircle className="shrink-0 mt-0.5" size={13} /> {uploadError}
            </p>
          )}
          {!thumbnail && !uploadError && (
            <p className="text-xs text-cool-gray">
              No image yet — the storefront will show a gradient placeholder until one is added.
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-soft-silver">Category</label>
            <select className="input-field" {...register('category', { required: true })}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-cool-gray">
              Will be labeled "{categoryLabels[selectedCategory]}" on the storefront.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-soft-silver">Badge (optional)</label>
            <select className="input-field" {...register('badge')}>
              {badgeOptions.map((b) => (
                <option key={b} value={b}>
                  {b ? b.charAt(0).toUpperCase() + b.slice(1) : 'None'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            placeholder="49"
            error={errors.price && 'Price is required'}
            {...register('price', { required: true, min: 0 })}
          />
          <Input
            label="Original Price ($) — optional, for showing a discount"
            type="number"
            step="0.01"
            min="0"
            placeholder="79"
            {...register('originalPrice')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-soft-silver">Description</label>
          <textarea
            rows={4}
            placeholder="A short description of the product…"
            className="input-field resize-none"
            {...register('description', { required: true })}
          />
          {errors.description && <span className="text-xs text-error">Description is required</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-soft-silver">Features — one per line</label>
          <textarea
            rows={4}
            placeholder={'50+ beautifully crafted screens\nFully responsive & customizable'}
            className="input-field resize-none"
            {...register('features')}
          />
        </div>

        <Input
          label="Tags — comma separated"
          placeholder="50+ Screens, Dark & Light, Fully Responsive"
          {...register('tags')}
        />

        <Input
          label="Compatibility — comma separated"
          placeholder="Figma, Sketch, Adobe XD"
          {...register('compatibility')}
        />

        {error && (
          <p className="flex items-start gap-2 text-sm text-error">
            <FiAlertCircle className="shrink-0 mt-0.5" /> {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving || uploading}>
            <FiSave /> {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button as={Link} to="/admin/products" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
