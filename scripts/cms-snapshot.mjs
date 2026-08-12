#!/usr/bin/env node
/**
 * cms-snapshot.mjs — downloads the whole site's CMS content into
 * public/site-content.json. The site's /api/site-data aggregator uses this
 * file as an offline tier: live CMS → this snapshot → hardcoded fallbacks.
 *
 * Usage:
 *   npm run cms:snapshot        # reads CMS_BASE / CMS_SITE from .env (public reads, no token)
 *   node scripts/cms-snapshot.mjs --base=https://cms.oluxstudio.com --site=deve-site
 */

import { writeFileSync } from 'node:fs'

function arg(name) {
	const match = process.argv.find(a => a.startsWith(`--${name}=`))
	return match?.slice(name.length + 3)
}

const base = arg('base') ?? process.env.CMS_BASE ?? 'http://localhost:8000'
const site = arg('site') ?? process.env.CMS_SITE ?? 'deve-site'
const api = `${base}/api/sites/${site}`
const out = 'public/site-content.json'

const [contentRes, postsRes] = await Promise.all([
	fetch(`${api}/content`, { headers: { Accept: 'application/json' } }),
	fetch(`${api}/posts?per_page=100`, { headers: { Accept: 'application/json' } }),
])
if (!contentRes.ok || !postsRes.ok) {
	console.error(`Snapshot failed: /content ${contentRes.status}, /posts ${postsRes.status}`)
	process.exit(1)
}
const content = await contentRes.json()
const posts = (await postsRes.json()).posts ?? []

writeFileSync(out, JSON.stringify({ content, posts, generated_at: new Date().toISOString() }))
console.log(`✔ wrote ${out} — ${content.collections?.length ?? 0} collections, ${content.pages?.length ?? 0} page(s), ${posts.length} posts (from ${api})`)
