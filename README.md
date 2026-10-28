# ÇevirmenX

ÇevirmenX keeps its browser extension and Cloudflare Pages website in one repository:

- `src/extension/` — shared extension source and the Chrome Manifest V3 manifest.
- `src/website/` — static website source.
- `scripts/build.mjs` — creates browser packages and the deployable website.
- `download/cevirmenx-edge.zip` — ready-to-upload Edge Add-ons package.
- `dist/` — generated output; do not edit by hand.

## Build everything

Install Node.js 20 or newer, then run `npm run build` or double-click `build.bat` on Windows. The output is written to `dist/`:

- `dist/download/cevirmenx-chrome.zip` — Chrome Web Store upload and manual Chrome installation.
- `dist/download/cevirmenx-edge.zip` — Edge Add-ons upload.
- `dist/download/cevirmenx-firefox.xpi` — Firefox Add-ons source package. AMO signing and review are required before ordinary Firefox users can install it.
- `dist/chrome/` — unpacked Chrome build for local development.
- `dist/index.html`, `dist/help.html`, `dist/safe.html` — static site output.

Each store archive puts `manifest.json` at its root. Chrome and Edge use the shared Chrome manifest. The Firefox package uses the Firefox MV3 background-script format and Gecko metadata generated during build.

The Edge package is also copied to `download/cevirmenx-edge.zip` at the repository root so it is easy to find and upload directly from Partner Center.

ZIP/XPI files are generated build artifacts and are excluded from Git. Run `npm run build` before uploading an extension package; the store-ready Edge ZIP remains in the local `download/` folder, and the website downloads are generated in `dist/download/`.

## GitHub Pages

The `.github/workflows/pages.yml` workflow builds `dist/` and deploys it to GitHub Pages whenever `main` is updated. In the repository settings, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. The published homepage is `https://haking06.github.io/CevirmenX/`; the root `README.md` is only the repository description, not the deployed website.

For local file opening or GitHub Pages still configured to publish the repository root, `npm run build` creates small root `index.html`, `help.html`, and `safe.html` redirects into `src/website/`. These redirects are only created when those root files are absent; the full deployable site remains in `dist/`.

## Microsoft Edge Add-ons

In Partner Center, choose **New extension** to create a separate ÇevirmenX listing. Leave the existing **QR Tarayıcı** product untouched. Upload `download/cevirmenx-edge.zip` on the package step. The package already contains `manifest.json` at the archive root. Use `src/extension/icon.png` as the listing logo and `https://haking06.github.io/CevirmenX/safe.html` as the privacy policy URL. The store listing still needs its description, permission justifications, data-use disclosures, and review submission completed in Partner Center.

`download/EDGE-STORE-LISTING.txt` contains draft Turkish and English listing copy and permission justifications.

## Cloudflare Pages

For the Cloudflare screen with a separate **Deploy command** field, set **Build command** to `npm run build`, **Deploy command** to `npm run deploy:cloudflare`, and **Root directory** to `/`. This runs `npx wrangler pages deploy dist --project-name cevirmenx`; the project slug is `cevirmenx`. Do not use `npx wrangler deploy`: that command tries to deploy a Worker and produces the missing Worker entry-point error shown by Wrangler for this Pages project.

The selected Cloudflare API token needs **Account → Cloudflare Pages → Edit** access. Create a custom token in Cloudflare **My Profile → API Tokens**, then select it in the build settings. The `Authentication error [code: 10000]` means the current build token cannot read or deploy this Pages project. Keep the token in Cloudflare; never commit it to this repository.

If the project is configured through the classic Pages Git integration instead, set **Build command** to `npm run build` and **Build output directory** to `dist`; Pages publishes that folder itself, so no separate deploy command is needed. `wrangler.toml` records the Pages output directory.

## Release checklist

1. Update `version` in `src/extension/manifest.json` for every store release.
2. Update the displayed version in `src/website/index.html`.
3. Run `npm run build` and inspect the generated packages before submitting them to each store.
4. Complete each store's listing, privacy disclosures, screenshots, and review process in its developer console.

Translation requests send the selected text to Google Translate or MyMemory. The website's security page describes this data flow.
