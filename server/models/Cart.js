import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: { type: [cartItemSchema], default: [] },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
)

cartSchema.methods.recalculateTotal = function () {
  this.total = this.products.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return this.total
}

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
