import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

// @route  GET /api/products
// @access Public
// Supports: ?category=ui-kits&search=dashboard&minPrice=0&maxPrice=100&sort=popular|price-low|price-high|rating&page=1&limit=12
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query

  const filter = {}
  if (category && category !== 'all') filter.category = category
  if (search) filter.$text = { $search: search }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  const sortMap = {
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    popular: { reviews: -1 },
  }
  const sortBy = sortMap[sort] || sortMap.popular

  const pageNum = Math.max(1, Number(page))
  const limitNum = Math.min(50, Math.max(1, Number(limit)))
  const skip = (pageNum - 1) * limitNum

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ])

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  })
})

// @route  GET /api/products/:slug
// @access Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json({ success: true, product })
})

// @route  GET /api/products/:slug/related
// @access Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(Number(req.query.limit) || 3)

  res.json({ success: true, products: related })
})

// @route  GET /api/products/id/:id
// @access Private/Admin — used by the admin panel, which edits by _id rather than slug
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json({ success: true, product })
})

// @route  GET /api/products/categories
// @access Public
export const getCategoryCounts = asyncHandler(async (req, res) => {
  const counts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ])
  res.json({ success: true, counts })
})

// @route  POST /api/products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body }

  if (!body.slug && body.title) {
    body.slug = slugify(body.title)
  }
  if (body.slug) {
    body.slug = slugify(body.slug)
    const existing = await Product.findOne({ slug: body.slug })
    if (existing) {
      body.slug = `${body.slug}-${Date.now().toString().slice(-5)}`
    }
  }

  const product = await Product.create(body)
  res.status(201).json({ success: true, product })
})

// @route  PUT /api/products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json({ success: true, product })
})

// @route  DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json({ success: true, message: 'Product deleted' })
})
