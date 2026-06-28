import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'ui-kits',
        'templates',
        'landing-pages',
        'react-components',
        'icon-packs',
        'design-systems',
      ],
      index: true,
    },
    categoryLabel: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    thumbnail: { type: String, default: '' },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    sales: { type: String, default: '0' },
    badge: {
      type: String,
      enum: ['bestseller', 'new', 'trending', 'sale', null],
      default: null,
    },
    features: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    stats: {
      screens: { type: String, default: '—' },
      components: { type: String, default: '—' },
      themes: { type: String, default: '—' },
      responsive: { type: String, default: '—' },
    },
    compatibility: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: true } }
)

productSchema.index({ title: 'text', description: 'text' })

const Product = mongoose.model('Product', productSchema)
export default Product
