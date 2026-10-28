// --- REMAINS SCOPED THEME HELPERS ---
function getThemeColors(themeName) {
  let colors = {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    glow: "rgba(99, 102, 241, 0.25)"
  };

  if (themeName === 'purple') {
    colors.primary = "#a855f7";
    colors.primaryHover = "#9333ea";
    colors.glow = "rgba(168, 85, 247, 0.25)";
  } else if (themeName === 'emerald') {
    colors.primary = "#10b981";
    colors.primaryHover = "#059669";
    colors.glow = "rgba(16, 185, 129, 0.25)";
  } else if (themeName === 'amber') {
    colors.primary = "#f59e0b";
    colors.primaryHover = "#d97706";
    colors.glow = "rgba(245, 158, 11, 0.25)";
  }
  return colors;
}

// --- ŞIK BİLDİRİM (TOAST) OLUŞTURUCU ---
function toastGoster(mesaj, tip = "bilgi") {
  let eskiToast = document.getElementById("cevirmenx-toast");
  if (eskiToast) eskiToast.remove();

  let toast = document.createElement("div");
  toast.id = "cevirmenx-toast";
  toast.innerText = mesaj;

  toast.style.cssText = `
    all: initial;
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 24px;
    border-radius: 12px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 2147483647;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateY(20px);
    box-sizing: border-box;
  `;

  chrome.storage.sync.get(['eklentiTemasi'], (result) => {
    let theme = result.eklentiTemasi || 'indigo';
    let colors = getThemeColors(theme);

    if (tip === "hata") {
      toast.style.backgroundColor = "rgba(220, 53, 69, 0.95)";
    } else if (tip === "basari") {
      toast.style.backgroundColor = "rgba(16, 185, 129, 0.95)";
    } else {
      toast.style.backgroundColor = colors.primary + "f2";
    }

    document.body.appendChild(toast);

    toast.offsetHeight;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  });
}

