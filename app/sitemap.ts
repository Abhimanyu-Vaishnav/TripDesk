import { Metadata } from 'next';

export const dynamic = 'force-static';

export default function sitemap() {
  const baseUrl = 'https://tripdeskholidays.com';

  const staticRoutes = [
    '',
    '/privacy-policy',
    '/terms',
    '/sitemap-page',
    '/packages/kashmir-paradise-on-earth',
    '/packages/himachal-manali-kasol-spiti-gateway',
    '/packages/rajasthan-royal-heritage-jaipur-udaipur-jodhpur',
    '/packages/kerala-gods-own-country-backwaters-munnar',
    '/packages/goa-sun-sand-luxury-yacht-heritage',
    '/packages/uttarakhand-rishikesh-mussoorie-char-dham-vibes',
    '/packages/andaman-emerald-islands-havelock-scuba-paradise',
    '/packages/north-east-meghalaya-living-roots-cherrapunji',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/packages') ? 0.8 : 0.5,
  }));

  return staticRoutes;
}

