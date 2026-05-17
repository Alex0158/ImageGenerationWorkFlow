# Designer Atelier Landing - Quick Setup Guide

This repository is an Astro static landing page for an independent graphic designer / visual design atelier.

The goal of this guide is to take a fresh machine or a fresh clone from zero to a local browser preview with the smallest reliable set of steps.

## 1. Prerequisites

Install or confirm these tools first:

- Git
- Node.js 22.x recommended
- pnpm 10.x recommended

Check your local versions:

```bash
git --version
node -v
pnpm -v
```

If `pnpm` is missing, install it with Corepack:

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm -v
```

## 2. Clone The Repository

```bash
cd /Users/alex/AdsManagement
git clone https://github.com/Alex0158/ImageGenerationWorkFlow.git
cd ImageGenerationWorkFlow
```

If GitHub asks for authentication, use your normal GitHub account / token flow. Do not paste tokens into project files.

## 3. Install Dependencies

```bash
pnpm install
```

Expected result:

- `node_modules/` is created locally.
- No source files should be changed by this step.
- `pnpm-lock.yaml` should already exist in the repo.

## 4. Validate Portfolio Assets

Run this before starting the site:

```bash
pnpm validate:works
```

Expected result:

```text
Validated 20 work entries and optimized asset sets.
```

This confirms that `src/data/works.ts` matches the optimized AVIF / WebP files under `public/assets/works/`.

## 5. Start Local Dev Server

```bash
pnpm dev -- --host 127.0.0.1
```

Then open the site in your browser:

```text
http://localhost:4321/
```

If that does not load, try:

```text
http://127.0.0.1:4321/
```

Astro normally uses port `4321`. If the port is already occupied, Astro may print another local URL in the terminal. Use the URL shown by Astro.

## 6. What To Check In The Browser

Focus on these core flows:

- First viewport: strong atelier / editorial impression, clear offer, visible work preview.
- Main CTA: `Send a Brief` scrolls to the contact section.
- Showcase carousel: previous / next controls work.
- Work gallery: poster and menu artwork is not badly cropped.
- Contact form: required fields validate before opening email.
- Fallbacks: WhatsApp link, copy brief, and direct email are visible.
- Mobile width: no horizontal overflow, overlapping text, or buried CTA.

## 7. Stop Local Dev Server

In the terminal running `pnpm dev`, press:

```text
Ctrl-C
```

To confirm the server is stopped:

```bash
lsof -iTCP:4321 -sTCP:LISTEN
```

Expected result:

- No output means port `4321` is no longer listening.
- If you see a process, stop that process before starting another dev server on the same port.

## 8. Optional Checks Before Editing

Before making changes:

```bash
git status --short --branch
```

After code, style, or copy changes:

```bash
pnpm build
```

After adding or changing original images under `public/assets/original/`:

```bash
pnpm optimize:images
pnpm validate:works
pnpm build
```

## 9. Troubleshooting

### `pnpm: command not found`

Enable pnpm through Corepack:

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
```

### Browser Cannot Open The Site

Check both URLs:

```text
http://localhost:4321/
http://127.0.0.1:4321/
```

Also check whether Astro printed a different port in the terminal.

### Port 4321 Is Already In Use

Find the process:

```bash
lsof -iTCP:4321 -sTCP:LISTEN
```

Then either stop that process or use the alternate URL printed by Astro.

### Asset Validation Fails

If `pnpm validate:works` reports missing optimized assets, regenerate image outputs:

```bash
pnpm optimize:images
pnpm validate:works
```

Only do this when image sources or work entries need regeneration.

## 10. Project Commands

```bash
pnpm dev              # Start Astro dev server
pnpm build            # Run Astro check and production build
pnpm preview          # Preview a built site
pnpm validate:works   # Validate work data and optimized image sets
pnpm optimize:images  # Regenerate AVIF / WebP work images from originals
```