// --- METİN DEĞİŞTİRME FONKSİYONLARI ---
function metniDegistir(aktifElement, yeniMetin) {
  aktifElement.focus();
  try {
    document.execCommand("insertText", false, yeniMetin);
  } catch (e) {
    let baslangic = aktifElement.selectionStart;
    let bitis = aktifElement.selectionEnd;
    if (baslangic !== undefined && bitis !== undefined) {
      let orijinalDeger = aktifElement.value;
      let yeniDeger = orijinalDeger.substring(0, baslangic) + yeniMetin + orijinalDeger.substring(bitis);
      aktifElement.value = yeniDeger;
      aktifElement.selectionStart = baslangic;
      aktifElement.selectionEnd = baslangic + yeniMetin.length;

      aktifElement.dispatchEvent(new Event('input', { bubbles: true }));
      aktifElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

// Genel Web sayfasında seçili metni kararlı bir şekilde değiştiren fonksiyon
function replaceRangeText(range, newText) {
  let startContainer = range.startContainer;
  let endContainer = range.endContainer;

  if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
    let val = startContainer.nodeValue;
    let start = range.startOffset;
    let end = range.endOffset;
    startContainer.nodeValue = val.substring(0, start) + newText + val.substring(end);

    try {
      let newRange = document.createRange();
      newRange.setStart(startContainer, start);
      newRange.setEnd(startContainer, start + newText.length);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(newRange);
    } catch (err) {
      console.warn("Seçim odaklanamadı:", err);
    }
  } else {
    range.deleteContents();
    let textNode = document.createTextNode(newText);
    range.insertNode(textNode);

    try {
      let newRange = document.createRange();
      newRange.selectNode(textNode);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(newRange);
    } catch (err) {
      console.warn("Seçim odaklanamadı:", err);
    }
  }
}

// --- YÜZEN ÇEVİRİ KARTI (TOOLTIP) ---
let aktifKart = null;

function kartiKapat() {
  if (aktifKart) {
    aktifKart.style.opacity = "0";
    aktifKart.style.transform = "scale(0.95) translateY(10px)";
    let tempKart = aktifKart;
    aktifKart = null;
    setTimeout(() => tempKart.remove(), 200);
  }
}

function yuzenKartGoster(originalText, translatedText, range, targetLang, sourceLang) {
  kartiKapat();

  let rect = range.getBoundingClientRect();

  chrome.storage.sync.get(['eklentiTemasi', 'arayuzDili'], (result) => {
    let theme = result.eklentiTemasi || 'indigo';
    let colors = getThemeColors(theme);
    let isEn = result.arayuzDili === 'en';

    let kart = document.createElement("div");
    kart.id = "cevirmenx-floating-card";
    kart.style.cssText = `
      all: initial;
      position: absolute;
      z-index: 2147483646;
      background: rgba(18, 18, 24, 0.96);
      color: #f3f4f6;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      border-radius: 16px;
      padding: 16px;
      width: 280px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      backdrop-filter: blur(12px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    `;

    // Header
    let header = document.createElement("div");
    header.style.cssText = `
      all: initial;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 8px;
      margin-bottom: 10px;
      font-size: 11px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      width: 100%;
    `;

    let logoSpan = document.createElement("span");
    logoSpan.innerText = isEn ? "TranslatorX" : "ÇevirmenX";
    logoSpan.style.cssText = `font-weight: 800; color: ${colors.primary};`;

    let langSpan = document.createElement("span");
    let displaySource = isEn && sourceLang.toLowerCase() === "sözlük" ? "Dict" : sourceLang;
    langSpan.innerText = `${displaySource.toUpperCase()} ➔ ${targetLang.toUpperCase()}`;
    langSpan.style.cssText = "font-weight: 600;";

    header.appendChild(logoSpan);
    header.appendChild(langSpan);
    kart.appendChild(header);

    // Body
    let textBody = document.createElement("div");
    textBody.style.cssText = `
      all: initial;
      display: block;
      max-height: 120px;
      overflow-y: auto;
      margin-bottom: 12px;
      color: #f3f4f6;
      word-break: break-word;
      font-size: 14px;
      line-height: 1.5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      white-space: pre-wrap;
    `;
    textBody.innerText = translatedText;
    kart.appendChild(textBody);

    // Footer
    let footer = document.createElement("div");
    footer.style.cssText = `
      all: initial;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
    `;

    // TTS Button
    let dinleBtn = document.createElement("button");
    dinleBtn.innerText = isEn ? "🔊 Listen" : "🔊 Dinle";
    dinleBtn.style.cssText = `
      all: initial;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e5e7eb;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 600;
      box-sizing: border-box;
    `;
    dinleBtn.onmouseover = () => dinleBtn.style.background = "rgba(255, 255, 255, 0.12)";
    dinleBtn.onmouseout = () => dinleBtn.style.background = "rgba(255, 255, 255, 0.06)";
    dinleBtn.onclick = () => {
      let utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    };
    footer.appendChild(dinleBtn);

    // Replace (Değiştir) Button
    let degistirBtn = document.createElement("button");
    degistirBtn.innerText = isEn ? "🔄 Replace" : "🔄 Değiştir";
    degistirBtn.style.cssText = `
      all: initial;
      background: ${colors.primary};
      border: none;
      color: white;
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
    `;
    degistirBtn.onmouseover = () => degistirBtn.style.background = colors.primaryHover;
    degistirBtn.onmouseout = () => degistirBtn.style.background = colors.primary;
    degistirBtn.onclick = () => {
      navigator.clipboard.writeText(translatedText).then(() => {
        try {
          replaceRangeText(range, translatedText);
          kartiKapat();
          toastGoster(isEn ? "Text replaced & copied ✓" : "Cümle değiştirildi & kopyalandı ✓", "basari");
        } catch (e) {
          console.error("Yerinde değiştirme hatası:", e);
          toastGoster(isEn ? "Error: Could not replace!" : "Hata: Metin değiştirilemedi!", "hata");
        }
      });
    };
    footer.appendChild(degistirBtn);

    // Close Button
    let kapatBtn = document.createElement("button");
    kapatBtn.innerText = "✕";
    kapatBtn.style.cssText = `
      all: initial;
      background: transparent;
      border: none;
      color: #9ca3af;
      padding: 6px;
      font-size: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: bold;
      box-sizing: border-box;
    `;
    kapatBtn.onmouseover = () => kapatBtn.style.color = "#f3f4f6";
    kapatBtn.onmouseout = () => kapatBtn.style.color = "#9ca3af";
    kapatBtn.onclick = kartiKapat;
    footer.appendChild(kapatBtn);

    kart.appendChild(footer);
    document.body.appendChild(kart);

    // Coordinate calculation
    let scrollX = window.scrollX || window.pageXOffset;
    let scrollY = window.scrollY || window.pageYOffset;

    let left = rect.left + scrollX + (rect.width - 280) / 2;
    let top = rect.top + scrollY - kart.offsetHeight - 10;

    if (left < 10) left = 10;
    if (left + 300 > window.innerWidth) left = window.innerWidth - 300;
    if (top < scrollY + 10) {
      top = rect.bottom + scrollY + 10;
    }

    kart.style.left = `${left}px`;
    kart.style.top = `${top}px`;

    setTimeout(() => {
      kart.style.opacity = "1";
      kart.style.transform = "scale(1) translateY(0)";
    }, 20);

    aktifKart = kart;
  });
}

// --- AKILLI ÇOK DİLLİ SÖZLÜK BULMA METODU ---
function sozluktenBul(source, target, temizMetin, dictionary) {
  if (source !== 'auto') {
    let keysToCheck = [
      `${source}_${target}_${temizMetin}`,
      `all_${target}_${temizMetin}`,
      `${source}_all_${temizMetin}`,
      `all_all_${temizMetin}`
    ];
    for (let key of keysToCheck) {
      if (dictionary[key]) {
        return dictionary[key];
      }
    }
  } else {
    // Kaynak dil 'auto' (Otomatik Tespit) olduğunda:
    // Sözlükte bu terim için hedef dile uyumlu bir kayıt (örn: tr_en_naber -> _en_naber) var mı diye kontrol edelim.
    let suffix = `_${target}_${temizMetin}`;
    let fallbackSuffix = `_all_${temizMetin}`;

    let foundKey = Object.keys(dictionary).find(k => k.endsWith(suffix));
    if (!foundKey) {
      foundKey = Object.keys(dictionary).find(k => k.endsWith(fallbackSuffix));
    }

    if (foundKey) {
      return dictionary[foundKey];
    }
  }
  return null;
}

// --- SEÇİM BALONU (HOVER BUBBLE) ---
let aktifBalon = null;
let sonSecilenMetin = "";
let sonSecimRange = null;

function balonKapat() {
  if (aktifBalon) {
    aktifBalon.remove();
    aktifBalon = null;
  }
}

function sefkatliBalonGoster(range, text) {
  balonKapat();

  chrome.storage.sync.get(['balonGoster'], (result) => {
    if (result.balonGoster === false) return;

    sonSecilenMetin = text;
    sonSecimRange = range.cloneRange();

    let rect = range.getBoundingClientRect();

    let balon = document.createElement("div");
    balon.id = "cevirmenx-selection-bubble";

    chrome.storage.sync.get(['eklentiTemasi'], (themeResult) => {
      let theme = themeResult.eklentiTemasi || 'indigo';
      let colors = getThemeColors(theme);

      balon.style.cssText = `
        all: initial;
        position: absolute;
        z-index: 2147483645;
        background: rgba(18, 18, 24, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.15);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        backdrop-filter: blur(8px);
        transform: scale(0.9) translateY(5px);
        opacity: 0;
        box-sizing: border-box;
      `;

      balon.innerHTML = `
        <svg style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="${colors.primary}" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 21a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v16.5a.75.75 0 0 1-.75.75z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1 0-1.5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.5 7.5 3 3-3 3M7.5 16.5l-3-3 3-3" />
        </svg>
      `;

      balon.onmouseover = () => {
        balon.style.transform = "scale(1.1)";
        balon.style.borderColor = colors.primary;
        balon.style.boxShadow = `0 4px 15px ${colors.primary}40`;
      };
      balon.onmouseout = () => {
        balon.style.transform = "scale(1)";
        balon.style.borderColor = "rgba(255, 255, 255, 0.15)";
        balon.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      };

      balon.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        balonKapat();
        tetikleBalonCevirisi();
      });

      document.body.appendChild(balon);

      let scrollX = window.scrollX || window.pageXOffset;
      let scrollY = window.scrollY || window.pageYOffset;

      let left = rect.left + scrollX + (rect.width - 32) / 2;
      let top = rect.top + scrollY - 38;

      if (left < 5) left = 5;
      if (top < scrollY + 5) {
        top = rect.bottom + scrollY + 5;
      }

      balon.style.left = `${left}px`;
      balon.style.top = `${top}px`;

      setTimeout(() => {
        balon.style.opacity = "1";
        balon.style.transform = "scale(1) translateY(0)";
      }, 10);

      aktifBalon = balon;
    });
  });
}

