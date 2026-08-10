/**
 * Aggregates the CMS's public content endpoints into one site-data JSON:
 * { collections, page, posts }. Cached in memory for a short TTL so the
 * CMS isn't hit on every request and brief CMS downtime is invisible —
 * each block is null when its fetch fails; the client falls back to the
 * app's built-in content.
 */
const TTL_MS = 60_000

interface SiteData {
	collections: unknown[] | null
	page: unknown | null
	posts: unknown[] | null
}

let cache: { at: number, data: SiteData } | null = null

export default defineEventHandler(async (): Promise<SiteData> => {
	if (cache && Date.now() - cache.at < TTL_MS) return cache.data

	const { public: { cmsBase, cmsSite } } = useRuntimeConfig()
	const api = `${cmsBase}/api/sites/${cmsSite}`

	const [collections, page, posts] = await Promise.all([
		$fetch<{ collections: unknown[] }>(`${api}/collections`).then(r => r.collections).catch(() => null),
		$fetch<{ page: unknown }>(`${api}/page`, { query: { url: '/' } }).then(r => r.page).catch(() => null),
		$fetch<{ posts: unknown[] }>(`${api}/posts`, { query: { per_page: 50 } }).then(r => r.posts).catch(() => null),
	])

	const data: SiteData = { collections, page, posts }
	// Only cache when at least one block came through, so a cold start with
	// the CMS down retries on the next request instead of pinning nulls.
	if (collections || page || posts) cache = { at: Date.now(), data }
	return data
})
