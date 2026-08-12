/**
 * cms-manifest.mjs — the single declarative source of truth for this site's
 * CMS content. `cms-sync.mjs` pushes everything here to a CMS (idempotent);
 * `cms-snapshot.mjs` pulls the CMS back down into public/site-content.json.
 *
 * Naming convention (how to identify each object type at a glance):
 *   components   section-<name>            e.g. section-hero, section-about-intro
 *   collections  plural kebab slug, section-scoped when section-specific
 *                e.g. services, about → stats/team/collage, blog → post-meta
 *   posts        slug (auto-generated from the title)
 *   assets       <section>-<purpose>-<n>.<ext>   e.g. blog-cover-1.png
 *   forms        plain form name matched by the submitting component
 *                e.g. contact, newsletter, quote, blog-comments
 */


// ── Forms ───────────────────────────────────────────────────────────────────
// Field keys are the source of truth — components submit payloads whose keys
// must match (sections/contact.vue, sections/newsletter.vue, pricing/Panel.vue,
// blog/Post.vue).

const FORMS = [
	{
		name: 'contact',
		title: 'Contact',
		description: 'Main contact form on the portfolio homepage',
		is_active: true,
		fields: [
			{ key: 'name', label: 'Full Name', type: 'text', required: true },
			{ key: 'email', label: 'Email Address', type: 'email', required: true },
			{ key: 'subject', label: 'Subject', type: 'text', required: true },
			{ key: 'message', label: 'Message', type: 'textarea', required: true },
		],
	},
	{
		name: 'newsletter',
		title: 'Newsletter Signup',
		description: 'Newsletter subscription form',
		is_active: true,
		fields: [
			{ key: 'name', label: 'Full Name', type: 'text', required: true },
			{ key: 'email', label: 'Email Address', type: 'email', required: true },
		],
	},
	{
		name: 'quote',
		title: 'Project Enquiry',
		description: 'Pricing panel enquiry form',
		is_active: true,
		fields: [
			{ key: 'name', label: 'Full Name', type: 'text', required: true },
			{ key: 'email', label: 'Email Address', type: 'email', required: true },
			{ key: 'phone', label: 'Phone', type: 'tel', required: false },
			// text, not url: the CMS url rule rejects bare domains like "example.com"
			{ key: 'website', label: 'Current Website', type: 'text', required: false },
			{ key: 'message', label: 'Project Details', type: 'textarea', required: true },
			// text, not select: value is set programmatically from the plan name,
			// so renaming a plan can never cause a validation failure
			{ key: 'plan', label: 'Selected Package', type: 'text', required: true },
		],
	},
	{
		name: 'blog-comments',
		title: 'Blog Comments',
		description: 'Comments submitted on blog posts',
		is_active: true,
		fields: [
			// text: posts are identified by CMS slug (fallback posts use numeric ids)
			{ key: 'post_slug', label: 'Post', type: 'text', required: true },
			{ key: 'post_title', label: 'Post Title', type: 'text', required: false },
			{ key: 'name', label: 'Name', type: 'text', required: true },
			{ key: 'comment', label: 'Comment', type: 'textarea', required: true },
		],
	},
]

// ── Collections ─────────────────────────────────────────────────────────────
// Multi-line textarea fields hold one entry per line; the app splits on "\n".

