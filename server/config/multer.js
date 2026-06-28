import multer from 'multer'

// Files are held in memory only long enough to stream to Cloudinary —
// nothing is ever written to disk on the server.
const storage = multer.memoryStorage()

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    const err = new Error('Only JPEG, PNG, WEBP, and GIF images are allowed')
    err.statusCode = 400
    cb(err)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
})

export default upload
