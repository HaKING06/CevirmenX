from pathlib import Path
import json,shutil
r=Path('.')
p=r/'src/extension/background.js';s=p.read_text(encoding='utf-8').replace('text.length > 450','new TextEncoder().encode(text).length > 500');p.write_text(s,encoding='utf-8')
p=r/'package.json';d=json.loads(p.read_text());d['version']='1.3.0';p.write_text(json.dumps(d,indent=2))
(r/'README.md').write_text('''# ÇevirmenX 1.3.0

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
''',encoding='utf-8')
(r/'CHANGELOG.md').write_text('# 1.3.0\n\nTranslation workspace, local memory, searchable history and favorites, export, timeout and fallback handling, update announcement and six-language website.\n',encoding='utf-8')
assets=r/'store-assets';assets.mkdir(exist_ok=True)
for name,w,h in [('banner',1400,560),('promo',440,280)]:
 (assets/(name+'.svg')).write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 1400 560"><rect width="1400" height="560" fill="#102b21"/><circle cx="1200" cy="250" r="280" fill="#24583c"/><text x="90" y="120" fill="#a8d6a2" font-family="sans-serif" font-size="30">ÇEVİRMENX · 1.3.0</text><text x="90" y="255" fill="white" font-family="sans-serif" font-size="76" font-weight="bold">Select. Translate.</text><text x="90" y="350" fill="white" font-family="sans-serif" font-size="76" font-weight="bold">Stay in your flow.</text><text x="90" y="460" fill="#c4d6c7" font-family="sans-serif" font-size="28">cevir.haking.tr · Alt+T</text></svg>''',encoding='utf-8')