const COLLECTIONS = [
	{
		name: 'services',
		type: 'grid',
		description: 'Service cards shown in the Services section (details: one point per line)',
		fields: [
			{ key: 'icon', label: 'Icon (bootstrap-icons classes)', type: 'text' },
			{ key: 'header', label: 'Title', type: 'text', required: true },
			{ key: 'text', label: 'Summary', type: 'textarea', required: true },
			{ key: 'details', label: 'Detail points (one per line)', type: 'textarea' },
		],
		items: [
			{ icon: 'bi bi-laptop text-3xl text-primary', header: 'Custom Website Design', text: 'Bespoke websites built from scratch — no templates. Every pixel crafted to reflect your brand identity and business goals.', details: 'Full discovery session to understand your brand, goals, and audience\nCustom wireframes and design mockups before any code is written\nTypography, colour, and layout decisions tailored to your identity\nFully bespoke — no page builders, no cookie-cutter themes\n2 rounds of design revisions included as standard\nFinal handoff includes all source files and assets' },
			{ icon: 'bi bi-phone text-3xl text-primary', header: 'Responsive Development', text: 'Fast, fluid experiences across every screen size. Built with modern frameworks for performance and long-term maintainability.', details: 'Mobile-first approach — designed for phones, scaled up to desktop\nBuilt with Nuxt 3, Vue, and Tailwind CSS for modern performance\nTested across all major browsers and device sizes\nSmooth animations and transitions that enhance — not distract\nClean, maintainable code with clear documentation\nLighthouse scores of 90+ targeted across all categories' },
			{ icon: 'bi bi-cart3 text-3xl text-primary', header: 'E-Commerce Solutions', text: 'Online stores that convert. From product pages to checkout flows, we build shops that are easy to manage and built to sell.', details: 'Custom product catalogue with filtering, search, and variants\nStreamlined, distraction-free checkout flow to reduce drop-off\nSecure payment integration (Stripe, PayPal, and more)\nInventory and order management built in or integrated\nAbandoned cart recovery and upsell logic available\nHeadless commerce architecture for maximum flexibility' },
			{ icon: 'bi bi-pencil-square text-3xl text-primary', header: 'CMS Integration', text: 'Take control of your content. We integrate headless CMS platforms so you can update your site without touching code.', details: 'Headless CMS setup with Sanity, Contentful, or your preferred platform\nCustom content schemas matched to your exact content structure\nIntuitive editing experience — no developer needed for updates\nPreview mode so you can review changes before publishing\nRole-based access control for teams of any size\nFull training and documentation provided on handoff' },
			{ icon: 'bi bi-graph-up-arrow text-3xl text-primary', header: 'SEO & Performance', text: 'Sites built with Core Web Vitals in mind — optimised images, clean code, and structured data baked in from day one.', details: 'Semantic HTML structure for strong crawlability from day one\nMeta tags, Open Graph, and structured data (JSON-LD) configured\nImage optimisation — WebP conversion, lazy loading, correct sizing\nCore Web Vitals optimisation: LCP, CLS, and INP targets met\nGoogle Analytics 4 and Search Console setup and verification\nOngoing SEO audit reports available as part of support plans' },
			{ icon: 'bi bi-wrench-adjustable text-3xl text-primary', header: 'Ongoing Support', text: 'Your site is never truly finished. We offer maintenance plans to keep things updated, secure, and performing at their best.', details: 'Monthly or quarterly maintenance plans to suit your needs\nDependency and security updates applied proactively\nPerformance monitoring with alerts for downtime or regressions\nPriority response SLA — issues addressed within 1 business day\nContent updates and minor feature additions included in plan\nQuarterly review calls to align the site with your business goals' },
		],
	},
	{
		name: 'pricing-plans',
		type: 'grid',
		description: 'Pricing tiers (features: one per line; price is display text)',
		fields: [
			{ key: 'name', label: 'Plan name', type: 'text', required: true },
			{ key: 'price', label: 'Price (display text)', type: 'text', required: true },
			{ key: 'description', label: 'Description', type: 'textarea' },
			{ key: 'features', label: 'Features (one per line)', type: 'textarea' },
			{ key: 'cta', label: 'Button label', type: 'text' },
			{ key: 'featured', label: 'Most popular?', type: 'checkbox' },
		],
		items: [
			{ name: 'Starter', price: '799', description: 'Perfect for freelancers, creatives, and small businesses needing a clean, professional presence online.', features: 'Up to 3 pages\nResponsive design\nContact form\nSEO foundations\n2 rounds of revisions\n30-day post-launch support', cta: 'Get started', featured: false },
			{ name: 'Growth', price: '1,999', description: 'For growing businesses that need a full site, CMS control, and a stronger digital foundation.', features: 'Up to 8 pages\nCMS integration\nBlog or news section\nPerformance optimisation\nGoogle Analytics setup\n3 months post-launch support', cta: 'Get started', featured: true },
			{ name: 'Custom', price: 'Let\'s talk', description: 'Complex web apps, e-commerce builds, or anything requiring a fully tailored solution — we scope it together.', features: 'Unlimited scope\nE-commerce / web app\nCustom integrations & APIs\nDedicated project management\nOngoing retainer available\nPriority support', cta: 'Contact us', featured: false },
		],
	},
	{
		name: 'projects',
		type: 'grid',
		description: 'Portfolio projects (images/tech: one per line)',
		fields: [
			{ key: 'title', label: 'Title', type: 'text', required: true },
			{ key: 'category', label: 'Category', type: 'select', options: ['Web Design', 'E-Commerce', 'Branding', 'UI/UX', 'Development'] },
			{ key: 'year', label: 'Year', type: 'text' },
			{ key: 'description', label: 'Description', type: 'textarea' },
			{ key: 'tech', label: 'Tech stack (one per line)', type: 'textarea' },
			{ key: 'images', label: 'Image paths (one per line)', type: 'textarea' },
			{ key: 'url', label: 'Live URL', type: 'text' },
		],
		items: [
			{ title: 'Nexus Studio', category: 'Web Design', year: '2024', description: 'A full brand and web presence for a creative studio. Bold typographic-led design with strong motion principles. Nuxt-powered with custom scroll animations, a project case study system, and a dark/light theme toggle.', tech: 'Nuxt 3\nTailwind CSS\nGSAP\nSanity CMS', images: '/images/portfolio/port1.png\n/images/portfolio/port2.png\n/images/portfolio/port3.png', url: '#' },
			{ title: 'Bloom E-Shop', category: 'E-Commerce', year: '2024', description: 'A premium floral e-commerce store for a UK-based florist. Custom product builder, real-time stock management, and seamless Stripe checkout with delivery slot selection.', tech: 'Nuxt 3\nStripe\nPinia\nTailwind CSS', images: '/images/portfolio/port4.png\n/images/portfolio/port6.webp\n/images/portfolio/port7.png', url: '#' },
			{ title: 'Forma Brand Identity', category: 'Branding', year: '2023', description: 'Complete brand identity system for a B2B SaaS startup — logo, colour system, typography hierarchy, icon library, and full brand guidelines document.', tech: 'Figma\nIllustrator\nBrand Guidelines', images: '/images/portfolio/port8.png\n/images/portfolio/port9.webp\n/images/portfolio/port10.webp' },
			{ title: 'Flux Dashboard', category: 'UI/UX', year: '2024', description: 'Data analytics dashboard UI for an internal ops team. Custom charts, filterable tables, and a collapsible sidebar — designed in Figma with a full component handoff.', tech: 'Figma\nPrototyping\nDesign System', images: '/images/portfolio/port11.webp\n/images/portfolio/port12.png\n/images/portfolio/port13.webp' },
			{ title: 'Apex Consulting', category: 'Web Design', year: '2023', description: 'Corporate website for a Manchester consulting firm — case study pages, team profiles, and a custom enquiry system. SEO-optimised with a 98 Lighthouse score.', tech: 'Nuxt 3\nContentful\nTailwind CSS\nTypeScript', images: '/images/portfolio/port14.webp\n/images/portfolio/port15.png\n/images/portfolio/port16.webp', url: '#' },
			{ title: 'NorthBay Goods', category: 'E-Commerce', year: '2024', description: 'High-volume outdoor goods platform with thousands of SKUs — headless Shopify backend, custom Vue storefront, faceted search, and a loyalty rewards programme.', tech: 'Nuxt 3\nShopify Headless\nAlgolia\nVue', images: '/images/portfolio/port17.webp\n/images/portfolio/port18.png\n/images/portfolio/port19.png', url: '#' },
			{ title: 'Slate CMS Platform', category: 'Development', year: '2023', description: 'Bespoke CMS for a media group with multiple publication brands — multi-tenant, role-based access, visual page builder, and a REST API powering their mobile app.', tech: 'Node.js\nVue 3\nPostgreSQL\nREST API', images: '/images/portfolio/port20.webp\n/images/portfolio/port21.webp\n/images/portfolio/port22.png' },
			{ title: 'Halo Identity', category: 'Branding', year: '2024', description: 'Rebranding for a wellness startup — soft gradients, approachable typography, and a visual language centred on calm and clarity. Delivered as a full Figma design system.', tech: 'Figma\nIllustrator\nMotion Design', images: '/images/portfolio/port1.png\n/images/portfolio/port4.png\n/images/portfolio/port8.png' },
			{ title: 'Velo Ride App', category: 'UI/UX', year: '2023', description: 'Mobile UI for a cycling route planning app — full user flow from onboarding to route creation, segment tracking, and social sharing with high-fidelity prototypes.', tech: 'Figma\nPrototyping\nMobile UI\nUser Testing', images: '/images/portfolio/port9.webp\n/images/portfolio/port12.png\n/images/portfolio/port15.png' },
			{ title: 'Pulse Landing Page', category: 'Web Design', year: '2024', description: 'High-converting SaaS landing page for a B2B email automation tool. A/B tested hero variants, animated feature sections, and Calendly integration — 34% improvement in sign-ups.', tech: 'Nuxt 3\nTailwind CSS\nCalendly API', images: '/images/portfolio/port13.webp\n/images/portfolio/port16.webp\n/images/portfolio/port19.png', url: '#' },
			{ title: 'Grid Design System', category: 'UI/UX', year: '2024', description: '200+ component design system for a fintech company — dark/light modes, accessibility-first patterns, and a Storybook-integrated documentation site across 5 product squads.', tech: 'Figma\nStorybook\nVue 3\nWCAG 2.1', images: '/images/portfolio/port7.png\n/images/portfolio/port10.webp\n/images/portfolio/port22.png' },
			{ title: 'Forte Digital', category: 'Development', year: '2023', description: 'Web app for a digital agency — project management, deliverable tracking, automated invoicing, PDF export, and a client-facing read-only portal.', tech: 'Nuxt 3\nSupabase\nTypeScript\nPDFKit', images: '/images/portfolio/port2.png\n/images/portfolio/port6.webp\n/images/portfolio/port11.webp', url: '#' },
		],
	},
	{
		name: 'testimonials',
		type: 'list',
		description: 'Client testimonials',
		fields: [
			{ key: 'quote', label: 'Quote', type: 'textarea', required: true },
			{ key: 'name', label: 'Name', type: 'text', required: true },
			{ key: 'role', label: 'Role', type: 'text' },
			{ key: 'company', label: 'Company', type: 'text' },
			{ key: 'initials', label: 'Initials', type: 'text' },
			{ key: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5 },
		],
		items: [
			{ quote: 'Olux Studio delivered our new website ahead of schedule and it looked better than anything we could have imagined. The attention to detail and communication throughout was exceptional.', name: 'Sarah Mitchell', role: 'Founder', company: 'Bloom Creative', initials: 'SM', rating: 5 },
			{ quote: 'We needed a complete redesign fast. Olux understood our brand immediately and built something that genuinely sets us apart from competitors. Our enquiries doubled within a month of launch.', name: 'James Patel', role: 'Managing Director', company: 'Apex Consulting', initials: 'JP', rating: 5 },
			{ quote: 'Working with Olux was effortless. They asked the right questions, pushed back on ideas that wouldn\'t work, and delivered a clean, fast site that our team can actually manage ourselves.', name: 'Lauren Davies', role: 'Marketing Manager', company: 'Forte Digital', initials: 'LD', rating: 5 },
			{ quote: 'The e-commerce site they built for us handles hundreds of orders a week without a hitch. The UX is intuitive, the checkout is fast, and our conversion rate has never been higher.', name: 'Tom Reeves', role: 'CEO', company: 'NorthBay Goods', initials: 'TR', rating: 5 },
			{ quote: 'I came with a rough idea and a tight budget. Olux was honest about what was achievable, prioritised beautifully, and the result is a site I\'m genuinely proud to share with clients.', name: 'Amara Osei', role: 'Freelance Consultant', company: 'AO Strategy', initials: 'AO', rating: 5 },
			{ quote: 'From the first call to launch day, Olux Studio made the whole process feel simple. They\'re the kind of team you keep on retainer because losing them would be a real step backwards.', name: 'Daniel Wright', role: 'Head of Digital', company: 'Meridian Group', initials: 'DW', rating: 5 },
		],
	},
	{
		name: 'faq',
		type: 'list',
		description: 'FAQ entries, grouped by tab',
		fields: [
			{ key: 'group', label: 'Group', type: 'select', options: ['general', 'process', 'technical', 'pricing'], required: true },
			{ key: 'question', label: 'Question', type: 'text', required: true },
			{ key: 'answer', label: 'Answer', type: 'textarea', required: true },
		],
		items: [
			{ group: 'general', question: 'What is Olux Studio?', answer: 'Olux Studio is a specialist web design and development studio based in Blackburn, Lancashire. We build bespoke websites and digital experiences for businesses, startups, and creatives who want to stand out online.' },
			{ group: 'general', question: 'Do you work with clients remotely?', answer: 'Absolutely. Most of our clients are remote. We communicate via video call, email, and shared project boards — no need to be local to work with us.' },
			{ group: 'general', question: 'What industries do you work with?', answer: 'We work across a wide range of industries including retail, professional services, hospitality, creative agencies, and technology startups. If you have a website need, we can help.' },
			{ group: 'process', question: 'How long does a typical project take?', answer: 'Most projects land between 2–6 weeks. A simple landing page can be ready in 1–2 weeks, while a full multi-page site with CMS integration typically takes 4–6 weeks. We agree on a timeline before any work begins.' },
			{ group: 'process', question: 'What do you need from me to get started?', answer: 'A brief covering your goals, target audience, and any sites you admire. From there we\'ll schedule a discovery call to scope the project properly before sending a proposal.' },
			{ group: 'process', question: 'How many rounds of revisions do I get?', answer: 'All plans include at least 2 rounds of design revisions. We work collaboratively throughout, so by the time we reach revisions the design is usually very close to final.' },
			{ group: 'technical', question: 'What tech stack do you use?', answer: 'We primarily build with Nuxt 3, Vue, and Tailwind CSS for custom sites. For CMS-driven projects we use headless options like Sanity or Contentful. We\'re tech-agnostic and can work within your existing stack if needed.' },
			{ group: 'technical', question: 'Will I own the code?', answer: 'Yes — full code ownership is transferred to you on project completion. We don\'t use proprietary builders or lock you into our systems.' },
			{ group: 'technical', question: 'Can you work with my existing website?', answer: 'Yes. We offer redesigns, partial rebuilds, and performance audits. Get in touch with details of your current site and we\'ll advise on the best path forward.' },
			{ group: 'pricing', question: 'How much does a website cost?', answer: 'Our Starter plan begins at £799 for up to 3 pages. Full multi-page sites start at £1,999. Custom apps and e-commerce builds are scoped individually. See our Services section for full pricing details.' },
			{ group: 'pricing', question: 'Do you offer payment plans?', answer: 'Yes — we typically split projects into a 50% deposit upfront and 50% on completion. For larger projects we can arrange milestone-based payment schedules.' },
			{ group: 'pricing', question: 'What happens if I need changes after launch?', answer: 'All plans include a post-launch support window (30 days on Starter, 3 months on Growth). After that, changes are covered under a monthly retainer or billed at our standard hourly rate.' },
		],
	},
	{
		name: 'socials',
		type: 'list',
		description: 'Social media links (footer + contact section)',
		fields: [
			{ key: 'label', label: 'Label', type: 'text', required: true },
			{ key: 'icon', label: 'Icon (bootstrap-icons class)', type: 'text' },
			{ key: 'href', label: 'Link', type: 'text' },
		],
		items: [
			{ label: 'LinkedIn', icon: 'bi-linkedin', href: '#' },
			{ label: 'GitHub', icon: 'bi-github', href: '#' },
			{ label: 'Twitter/X', icon: 'bi-twitter-x', href: '#' },
			{ label: 'Instagram', icon: 'bi-instagram', href: '#' },
		],
	},
	{
		name: 'stats',
		type: 'list',
		description: 'About section stats bar',
		fields: [
			{ key: 'value', label: 'Value (display text)', type: 'text', required: true },
			{ key: 'label', label: 'Label', type: 'text', required: true },
		],
		items: [
			{ value: '50+', label: 'Projects Delivered' },
			{ value: '30+', label: 'Happy Clients' },
			{ value: '5+', label: 'Years Experience' },
			{ value: '100%', label: 'On-Time Delivery' },
		],
	},
	{
		name: 'testimonial-stats',
		type: 'list',
		description: 'Testimonials section stats strip',
		fields: [
			{ key: 'value', label: 'Value (display text)', type: 'text', required: true },
			{ key: 'label', label: 'Label', type: 'text', required: true },
		],
		items: [
			{ value: '50+', label: 'Projects completed' },
			{ value: '30+', label: 'Happy clients' },
			{ value: '4.9★', label: 'Average rating' },
			{ value: '100%', label: 'Would recommend us' },
		],
	},
	{
		name: 'team',
		type: 'list',
		description: 'About section team cards',
		fields: [
			{ key: 'name', label: 'Name', type: 'text', required: true },
			{ key: 'role', label: 'Role', type: 'text', required: true },
			{ key: 'initials', label: 'Initials (avatar)', type: 'text' },
		],
		items: [
			{ name: 'Oluwaseun', role: 'Founder & Lead Developer', initials: 'O' },
			{ name: 'Design Lead', role: 'UI / UX Designer', initials: 'DL' },
			{ name: 'Dev Support', role: 'Frontend Engineer', initials: 'DS' },
		],
	},
	{
		// Schema only — NOT seeded. The fallback collage uses bundled assets;
		// once items exist here they fully replace it, so add items only after
		// uploading the media to the CMS Assets library and using those URLs.
		name: 'collage',
		type: 'list',
		description: 'About intro collage slideshow (url: absolute Asset URL for image/video; label+text for text slides)',
		fields: [
			{ key: 'type', label: 'Type', type: 'select', options: ['image', 'video', 'text'], required: true },
			{ key: 'url', label: 'Media URL (image/video)', type: 'text' },
			{ key: 'alt', label: 'Alt text', type: 'text' },
			{ key: 'label', label: 'Label (text slides)', type: 'text' },
			{ key: 'text', label: 'Text (text slides)', type: 'textarea' },
		],
		items: [],
	},
	{
		// The posts API doesn't carry a category field, so category lives here,
		// matched to posts by exact title (see sections/blog.vue).
		name: 'post-meta',
		type: 'list',
		description: 'Per-post metadata the posts API does not carry (category, matched by post title)',
		fields: [
			{ key: 'title', label: 'Post title (must match the post exactly)', type: 'text', required: true },
			{ key: 'category', label: 'Category', type: 'select', options: ['Design', 'Development', 'UI/UX', 'Business', 'Tutorial'], required: true },
		],
		items: [
			{ title: 'Why Custom Websites Outperform Templates Every Time', category: 'Design' },
			{ title: '10 UI Design Trends Shaping the Web in 2025', category: 'UI/UX' },
			{ title: 'How Core Web Vitals Directly Affect Your Google Rankings', category: 'Development' },
			{ title: 'The Case for Headless CMS in Modern Web Projects', category: 'Development' },
			{ title: 'Mobile-First Design: Why It\'s Non-Negotiable in 2025', category: 'Design' },
			{ title: 'How to Brief a Web Designer: A Client\'s Complete Guide', category: 'Business' },
			{ title: 'UI vs UX: Understanding the Real Difference', category: 'UI/UX' },
			{ title: 'From Sketch to Code: Our Design-to-Dev Workflow', category: 'Tutorial' },
			{ title: 'Why Page Speed Is Your Best Sales Tool', category: 'Business' },
			{ title: 'Setting Up a Nuxt 3 Project the Right Way', category: 'Tutorial' },
			{ title: 'The Psychology of Colour in Web Design', category: 'Design' },
			{ title: 'Accessible Websites: Beyond the Basics of WCAG', category: 'Development' },
			{ title: 'What to Look for When Hiring a Web Design Agency', category: 'Business' },
		],
	},
	{
		name: 'contact-info',
		type: 'list',
		description: 'Contact tiles (contact section + footer)',
		fields: [
			{ key: 'icon', label: 'Icon (bootstrap-icons class)', type: 'text' },
			{ key: 'label', label: 'Label', type: 'text', required: true },
			{ key: 'value', label: 'Value', type: 'text', required: true },
		],
		items: [
			{ icon: 'bi-envelope-fill', label: 'Email', value: 'contact@oluxstudio.com' },
			{ icon: 'bi-telephone-fill', label: 'Phone', value: '+44 78 2768 5736' },
			{ icon: 'bi-geo-alt-fill', label: 'Location', value: 'Blackburn, Lancashire, UK' },
			{ icon: 'bi-clock-fill', label: 'Response', value: 'Within 1 working day' },
		],
	},
]

