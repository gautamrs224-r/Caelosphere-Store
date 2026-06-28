import { FiStar } from 'react-icons/fi'
import SectionHeader from '../ui/SectionHeader'
import { testimonials } from '../../services/testimonials'

export default function Testimonials() {
  return (
    <section className="py-20 bg-midnight-navy/40">
      <div className="container-page">
        <SectionHeader
          eyebrow="Trusted By Creators Worldwide"
          title="What Our"
          highlight="Customers Say"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-7">
              <div className="flex gap-1 text-warning mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FiStar key={i} className="fill-warning" />
                ))}
              </div>
              <p className="text-soft-silver leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white font-semibold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-medium text-heading-white text-sm">{t.name}</div>
                  <div className="text-xs text-cool-gray">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
