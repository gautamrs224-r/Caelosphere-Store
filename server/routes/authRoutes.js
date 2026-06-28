import express from 'express'
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  getAllUsers,
  updateUserRole,
} from '../controllers/authController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', protect, logoutUser)
router.get('/me', protect, getMe)

// Admin-only user management
router.get('/users', protect, adminOnly, getAllUsers)
router.put('/users/:id/role', protect, adminOnly, updateUserRole)

export default router