// ── Blog posts ──────────────────────────────────────────────────────────────
// body: paragraphs separated by blank lines (the app splits on \n\n).

const POSTS = [
	{ title: 'Why Custom Websites Outperform Templates Every Time', cover_image: '/images/blogs/blog1.png', category: 'Design', published_at: '2025-05-12', excerpt: 'Templates promise speed, but they trade your brand\'s uniqueness for convenience — businesses that invest in bespoke design consistently see stronger engagement and better conversion rates.', body: ['Templates promise speed, but they trade your brand’s uniqueness for convenience — businesses that invest in bespoke design consistently see stronger engagement and better conversion rates.', 'When you use a template, you start with someone else’s idea of what your site should look like. You inherit their assumptions, their layout decisions, and their structural limitations. Custom websites start with you — your brand, your goals, your users.', 'The data backs this up. Studies consistently show that purpose-built sites outperform template sites on key metrics including time on page, bounce rate, and conversion.', 'At Olux Studio, every project begins with discovery — understanding your business, your audience, and what success looks like for you.'] },
	{ title: '10 UI Design Trends Shaping the Web in 2025', cover_image: '/images/blogs/blog2.png', category: 'UI/UX', published_at: '2025-05-08', excerpt: 'From glassmorphism to AI-assisted layouts, the visual web is evolving fast. We break down the ten trends worth paying attention to this year.', body: ['From glassmorphism to AI-assisted layouts, the visual web is evolving fast. We break down the ten trends worth paying attention to this year.', 'Bold typography is back — large, expressive type is being used as a primary visual element rather than just a content carrier.', 'Dark mode is now table stakes. Users expect it, and designers are embracing the creative freedom it offers.', 'Micro-interactions are becoming more sophisticated. Done well, they make an interface feel alive and responsive.'] },
	{ title: 'How Core Web Vitals Directly Affect Your Google Rankings', cover_image: '/images/blogs/blog3.png', category: 'Development', published_at: '2025-05-03', excerpt: 'Speed, interactivity, and visual stability are now official ranking signals. Here\'s what that means for your site and how to improve your scores.', body: ['Speed, interactivity, and visual stability are now official ranking signals. Here’s what that means for your site and how to improve your scores.', 'Google’s Core Web Vitals measure three things: Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.', 'A poor score doesn’t just affect user experience — it directly impacts your position in search results.', 'The good news is that most issues are fixable with the right technical approach.'] },
	{ title: 'The Case for Headless CMS in Modern Web Projects', cover_image: '/images/blogs/blog4.png', category: 'Development', published_at: '2025-04-28', excerpt: 'Decoupled content management gives your team editorial freedom without locking you into a rigid frontend. Here\'s when it makes sense.', body: ['Decoupled content management gives your team editorial freedom without locking you into a rigid frontend.', 'A headless CMS stores your content and exposes it via an API. Your frontend fetches and displays that content.', 'This separation brings real advantages for both content teams and developers.', 'Popular options we work with include Sanity, Contentful, and Directus.'] },
	{ title: 'Mobile-First Design: Why It\'s Non-Negotiable in 2025', cover_image: '/images/blogs/blog5.png', category: 'Design', published_at: '2025-04-22', excerpt: 'Over 60% of web traffic is mobile. Designing desktop-first and scaling down is no longer good enough — here\'s how to flip the process.', body: ['Over 60% of web traffic is mobile. Designing desktop-first and scaling down is no longer good enough.', 'Mobile-first design means starting with the smallest screen and progressively enhancing for larger viewports.', 'The benefits ripple outward — faster sites, better Core Web Vitals, higher rankings.', 'In practice, it means designing the mobile layout first and testing on real devices throughout.'] },
	{ title: 'How to Brief a Web Designer: A Client\'s Complete Guide', cover_image: '/images/blogs/blog6.png', category: 'Business', published_at: '2025-04-15', excerpt: 'A strong brief is the difference between a project that runs smoothly and one that derails. Here\'s exactly what to include.', body: ['A strong brief is the difference between a project that runs smoothly and one that derails.', 'The most important thing in any brief is clarity about goals.', 'Include examples of sites you admire — and explain what you like about them.', 'Budget and timeline matter, even if you’re not sure exactly.'] },
	{ title: 'UI vs UX: Understanding the Real Difference', cover_image: '/images/blogs/blog7.png', category: 'UI/UX', published_at: '2025-04-09', excerpt: 'They\'re often used interchangeably, but UI and UX are distinct disciplines. Understanding the difference helps you hire the right help.', body: ['They’re often used interchangeably, but UI and UX are distinct disciplines.', 'UX is about the overall journey — flows, architecture, and research.', 'UI is about the presentation layer — visual systems, typography, colour, spacing.', 'Many designers do both, but the skills and mindsets are different.'] },
	{ title: 'From Sketch to Code: Our Design-to-Dev Workflow', cover_image: '/images/blogs/blog8.png', category: 'Tutorial', published_at: '2025-04-01', excerpt: 'A transparent look at how Olux Studio takes a project from initial wireframe to production-ready code in six clear stages.', body: ['A transparent look at how Olux Studio takes a project from wireframe to production-ready code in six clear stages.', 'Discovery, architecture, and wireframing establish the foundation.', 'Visual design applies the brand; development builds it in code.', 'QA and launch close out the process with testing and monitoring.'] },
	{ title: 'Why Page Speed Is Your Best Sales Tool', cover_image: '/images/blogs/blog9.png', category: 'Business', published_at: '2025-03-24', excerpt: 'A one-second delay in load time can cost you 7% in conversions. Page speed isn\'t a technical detail — it\'s a revenue driver.', body: ['A one-second delay in load time can cost you 7% in conversions.', 'The research is unambiguous — Amazon, Google, and Walmart have all quantified the impact.', 'Speed affects how users perceive your brand.', 'Speed is an engineering problem with known solutions.'] },
	{ title: 'Setting Up a Nuxt 3 Project the Right Way', cover_image: '/images/blogs/blog10.png', category: 'Tutorial', published_at: '2025-03-17', excerpt: 'Nuxt 3 is a powerful Vue meta-framework, but a poor setup leads to technical debt fast. Here\'s the opinionated starter config we use.', body: ['Nuxt 3 is powerful, but a poor setup leads to technical debt fast.', 'Start with TypeScript enabled from day one.', 'Choose your CSS approach early and stick to it.', 'Set up state management and linting before you need them.'] },
	{ title: 'The Psychology of Colour in Web Design', cover_image: '/images/blogs/blog11.png', category: 'Design', published_at: '2025-03-10', excerpt: 'Colour choices influence trust, emotion, and action. Here\'s how we use colour theory to make deliberate design decisions for our clients.', body: ['Colour isn’t decoration — it’s communication.', 'Different colours carry different associations, and these vary by culture.', 'Colour theory is more nuanced than colour associations.', 'Choose your brand colours for what they communicate, not just what you like.'] },
	{ title: 'Accessible Websites: Beyond the Basics of WCAG', cover_image: '/images/blogs/blog12.png', category: 'Development', published_at: '2025-03-03', excerpt: 'Accessibility isn\'t a checklist — it\'s a mindset. We explore how building inclusively benefits all users, not just those with disabilities.', body: ['Building accessible websites is both the right thing to do and good for business.', 'Accessibility starts with semantic HTML.', 'Colour contrast is a common failure and an easy fix.', 'Keyboard navigation is a foundational requirement.'] },
	{ title: 'What to Look for When Hiring a Web Design Agency', cover_image: '/images/blogs/blog13.png', category: 'Business', published_at: '2025-02-24', excerpt: 'Not all agencies are equal. Here\'s the checklist we\'d use ourselves — covering portfolio quality, process transparency, and post-launch support.', body: ['Knowing the difference can save you significant time and money.', 'A redesign changes the look and feel while keeping the structure intact.', 'A rebuild starts from scratch when technical debt is limiting you.', 'The only way to know which you need is an honest technical audit.'] },
]

