import { v2 as cloudinary } from 'cloudinary'

// IMPORTANT: do not call cloudinary.config() here at module load time.
// ES module `import` statements are hoisted and execute before any other
// code in the importing file — including server.js's dotenv.config() call —
// so process.env.CLOUDINARY_* would still be undefined at this point,
// permanently configuring the SDK with empty credentials for the life of
// the process. Configuring lazily on first use guarantees dotenv has
// already run by the time these values are actually read.
let configured = false

export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    configured = true
  }
  return cloudinary
}

export default cloudinary
