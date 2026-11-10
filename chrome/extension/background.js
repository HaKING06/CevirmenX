chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cevir_sag_tik",
    title: "Çevir ve Değiştir",
    contexts: ["selection", "editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "cevir_sag_tik") {
    chrome.tabs.sendMessage(tab.id, { action: "cevir" }).catch(e => console.log("Hata:", e));
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "cevir_kisayol") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: "cevir" }).catch(e => console.log("Hata:", e));
    });
  }
});

// Requests are bounded, deduplicated and cached locally. No API key is required.
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
      if (new TextEncoder().encode(text).length > 500) throw new Error('Translation service unavailable. Please retry shortly.');
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
