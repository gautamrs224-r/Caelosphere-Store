import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', createOrder)
router.get('/my', getMyOrders)
router.get('/', adminOnly, getAllOrders)
router.put('/:id/status', adminOnly, updateOrderStatus)
router.get('/:id', getOrderById)

export default router
