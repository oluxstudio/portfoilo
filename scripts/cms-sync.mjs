#!/usr/bin/env node
/**
 * cms-sync.mjs — pushes the whole site's content (scripts/cms-manifest.mjs)
 * to the Olux CMS as typed objects. Idempotent: re-runs create nothing new.
 *
 * Syncs, in order:
 *   forms        create or update by name
 *   collections  create by slug; seed items only when the collection is empty
 *   posts        create only titles that don't exist yet
 *   attributes   set page "/" attributes
 *   components   create or update by name (renames pre-convention names),
 *                attach to their page
 *   assets       upload files missing from the media library (renames
 *                pre-convention names), then re-point post cover images
 *
 * Usage:
 *   npm run cms:sync            # reads CMS_BASE / CMS_SITE / CMS_API_TOKEN from .env
 *   node scripts/cms-sync.mjs --base=http://localhost:8000 --site=deve-site --token=XXX
 */

import { existsSync, openAsBlob } from 'node:fs'
import { basename } from 'node:path'
import { FORMS, COLLECTIONS, POSTS, PAGE_ATTRIBUTES, COMPONENTS, ASSETS } from './cms-manifest.mjs'

function arg(name) {
	const match = process.argv.find(a => a.startsWith(`--${name}=`))
	return match?.slice(name.length + 3)
}

const base = arg('base') ?? process.env.CMS_BASE ?? 'http://localhost:8000'
const site = arg('site') ?? process.env.CMS_SITE ?? 'deve-site'
const token = arg('token') ?? process.env.CMS_API_TOKEN

if (!token) {
	console.error('CMS_API_TOKEN is required (set it in .env or pass --token=...)')
	process.exit(1)
}

