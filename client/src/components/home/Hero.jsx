import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiPlay, FiBox, FiHeart, FiShield, FiRefreshCw, FiShoppingCart } from 'react-icons/fi'
import Button from '../ui/Button'

const stats = [
  { icon: FiBox, value: '500+', label: 'Premium Assets' },
  { icon: FiHeart, value: '10K+', label: 'Happy Creators' },
  { icon: FiShield, value: 'Lifetime', label: 'Access' },
  { icon: FiRefreshCw, value: 'Free', label: 'Updates' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-20 md:pb-32">
      {/* Ambient glows */}
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-aurora-purple/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 -left-32 w-[400px] h-[400px] rounded-full bg-royal-blue/15 blur-[120px] pointer-events-none" />

      <div className="container-page relative grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge border border-aurora-purple/30 bg-aurora-purple/10 text-aurora-purple mb-6">
            ✦ Premium Digital Assets
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-bold leading-[1.05] text-balance">
            Build Faster.
            <br />
            <span className="text-gradient-marketplace">Launch Smarter.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-gray max-w-md">
            Premium templates, UI kits, icons, and design resources crafted for
            developers, startups, and creators.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Button as={Link} to="/marketplace">
              Explore Marketplace <FiArrowRight />
            </Button>
            <Button as={Link} to="/marketplace" variant="secondary">
              <FiPlay /> View Collection
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <s.icon className="text-aurora-purple text-lg shrink-0" />
                <div>
                  <div className="font-heading font-bold text-heading-white text-sm leading-none">
                    {s.value}
                  </div>
                  <div className="text-xs text-cool-gray mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: floating product previews */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative h-[480px] hidden lg:block"
        >
          <div className="absolute inset-0 rounded-full border border-aurora-purple/20" />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-72 glass-card-elevated p-4 shadow-glow-purple"
          >
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-[#e9e6fb] to-[#cfd9f7] mb-3" />
            <p className="text-xs text-cool-gray">SaaS Landing Page</p>
            <p className="font-semibold text-heading-white text-sm mt-1">Modern & Clean</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-bold text-heading-white">$29</span>
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-premium text-white">
                View Details
              </span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-10 left-0 w-64 glass-card-elevated p-4 shadow-glow-blue"
          >
            <div className="flex items-end gap-1 h-16 mb-3">
              {[40, 70, 55, 90, 65, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-premium"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-cool-gray">Dashboard UI Kit</p>
            <p className="font-semibold text-heading-white text-sm mt-1">$24,680 Earnings</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-bold text-heading-white">$49</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-aurora-purple/20 text-aurora-purple">
                <FiShoppingCart size={14} />
              </button>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-0 right-10 w-48 glass-card-elevated p-4 shadow-glow-cyan"
          >
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-md bg-electric-cyan/15 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm bg-electric-cyan/60" />
                </div>
              ))}
            </div>
            <p className="text-xs text-cool-gray">Icon Pack</p>
            <p className="font-semibold text-heading-white text-sm mt-1">$19</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
