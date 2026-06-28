// Static UI metadata for categories — names, colors, icon keys.
// Product counts per category come from the live API (productService.getCategoryCounts),
// not from this file. This only exists because the backend doesn't need to store
// presentation details like color/icon for something that's effectively a fixed enum.

export const categories = [
  { id: 'ui-kits', name: 'UI Kits', color: '#8B5CF6', icon: 'box' },
  { id: 'templates', name: 'Templates', color: '#3B82F6', icon: 'layout' },
  { id: 'landing-pages', name: 'Landing Pages', color: '#06B6D4', icon: 'monitor' },
  { id: 'react-components', name: 'React Components', color: '#10B981', icon: 'code' },
  { id: 'icon-packs', name: 'Icon Packs', color: '#F59E0B', icon: 'star' },
  { id: 'design-systems', name: 'Design Systems', color: '#D946EF', icon: 'grid' },
]
