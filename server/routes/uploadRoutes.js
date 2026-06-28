import express from 'express'
import { uploadImage } from '../controllers/uploadController.js'
import upload from '../config/multer.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, adminOnly, upload.single('image'), uploadImage)

export default router
