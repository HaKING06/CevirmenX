from pathlib import Path
import json
r=Path('.')
p=r/'src/extension/background.js'
s=p.read_text(encoding='utf-8'); start=s.index('// Arka planda')
s=s[:start]+'''// Requests are bounded, deduplicated and cached locally. No API key is required.
const pending = new Map();
async function fetchJSON(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000), credentials: 'omit' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}
async function translate(request) {
  const text = String(request.text || '').trim();
  const source = request.sourceLang || 'auto', target = request.targetLang || 'en';
  if (!text || text.length > 5000) throw new Error('Select between 1 and 5000 characters.');
  if (!/^(auto|[a-z]{2,3}(-[A-Za-z]{2,4})?)$/.test(source) || !/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(target)) throw new Error('Invalid language');
  const key = JSON.stringify([source,target,text]);
  const { translationMemory = [], memoryEnabled = true } = await chrome.storage.local.get(['translationMemory','memoryEnabled']);
  const cached = memoryEnabled && translationMemory.find(x => x.key === key);
  if (cached) return { ...cached.result, cached: true };
  if (pending.has(key)) return pending.get(key);
  const job = (async () => {
    let result;
    try {
      const data = await fetchJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl='+source+'&tl='+target+'&dt=t&q='+encodeURIComponent(text));
      const translatedText = data?.[0]?.map(x=>x?.[0] || '').join('');
      if (!translatedText) throw new Error('Empty translation');
      result = { success:true, translatedText, detectedSource: data[2] || source, provider:'Google' };
    } catch (error) {
      let detected = source;
      if (detected === 'auto') {
        const detection = await chrome.i18n.detectLanguage(text);
        if (!detection.isReliable || !detection.languages?.length) throw new Error('Select the source language and retry.');
        detected = detection.languages[0].language;
      }
      if (text.length > 450) throw new Error('Translation service unavailable. Please retry shortly.');
      const data = await fetchJSON('https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair='+encodeURIComponent(detected+'|'+target));
      if (Number(data.responseStatus)!==200 || !data.responseData?.translatedText) throw new Error('Translation service unavailable. Please retry shortly.');
      result = { success:true, translatedText:data.responseData.translatedText, detectedSource:detected, provider:'MyMemory' };
    }
    if (memoryEnabled) {
      const latest = await chrome.storage.local.get('translationMemory');
      await chrome.storage.local.set({translationMemory:[{key,result},...(latest.translationMemory || []).filter(x=>x.key!==key)].slice(0,100)});
    }
    return result;
  })();
  pending.set(key,job);
  try { return await job; } finally { pending.delete(key); }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'perform_translation') return;
  translate(request).then(sendResponse).catch(error=>sendResponse({success:false,error:error.message}));
  return true;
});
chrome.runtime.onInstalled.addListener(async details => {
  if (details.reason === 'update' && details.previousVersion !== chrome.runtime.getManifest().version) {
    const { showReleaseNotes = true } = await chrome.storage.local.get('showReleaseNotes');
    if (showReleaseNotes) chrome.tabs.create({url:chrome.runtime.getURL('whats-new.html')});
  }
});
'''
p.write_text(s,encoding='utf-8')
m=r/'src/extension/manifest.json'; data=json.loads(m.read_text(encoding='utf-8'));data['version']='1.3.0';data['version_name']='1.3.0';data['homepage_url']='https://cevir.haking.tr/';m.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
# Compact support links and a dedicated workspace, preserving existing settings.
for name in ['popup.html','options.html']:
 p=r/'src/extension'/name;s=p.read_text(encoding='utf-8');s=s.replace('<script src=', '<div style="display:flex;justify-content:center;gap:16px;padding:14px;font:12px system-ui"><a href="workspace.html" target="_blank" style="color:#a5b4fc">Çeviri merkezi</a><a href="https://buymeacoffee.com/haking" target="_blank" rel="noopener" style="color:#cbbf9b">☕ Destek ol</a></div><script src=',1);p.write_text(s,encoding='utf-8')
