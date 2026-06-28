import api from './api'

export async function createOrder({ billingInfo, paymentMethod }) {
  const { data } = await api.post('/orders', { billingInfo, paymentMethod })
  return data.order
}

export async function getMyOrders() {
  const { data } = await api.get('/orders/my')
  return data.orders
}

export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`)
  return data.order
}

// Admin-only
export async function getAllOrders() {
  const { data } = await api.get('/orders')
  return data.orders
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.put(`/orders/${id}/status`, { status })
  return data.order
}
