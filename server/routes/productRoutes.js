import express from 'express'
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  getCategoryCounts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/categories', getCategoryCounts)
router.get('/id/:id', protect, adminOnly, getProductById)
router.get('/:slug', getProductBySlug)
router.get('/:slug/related', getRelatedProducts)

// Admin-only product management
router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

export default router
