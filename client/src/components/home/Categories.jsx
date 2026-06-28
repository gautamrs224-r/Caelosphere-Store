import { Link } from 'react-router-dom'
import { FiBox, FiLayout, FiMonitor, FiCode, FiStar, FiGrid } from 'react-icons/fi'
import SectionHeader from '../ui/SectionHeader'
import { categories } from '../../services/categoryConfig'

const icons = {
  'ui-kits': FiBox,
  templates: FiLayout,
  'landing-pages': FiMonitor,
  'react-components': FiCode,
  'icon-packs': FiStar,
  'design-systems': FiGrid,
}

export default function Categories() {
  return (
    <section className="py-20 bg-midnight-navy/40">
      <div className="container-page">
        <SectionHeader
          eyebrow="Browse By Category"
          title="Explore Top"
          highlight="Categories"
          subtitle="Find exactly what you need across our curated collection of digital assets."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mt-12">
          {categories.map((cat) => {
            const Icon = icons[cat.id]
            return (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.id}`}
                className="glass-card flex flex-col items-center gap-3 p-6 text-center hover:-translate-y-1 hover:border-aurora-purple/30 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}1A`, color: cat.color }}
                >
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-soft-silver">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
