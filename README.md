# vibly-site

Static brand entry pages for `vibly.network`.

## Pages

- Home: `/`
- Donate: `/donate/`

## Local Preview

Run a static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open:

- Home: `http://localhost:4173/`
- Donate: `http://localhost:4173/donate/`

Opening `index.html` directly also works for the home page, but the static
server is a closer match to the deployed paths.

## Configuration

Home and donate page content is centralized in `site.config.js`.

Home:

- `brandName`
- `tagline`
- `links.github`
- `links.twitter`
- `mascot.src`
- `mascot.alt`
- `enableFloatAnimation`
- `enableAmbientHaze`

Donate:

- `donate.title`
- `donate.subtitle`
- `donate.address`
- `donate.explorer`
- `donate.qr`
- `donate.copy`
