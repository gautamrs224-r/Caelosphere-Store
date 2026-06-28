import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// Verifies the JWT (from Authorization header or cookie) and attaches req.user.
export const protect = asyncHandler(async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized — no token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) {
      res.status(401)
      throw new Error('Not authorized — user not found')
    }
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized — invalid or expired token')
  }
})

// Use after `protect` — requires the authenticated user to have the admin role.
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  res.status(403)
  throw new Error('Admin access required')
}
