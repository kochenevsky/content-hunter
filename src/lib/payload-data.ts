import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

// ===== Домен =====

async function getDomain(): Promise<'ru' | 'pro'> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || ''
    return host.includes('.pro') ? 'pro' : 'ru'
  } catch {
    return 'ru'
  }
}

// ===== Payload Client =====

export async function getPayloadClient() {
  return getPayload({ config })
}

// ===== Collections =====

export async function getCases(limit = 100) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'cases',
      where: { published: { equals: true } },
      sort: '-order',
      limit,
      depth: 1,
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching cases:', error)
    return []
  }
}

export async function getBlogPosts(limit = 100) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'blog-posts',
      where: { published: { equals: true } },
      sort: '-publishedAt',
      limit,
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getFAQ(limit = 100) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faq',
      sort: 'order',
      limit,
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return []
  }
}

// ✅ ЕДИНАЯ функция getPricing с учётом домена
export async function getPricing(limit = 10) {
  try {
    const domain = await getDomain()
    const collection = domain === 'pro' ? 'pricing-pro' : 'pricing' // ← ключевая строка
    
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: collection as any, // ← динамическая коллекция
      sort: 'order',
      limit,
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching pricing:', error)
    return []
  }
}

export async function getTeam(limit = 20) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'team',
      sort: 'order',
      limit,
    })
    return result.docs
  } catch (error) {
    console.error('Error fetching team:', error)
    return []
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return result.docs[0] || null
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error)
    return null
  }
}

// ===== Globals =====

export async function getHeader() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'header' })
  } catch (error) {
    console.error('Error fetching header:', error)
    return null
  }
}

export async function getFooter() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'footer' })
  } catch (error) {
    console.error('Error fetching footer:', error)
    return null
  }
}

export async function getSettings() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'settings' })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export async function getHomePage() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'home-page' })
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}

export async function getServicesPage() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'services-page' })
  } catch (error) {
    console.error('Error fetching services page:', error)
    return null
  }
}

export async function getAboutPage() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'about-page' })
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}

export async function getPricingPage() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'pricing-page' })
  } catch (error) {
    console.error('Error fetching pricing page:', error)
    return null
  }
}

export async function getFAQPage() {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'faq-page' })
  } catch (error) {
    console.error('Error fetching FAQ page:', error)
    return null
  }
}