// ── Page "/" attributes (hero + section copy) ───────────────────────────────

const PAGE_ATTRIBUTES = {
	hero_headline: 'Let me help you with your project',
	hero_sub: 'I make the complex simple',
	hero_words: 'Web Development\nMobile Apps\nDigital Solutions\nUI/UX Design\nBranding\nAutomation',
	hero_cta: 'Let\'s Get Started',
	// About
	about_intro_subtitle: 'From first sketch to final click, we help your vision come alive online.',
	about_intro_headline: 'Turning Bright Ideas into',
	about_intro_headline_accent: 'Beautiful Websites',
	about_intro_body: 'A modern web studio is a creative and technical partner that designs and builds high-quality, custom digital experiences. We\'re a small, specialised team focused on creating websites and digital products that are visually striking, high-performing, and conversion-driven.',
	about_intro_cta: 'See our services',
	about_mission: 'We are on a mission to help businesses reach their full potential through smarter and more purposeful web experiences built for the modern world.',
	about_team_label: 'Team',
	about_team_header: 'Meet the Studio',
	about_team_sub: 'Small team. Big impact. Direct access to the people building your project.',
	about_faq_label: 'Got questions?',
	about_faq_desc: 'Clear answers to common questions about our studio, process, and services.',
	about_cta_heading: 'Let\'s build something great together',
	about_cta_body: 'Tell us about your project and we\'ll get back to you within 24 hours.',
	about_cta_primary: 'Get in touch',
	about_cta_secondary: 'See our services',
	// Services + pricing
	services_intro: 'From first sketch to final click, we help your vision come alive online.',
	services_header: 'What We Do',
	pricing_label: 'Simple, transparent pricing',
	pricing_header: 'Choose Your Plan',
	pricing_sub: 'Every project is different — pick the tier that fits, or reach out for a tailored quote.',
	services_cta_heading: 'Got a project in mind?',
	services_cta_body: 'Let\'s talk about what we can build together.',
	services_cta_button: 'Get in touch',
	// Testimonials
	testimonials_label: 'Client testimonials',
	testimonials_header: 'Trusted by businesses across the UK',
	testimonials_cta_heading: 'Ready to join them?',
	testimonials_cta_button: 'Start your project',
	// Newsletter
	newsletter_label: 'Stay in the loop',
	newsletter_heading: 'Web insights,',
	newsletter_heading_accent: 'delivered weekly.',
	newsletter_body: 'Get practical articles on web design, development, and growing your business online — straight to your inbox. No spam, unsubscribe any time.',
	newsletter_benefits: 'Practical web design & dev tips\nStudio project case studies\nIndustry news, curated weekly\nExclusive offers for subscribers',
	newsletter_form_title: 'Join the newsletter',
	newsletter_form_sub: 'Enter your details below to start receiving updates.',
	// Contact
	contact_label: 'Let\'s talk',
	contact_heading: 'Have a project in mind? Let\'s build it.',
	// Blog
	blog_articles_header: 'All Articles',
	blog_sidebar_newsletter_desc: 'Subscribe to get web design insights and studio updates delivered weekly.',
	blog_default_author: 'Oluwaseun',
	portfolio_intro: 'A selection of projects we\'re proud of — from landing pages to full web applications. Each one built with purpose, precision, and care.',
	testimonials_intro: 'Don\'t just take our word for it — here\'s what our clients have to say about working with Olux Studio.',
	contact_intro: 'Whether you have a brief ready or just an idea, we\'d love to hear from you. Fill in the form and we\'ll get back to you within one working day.',
	footer_tagline: 'A specialist web design and development studio based in Blackburn, UK. We build fast, beautiful, purposeful websites for businesses that care about quality.',
}


