import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

const ROUTES = [
  { path: '', priority: 1 },
  { path: '/protocol', priority: 0.9 },
  { path: '/hooks', priority: 0.9 },
  { path: '/docs', priority: 0.8 },
  { path: '/contracts', priority: 0.8 },
  { path: '/nest', priority: 0.7 },
  { path: '/creatures', priority: 0.7 },
  { path: '/gallery', priority: 0.6 },
  { path: '/legal', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: r.priority,
  }));
}
