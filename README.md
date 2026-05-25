# vibly-site

Vibly homepage and donate pages, built with Vite + React + Tailwind CSS.

## Pages

- Home: `/`
- Donate: `/donate/`

## Local Preview

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm dev
```

Build production assets:

```bash
pnpm build
```

Then open (default dev server):

- Home: `http://localhost:5173/`
- Donate: `http://localhost:5173/donate/`

`/donate/` is served as a static page from `public/donate/`.

## Project Structure

- `src/`: React homepage source
	- `src/App.jsx`: homepage UI (join command preview, i18n, theme switch)
	- `src/main.jsx`: app entry
	- `src/index.css`: Tailwind entry styles
- `public/`: static assets and static pages
	- `public/assets/`: icons/images
	- `public/donate/`: donate page
	- `public/site.config.js`: site configuration for static pages
	- `public/main.js` and `public/styles.css`: donate page runtime/styles

## NPM Scripts

- `pnpm dev`: run local dev server
- `pnpm build`: build production bundle
- `pnpm preview`: preview production build

## Configuration

The React homepage content (i18n copy, links, runtimes) lives in `src/App.jsx`.

The donate page (`/donate/`) reads `public/site.config.js`. Relevant keys:

- `donate.title`
- `donate.subtitle`
- `donate.address`
- `donate.explorer`
- `donate.qr`
- `donate.copy`
