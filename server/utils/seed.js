import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

dotenv.config()

// Mirrors client/src/services/mockData.js so the live API returns the same
// products the frontend was designed and tested against.
const products = [
  {
    title: 'Aurora Dashboard UI Kit',
    slug: 'aurora-dashboard-ui-kit',
    category: 'ui-kits',
    categoryLabel: 'UI Kit',
    price: 49,
    originalPrice: 79,
    rating: 4.9,
    reviews: 210,
    sales: '2.4k+',
    badge: 'bestseller',
    description:
      'Aurora Dashboard UI Kit is a modern, clean and beautifully crafted dashboard UI kit designed for SaaS, CRM, analytics, and admin panels. Comes with both dark and light versions, pixel-perfect components, and fully organized layers.',
    features: [
      '50+ beautifully crafted screens',
      'Global style guide & design system',
      'Fully responsive & customizable',
      'Organized layers & components',
      'Free updates & premium support',
    ],
    tags: ['50+ Screens', 'Dark & Light', 'Fully Responsive', 'Figma Auto Layout'],
    stats: { screens: '50+', components: '200+', themes: '2', responsive: '100%' },
    compatibility: ['Figma', 'Sketch', 'Adobe XD'],
  },
  {
    title: 'Startup Landing Page',
    slug: 'startup-landing-page',
    category: 'landing-pages',
    categoryLabel: 'Landing Page',
    price: 29,
    originalPrice: 49,
    rating: 4.8,
    reviews: 128,
    sales: '1.8k+',
    badge: 'new',
    description:
      'Launch your startup faster than ever with this clean, conversion-focused landing page template. Built with modern sections for hero, features, pricing, and testimonials.',
    features: ['12+ sections', 'Fully responsive', 'Easy to customize', 'Conversion-optimized layout'],
    tags: ['12+ Sections', 'Fully Responsive', 'Easy to Customize'],
    stats: { screens: '12+', components: '40+', themes: '1', responsive: '100%' },
    compatibility: ['React', 'HTML', 'Figma'],
  },
  {
    title: 'Devfolio Portfolio Template',
    slug: 'devfolio-portfolio-template',
    category: 'templates',
    categoryLabel: 'Template',
    price: 39,
    originalPrice: 59,
    rating: 4.9,
    reviews: 96,
    sales: '900+',
    badge: 'trending',
    description:
      'Build stunning developer portfolio websites with ease and speed. Devfolio comes with project showcases, blog layout, and dark-mode-first design.',
    features: ['Dark mode first', 'Project showcase grid', 'Blog-ready layout', 'SEO optimized'],
    tags: ['Dark Mode', 'SEO Ready', 'Fast Load'],
    stats: { screens: '8+', components: '30+', themes: '1', responsive: '100%' },
    compatibility: ['React', 'Next.js'],
  },
  {
    title: 'Minimal Line Icons',
    slug: 'minimal-line-icons',
    category: 'icon-packs',
    categoryLabel: 'Icon Pack',
    price: 19,
    originalPrice: 29,
    rating: 4.7,
    reviews: 83,
    sales: '3.1k+',
    description:
      '300+ beautifully crafted minimal line icons for any project. Pixel-perfect, consistent stroke width, available in SVG and PNG formats.',
    features: ['300+ icons', 'Pixel perfect', 'SVG & PNG files', 'Consistent stroke width'],
    tags: ['200+ Icons', 'Pixel Perfect', 'SVG & PNG Files'],
    stats: { screens: '—', components: '300+', themes: '1', responsive: '—' },
    compatibility: ['Figma', 'Sketch', 'HTML'],
  },
  {
    title: 'SaaS Dashboard Components',
    slug: 'saas-dashboard-components',
    category: 'react-components',
    categoryLabel: 'Components',
    price: 29,
    originalPrice: 45,
    rating: 4.9,
    reviews: 164,
    sales: '1.2k+',
    description:
      'A complete library of React dashboard components — charts, tables, cards, and navigation — ready to drop into any SaaS product.',
    features: ['Reusable React components', 'Chart & table primitives', 'Tailwind-based styling', 'Accessible by default'],
    tags: ['React 18', 'Tailwind CSS', 'TypeScript Ready'],
    stats: { screens: '—', components: '60+', themes: '2', responsive: '100%' },
    compatibility: ['React', 'Next.js', 'Tailwind'],
  },
  {
    title: 'Agency Website Template',
    slug: 'agency-website-template',
    category: 'templates',
    categoryLabel: 'Template',
    price: 39,
    originalPrice: 59,
    rating: 4.8,
    reviews: 74,
    sales: '650+',
    description:
      'A polished agency website template with case study layouts, team pages, and a creative hero section built for studios and freelancers.',
    features: ['Case study layout', 'Team showcase page', 'Creative hero section', 'Contact form ready'],
    tags: ['Creative', 'Case Studies', 'Responsive'],
    stats: { screens: '10+', components: '35+', themes: '1', responsive: '100%' },
    compatibility: ['HTML', 'React'],
  },
  {
    title: 'Mobile Banking UI Kit',
    slug: 'mobile-banking-ui-kit',
    category: 'ui-kits',
    categoryLabel: 'UI Kit',
    price: 49,
    originalPrice: 69,
    rating: 4.9,
    reviews: 118,
    sales: '1.5k+',
    description:
      'A complete fintech mobile UI kit with onboarding, transactions, cards, and analytics screens — designed for modern banking apps.',
    features: ['40+ mobile screens', 'Light & dark themes', 'Onboarding flows', 'Card & transaction UI'],
    tags: ['Mobile First', 'Fintech', 'Dark & Light'],
    stats: { screens: '40+', components: '120+', themes: '2', responsive: '100%' },
    compatibility: ['Figma', 'Sketch'],
  },
  {
    title: 'AI SaaS Landing Page',
    slug: 'ai-saas-landing-page',
    category: 'landing-pages',
    categoryLabel: 'Landing Page',
    price: 29,
    originalPrice: 45,
    rating: 4.8,
    reviews: 67,
    sales: '780+',
    description:
      'A future-forward landing page built for AI and SaaS products, with animated gradients, feature grids, and a pricing section.',
    features: ['Animated gradient hero', 'Feature comparison grid', 'Built-in pricing section', 'Newsletter capture'],
    tags: ['AI Theme', 'Animated', 'Conversion Focused'],
    stats: { screens: '9+', components: '32+', themes: '1', responsive: '100%' },
    compatibility: ['React', 'HTML'],
  },
  {
    title: 'Aurora Design System',
    slug: 'aurora-design-system',
    category: 'design-systems',
    categoryLabel: 'Design System',
    price: 59,
    originalPrice: 89,
    rating: 4.9,
    reviews: 52,
    sales: '410+',
    description:
      'A complete design system with color tokens, typography scale, spacing system, and pre-built components for building consistent products fast.',
    features: ['Full token library', 'Typography & spacing scale', 'Component library', 'Dark mode native'],
    tags: ['Tokens', 'Components', 'Dark Mode'],
    stats: { screens: '—', components: '150+', themes: '2', responsive: '100%' },
    compatibility: ['Figma', 'React'],
  },
  {
    title: '3D Gradient Icons',
    slug: '3d-gradient-icons',
    category: 'icon-packs',
    categoryLabel: 'Icon Pack',
    price: 24,
    originalPrice: 34,
    rating: 4.8,
    reviews: 91,
    sales: '2.0k+',
    description:
      'A vibrant set of 3D gradient icons perfect for landing pages, app onboarding, and marketing sites that want extra visual personality.',
    features: ['120+ 3D icons', 'Gradient & flat versions', 'PNG & SVG formats', 'Editable source files'],
    tags: ['3D Style', 'Gradient', 'Editable'],
    stats: { screens: '—', components: '120+', themes: '1', responsive: '—' },
    compatibility: ['Figma', 'Sketch'],
  },
]

const demoUser = {
  name: 'Devansh Sharma',
  email: 'devansh@example.com',
  password: 'password123',
}

const adminUser = {
  name: 'Store Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
}

async function seed() {
  await connectDB()

  try {
    console.log('Clearing existing products...')
    await Product.deleteMany()

    console.log('Inserting products...')
    await Product.insertMany(products)

    const existingUser = await User.findOne({ email: demoUser.email })
    if (!existingUser) {
      console.log('Creating demo user...')
      await User.create(demoUser)
      console.log(`Demo user created: ${demoUser.email} / ${demoUser.password}`)
    } else {
      console.log('Demo user already exists, skipping.')
    }

    const existingAdmin = await User.findOne({ email: adminUser.email })
    if (!existingAdmin) {
      console.log('Creating admin user...')
      await User.create(adminUser)
      console.log(`Admin user created: ${adminUser.email} / ${adminUser.password}`)
    } else {
      console.log('Admin user already exists, skipping.')
    }

    console.log(`Seed complete — ${products.length} products inserted.`)
  } catch (err) {
    console.error('Seed failed:', err)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

seed()
