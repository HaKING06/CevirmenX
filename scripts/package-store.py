from pathlib import Path
import shutil
r=Path('.')
p=r/'src/website/site.js';s=p.read_text(encoding='utf-8').replace("document.getElementById('demo-pair').textContent=", "document.querySelector('.document mark').textContent=lang==='en'?'Her kelime yeni bir bakış açısı açar.':'Every word opens a new perspective.';document.getElementById('demo-pair').textContent=");p.write_text(s,encoding='utf-8')
for p in (r/'store-assets').glob('*.svg'):
 s=p.read_text(encoding='utf-8').replace('#102b21','#0d0d19').replace('#24583c','#383477').replace('#a8d6a2','#b7b2ff').replace('#c4d6c7','#d1cdef');p.write_text(s,encoding='utf-8')
# Keep generated marketing source distinct from browser packages.
for browser in ['chrome','edge']:
 folder=r/browser;folder.mkdir(exist_ok=True)
 shutil.copytree(r/'src/extension',folder/'extension',dirs_exist_ok=True)
 shutil.copytree(r/'store-assets',folder/'store-assets',dirs_exist_ok=True)
 (folder/'README.txt').write_text('Upload cevirmenx-'+browser+'.zip to the store. The extension folder is for unpacked installation. Store assets are not extension files. Firefox signing and store review are separate.\n',encoding='utf-8')
