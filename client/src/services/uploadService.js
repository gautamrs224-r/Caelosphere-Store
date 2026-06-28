import api from './api'

// Uploads a single image file and returns the Cloudinary URL.
// Overrides the default JSON content-type since this is a multipart request —
// axios needs to set its own boundary header for FormData bodies.
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data // { success, url, publicId }
}
