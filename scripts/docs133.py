from pathlib import Path
r=Path('.')
license='''MIT License

Copyright (c) 2026 HaKING (Halit Günşalıt)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
''';(r/'LICENSE').write_text(license,encoding='utf-8')
rule='''\n## Repository delivery standards\n\n- For new public projects, include a useful README, a license file (MIT when the owner requests MIT), .gitignore, changelog, and relevant setup/build/release instructions. Preserve an existing license unless the owner authorizes changing it.\n- For releases, keep website, manifest, package metadata, release notes, and store packages on the same version. Check for stale version labels.\n- Use one accessible language dropdown with native language names; do not place seven language-code buttons in a row. Support RTL for Arabic.\n- Integrate related tools into the main application navigation instead of adding disconnected footer links.\n- Verify significant UI changes at 390px and 768px and exercise primary interactions. Clearly report checks that use mocks versus real browser-extension APIs.\n- Do not describe a release as flawless or fully verified unless evidence supports that claim.\n'''
(r/'AGENTS.md').write_text('# ÇevirmenX project instructions\n'+rule,encoding='utf-8')
p=Path('C:/Users/halit/.codex/AGENTS.md');s=p.read_text(encoding='utf-8');
if '## Repository delivery standards' not in s:p.write_text(s+rule,encoding='utf-8')
(r/'CONTRIBUTING.md').write_text('# Contributing\n\nEdit src/extension or src/website. Run npm run build. Keep all release versions aligned and review Chrome and Edge archives. Do not include credentials or private translation history. Open focused issues with reproduction steps; submit small changes with a description of verification.\n',encoding='utf-8')
(r/'SECURITY.md').write_text('# Security\n\nDo not post credentials or private translation text in public issues. Contact the maintainer using the contact channel on https://haking.tr/ for security-sensitive reports. Selected text is sent to external translation providers; see the website privacy policy.\n',encoding='utf-8')
p=r/'README.md';s=p.read_text(encoding='utf-8').replace('1.3.0','1.3.3').replace('1.3.2','1.3.3');s+='\n## License\n\nMIT. See [LICENSE](LICENSE). See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).\n\n## 1.3.3 dashboard\n\nTranslation, dictionary, history and preferences share one dashboard. The interface language picker uses native language names. The former workspace URL redirects to the unified dashboard.\n';p.write_text(s,encoding='utf-8')
(r/'CHANGELOG.md').write_text('# 1.3.3\n\nUnified translation dashboard; native-name language dropdown; refreshed popup and responsive panel; MIT license and contribution/security documentation.\n\n'+(r/'CHANGELOG.md').read_text(encoding='utf-8'),encoding='utf-8')
p=r/'src/extension/whats-new.html';s=p.read_text(encoding='utf-8').replace('1.3.2','1.3.3').replace('workspace.html','options.html');p.write_text(s,encoding='utf-8')
