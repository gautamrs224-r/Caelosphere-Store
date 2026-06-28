import asyncHandler from 'express-async-handler'
import { getCloudinary } from '../config/cloudinary.js'

function uploadBufferToCloudinary(buffer) {
  const cloudinary = getCloudinary()
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'caelosphere-store/products',
        resource_type: 'image',
        transformation: [{ width: 1200, height: 900, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

// @route  POST /api/upload
// @access Private/Admin
// @body   multipart/form-data, field name "image"
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('No image file was provided')
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    res.status(500)
    throw new Error(
      'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env'
    )
  }

  const result = await uploadBufferToCloudinary(req.file.buffer)

  res.status(201).json({
    success: true,
    url: result.secure_url,
    publicId: result.public_id,
  })
})
