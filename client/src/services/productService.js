import api from './api'

// MongoDB returns _id; the rest of the app (built against mock data) expects id.
// Normalizing here means no other file needs to know about Mongo's field naming.
function normalizeProduct(product) {
  if (!product) return product
  return { ...product, id: product._id }
}

// params: { category, search, minPrice, maxPrice, sort, page, limit }
export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return { ...data, products: data.products.map(normalizeProduct) }
}

export async function getProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`)
  return normalizeProduct(data.product)
}

export async function getRelatedProducts(slug, limit = 3) {
  const { data } = await api.get(`/products/${slug}/related`, { params: { limit } })
  return data.products.map(normalizeProduct)
}

export async function getCategoryCounts() {
  const { data } = await api.get('/products/categories')
  return data.counts
}

// Admin-only
export async function getProductById(id) {
  const { data } = await api.get(`/products/id/${id}`)
  return normalizeProduct(data.product)
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  return normalizeProduct(data.product)
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload)
  return normalizeProduct(data.product)
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`)
  return data
}
