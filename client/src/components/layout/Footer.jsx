import { Link } from 'react-router-dom'
import { FiTwitter, FiGithub, FiInstagram, FiLinkedin } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'
import Logo from '../ui/Logo'

const columns = [
  {
    title: 'Marketplace',
    links: ['All Products', 'UI Kits', 'Templates', 'Landing Pages', 'Components', 'Icon Packs'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Contact Us', 'Privacy Policy', 'Terms of Use'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Help Center', 'Blog', 'Changelog', 'License'],
  },
  {
    title: 'Support',
    links: ['Contact Support', 'Community', 'Affiliate Program', 'Become a Creator'],
  },
]

const socials = [
  { icon: FiTwitter, href: '#' },
  { icon: FiGithub, href: '#' },
  { icon: FaDiscord, href: '#' },
  { icon: FiInstagram, href: '#' },
  { icon: FiLinkedin, href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-midnight-navy mt-24">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-slate-gray max-w-xs">
              Premium digital assets for developers, designers, and creators.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-slate-gray hover:text-heading-white hover:border-aurora-purple/50 transition-colors"
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-heading-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-slate-gray hover:text-aurora-purple transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-6 text-center text-xs text-cool-gray">
          © {new Date().getFullYear()} Caelosphere Store. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
