import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://hrm.sanazazarnia.com',
      lastModified: new Date(),
    },
   
  ]
}