function tetikleBalonCevirisi() {
  if (!sonSecilenMetin || sonSecilenMetin.length === 0 || !sonSecimRange) return;

  let seciliMetin = sonSecilenMetin;
  let range = sonSecimRange;

  chrome.storage.sync.get(['hedefDil', 'kaynakDil', 'ozelSozluk', 'sozlukCevirisiEtkin', 'arayuzDili'], (result) => {
    let target = result.hedefDil || 'en';
    let source = result.kaynakDil || 'auto';
    let dictionary = result.ozelSozluk || {};
    let isDictActive = result.sozlukCevirisiEtkin !== false;
    let isEn = result.arayuzDili === 'en';

    let temizMetin = seciliMetin.toLowerCase().trim();

    // Akıllı Çok Dilli Sözlük Sorgulama Altyapısı
    let translation = null;
    if (isDictActive) {
      translation = sozluktenBul(source, target, temizMetin, dictionary);
    }

    if (translation) {
      yuzenKartGoster(seciliMetin, translation, range, target, "Sözlük");
      gecmiseKaydet(seciliMetin, translation, "Sözlük", target);
    } else {
      toastGoster(isEn ? "Translating..." : "Çeviriliyor...", "bilgi");

      chrome.runtime.sendMessage({
        action: "perform_translation",
        text: seciliMetin,
        sourceLang: source,
        targetLang: target
      }, (response) => {
        if (response && response.success) {
          yuzenKartGoster(seciliMetin, response.translatedText, range, target, response.detectedSource || source);
          gecmiseKaydet(seciliMetin, response.translatedText, response.detectedSource || source, target);
        } else {
          toastGoster(isEn ? "Error: Translation failed!" : "Hata: Çeviri Yapılamadı!", "hata");
        }
      });
    }
  });
}

