from pathlib import Path
import shutil,json
r=Path('.')
for browser in ['chrome','edge']:
 folder=r/browser
 shutil.copytree(r/'src/extension',folder/'extension',dirs_exist_ok=True)
 shutil.copytree(r/'store-assets/1.3.2',folder/'store-assets/1.3.2',dirs_exist_ok=True)
 shutil.copy2(r/'dist/download'/f'cevirmenx-{browser}.zip',folder/f'cevirmenx-{browser}.zip')
 (folder/'README.txt').write_text(f'Version 1.3.2. Upload cevirmenx-{browser}.zip. Use the extension folder for unpacked installation. Seven-language PNG artwork and store descriptions are in store-assets/1.3.2/. Marketing artwork is not an actual UI screenshot; take genuine extension screenshots for store screenshot fields.\n',encoding='utf-8')
# Never label marketing artwork as a genuine product screenshot.
for parent in [r/'store-assets/1.3.2',r/'chrome/store-assets/1.3.2',r/'edge/store-assets/1.3.2']:
 for p in parent.glob('*/screenshot-1280x800.png'):p.rename(p.with_name('marketing-1280x800.png'))
target=Path('C:/Users/halit/OneDrive/Belgeler/GitHub/CevirmenX')
for name in ['src','scripts','store-assets','chrome','edge']:
 shutil.copytree(r/name,target/name,dirs_exist_ok=True)
for name in ['package.json','README.md','CHANGELOG.md']:shutil.copy2(r/name,target/name)
print('Seven language asset sets:',len(list((r/'store-assets/1.3.2').glob('*/store-description.txt'))))
print('Manifest:',json.loads((r/'src/extension/manifest.json').read_text(encoding='utf-8'))['version'])
