// Revalidate hourly so newly published / updated WordPress posts reach
// sitemap.xml without a redeploy.
export const revalidate = 3600

const API = process.env.NEXT_PUBLIC_API_URL

// Safety cap: 50 pages x 100 posts. Guards against a bogus X-WP-TotalPages.
const MAX_PAGES = 50
const PER_PAGE = 100

// Only the fields the sitemap needs — no _embed, no ACF. Pulling embedded
// media/terms for every post would be an order of magnitude more payload.
const POST_FIELDS = 'slug,modified_gmt,date_gmt'

async function fetchPostPage(page) {
  const res = await fetch(
    `${API}wp/v2/posts?page=${page}&per_page=${PER_PAGE}&_fields=${POST_FIELDS}&orderby=modified&order=desc&status=publish`,
    {
      signal: AbortSignal.timeout(30000),
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) return { posts: [], totalPages: 0 }

  const data = await res.json()
  const totalPages = Number(res.headers.get('x-wp-totalpages')) || 0

  return { posts: Array.isArray(data) ? data : [], totalPages }
}

// Walks every page of published posts. Never throws — a partial list (or an
// empty one) is better than a 500 on sitemap.xml.
async function fetchAllPosts() {
  if (!API) return []

  const all = []

  try {
    const first = await fetchPostPage(1)
    all.push(...first.posts)

    const totalPages = Math.min(first.totalPages, MAX_PAGES)

    for (let page = 2; page <= totalPages; page++) {
      const next = await fetchPostPage(page)
      if (next.posts.length === 0) break
      all.push(...next.posts)
    }
  } catch {
    // Fall through with whatever we managed to collect.
  }

  return all
}

// WordPress returns GMT timestamps without a trailing Z; without it the date
// is parsed as local time and lastmod drifts by the server's offset.
function toDate(value, fallback) {
  if (!value) return fallback

  const date = new Date(/(Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`)
  return Number.isNaN(date.getTime()) ? fallback : date
}

export default async function sitemap() {
  // trailingSlash: true is set in next.config.mjs, so every URL here ends in
  // a slash to match what the site actually serves.
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://remotedosimetrist.com'
  ).replace(/\/$/, '')

  const now = new Date()

  const routes = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about/`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/areas/`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/plans/`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/process/`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/systems/`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/how-it-works/`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/faq/`, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${baseUrl}/blog/`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/contact/`, priority: 0.85, changeFrequency: 'monthly' },
  ]

  const staticEntries = routes.map((route) => ({
    url: route.url,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const posts = await fetchAllPosts()
  const seen = new Set(staticEntries.map((entry) => entry.url))
  const postEntries = []

  for (const post of posts) {
    if (!post?.slug) continue

    const url = `${baseUrl}/blog/${post.slug}/`
    if (seen.has(url)) continue
    seen.add(url)

    postEntries.push({
      url,
      lastModified: toDate(post.modified_gmt || post.date_gmt, now),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return [...staticEntries, ...postEntries]
}
