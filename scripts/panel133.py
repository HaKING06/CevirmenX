from pathlib import Path
import re,json
r=Path('.')
p=r/'src/extension/options.html';s=p.read_text(encoding='utf-8');s=s.replace('<meta charset="UTF-8">','<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">');s=re.sub(r'<div class="lang-switcher">.*?</div>','<div class="language-control"><span aria-hidden="true">◎</span><select id="interface-language" aria-label="Interface language">'+''.join(f'<option value="{code}">{name}</option>' for code,name in [('en','English'),('tr','Türkçe'),('de','Deutsch'),('es','Español'),('fr','Français'),('pt','Português'),('ar','العربية')])+'</select></div>',s,count=1,flags=re.S)
s=s.replace('<div class="tabs">','<div class="tabs" role="tablist"><button class="tab-btn active" data-tab="ceviri"><span id="workspace-tab-label">Translate</span></button>',1).replace('class="tab-btn active" data-tab="sozluk"','class="tab-btn" data-tab="sozluk"').replace('class="tab-content active" id="tab-sozluk"','class="tab-content" id="tab-sozluk"')
w=(r/'src/extension/workspace.html').read_text(encoding='utf-8');content=w[w.index('<section>'):w.index('</main>')];content=re.sub(r'id="([^"]+)"',lambda m:'id="w-'+m[1]+'"',content)
s=s.replace('<div class="card">','<div class="card"><div class="tab-content active" id="tab-ceviri"><div class="workspace-intro"><span class="panel-eyebrow">ÇEVİRMENX / WORKSPACE</span><h2 id="workspace-heading">Translate without leaving your flow.</h2><p id="workspace-description">Write your text, choose a language and translate. Your history stays on this device.</p></div>'+content+'</div>',1)
s=re.sub(r'<div style="display:flex;justify-content:center;gap:16px;padding:14px;font:12px system-ui">.*?</div>', '<footer class="panel-footer"><span>ÇevirmenX 1.3.3</span><a href="https://buymeacoffee.com/haking" target="_blank" rel="noopener">☕ Buy me a coffee</a></footer>',s,flags=re.S)
s=s.replace('</head>','<link rel="stylesheet" href="panel.css"></head>').replace('<script src="options.js"></script>','<script src="options.js"></script><script src="panel-workspace.js"></script>');p.write_text(s,encoding='utf-8')
p=r/'src/extension/options.js';s=p.read_text(encoding='utf-8');a=s.index('function initLanguageSwitcher()');b=s.index('// Arama kutulu',a);s=s[:a]+'''function initLanguageSwitcher() {
 const picker=document.getElementById('interface-language');
 chrome.storage.sync.get('arayuzDili', result=>{
  const preferred=(navigator.languages || [navigator.language]).map(x=>x.split('-')[0]).find(x=>UI_STRINGS[x]) || 'en';
  activeLang=UI_STRINGS[result.arayuzDili]?result.arayuzDili:preferred;
  picker.value=activeLang;applyUiLanguage(activeLang);
 });
 picker.addEventListener('change',()=>{activeLang=picker.value;chrome.storage.sync.set({arayuzDili:activeLang});applyUiLanguage(activeLang);});
}

'''+s[b:];s=s.replace('function applyUiLanguage(lang) {','function applyUiLanguage(lang) {\n document.dispatchEvent(new CustomEvent("cx-language",{detail:lang}));');p.write_text(s,encoding='utf-8')
s=(r/'src/extension/workspace.js').read_text(encoding='utf-8').replace("document.getElementById(id)","document.getElementById('w-'+id)")
(r/'src/extension/panel-workspace.js').write_text('(()=>{\n'+s+'''\nconst labels={en:['Translate','Translate without leaving your flow.','Write your text, choose a language and translate. Your history stays on this device.'],tr:['Çeviri','Akışını bozmadan çevir.','Metnini yaz, dilini seç ve çevir. Geçmişin bu cihazda saklanır.'],de:['Übersetzen','Übersetze ohne Unterbrechung.','Text eingeben, Sprache wählen und übersetzen.'],es:['Traducir','Traduce sin perder el hilo.','Escribe el texto, elige un idioma y traduce.'],fr:['Traduire','Traduisez sans perdre le fil.','Saisissez un texte, choisissez une langue et traduisez.'],pt:['Traduzir','Traduza sem perder o ritmo.','Escreva o texto, escolha um idioma e traduza.'],ar:['ترجمة','ترجم دون مقاطعة عملك.','اكتب النص واختر اللغة ثم ترجم. يبقى السجل على جهازك.']};
function localize(lang){const text=labels[lang]||labels.en;document.getElementById('workspace-tab-label').textContent=text[0];document.getElementById('workspace-heading').textContent=text[1];document.getElementById('workspace-description').textContent=text[2];}
document.addEventListener('cx-language',e=>localize(e.detail));localize(document.documentElement.lang);
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.gecmis)render();});
})();''',encoding='utf-8')
# All old workspace links now enter the unified panel.
(r/'src/extension/workspace.html').write_text('<!doctype html><html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=options.html"><title>ÇevirmenX</title><a href="options.html">Open ÇevirmenX</a></html>',encoding='utf-8')
p=r/'src/extension/popup.html';s=p.read_text(encoding='utf-8');s=re.sub(r'<a href="workspace.html".*?</a>','',s);s=s.replace('</head>','<link rel="stylesheet" href="popup-refined.css"></head>');p.write_text(s,encoding='utf-8')
for file in ['package.json','src/extension/manifest.json']:
 p=r/file;d=json.loads(p.read_text(encoding='utf-8'));d['version']='1.3.3'
 if 'version_name' in d:d['version_name']='1.3.3'
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
for p in (r/'src/website').glob('*'):
 if p.suffix in ['.html','.json','.js']:p.write_text(p.read_text(encoding='utf-8').replace('1.3.2','1.3.3'),encoding='utf-8')
