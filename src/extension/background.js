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

// Arka planda güvenli fetch işlemi (Sayfa CSP engellemesini aşmak ve yüksek kaliteli çeviri motorlarını yönetmek için)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "perform_translation") {
    let source = request.sourceLang || 'auto';
    let target = request.targetLang || 'en';
    let text = request.text;
    
    if (source === 'auto') {
      chrome.i18n.detectLanguage(text, (result) => {
        let detected = 'tr';
        if (result && result.languages && result.languages.length > 0) {
          detected = result.languages[0].language;
        }
        
        // Gelişmiş dil tespiti filtresi: 
        // naber, selam gibi kısa kelimeler sıklıkla Norveççe (no, nb, nn) veya Latince (la), undetermined (und) olarak algılanır.
        // Kısa metinlerde (< 15 karakter) bu tarz yanlış tespiti engellemek için varsayılan dile (hedef dile göre tr veya en) yönlendirilir.
        let isShortText = text.trim().length < 15;
        let isFalsePositive = ['no', 'nb', 'nn', 'und', 'la', 'fy', 'gd', 'cy', 'ga'].includes(detected);
        
        if (!result || !result.isReliable || (isShortText && isFalsePositive) || !detected) {
          detected = (target === 'tr') ? 'en' : 'tr';
        }
        
        runFetch(detected, target, text, sendResponse);
      });
    } else {
      runFetch(source, target, text, sendResponse);
    }
    
    return true; // Asenkron yanıt kanalı
  }
});

// Çift Motorlu Çeviri Sistemi (Google Translate + MyMemory Fallback)
function runFetch(source, target, text, sendResponse) {
  // Motor 1: Yüksek Kaliteli Google Translate API
  let googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  
  fetch(googleUrl)
    .then(res => res.json())
    .then(data => {
      let translatedText = "";
      if (Array.isArray(data) && data[0]) {
        data[0].forEach(segment => {
          if (segment[0]) {
            translatedText += segment[0];
          }
        });
      }
      
      if (translatedText) {
        sendResponse({ success: true, translatedText: translatedText, detectedSource: source });
      } else {
        throw new Error("Google Translate boş yanıt döndürdü.");
      }
    })
    .catch(err => {
      console.warn("Google Translate başarısız oldu, MyMemory yedek motoru tetikleniyor:", err);
      
      // Motor 2: Yedek MyMemory API
      let myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
      
      fetch(myMemoryUrl)
        .then(res => res.json())
        .then(data => {
          if (data && data.responseData) {
            sendResponse({ success: true, translatedText: data.responseData.translatedText, detectedSource: source });
          } else {
            sendResponse({ success: false, error: "API Yanıt Hatası" });
          }
        })
        .catch(myMemoryErr => {
          console.error("Yedek motor da başarısız oldu:", myMemoryErr);
          sendResponse({ success: false, error: "Çeviri yapılamadı (Bağlantı hatası)" });
        });
    });
}