// ── Components (named bags of typed nodes, attached to a page) ──────────────
// Node types: text, url, image, number, boolean, color, collection.
// `renameFrom` lets cms-sync migrate pre-convention names instead of duplicating.

const COMPONENTS = [
	{
		name: 'section-hero',
		renameFrom: ['Hero'],
		description: 'Hero section copy',
		page: '/',
		nodes: [
			{ label: 'headline', type: 'text', value: 'Let me help you with your project' },
			{ label: 'sub', type: 'text', value: 'I make the complex simple' },
			{ label: 'words', type: 'text', value: 'Web Development\nMobile Apps\nDigital Solutions\nUI/UX Design\nBranding\nAutomation' },
			{ label: 'cta', type: 'text', value: 'Let\'s Get Started' },
		],
	},
	{
		name: 'section-about-intro',
		renameFrom: ['About Intro'],
		description: 'Intro block of the About section',
		page: '/',
		nodes: [
			{ label: 'subtitle', type: 'text', value: 'From first sketch to final click, we help your vision come alive online.' },
			{ label: 'headline', type: 'text', value: 'Turning Bright Ideas into' },
			{ label: 'accent', type: 'text', value: 'Beautiful Websites' },
			{ label: 'body', type: 'text', value: 'A modern web studio is a creative and technical partner that designs and builds high-quality, custom digital experiences. We\'re a small, specialised team focused on creating websites and digital products that are visually striking, high-performing, and conversion-driven.' },
			{ label: 'cta', type: 'text', value: 'See our services' },
		],
	},
]

// ── Assets (uploaded to the CMS media library) ──────────────────────────────
// `file` is repo-relative; `renameFrom` migrates earlier upload names;
// `use.post` re-points that post's cover_image at the uploaded asset's URL.

const ASSETS = POSTS.map((post, i) => ({
	name: `blog-cover-${i + 1}.png`,
	renameFrom: [`blog${i + 1}.png`],
	file: `public/images/blogs/blog${i + 1}.png`,
	use: { post: post.title },
}))

export { FORMS, COLLECTIONS, POSTS, PAGE_ATTRIBUTES, COMPONENTS, ASSETS }
