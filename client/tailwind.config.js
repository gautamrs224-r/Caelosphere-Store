/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        'aurora-purple': '#8B5CF6',
        'neon-purple': '#A855F7',
        'royal-blue': '#3B82F6',
        'electric-cyan': '#06B6D4',
        // Backgrounds
        'deep-space': '#050816',
        'midnight-navy': '#0B1023',
        'aurora-surface': '#10182B',
        'glass-surface': '#16213A',
        // Typography
        'heading-white': '#FFFFFF',
        'soft-silver': '#CBD5E1',
        'slate-gray': '#94A3B8',
        'cool-gray': '#64748B',
        // Category colors
        'cat-uikits': '#8B5CF6',
        'cat-templates': '#3B82F6',
        'cat-landing': '#06B6D4',
        'cat-components': '#10B981',
        'cat-icons': '#F59E0B',
        'cat-design': '#D946EF',
        // Status
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-marketplace': 'linear-gradient(90deg, #A855F7 0%, #8B5CF6 40%, #3B82F6 100%)',
        'gradient-premium': 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        'gradient-creator': 'linear-gradient(135deg, #06B6D4, #3B82F6)',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(139,92,246,0.35)',
        'glow-blue': '0 0 40px rgba(59,130,246,0.25)',
        'glow-cyan': '0 0 40px rgba(6,182,212,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
