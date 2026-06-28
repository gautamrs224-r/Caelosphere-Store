import { FiAward, FiUnlock, FiUsers, FiRefreshCw } from 'react-icons/fi'
import SectionHeader from '../ui/SectionHeader'

const features = [
  {
    icon: FiAward,
    title: 'Premium Quality',
    desc: 'Every asset is crafted to a professional, pixel-perfect standard.',
    color: '#8B5CF6',
  },
  {
    icon: FiUnlock,
    title: 'Lifetime Access',
    desc: 'Pay once and keep access to your purchased products forever.',
    color: '#3B82F6',
  },
  {
    icon: FiUsers,
    title: 'Developer Friendly',
    desc: 'Clean code, organized files, and documentation included.',
    color: '#06B6D4',
  },
  {
    icon: FiRefreshCw,
    title: 'Regular Updates',
    desc: 'Get free updates and improvements as products evolve.',
    color: '#F59E0B',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container-page">
        <SectionHeader
          eyebrow="Why Choose Caelosphere"
          title="Everything You Need"
          highlight="to Succeed"
          subtitle="Built for creators who care about quality, speed, and long-term value."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-7 hover:border-aurora-purple/30 transition-colors duration-300">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${f.color}1A`, color: f.color }}
              >
                <f.icon size={20} />
              </div>
              <h3 className="font-heading font-semibold text-heading-white">{f.title}</h3>
              <p className="text-sm text-slate-gray mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
