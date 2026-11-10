# ÇevirmenX 1.3.2

[Website](https://cevir.haking.tr/) · [Support development](https://buymeacoffee.com/haking)

A free, API-key-free browser translation extension. Select text and press Alt+T, use the context menu, or open the translation workspace.

## Features

- Custom dictionary and configurable shortcuts in the existing settings panel
- Searchable local history, favorites and JSON export
- Local translation memory (100 entries), which can be disabled and erased
- Automatic source language handling, request deduplication and 12-second service timeouts
- Google translation endpoint with MyMemory fallback for supported short requests
- Version update page with an opt-out preference
- Website in Turkish, English, German, Spanish, French and Portuguese; light and dark themes

## Build and installation

Install Node.js 20+ and run `npm run build`, or double-click `build.bat`.

- `dist/chrome/`: unpacked Chrome extension
- `dist/edge/`: unpacked Edge extension
- `dist/download/`: store upload ZIP archives and unsigned Firefox XPI
- `download/cevirmenx-edge.zip`: Edge upload copy
- `dist/index.html`: production website

Upload the ZIP with manifest.json at its root to the appropriate extension store. Store approval is separate from packaging. Firefox signing is required for normal installation.

## Privacy and reliability

Selected translation text is sent to Google, or MyMemory when fallback is needed. History and translation memory are local; extension settings and dictionary use browser sync. No analytics or advertising trackers are included. Support links open Buy Me a Coffee, which has its own privacy policy. Do not translate sensitive text without considering these providers.

The public Google endpoint has no service guarantee. MyMemory has public usage and request limits. API-key-free does not mean unlimited or perfectly accurate translation. Critical translations should be reviewed.

## Project structure

`src/extension/` contains the extension; `src/website/` the static website; `scripts/build.mjs` builds the packages. Edit source files and rebuild; generated output is disposable.

## Cloudflare

Worker name: `cevirmenx`. Build: `npm run build`. Deploy: `npm run deploy:cloudflare`. Root: `/`. `wrangler.toml` serves `dist/` as static assets. The build token requires Workers Scripts Edit permission.

## Release workflow

Update manifest and package versions together, edit `whats-new.html`, build, review packages, then upload store ZIPs. The update page opens only when installed extension versions differ. Website pushes alone do not update store installations.

## Support

[Buy HaKING a coffee](https://buymeacoffee.com/haking). Donations are optional and do not unlock features.