// --- ÇEVİRİ GEÇMİŞİNİ LOCAL STORAGE'A KAYDET ---
function gecmiseKaydet(orijinal, cevrilen, kaynak, hedef) {
  chrome.storage.local.get(['gecmis'], (result) => {
    let gecmis = result.gecmis || [];

    let isDuplicate = gecmis.slice(0, 3).some(h => h.orijinal.toLowerCase() === orijinal.toLowerCase() && h.hedef === hedef);
    if (isDuplicate) return;

    let yeniKayit = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      orijinal: orijinal,
      cevrilen: cevrilen,
      kaynak: kaynak,
      hedef: hedef,
      tarih: new Date().toLocaleString('tr-TR')
    };

    gecmis.unshift(yeniKayit);
    if (gecmis.length > 50) gecmis.pop();

    chrome.storage.local.set({ gecmis: gecmis });
  });
}

// --- MOUSEUP / SEÇİM DİNLEYİCİSİ (BALON İÇİN) ---
document.addEventListener("mouseup", (e) => {
  setTimeout(() => {
    let activeElement = document.activeElement;

    if (aktifKart && aktifKart.contains(e.target)) return;
    if (aktifBalon && aktifBalon.contains(e.target)) return;

    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      balonKapat();
      return;
    }

    let selection = window.getSelection();
    let selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      let range = selection.getRangeAt(0);
      sefkatliBalonGoster(range, selectedText);
    } else {
      balonKapat();
    }
  }, 30);
});

document.addEventListener("mousedown", (e) => {
  if (aktifKart && !aktifKart.contains(e.target)) {
    kartiKapat();
  }
  if (aktifBalon && !aktifBalon.contains(e.target)) {
    balonKapat();
  }
});

