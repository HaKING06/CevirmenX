# ÇevirmenX

ÇevirmenX keeps its browser extension and Cloudflare Pages website in one repository:

- `src/extension/` — shared extension source and the Chrome Manifest V3 manifest.
- `src/website/` — static website source.
- `scripts/build.mjs` — creates browser packages and the deployable website.
- `dist/` — generated output; do not edit by hand.

## Build everything

Install Node.js 20 or newer, then run `npm run build` or double-click `build.bat` on Windows. The output is written to `dist/`:

- `dist/download/cevirmenx-chrome.zip` — Chrome Web Store upload and manual Chrome installation.
- `dist/download/cevirmenx-edge.zip` — Edge Add-ons upload.
- `dist/download/cevirmenx-firefox.xpi` — Firefox Add-ons source package. AMO signing and review are required before ordinary Firefox users can install it.
- `dist/chrome/` — unpacked Chrome build for local development.
- `dist/index.html`, `dist/help.html`, `dist/safe.html` — static site output.

Each store archive puts `manifest.json` at its root. Chrome and Edge use the shared Chrome manifest. The Firefox package uses the Firefox MV3 background-script format and Gecko metadata generated during build.

## Cloudflare Pages

For a Git-connected Pages project, set the repository root as the Root directory, `npm run build` as the Build command, and `dist` as the Build output directory. `wrangler.toml` also records the output directory for Wrangler-based deployments. Pages will deploy the generated site and browser download archives together. Configure the production branch to match the branch used by the GitHub repository.

## Release checklist

1. Update `version` in `src/extension/manifest.json` for every store release.
2. Update the displayed version in `src/website/index.html`.
3. Run `npm run build` and inspect the generated packages before submitting them to each store.
4. Complete each store's listing, privacy disclosures, screenshots, and review process in its developer console.

Translation requests send the selected text to Google Translate or MyMemory. The website's security page describes this data flow.
