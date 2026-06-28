import asyncHandler from 'express-async-handler'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId }).populate('products.product')
  if (!cart) {
    cart = await Cart.create({ userId, products: [] })
  }
  return cart
}

// @route  GET /api/cart
// @access Private
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  res.json({ success: true, cart })
})

// @route  POST /api/cart
// @body   { productId, quantity }
// @access Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body

  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const cart = await getOrCreateCart(req.user._id)
  const existingItem = cart.products.find((p) => p.product._id.toString() === productId)

  if (existingItem) {
    existingItem.quantity += Number(quantity)
  } else {
    cart.products.push({ product: productId, quantity: Number(quantity), price: product.price })
  }

  cart.recalculateTotal()
  await cart.save()
  await cart.populate('products.product')

  res.status(201).json({ success: true, cart })
})

// @route  PUT /api/cart/:productId
// @body   { quantity }
// @access Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  if (!quantity || quantity < 1) {
    res.status(400)
    throw new Error('Quantity must be at least 1')
  }

  const cart = await getOrCreateCart(req.user._id)
  const item = cart.products.find((p) => p.product._id.toString() === req.params.productId)
  if (!item) {
    res.status(404)
    throw new Error('Item not found in cart')
  }

  item.quantity = Number(quantity)
  cart.recalculateTotal()
  await cart.save()
  await cart.populate('products.product')

  res.json({ success: true, cart })
})

// @route  DELETE /api/cart/:productId
// @access Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  cart.products = cart.products.filter(
    (p) => p.product._id.toString() !== req.params.productId
  )
  cart.recalculateTotal()
  await cart.save()
  await cart.populate('products.product')

  res.json({ success: true, cart })
})

// @route  DELETE /api/cart
// @access Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id)
  cart.products = []
  cart.total = 0
  await cart.save()

  res.json({ success: true, cart })
})
