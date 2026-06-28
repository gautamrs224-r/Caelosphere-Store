import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}

function sendAuthResponse(res, user, statusCode = 200) {
  const token = generateToken(user._id)
  res
    .status(statusCode)
    .cookie('token', token, COOKIE_OPTIONS)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
}

// @route  POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email, and password are all required')
  }

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(400)
    throw new Error('An account with that email already exists')
  }

  const user = await User.create({ name, email, password })
  sendAuthResponse(res, user, 201)
})

// @route  POST /api/auth/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  sendAuthResponse(res, user)
})

// @route  GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  })
})

// @route  POST /api/auth/logout
// @access Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', { ...COOKIE_OPTIONS, maxAge: 0 })
  res.json({ success: true, message: 'Logged out successfully' })
})

// @route  GET /api/auth/users
// @access Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.json({ success: true, count: users.length, users })
})

// @route  PUT /api/auth/users/:id/role
// @body   { role: 'user' | 'admin' }
// @access Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) {
    res.status(400)
    throw new Error("Role must be 'user' or 'admin'")
  }

  if (req.params.id === req.user._id.toString() && role !== 'admin') {
    res.status(400)
    throw new Error('You cannot remove your own admin access')
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  res.json({ success: true, user })
})
