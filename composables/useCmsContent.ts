/**
 * Site content pulled from the Olux CMS via the server aggregator
 * (/api/site-data). Sections keep their hardcoded arrays as fallback and
 * render CMS data only when it exists — the site never renders empty.
 */

export interface CmsCollectionItem {
	id: number
	data: Record<string, any>
	status: string
	created_at?: string
}

export interface CmsCollection {
	id: number
	name: string
	slug: string
	type: string
	fields: any[]
	items: CmsCollectionItem[]
}

export interface CmsPost {
	title: string
	slug: string
	excerpt: string | null
	cover_image: string | null
	author: string | null
	published_at: string | null
	views?: number
	likes?: number
	comments?: number
}

export interface CmsComponent {
	name: string
	nodes: { label: string, type: string, value: string | null }[]
}

interface SiteData {
	collections: CmsCollection[] | null
	page: { attributes?: Record<string, string>, components?: CmsComponent[] } | null
	posts: CmsPost[] | null
}

/** Split a textarea field into one entry per non-empty line. */
export function lines(value: unknown): string[] {
	return String(value ?? '')
		.split('\n')
		.map(s => s.trim())
		.filter(Boolean)
}

export function useCmsContent() {
	const { data } = useAsyncData<SiteData>(
		'site-data',
		() => $fetch<SiteData>('/api/site-data'),
		{ default: () => ({ collections: null, page: null, posts: null }) },
	)

	/** Items of a collection mapped to the section's shape, or the fallback when missing/empty. */
	function collection<T>(slug: string, fallback: T[], map: (data: Record<string, any>, item: CmsCollectionItem) => T): ComputedRef<T[]> {
		return computed(() => {
			const col = data.value?.collections?.find(c => c.slug === slug)
			const items = (col?.items ?? []).map(i => map(i.data ?? {}, i))
			return items.length ? items : fallback
		})
	}

	/** Page `/` attribute, or the fallback copy when the CMS doesn't provide it. */
	function attr(key: string, fallback = ''): ComputedRef<string> {
		return computed(() => data.value?.page?.attributes?.[key] || fallback)
	}

	/** A page component's nodes as a label→value map, or {} when absent. */
	function componentNodes(name: string): ComputedRef<Record<string, string>> {
		return computed(() => {
			const c = data.value?.page?.components?.find(c => c.name === name)
			return Object.fromEntries((c?.nodes ?? []).map(n => [n.label, n.value ?? '']))
		})
	}

	const posts = computed<CmsPost[]>(() => data.value?.posts ?? [])

	return { collection, attr, componentNodes, posts }
}
