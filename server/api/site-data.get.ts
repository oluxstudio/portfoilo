/**
 * Aggregates the CMS's public content into one site-data JSON:
 * { collections, page, posts }. Collections and the home page come from the
 * site tree endpoint (/content); posts from /posts (the tree doesn't include
 * them). Cached in memory for a short TTL so the CMS isn't hit on every
 * request.
 *
 * Source priority per block: live CMS → public/site-content.json snapshot
 * (written by scripts/cms-snapshot.mjs) → null, in which case the client
 * falls back to each component's built-in content.
 */
const TTL_MS = 60_000

interface Snapshot {
	content?: { pages?: { url: string }[], collections?: unknown[] }
	posts?: unknown[]
}

interface SiteData {
	collections: unknown[] | null
	page: unknown | null
	posts: unknown[] | null
}

let cache: { at: number, data: SiteData } | null = null

export default defineEventHandler(async (event): Promise<SiteData> => {
	if (cache && Date.now() - cache.at < TTL_MS) return cache.data

	const { public: { cmsBase, cmsSite } } = useRuntimeConfig()
	const api = `${cmsBase}/api/sites/${cmsSite}`

	let [content, posts] = await Promise.all([
		$fetch<{ pages: { url: string }[], collections: unknown[] }>(`${api}/content`).catch(() => null),
		$fetch<{ posts: unknown[] }>(`${api}/posts`, { query: { per_page: 50 } }).then(r => r.posts).catch(() => null),
	])

	// Offline tier: the committed snapshot in public/ (same-origin static file).
	if (!content || !posts) {
		const snapshot = await $fetch<Snapshot>('/site-content.json', {
			baseURL: getRequestURL(event).origin,
		}).catch(() => null)
		content ??= snapshot?.content ?? null
		posts ??= snapshot?.posts ?? null
	}

	const collections = content?.collections ?? null
	const page = content?.pages?.find(p => p.url === '/') ?? null

	const data: SiteData = { collections, page, posts }
	// Only cache when at least one block came through, so a cold start with
	// the CMS down retries on the next request instead of pinning nulls.
	if (collections || page || posts) cache = { at: Date.now(), data }
	return data
})
