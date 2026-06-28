import asyncHandler from 'express-async-handler'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

const TAX_RATE = 0.0825

// @route  POST /api/orders
// @body   { billingInfo, paymentMethod }
// @access Private
// Builds the order from the user's current cart, then clears the cart.
export const createOrder = asyncHandler(async (req, res) => {
  const { billingInfo, paymentMethod = 'card' } = req.body

  if (!billingInfo) {
    res.status(400)
    throw new Error('Billing information is required')
  }

  const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product')
  if (!cart || cart.products.length === 0) {
    res.status(400)
    throw new Error('Your cart is empty')
  }

  const products = cart.products.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.price,
    quantity: item.quantity,
  }))

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const originalTotal = cart.products.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.price) * item.quantity,
    0
  )
  const discount = Math.max(0, originalTotal - subtotal)
  const taxes = Number((subtotal * TAX_RATE).toFixed(2))
  const total = Number((subtotal + taxes).toFixed(2))

  const order = await Order.create({
    userId: req.user._id,
    products,
    billingInfo,
    paymentMethod,
    subtotal,
    discount,
    taxes,
    total,
    status: 'paid', // No real payment gateway in V1 — orders are marked paid on creation.
  })

  // Clear the cart now that the order has been placed.
  cart.products = []
  cart.total = 0
  await cart.save()

  res.status(201).json({ success: true, order })
})

// @route  GET /api/orders/my
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, count: orders.length, orders })
})

// @route  GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }
  const isOwner = order.userId.toString() === req.user._id.toString()
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Not authorized to view this order')
  }
  res.json({ success: true, order })
})

// @route  GET /api/orders
// @access Private/Admin — every order in the store, not just the requester's own
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 })
  res.json({ success: true, count: orders.length, orders })
})

// @route  PUT /api/orders/:id/status
// @body   { status: 'pending' | 'paid' | 'fulfilled' | 'cancelled' }
// @access Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'paid', 'fulfilled', 'cancelled']
  if (!validStatuses.includes(status)) {
    res.status(400)
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`)
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }
  res.json({ success: true, order })
})
