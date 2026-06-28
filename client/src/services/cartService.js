import api from './api'

export async function getCart() {
  const { data } = await api.get('/cart')
  return data.cart
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await api.post('/cart', { productId, quantity })
  return data.cart
}

export async function updateCartItem(productId, quantity) {
  const { data } = await api.put(`/cart/${productId}`, { quantity })
  return data.cart
}

export async function removeFromCart(productId) {
  const { data } = await api.delete(`/cart/${productId}`)
  return data.cart
}

export async function clearCart() {
  const { data } = await api.delete('/cart')
  return data.cart
}