css='''*{box-sizing:border-box}body{margin:0;background:#101522;color:#e8edf7;font:16px/1.6 system-ui}main{max-width:900px;margin:auto;padding:40px 24px}a{color:#a9bbff}button,select,input,textarea{font:inherit;border:1px solid #46516b;border-radius:10px;padding:10px;background:#1c263b;color:inherit}button{cursor:pointer}textarea{width:100%;min-height:140px}header,.row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}article,section{padding:24px;margin:20px 0;border:1px solid #34405a;border-radius:16px}label{display:block;margin:12px 0}small{color:#a9b4ca}@media(prefers-color-scheme:light){body{background:#f6f8fd;color:#162036}button,select,input,textarea{background:white;color:#162036}a{color:#4055a6}}'''
(r/'src/extension/workspace.css').write_text(css)
(r/'src/extension/workspace.html').write_text('''<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ÇevirmenX · Çeviri merkezi</title><link rel="stylesheet" href="workspace.css"><main><header><h1>Çeviri merkezi</h1><a href="options.html">Sözlük ve ayarlar</a><a href="https://buymeacoffee.com/haking">☕ Destek ol</a></header><p>Metni çevir, geçmişinde ara, sık kullandıklarını kaydet.</p><section><div class="row"><label>Kaynak <select id="source"><option value="auto">Otomatik</option></select></label><label>Hedef <select id="target"></select></label></div><textarea id="text" maxlength="5000" placeholder="Çevirmek istediğin metin" aria-label="Çevrilecek metin"></textarea><button id="translate">Çevir</button><p id="result" role="status" style="white-space:pre-wrap"></p><button id="copy">Kopyala</button></section><section><h2>Tercihler</h2><label><input type="checkbox" id="memory"> Çeviri hafızası (bu cihazda)</label><label><input type="checkbox" id="release">Güncelleme notlarını otomatik aç</label><button id="clearMemory">Hafızayı temizle</button><a href="#" id="shortcut">Kısayolları düzenle</a></section><section><h2>Geçmiş ve favoriler</h2><input id="search" placeholder="Geçmişte ara" aria-label="Geçmişte ara"><button id="export">JSON dışa aktar</button><button id="clear">Geçmişi sil</button><div id="history"></div></section></main><script src="workspace.js"></script></html>''',encoding='utf-8')
(r/'src/extension/workspace.js').write_text('''const $=id=>document.getElementById(id);
const languages={tr:'Türkçe',en:'English',de:'Deutsch',fr:'Français',es:'Español',pt:'Português',it:'Italiano',ja:'日本語',ko:'한국어',ar:'العربية',ru:'Русский',zh:'中文'};
for(const [code,name] of Object.entries(languages)){for(const id of ['source','target']){const option=new Option(name,code);$(id).add(option);}} $('target').value='tr';
async function render(){const {gecmis=[]}=await chrome.storage.local.get('gecmis');$('history').replaceChildren();for(const item of gecmis.filter(x=>(x.orijinal+' '+x.cevrilen).toLowerCase().includes($('search').value.toLowerCase()))){const card=document.createElement('article');const text=document.createElement('p');text.textContent=item.orijinal;const result=document.createElement('p');result.textContent=item.cevrilen;const star=document.createElement('button');star.textContent=item.favorite?'★ Kaydedildi':'☆ Kaydet';star.onclick=async()=>{item.favorite=!item.favorite;await chrome.storage.local.set({gecmis});render();};card.append(text,result,star);$('history').append(card);}}
$('translate').onclick=async()=>{ $('translate').disabled=true;$('result').textContent='Çevriliyor…';try{const result=await chrome.runtime.sendMessage({action:'perform_translation',text:$('text').value,sourceLang:$('source').value,targetLang:$('target').value});if(!result.success)throw Error(result.error);$('result').textContent=result.translatedText;const {gecmis=[]}=await chrome.storage.local.get('gecmis');gecmis.unshift({id:crypto.randomUUID(),orijinal:$('text').value,cevrilen:result.translatedText,kaynak:result.detectedSource,hedef:$('target').value,tarih:new Date().toISOString()});await chrome.storage.local.set({gecmis:gecmis.slice(0,200)});await render();}catch(e){$('result').textContent=e.message;}finally{$('translate').disabled=false;}};
$('copy').onclick=()=>navigator.clipboard.writeText($('result').textContent);$('search').oninput=render;
$('clear').onclick=async()=>{if(confirm('Tüm geçmiş silinsin mi?')){await chrome.storage.local.set({gecmis:[]});render();}};
$('clearMemory').onclick=()=>chrome.storage.local.set({translationMemory:[]});
$('memory').onchange=()=>chrome.storage.local.set({memoryEnabled:$('memory').checked});$('release').onchange=()=>chrome.storage.local.set({showReleaseNotes:$('release').checked});
chrome.storage.local.get(['memoryEnabled','showReleaseNotes']).then(x=>{$('memory').checked=x.memoryEnabled!==false;$('release').checked=x.showReleaseNotes!==false;});
$('shortcut').onclick=e=>{e.preventDefault();chrome.tabs.create({url:navigator.userAgent.includes('Edg/')?'edge://extensions/shortcuts':'chrome://extensions/shortcuts'});};
$('export').onclick=async()=>{const {gecmis=[]}=await chrome.storage.local.get('gecmis');const url=URL.createObjectURL(new Blob([JSON.stringify(gecmis,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='cevirmenx-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};render();
''',encoding='utf-8')
(r/'src/extension/whats-new.html').write_text('''<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="workspace.css"><title>ÇevirmenX 1.3.0</title><main><small>ÇEVİRMENX · 1.3.0</small><h1>Çevirinin kontrolü sende.</h1><p>Yeni çeviri merkeziyle geçmişinde ara, favorilerini kaydet ve çeviri hafızanı yönet.</p><section><h2>Bu sürümde</h2><ul><li>Daha doğru otomatik kaynak dil işleme</li><li>Zaman aşımı ve yedek servis hata yönetimi</li><li>Cihazda tutulan 100 kayıtlık çeviri hafızası</li><li>Geçmiş arama, favori ve JSON dışa aktarma</li></ul></section><a href="workspace.html">Çeviri merkezini aç →</a><p><a href="https://buymeacoffee.com/haking">☕ Geliştirmeye destek ol</a></p><small>Bu sayfanın güncellemelerde açılmasını çeviri merkezinden kapatabilirsin.</small></main></html>''',encoding='utf-8')
p=r/'scripts/build.mjs';s=p.read_text();s=s.replace("if (browser === 'chrome') await cp(staging, path.join(output, 'chrome'), { recursive: true });","if (browser !== 'firefox') await cp(staging, path.join(output, browser), { recursive: true });");p.write_text(s)
