import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const billingInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    company: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: { type: [orderItemSchema], required: true },
    billingInfo: { type: billingInfoSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'stripe'],
      default: 'card',
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: true } }
)

const Order = mongoose.model('Order', orderSchema)
export default Order