const api = `${base}/api/sites/${site}`
const headers = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Bearer ${token}`,
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

/** fetch that waits out 429 rate limits (up to 3 retries). */
async function fetchRl(url, opts) {
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(url, opts)
		if (res.status !== 429 || attempt >= 3) return res
		await sleep(10_000 * (attempt + 1))
	}
}

async function readBody(res) {
	const text = await res.text()
	try {
		return JSON.parse(text)
	}
	catch {
		return { message: text.slice(0, 200) }
	}
}

let failed = false

function fail(label, res, body) {
	failed = true
	console.error(`  ✘ FAILED   ${label} — ${res.status} ${body.message ?? ''}`)
	if (body.errors) console.error('    ' + JSON.stringify(body.errors))
}

// ── Forms ──
async function syncForms() {
	console.log(`\nForms → ${api}/forms`)
	for (const form of FORMS) {
		let res = await fetchRl(`${api}/forms`, { method: 'POST', headers, body: JSON.stringify(form) })
		let body = await readBody(res)
		let action = 'created'
		if (res.status === 422 && (body.message ?? '').includes('already exists')) {
			res = await fetchRl(`${api}/forms/${form.name}`, { method: 'PATCH', headers, body: JSON.stringify(form) })
			body = await readBody(res)
			action = 'updated'
		}
		if (res.ok) console.log(`  ✔ ${action}  ${form.name}`)
		else fail(form.name, res, body)
	}
}

// ── Collections ──
async function syncCollections() {
	console.log(`\nCollections → ${api}/collections`)
	const listRes = await fetchRl(`${api}/collections`, { headers })
	const existing = (await readBody(listRes)).collections ?? []

	for (const def of COLLECTIONS) {
		let col = existing.find(c => c.slug === def.name || c.name === def.name)
		if (!col) {
			const res = await fetchRl(`${api}/collections`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ name: def.name, type: def.type, description: def.description, fields: def.fields, is_public: true }),
			})
			const body = await readBody(res)
			if (!res.ok) {
				fail(def.name, res, body)
				continue
			}
			col = body.collection
			console.log(`  ✔ created  ${def.name}`)
		}
		else {
			console.log(`  · exists   ${def.name}`)
		}

		// Seed items only when the collection is empty (idempotent reruns).
		if ((col.items ?? []).length > 0) continue
		let seeded = 0
		for (const data of def.items) {
			const res = await fetchRl(`${api}/collections/${col.id}/items`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ data, status: 'published' }),
			})
			if (res.ok) seeded++
			else fail(`${def.name} item`, res, await readBody(res))
		}
		if (seeded) console.log(`    ↳ seeded ${seeded}/${def.items.length} items`)
	}
}

// ── Posts ──
const slugify = s => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function syncPosts() {
	console.log(`\nPosts → ${api}/posts`)
	const listRes = await fetchRl(`${api}/posts?per_page=100`, { headers })
	const existing = (await readBody(listRes)).posts ?? []
	const existingTitles = new Set(existing.map(p => p.title))
	// Also match by slug (ignoring the CMS's -N dedupe suffix) so a post whose
	// title was edited in the CMS isn't re-created as a duplicate.
	const existingSlugs = new Set(existing.map(p => p.slug.replace(/-\d+$/, '')))

	let created = 0
	for (const post of POSTS) {
		if (existingTitles.has(post.title) || existingSlugs.has(slugify(post.title))) continue
		const res = await fetchRl(`${api}/posts`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				title: post.title,
				excerpt: post.excerpt,
				body: post.body.join('\n\n'),
				cover_image: post.cover_image,
				status: 'published',
				published_at: post.published_at,
			}),
		})
		if (res.ok) created++
		else fail(post.title, res, await readBody(res))
	}
	console.log(`  ✔ created ${created} posts (${POSTS.length - created} already existed)`)
}

// ── Page attributes ──
async function homePage() {
	const listRes = await fetchRl(`${api}/pages`, { headers })
	const pages = (await readBody(listRes)).pages ?? []
	let home = pages.find(p => p.url === '/')
	if (!home) {
		const createRes = await fetchRl(`${api}/pages`, {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: 'Home', url: '/', is_published: true }),
		})
		const createBody = await readBody(createRes)
		if (!createRes.ok) {
			fail('create page "/"', createRes, createBody)
			return null
		}
		home = createBody.page
		console.log('  ✔ created  page "/" (Home)')
	}
	return home
}

async function syncPageAttributes(home) {
	console.log(`\nPage "/" attributes → ${api}/pages`)
	if (!home) return
	const res = await fetchRl(`${api}/pages/${home.id}`, {
		method: 'PATCH',
		headers,
		body: JSON.stringify({ attributes: PAGE_ATTRIBUTES }),
	})
	if (res.ok) console.log(`  ✔ set ${Object.keys(PAGE_ATTRIBUTES).length} attributes on page "${home.name}"`)
	else fail('page attributes', res, await readBody(res))
}

// ── Components ──
async function syncComponents(home) {
	console.log(`\nComponents → ${api}/components`)
	const listRes = await fetchRl(`${api}/components`, { headers })
	const existing = (await readBody(listRes)).components ?? (await (async () => {
		// public page payload also lists attached components — fallback source
		const r = await fetchRl(`${api}/page?url=/`)
		return ((await readBody(r)).page?.components) ?? []
	})())

	for (const def of COMPONENTS) {
		const aliases = [def.name, ...(def.renameFrom ?? [])]
		const found = existing.find(c => aliases.includes(c.name))
		const pageIds = def.page === '/' && home ? [String(home.id)] : []

		if (found && found.name !== def.name) {
			// migrate a pre-convention name
			const res = await fetchRl(`${api}/components/${found.id}`, {
				method: 'PATCH',
				headers,
				body: JSON.stringify({ name: def.name, description: def.description }),
			})
			if (res.ok) console.log(`  ✔ renamed  ${found.name} → ${def.name}`)
			else fail(`rename ${found.name}`, res, await readBody(res))
			continue
		}
		if (found) {
			console.log(`  · exists   ${def.name}`)
			continue
		}
		const res = await fetchRl(`${api}/components`, {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: def.name, description: def.description, nodes: def.nodes, page_ids: pageIds }),
		})
		if (res.ok) console.log(`  ✔ created  ${def.name} (attached to ${def.page})`)
		else fail(def.name, res, await readBody(res))
	}
}

// ── Assets ──
async function syncAssets() {
	console.log(`\nAssets → ${api}/media`)
	const listRes = await fetchRl(`${api}/media?per_page=200`, { headers })
	const existing = (await readBody(listRes)).data ?? []
	const byName = new Map(existing.map(a => [a.name, a]))

	const urls = new Map() // manifest asset name -> CMS url
	for (const def of ASSETS) {
		let asset = byName.get(def.name)

		// migrate a pre-convention name
		if (!asset) {
			const old = (def.renameFrom ?? []).map(n => byName.get(n)).find(Boolean)
			if (old) {
				const res = await fetchRl(`${api}/media/${old.id}`, {
					method: 'PATCH',
					headers,
					body: JSON.stringify({ name: def.name }),
				})
				if (res.ok) {
					asset = { ...old, name: def.name }
					console.log(`  ✔ renamed  ${old.name} → ${def.name}`)
				}
				else fail(`rename ${old.name}`, res, await readBody(res))
			}
		}

		if (!asset) {
			if (!existsSync(def.file)) {
				console.log(`  · skipped  ${def.name} (missing file ${def.file})`)
				continue
			}
			const form = new FormData()
			form.append('file', await openAsBlob(def.file), basename(def.file))
			form.append('name', def.name)
			const res = await fetchRl(`${api}/media`, {
				method: 'POST',
				headers: { Accept: 'application/json', Authorization: headers.Authorization },
				body: form,
			})
			const body = await readBody(res)
			if (res.ok) {
				asset = body.asset
				console.log(`  ✔ uploaded ${def.name}`)
			}
			else {
				fail(def.name, res, body)
				continue
			}
		}
		else if (byName.get(def.name)) {
			console.log(`  · exists   ${def.name}`)
		}
		urls.set(def.name, asset.url)
	}

	// Re-point post cover images at their assets.
	const postsRes = await fetchRl(`${api}/posts?per_page=100`, { headers })
	const posts = (await readBody(postsRes)).posts ?? []
	let repointed = 0
	for (const def of ASSETS) {
		const url = urls.get(def.name)
		if (!url || !def.use?.post) continue
		const post = posts.find(p => p.title === def.use.post)
		if (!post || post.cover_image === url) continue
		const res = await fetchRl(`${api}/posts/${post.slug}`, {
			method: 'PATCH',
			headers,
			body: JSON.stringify({ cover_image: url }),
		})
		if (res.ok) repointed++
		else fail(`cover ${post.slug}`, res, await readBody(res))
	}
	console.log(`  ✔ re-pointed ${repointed} post cover(s) at CMS assets`)
}

console.log(`Syncing site content to CMS "${site}" at ${base}`)
await syncForms()
await syncCollections()
await syncPosts()
const home = await homePage()
await syncPageAttributes(home)
await syncComponents(home)
await syncAssets()
console.log(failed ? '\nDone with errors.' : '\nDone.')
process.exit(failed ? 1 : 0)