// --- ANA TETİKLEYİCİ ÇEVİRİ FONKSİYONU ---
function tetikleCeviri() {
  let aktifElement = document.activeElement;
  let seciliMetin = "";
  let isEditable = false;
  let selectionRange = null;

  if (aktifElement && (aktifElement.tagName === 'TEXTAREA' || aktifElement.tagName === 'INPUT')) {
    let start = aktifElement.selectionStart;
    let end = aktifElement.selectionEnd;
    if (start !== undefined && end !== undefined) {
      seciliMetin = aktifElement.value.substring(start, end);
      isEditable = true;
    }
  }

  if (!isEditable || seciliMetin.length === 0) {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      seciliMetin = selection.toString();
      selectionRange = selection.getRangeAt(0);
      isEditable = false;
    }
  }

  seciliMetin = seciliMetin.trim();
  if (seciliMetin.length === 0) return;

  chrome.storage.sync.get(['hedefDil', 'kaynakDil', 'ozelSozluk', 'sozlukCevirisiEtkin', 'arayuzDili'], (result) => {
    let target = result.hedefDil || 'en';
    let source = result.kaynakDil || 'auto';
    let dictionary = result.ozelSozluk || {};
    let isDictActive = result.sozlukCevirisiEtkin !== false;
    let isEn = result.arayuzDili === 'en';

    let temizMetin = seciliMetin.toLowerCase().trim();

    // Akıllı Çok Dilli Sözlük Sorgulama Altyapısı
    let translation = null;
    if (isDictActive) {
      translation = sozluktenBul(source, target, temizMetin, dictionary);
    }

    if (translation) {
      if (isEditable) {
        metniDegistir(aktifElement, translation);
        toastGoster(isEn ? "Translated from Dictionary ✓" : "Sözlükten Çevrildi ✓", "basari");
      } else if (selectionRange) {
        yuzenKartGoster(seciliMetin, translation, selectionRange, target, "Sözlük");
      }
      gecmiseKaydet(seciliMetin, translation, "Sözlük", target);
    } else {
      if (isEditable) {
        metniDegistir(aktifElement, isEn ? "" : "");
      } else {
        toastGoster(isEn ? "Translating..." : "Çeviriliyor...", "bilgi");
      }

      chrome.runtime.sendMessage({
        action: "perform_translation",
        text: seciliMetin,
        sourceLang: source,
        targetLang: target
      }, (response) => {
        if (response && response.success) {
          if (isEditable) {
            metniDegistir(aktifElement, response.translatedText);
            toastGoster(isEn ? "Translation Success ✓" : "Çeviri Başarılı ✓", "basari");
          } else if (selectionRange) {
            yuzenKartGoster(seciliMetin, response.translatedText, selectionRange, target, response.detectedSource || source);
          }
          gecmiseKaydet(seciliMetin, response.translatedText, response.detectedSource || source, target);
        } else {
          if (isEditable) {
            metniDegistir(aktifElement, seciliMetin);
          }
          toastGoster(isEn ? "Error: Translation failed!" : "Hata: Çeviri Yapılamadı!", "hata");
        }
      });
    }
  });
}

// --- ANA DİNLEYİCİLER ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cevir") {
    tetikleCeviri();
  }
});

// --- DİNAMİK KISAYOL TUŞU DİNLEME ---
let varsayilanKisayol = { ctrl: false, alt: true, shift: false, key: "KeyT", display: "Alt+T" };

window.addEventListener("keydown", (e) => {
  chrome.storage.sync.get(["kullaniciKisayol"], (result) => {
    let kisayol = result.kullaniciKisayol || varsayilanKisayol;

    let keyMatches = e.code === kisayol.key || e.key.toLowerCase() === kisayol.key.replace("Key", "").toLowerCase();

    if (
      e.ctrlKey === !!kisayol.ctrl &&
      e.altKey === !!kisayol.alt &&
      e.shiftKey === !!kisayol.shift &&
      keyMatches
    ) {
      e.preventDefault();
      tetikleCeviri();
    }
  });
});