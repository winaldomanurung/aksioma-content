<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aksioma Content Studio rules

- Treat JSX/React as the source of truth. JPEG files are generated artifacts and must not be hand-edited.
- Standard Instagram carousel canvas is exactly 1080 × 1350 CSS pixels.
- Every exportable slide must render through `CarouselCanvas` and keep the `data-carousel-slide` attribute.
- Preview and export must use the same DOM and component styles.
- Generated files belong in `output/` and must stay gitignored.
- Prefer reusable slide components in `components/carousel/` over duplicated markup.
- Keep each content route self-contained under `app/carousel/<slug>/page.jsx`.
- Avoid runtime randomness, time-dependent rendering, animations, or delayed layout shifts inside exportable slides.
- Fonts must be loaded before screenshots are taken.
- Decorative elements may overflow internally, but `CarouselCanvas` itself must remain fixed and `overflow-hidden`.
- Use semantic content props where practical so AI-generated content can be swapped without rewriting the design system.
