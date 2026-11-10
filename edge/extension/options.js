document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLanguageSwitcher();
  sozluguYukle();
  gecmisiYukle();
  loadSettings();
});

// --- DİL ÇEVİRİ ALTYAPISI (INTERNATIONALIZATION) ---
const UI_STRINGS = {
  tr: {
    title: "ÇevirmenX",
    tagline: "Özel sözlük ve anında akıllı çeviri paneli",
    tabSozluk: "📖 Özel Sözlük",
    tabGecmis: "⏱️ Çeviri Geçmişi",
    tabAyarlar: "⚙️ Ayarlar & Temalar",
    
    sozlukTitle: "Dinamik Çeviri Sözlüğü",
    sozlukSubtitle: "Çeviri motorunun hata yaptığı veya istediğiniz jargona uydurmak istediğiniz terimleri belirli bir kaynak ve hedef dile göre kaydedin.",
    placeholderOriginal: "Orijinal Terim (örn: naber)",
    placeholderTranslation: "Çevirisi (örn: what's up)",
    btnEkle: "Ekle",
    placeholderSearchSozluk: "Sözlük içinde terim veya dil ara...",
    btnExport: "Sözlüğü İndir (.json)",
    btnImport: "Dosyadan Yükle",
    btnClearSozluk: "🗑️ Sözlüğü Temizle",
    emptySozluk: "Sözlüğünüz şu an boş. Üst kısımdan dilleri belirterek terimler ekleyebilirsiniz.",
    
    historyTitle: "Çeviri Geçmişi",
    historySubtitle: "Son yaptığınız çevirilerin listesi. Kolayca kopyalayabilir veya sözlüğe ekleyebilirsiniz.",
    btnClearHistory: "🗑️ Geçmişi Temizle",
    placeholderSearchHistory: "Geçmiş içinde ara...",
    emptyHistory: "Henüz yapılmış bir çeviri geçmişi yok.",
    
    settingsTitle: "Eklenti Ayarları",
    settingsSubtitle: "Çeviri tetikleme yöntemlerini düzenleyin, kısayol tuşlarını kaydedin ve eklenti renk temasını seçin.",
    cardUiOptions: "Arayüz Seçenekleri",
    optionBubbleName: "Çeviri Balonu (Hover Bubble)",
    optionBubbleDesc: "Metin seçildiğinde yanında küçük çeviri ikonu çıkar. Kısayola basmadan tıklayıp çevirebilirsiniz.",
    optionDictName: "Sözlük Çevirisi Etkin",
    optionDictDesc: "Çeviri yaparken öncelikle dinamik sözlüğünüzdeki tanımlar kontrol edilir.",
    
    cardTheme: "Renk Teması",
    themeMidnight: "Midnight",
    themeAmethyst: "Amethyst",
    themeEmerald: "Emerald",
    themeAmber: "Amber",
    
    cardShortcut: "Metin Seçim Kısayolu (Sayfa İçi)",
    activeShortcutTitle: "Aktif Tetikleyici Kısayol",
    btnChangeShortcut: "Kısayolu Değiştir",
    shortcutDesc: '"Kısayolu Değiştir" butonuna tıklayıp klavyenizden yeni tuşlara basın. En az bir değiştirici (Ctrl, Alt, Shift) + bir harf tuşlayın.',
    shortcutWarningTitle: "⚠️ Kısayol Türleri ve Sınırlandırmalar",
    shortcutWarningDesc: "<strong>1. Sayfa İçi Kısayol (Yukarıdaki):</strong> Web sayfalarındaki metinleri seçip basınca çalışır. Anında güncellenir.<br><strong>2. Tarayıcı Kısayolu (Natif):</strong> Tarayıcı genelinde geçerlidir. Güvenlik gereği Chrome bu native tuşu otomatik değiştirmemize izin vermez. Bunu güncellemek için aşağıdaki adresi açın:",
    btnCopyLink: "Sekmeyi Kopyala",
    btnCopyLinkSuccess: "✓ Kopyalandı",
    
    confirmClearHistory: "Tüm çeviri geçmişinizi temizlemek istediğinize emin misiniz?",
    confirmClearSozluk: "Tüm sözlük kayıtlarınızı temizlemek istediğinize emin misiniz?",
    importSuccess: "Sözlük başarıyla içe aktarıldı ve birleştirildi!",
    importError: "Geçersiz dosya biçimi!",
    errorCopy: "Kopyalandı",
    addedToDict: "✓ Eklendi",
    
    universalLang: "Tüm Diller",
    originalTerm: "Orijinal Terim",
    translationTerm: "Çeviri",
    
    // Dil Listesi
    langTr: "🇹🇷 Türkçe (TR)",
    langEn: "🇬🇧 İngilizce (EN)",
    langDe: "🇩🇪 Almanca (DE)",
    langFr: "🇫🇷 Fransızca (FR)",
    langEs: "🇪🇸 İspanyolca (ES)",
    langIt: "🇮🇹 İtalyanca (IT)",
    langRu: "🇷🇺 Rusça (RU)",
    langZh: "🇨🇳 Çince (ZH)",
    langJa: "🇯🇵 Japonca (JA)",
    langKo: "🇰🇷 Korece (KO)",
    langAr: "🇸🇦 Arapça (AR)",
    langPt: "🇵🇹 Portekizce (PT)",
    langNl: "🇳🇱 Felemenkçe (NL)",
    langPl: "🇵🇱 Lehçe (PL)",
    langSv: "🇸🇪 İsveççe (SV)",
    langEl: "🇬🇷 Yunanca (EL)",
    langHi: "🇮🇳 Hintçe (HI)"
  },
  en: {
    title: "TranslatorX",
    tagline: "Custom dictionary and instant smart translation dashboard",
    tabSozluk: "📖 My Dictionary",
    tabGecmis: "⏱️ Translation History",
    tabAyarlar: "⚙️ Settings & Themes",
    
    sozlukTitle: "Dynamic Translation Dictionary",
    sozlukSubtitle: "Register terms where the translation engine fails or adjust translations to your own gaming/dev jargons based on source and target languages.",
    placeholderOriginal: "Original Term (e.g., naber)",
    placeholderTranslation: "Translation (e.g., what's up)",
    btnEkle: "Add",
    placeholderSearchSozluk: "Search in dictionary by term or language...",
    btnExport: "Export (.json)",
    btnImport: "Import from File",
    btnClearSozluk: "🗑️ Clear Dictionary",
    emptySozluk: "Your dictionary is empty. You can add translation pairs above.",
    
    historyTitle: "Translation History",
    historySubtitle: "List of your recent translations. You can easily copy them or add them to the dictionary.",
    btnClearHistory: "🗑️ Clear History",
    placeholderSearchHistory: "Search in history...",
    emptyHistory: "No translation history yet.",
    
    settingsTitle: "Extension Settings",
    settingsSubtitle: "Configure translation triggers, record custom hotkeys, and choose a layout color theme.",
    cardUiOptions: "Interface Options",
    optionBubbleName: "Hover Translation Bubble",
    optionBubbleDesc: "Shows a small translate bubble icon when text is highlighted. Click it to translate without hotkeys.",
    optionDictName: "Enable Custom Dictionary",
    optionDictDesc: "Always check custom dictionary overrides first before querying translation engines.",
    
    cardTheme: "Color Theme",
    themeMidnight: "Midnight",
    themeAmethyst: "Amethyst",
    themeEmerald: "Emerald",
    themeAmber: "Amber",
    
    cardShortcut: "Text Selection Hotkey (In-Page)",
    activeShortcutTitle: "Active Trigger Hotkey",
    btnChangeShortcut: "Change Hotkey",
    shortcutDesc: 'Click "Change Hotkey" and press your key combination. Use at least one modifier (Ctrl, Alt, Shift) + any key.',
    shortcutWarningTitle: "⚠️ Hotkey Types & Limitations",
    shortcutWarningDesc: "<strong>1. In-Page Hotkey:</strong> Works on standard web pages when text is selected. Updates instantly.<br><strong>2. Browser Native Hotkey:</strong> Managed globally by Chrome. For security reasons, Chrome doesn't allow extensions to change it automatically. Visit the link below to modify it:",
    btnCopyLink: "Copy Link",
    btnCopyLinkSuccess: "✓ Copied",
    
    confirmClearHistory: "Are you sure you want to clear your entire translation history?",
    confirmClearSozluk: "Are you sure you want to clear all dictionary entries?",
    importSuccess: "Dictionary imported and merged successfully!",
    importError: "Invalid file format!",
    errorCopy: "Copied",
    addedToDict: "✓ Added",
    
    universalLang: "All Languages",
    originalTerm: "Original Term",
    translationTerm: "Translation",
    
    // Language List
    langTr: "Turkish (TR)",
    langEn: "English (EN)",
    langDe: "German (DE)",
    langFr: "French (FR)",
    langEs: "Spanish (ES)",
    langIt: "Italian (IT)",
    langRu: "Russian (RU)",
    langZh: "Chinese (ZH)",
    langJa: "Japanese (JA)",
    langKo: "Korean (KO)",
    langAr: "Arabic (AR)",
    langPt: "Portuguese (PT)",
    langNl: "Dutch (NL)",
    langPl: "Polish (PL)",
    langSv: "Swedish (SV)",
    langEl: "Greek (EL)",
    langHi: "Hindi (HI)"
  }
};

let activeLang = 'tr';
let sozlukKaynakSelect = null;
let sozlukHedefSelect = null;

let tempKaynakVal = 'tr';
let tempHedefVal = 'en';

function initLanguageSwitcher() {
  chrome.storage.sync.get(['arayuzDili'], (result) => {
    activeLang = result.arayuzDili || 'tr';
    applyUiLanguage(activeLang);
  });

  document.querySelectorAll('.lang-change-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-lang');
      activeLang = selected;
      chrome.storage.sync.set({ arayuzDili: selected }, () => {
        applyUiLanguage(selected);
      });
    });
  });
}

// Arama kutulu dil seçicisi yapıcı metodu
function makeSearchableSelect(wrapperId, options, initialValue, onChange) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return null;
  
  wrapper.innerHTML = "";
  wrapper.className = 'custom-select-wrapper';
  wrapper.innerHTML = `
    <div class="custom-select-trigger">
      <span class="selected-text"></span>
      <span style="font-size: 8px; color: var(--text-muted);">▼</span>
    </div>
    <div class="custom-select-dropdown">
      <div class="custom-select-search">
        <input type="text" placeholder="${activeLang === 'tr' ? 'Dil ara...' : 'Search language...'}">
      </div>
      <div class="custom-select-options"></div>
    </div>
  `;
  
  const trigger = wrapper.querySelector('.custom-select-trigger');
  const dropdown = wrapper.querySelector('.custom-select-dropdown');
  const searchInput = wrapper.querySelector('.custom-select-search input');
  const optionsDiv = wrapper.querySelector('.custom-select-options');
  const selectedSpan = wrapper.querySelector('.selected-text');
  
  let currentValue = initialValue;
  
  function updateTriggerText() {
    let opt = options.find(o => o.value === currentValue);
    if (opt) {
      selectedSpan.innerText = opt.text;
    }
  }
  
  function renderOptions(filterText = "") {
    optionsDiv.innerHTML = "";
    let q = filterText.toLowerCase().trim();
    
    let filtered = options.filter(o => o.text.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
    
    filtered.forEach(o => {
      let optionItem = document.createElement('div');
      optionItem.className = `custom-select-option ${o.value === currentValue ? 'selected' : ''}`;
      optionItem.innerText = o.text;
      
      optionItem.addEventListener('click', (e) => {
        e.stopPropagation();
        currentValue = o.value;
        updateTriggerText();
        wrapper.classList.remove('open');
        onChange(currentValue);
      });
      
      optionsDiv.appendChild(optionItem);
    });
  }
  
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
      if (w !== wrapper) w.classList.remove('open');
    });
    wrapper.classList.toggle('open');
    if (wrapper.classList.contains('open')) {
      searchInput.value = "";
      renderOptions();
      searchInput.focus();
    }
  });
  
  searchInput.addEventListener('input', (e) => {
    renderOptions(e.target.value);
  });
  
  searchInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  updateTriggerText();
  
  return {
    setValue: (val) => {
      currentValue = val;
      updateTriggerText();
    },
    getValue: () => currentValue,
    setLanguage: (lang) => {
      searchInput.placeholder = lang === 'tr' ? 'Dil ara...' : 'Search language...';
    }
  };
}

// Global kapatma dinleyicisi
document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
});

function getOzelKaynakList(strings) {
  return [
    { value: "tr", text: strings.langTr },
    { value: "all", text: `🌐 ${strings.universalLang}` },
    { value: "en", text: strings.langEn },
    { value: "de", text: strings.langDe },
    { value: "fr", text: strings.langFr },
    { value: "es", text: strings.langEs },
    { value: "it", text: strings.langIt },
    { value: "ru", text: strings.langRu },
    { value: "zh", text: strings.langZh },
    { value: "ja", text: strings.langJa },
    { value: "ko", text: strings.langKo },
    { value: "ar", text: strings.langAr },
    { value: "pt", text: strings.langPt },
    { value: "nl", text: strings.langNl },
    { value: "pl", text: strings.langPl },
    { value: "sv", text: strings.langSv },
    { value: "el", text: strings.langEl },
    { value: "hi", text: strings.langHi }
  ];
}

function getOzelHedefList(strings) {
  return [
    { value: "en", text: strings.langEn },
    { value: "all", text: `🌐 ${strings.universalLang}` },
    { value: "tr", text: strings.langTr },
    { value: "de", text: strings.langDe },
    { value: "fr", text: strings.langFr },
    { value: "es", text: strings.langEs },
    { value: "it", text: strings.langIt },
    { value: "ru", text: strings.langRu },
    { value: "zh", text: strings.langZh },
    { value: "ja", text: strings.langJa },
    { value: "ko", text: strings.langKo },
    { value: "ar", text: strings.langAr },
    { value: "pt", text: strings.langPt },
    { value: "nl", text: strings.langNl },
    { value: "pl", text: strings.langPl },
    { value: "sv", text: strings.langSv },
    { value: "el", text: strings.langEl },
    { value: "hi", text: strings.langHi }
  ];
}

function applyUiLanguage(lang) {
  document.querySelectorAll('.lang-change-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const strings = UI_STRINGS[lang] || UI_STRINGS['tr'];
  
  // Header translations
  document.querySelector('.brand-name').innerText = strings.title;
  document.querySelector('.brand-tagline').innerText = strings.tagline;
  
  document.querySelector('[data-tab="sozluk"] span').innerText = strings.tabSozluk;
  document.querySelector('[data-tab="gecmis"] span').innerText = strings.tabGecmis;
  document.querySelector('[data-tab="ayarlar"] span').innerText = strings.tabAyarlar;
  
  // Tab 1 Dictionary translations
  document.querySelector('#tab-sozluk h3').innerText = strings.sozlukTitle;
  document.querySelector('#tab-sozluk .subtitle').innerText = strings.sozlukSubtitle;
  document.getElementById('kelimeInput').placeholder = strings.placeholderOriginal;
  document.getElementById('cevirisiInput').placeholder = strings.placeholderTranslation;
  document.querySelector('#ekleBtn span').innerText = strings.btnEkle;
  document.getElementById('sozlukAramaInput').placeholder = strings.placeholderSearchSozluk;
  document.getElementById('disaAktarBtn').innerHTML = `
    <svg style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    ${strings.btnExport}
  `;
  document.getElementById('iceAktarBtn').innerHTML = `
    <svg style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    ${strings.btnImport}
  `;
  document.getElementById('sozluguTemizleBtn').innerHTML = `
    🗑️ ${strings.btnClearSozluk.substring(3)}
  `;

  // Searchable Select initialization
  sozlukKaynakSelect = makeSearchableSelect("sozlukKaynakDilContainer", getOzelKaynakList(strings), tempKaynakVal, (val) => {
    tempKaynakVal = val;
  });
  
  sozlukHedefSelect = makeSearchableSelect("sozlukHedefDilContainer", getOzelHedefList(strings), tempHedefVal, (val) => {
    tempHedefVal = val;
  });

  // Tab 2 History translations
  document.querySelector('#tab-gecmis h3').innerText = strings.historyTitle;
  document.querySelector('#tab-gecmis .subtitle').innerText = strings.historySubtitle;
  document.getElementById('gecmisiTemizleBtn').innerText = strings.btnClearHistory;
  document.getElementById('gecmisAramaInput').placeholder = strings.placeholderSearchHistory;

  // Tab 3 Settings translations
  document.querySelector('#tab-ayarlar h3').innerText = strings.settingsTitle;
  document.querySelector('#tab-ayarlar .subtitle').innerText = strings.settingsSubtitle;
  document.querySelector('#tab-ayarlar .settings-column:nth-child(1) .setting-card:nth-child(1) .setting-title').innerText = strings.cardUiOptions;
  
  document.querySelector('#tab-ayarlar .toggle-setting:nth-child(2) .toggle-name').innerText = strings.optionBubbleName;
  document.querySelector('#tab-ayarlar .toggle-setting:nth-child(2) .toggle-desc').innerText = strings.optionBubbleDesc;
  document.querySelector('#tab-ayarlar .toggle-setting:nth-child(3) .toggle-name').innerText = strings.optionDictName;
  document.querySelector('#tab-ayarlar .toggle-setting:nth-child(3) .toggle-desc').innerText = strings.optionDictDesc;

  document.querySelector('#tab-ayarlar .setting-card:nth-child(2) .setting-title').innerText = strings.cardTheme;
  document.querySelector('[data-theme-name="indigo"] .theme-name').innerText = strings.themeMidnight;
  document.querySelector('[data-theme-name="purple"] .theme-name').innerText = strings.themeAmethyst;
  document.querySelector('[data-theme-name="emerald"] .theme-name').innerText = strings.themeEmerald;
  document.querySelector('[data-theme-name="amber"] .theme-name').innerText = strings.themeAmber;

  document.querySelector('#tab-ayarlar .settings-column:nth-child(2) .setting-card .setting-title').innerText = strings.cardShortcut;
  document.querySelector('#tab-ayarlar .shortcut-box div:nth-child(1)').innerText = strings.activeShortcutTitle;
  document.getElementById('kisayolKayitBtn').innerText = strings.btnChangeShortcut;
  document.getElementById('kisayolTalimat').innerText = strings.shortcutDesc;
  document.querySelector('#tab-ayarlar .shortcut-warning div:nth-child(1)').innerText = strings.shortcutWarningTitle;
  document.querySelector('#tab-ayarlar .shortcut-warning div:nth-child(2)').innerHTML = strings.shortcutWarningDesc;
  document.getElementById('kopyalaLinkBtn').innerText = strings.btnCopyLink;
  
  // Re-list collections to apply languages
  listeyiGuncelle(document.getElementById('sozlukAramaInput').value);
  gecmisListele(document.getElementById('gecmisAramaInput').value);
}


// --- TAB KONTROLÜ ---
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');

      const targetTabId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${targetTabId}`).classList.add('active');

      if (targetTabId === 'sozluk') {
        sozluguYukle();
      } else if (targetTabId === 'gecmis') {
        gecmisiYukle();
      }
    });
  });
}

// --- SÖZLÜK YÖNETİMİ ---
let currentDictionary = {};

// Gelişmiş veri göçü fonksiyonu: (Eski formatları en yeni 3 parçalı formata dönüştürür: kaynak_hedef_kelime)
function migrateDictionary(sozluk) {
  let migrated = false;
  let newSozluk = {};
  for (let [k, v] of Object.entries(sozluk)) {
    if (/^[a-z]{2,3}_[a-z]{2,3}_/.test(k)) {
      newSozluk[k] = v;
    } else if (/^[a-z]{2,3}_/.test(k)) {
      let underscoreIdx = k.indexOf("_");
      let target = k.substring(0, underscoreIdx);
      let word = k.substring(underscoreIdx + 1);
      newSozluk[`all_${target}_${word}`] = v;
      migrated = true;
    } else {
      newSozluk[`all_all_${k}`] = v;
      migrated = true;
    }
  }
  if (migrated) {
    chrome.storage.sync.set({ ozelSozluk: newSozluk });
  }
  return newSozluk;
}

function sozluguYukle() {
  chrome.storage.sync.get(['ozelSozluk'], (result) => {
    let rawSozluk = result.ozelSozluk || {};
    currentDictionary = migrateDictionary(rawSozluk);
    listeyiGuncelle();
  });
}

function getLanguageName(code) {
  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  const names = {
    'all': strings.universalLang,
    'tr': strings.langTr,
    'en': strings.langEn,
    'de': strings.langDe,
    'fr': strings.langFr,
    'es': strings.langEs,
    'it': strings.langIt,
    'ru': strings.langRu,
    'zh': strings.langZh,
    'ja': strings.langJa,
    'ko': strings.langKo,
    'ar': strings.langAr,
    'pt': strings.langPt,
    'nl': strings.langNl,
    'pl': strings.langPl,
    'sv': strings.langSv,
    'el': strings.langEl,
    'hi': strings.langHi
  };
  return names[code] || String(code).toUpperCase();
}

function getLanguageFlag(code) {
  const flags = {
    'all': '🌐',
    'tr': '🇹🇷',
    'en': '🇬🇧',
    'de': '🇩🇪',
    'fr': '🇫🇷',
    'es': '🇪🇸',
    'it': '🇮🇹',
    'ru': '🇷🇺',
    'zh': '🇨🇳',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'ar': '🇸🇦',
    'pt': '🇵🇹',
    'nl': '🇳🇱',
    'pl': '🇵🇱',
    'sv': '🇸🇪',
    'el': '🇬🇷',
    'hi': '🇮🇳'
  };
  return flags[code] || '🌐';
}

function parseStorageKey(key) {
  let parts = key.split("_");
  if (parts.length >= 3) {
    let source = parts[0];
    let target = parts[1];
    let word = parts.slice(2).join("_");
    return { source, target, word };
  }
  return { source: "all", target: "all", word: key };
}

function listeyiGuncelle(filtre = "") {
  const listeDiv = document.getElementById('sozlukListesi');
  if (!listeDiv) return;
  listeDiv.innerHTML = "";
  
  const entries = Object.entries(currentDictionary);
  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  
  const filtered = entries.filter(([k, cevirisi]) => {
    if (!k || cevirisi === undefined || cevirisi === null) return false;
    let { source, target, word } = parseStorageKey(k);
    let q = (filtre || "").toLowerCase().trim();
    
    let sourceName = (getLanguageName(source) || "").toLowerCase();
    let targetName = (getLanguageName(target) || "").toLowerCase();
    let wordClean = (word || "").toLowerCase();
    let transClean = String(cevirisi).toLowerCase();
    
    return wordClean.includes(q) || 
           transClean.includes(q) || 
           sourceName.includes(q) || 
           targetName.includes(q) || 
           source.toLowerCase().includes(q) || 
           target.toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    if (entries.length === 0) {
      listeDiv.innerHTML = `
        <div class="empty-state">
          <svg style="width: 40px; height: 40px; margin-bottom: 8px; opacity: 0.3;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <div>${strings.emptySozluk}</div>
        </div>
      `;
    } else {
      listeDiv.innerHTML = `
        <div class="empty-state">
          <div>${activeLang === 'tr' ? 'Aramanızla eşleşen bir kayıt bulunamadı.' : 'No matching record found.'}</div>
        </div>
      `;
    }
    return;
  }

  filtered.sort((a, b) => {
    let wordA = parseStorageKey(a[0]).word;
    let wordB = parseStorageKey(b[0]).word;
    return wordA.localeCompare(wordB);
  });

  for (let [fullKey, cevirisi] of filtered) {
    let { source, target, word } = parseStorageKey(fullKey);
    
    let isAllSource = source === "all";
    let isAllTarget = target === "all";
    
    let sourceBadge = `${getLanguageFlag(source)} ${source.toUpperCase()}`;
    let targetBadge = `${getLanguageFlag(target)} ${target.toUpperCase()}`;

    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <div class="list-item-content">
        <span class="lang-badge ${isAllSource ? 'all' : 'specific'}">${sourceBadge}</span>
        <span class="arrow-icon" style="color: var(--text-muted); font-size: 11px;">➔</span>
        <span class="lang-badge ${isAllTarget ? 'all' : 'specific'}">${targetBadge}</span>
        <span class="word-tag" style="margin-left: 8px;">${escapeHtml(word)}</span>
        <span class="arrow-icon">➔</span>
        <span class="trans-tag">${escapeHtml(cevirisi)}</span>
      </div>
      <button class="btn-delete" data-fullkey="${escapeHtml(fullKey)}">${activeLang === 'tr' ? 'Sil' : 'Delete'}</button>
    `;
    listeDiv.appendChild(div);
  }

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let silinecekKey = e.target.getAttribute('data-fullkey');
      sozluktenSil(silinecekKey);
    });
  });
}

function sozluktenSil(fullKey) {
  delete currentDictionary[fullKey];
  chrome.storage.sync.set({ ozelSozluk: currentDictionary }, () => {
    listeyiGuncelle(document.getElementById('sozlukAramaInput').value);
  });
}

// Ekleme
document.getElementById('ekleBtn').addEventListener('click', () => {
  let kelime = document.getElementById('kelimeInput').value.toLowerCase().trim();
  let cevirisi = document.getElementById('cevirisiInput').value.trim();
  let kaynakDil = sozlukKaynakSelect ? sozlukKaynakSelect.getValue() : tempKaynakVal;
  let hedefDil = sozlukHedefSelect ? sozlukHedefSelect.getValue() : tempHedefVal;

  if (!kelime || !cevirisi) return;

  let storageKey = `${kaynakDil}_${hedefDil}_${kelime}`;

  currentDictionary[storageKey] = cevirisi;
  chrome.storage.sync.set({ ozelSozluk: currentDictionary }, () => {
    document.getElementById('kelimeInput').value = "";
    document.getElementById('cevirisiInput').value = "";
    listeyiGuncelle(document.getElementById('sozlukAramaInput').value);
  });
});

// Arama
document.getElementById('sozlukAramaInput').addEventListener('input', (e) => {
  listeyiGuncelle(e.target.value);
});

// Dışa Aktarma
document.getElementById('disaAktarBtn').addEventListener('click', () => {
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDictionary, null, 2));
  let downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "cevirmenx_sozluk.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// İçe Aktarma
const importFileBtn = document.getElementById('iceAktarBtn');
const fileInput = document.getElementById('importFileInput');

if (importFileBtn) {
  importFileBtn.addEventListener('click', () => {
    fileInput.click();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    let file = e.target.files[0];
    if (!file) return;
    
    let reader = new FileReader();
    reader.onload = function(evt) {
      const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
      try {
        let imported = JSON.parse(evt.target.result);
        if (typeof imported === 'object' && imported !== null) {
          let migratedImported = migrateDictionary(imported);
          currentDictionary = { ...currentDictionary, ...migratedImported };
          chrome.storage.sync.set({ ozelSozluk: currentDictionary }, () => {
            listeyiGuncelle(document.getElementById('sozlukAramaInput').value);
            alert(strings.importSuccess);
          });
        } else {
          alert(strings.importError);
        }
      } catch (err) {
        alert(strings.importError);
      }
    };
    reader.readAsText(file);
  });
}

// Tüm Sözlüğü Temizleme
document.getElementById('sozluguTemizleBtn').addEventListener('click', () => {
  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  if (confirm(strings.confirmClearSozluk)) {
    currentDictionary = {};
    chrome.storage.sync.set({ ozelSozluk: {} }, () => {
      listeyiGuncelle();
    });
  }
});


// --- ÇEVİRİ GEÇMİŞİ YÖNETİMİ ---
let currentHistory = [];

function gecmisiYukle() {
  chrome.storage.local.get(['gecmis'], (result) => {
    currentHistory = result.gecmis || [];
    gecmisListele();
  });
}

function gecmisListele(filtre = "") {
  const gecmisListDiv = document.getElementById('gecmisListesi');
  if (!gecmisListDiv) return;
  gecmisListDiv.innerHTML = "";

  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  const q = (filtre || "").toLowerCase().trim();

  const filtered = currentHistory.filter(item => {
    if (!item) return false;
    let orijinal = String(item.orijinal || "").toLowerCase();
    let cevrilen = String(item.cevrilen || "").toLowerCase();
    return orijinal.includes(q) || cevrilen.includes(q);
  });

  if (filtered.length === 0) {
    gecmisListDiv.innerHTML = `
      <div class="empty-state">
        <svg style="width: 40px; height: 40px; margin-bottom: 8px; opacity: 0.3;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>${strings.emptyHistory}</div>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    let kaynak = String(item.kaynak || "auto").toUpperCase();
    let hedef = String(item.hedef || "en").toUpperCase();
    let tarih = String(item.tarih || "");
    let orijinal = String(item.orijinal || "");
    let cevrilen = String(item.cevrilen || "");
    
    let btnCopyWord = strings.btnCopyLink.split(" ")[0];

    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-meta">
        <span>🌐 ${kaynak} ➔ ${hedef}</span>
        <span>${tarih}</span>
      </div>
      <div class="history-texts">
        <span class="history-orig">${escapeHtml(orijinal)}</span>
        <span class="arrow-icon">➔</span>
        <span class="history-trans">${escapeHtml(cevrilen)}</span>
      </div>
      <div class="history-actions">
        <button class="btn btn-outline btn-sm gecmis-kopyala" data-text="${escapeHtml(cevrilen)}">📋 ${btnCopyWord} Copy</button>
        <button class="btn btn-primary btn-sm gecmis-sozluge-ekle" data-orig="${escapeHtml(orijinal)}" data-trans="${escapeHtml(cevrilen)}" data-sourcelang="${escapeHtml(item.kaynak || 'auto')}" data-targetlang="${escapeHtml(item.hedef || 'en')}">➕ ${strings.tabSozluk.substring(3)}</button>
        <button class="btn btn-danger btn-sm gecmis-tekli-sil" data-id="${item.id}">${activeLang === 'tr' ? 'Sil' : 'Delete'}</button>
      </div>
    `;
    gecmisListDiv.appendChild(div);
  });

  // Kopyalama
  document.querySelectorAll('.gecmis-kopyala').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let txt = e.target.getAttribute('data-text');
      navigator.clipboard.writeText(txt).then(() => {
        e.target.innerText = strings.btnCopyLinkSuccess;
        setTimeout(() => {
          let btnCopyWord = strings.btnCopyLink.split(" ")[0];
          e.target.innerText = `📋 ${btnCopyWord} Copy`;
        }, 1500);
      });
    });
  });

  // Sözlüğe Ekleme
  document.querySelectorAll('.gecmis-sozluge-ekle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let orig = e.target.getAttribute('data-orig').toLowerCase().trim();
      let trans = e.target.getAttribute('data-trans').trim();
      let sourcelang = e.target.getAttribute('data-sourcelang').toLowerCase().trim();
      let targetlang = e.target.getAttribute('data-targetlang').toLowerCase().trim();
      
      if (sourcelang === "sözlük") sourcelang = "all";
      if (targetlang === "sözlük") targetlang = "all";
      
      chrome.storage.sync.get(['ozelSozluk'], (result) => {
        let sozluk = result.ozelSozluk || {};
        let storageKey = `${sourcelang}_${targetlang}_${orig}`;
        sozluk[storageKey] = trans;
        
        chrome.storage.sync.set({ ozelSozluk: sozluk }, () => {
          e.target.innerText = `${strings.addedToDict} (${sourcelang.toUpperCase()}➔${targetlang.toUpperCase()})`;
          e.target.style.background = "#10b981";
          setTimeout(() => {
            e.target.innerText = `➕ ${activeLang === 'tr' ? 'Özel Sözlük' : 'Dictionary'}`;
            e.target.style.background = "";
          }, 1500);
        });
      });
    });
  });

  // Tekli Silme
  document.querySelectorAll('.gecmis-tekli-sil').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let id = e.target.getAttribute('data-id');
      currentHistory = currentHistory.filter(h => h.id !== id);
      chrome.storage.local.set({ gecmis: currentHistory }, () => {
        gecmisListele(document.getElementById('gecmisAramaInput').value);
      });
    });
  });
}

function escapeHtml(text) {
  if (!text) return "";
  let map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Geçmiş Arama
document.getElementById('gecmisAramaInput').addEventListener('input', (e) => {
  gecmisListele(e.target.value);
});

// Geçmişi Temizleme
document.getElementById('gecmisiTemizleBtn').addEventListener('click', () => {
  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  if (confirm(strings.confirmClearHistory)) {
    currentHistory = [];
    chrome.storage.local.set({ gecmis: [] }, () => {
      gecmisListele();
    });
  }
});


// --- GENEL AYARLAR VE TEMALAR ---
function loadSettings() {
  chrome.storage.sync.get(['hedefDil', 'kaynakDil', 'sozlukCevirisiEtkin', 'balonGoster', 'eklentiTemasi'], (result) => {
    document.getElementById('balonGosterToggle').checked = result.balonGoster !== false;
    document.getElementById('sozlukCevirisiEtkinToggle').checked = result.sozlukCevirisiEtkin !== false;
    
    const activeTheme = result.eklentiTemasi || 'indigo';
    setTheme(activeTheme);
  });

  loadShortcut();

  document.getElementById('balonGosterToggle').addEventListener('change', (e) => {
    chrome.storage.sync.set({ balonGoster: e.target.checked });
  });

  document.getElementById('sozlukCevirisiEtkinToggle').addEventListener('change', (e) => {
    chrome.storage.sync.set({ sozlukCevirisiEtkin: e.target.checked });
  });

  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      const selectedTheme = card.getAttribute('data-theme-name');
      chrome.storage.sync.set({ eklentiTemasi: selectedTheme }, () => {
        setTheme(selectedTheme);
      });
    });
  });
}

function setTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  
  document.querySelectorAll('.theme-card').forEach(card => {
    if (card.getAttribute('data-theme-name') === themeName) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Chrome kısayol kopyalama
document.getElementById('kopyalaLinkBtn').addEventListener('click', () => {
  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  navigator.clipboard.writeText("chrome://extensions/shortcuts").then(() => {
    let btn = document.getElementById('kopyalaLinkBtn');
    btn.innerText = strings.btnCopyLinkSuccess;
    setTimeout(() => { btn.innerText = strings.btnCopyLink; }, 1500);
  });
});


// --- KISAYOL TUŞU KAYDEDİCİSİ ---
let isRecording = false;
let recordedShortcut = { ctrl: false, alt: false, shift: false, key: "", display: "" };

const box = document.getElementById("shortcutBox");
const display = document.getElementById("shortcutDisplay");
const recordBtn = document.getElementById("kisayolKayitBtn");
const talimat = document.getElementById("kisayolTalimat");

recordBtn.addEventListener("click", () => {
  if (isRecording) return;
  isRecording = true;
  recordBtn.innerText = activeLang === 'tr' ? "Kaydediliyor..." : "Recording...";
  recordBtn.style.background = "#ef4444";
  box.classList.add("recording");
  display.innerText = activeLang === 'tr' ? "Tuşlara Basın..." : "Press Keys...";
  talimat.innerText = activeLang === 'tr' ? 
    "Klavyenizden yeni kısayol tuşlarınıza basın. Tamamlamak için diğer tuşu bırakın. Vazgeçmek için Esc tuşuna basın." : 
    "Press your new shortcut keys. Release other keys to complete. Press Esc to cancel.";
  
  recordedShortcut = { ctrl: false, alt: false, shift: false, key: "", display: "" };
  
  window.addEventListener("keydown", handleShortcutRecord);
});

function formatKeyName(code) {
  if (!code) return "...";
  if (code.startsWith("Key")) return code.substring(3);
  if (code.startsWith("Digit")) return code.substring(5);
  
  const mapping = {
    "Space": "Space",
    "ArrowUp": activeLang === 'tr' ? "Yukarı" : "Up",
    "ArrowDown": activeLang === 'tr' ? "Aşağı" : "Down",
    "ArrowLeft": activeLang === 'tr' ? "Sol" : "Left",
    "ArrowRight": activeLang === 'tr' ? "Sağ" : "Right",
    "Enter": "Enter",
    "Escape": "Esc",
    "Backspace": activeLang === 'tr' ? "Geri" : "Backspace",
    "Delete": activeLang === 'tr' ? "Sil" : "Del",
    "Equal": "=",
    "Minus": "-",
    "Comma": ",",
    "Period": "."
  };
  return mapping[code] || code;
}

function handleShortcutRecord(e) {
  e.preventDefault();
  
  if (e.key === "Escape" || e.code === "Escape") {
    stopRecording(false);
    return;
  }

  const ctrl = e.ctrlKey;
  const alt = e.altKey;
  const shift = e.shiftKey;
  
  const isModifier = ["Control", "Alt", "Shift", "Meta"].some(m => e.key.includes(m) || e.code.includes(m));
  
  let modifierList = [];
  if (ctrl) modifierList.push("Ctrl");
  if (alt) modifierList.push("Alt");
  if (shift) modifierList.push("Shift");
  
  if (!isModifier) {
    const key = e.code;
    const keyDisplayName = formatKeyName(key);
    modifierList.push(keyDisplayName);
    
    if (!ctrl && !alt && !shift) {
      display.innerText = keyDisplayName;
      talimat.innerText = activeLang === 'tr' ? 
        "Hata: Sayfalarda yazı yazarken tetiklenmemesi için Ctrl, Alt veya Shift tuşlarından en az birini kullanmalısınız!" : 
        "Error: You must include at least one modifier (Ctrl, Alt, or Shift) to prevent overlaps while typing!";
      return;
    }
    
    recordedShortcut = {
      ctrl,
      alt,
      shift,
      key,
      display: modifierList.join(" + ")
    };
    
    stopRecording(true);
  } else {
    display.innerText = modifierList.length > 0 ? modifierList.join(" + ") + " + ..." : (activeLang === 'tr' ? "Tuşlayın..." : "Press...");
  }
}

function stopRecording(save) {
  isRecording = false;
  window.removeEventListener("keydown", handleShortcutRecord);
  
  const strings = UI_STRINGS[activeLang] || UI_STRINGS['tr'];
  recordBtn.innerText = strings.btnChangeShortcut;
  recordBtn.style.background = "";
  box.classList.remove("recording");
  talimat.innerText = strings.shortcutDesc;
  
  if (save && recordedShortcut.key) {
    chrome.storage.sync.set({ kullaniciKisayol: recordedShortcut }, () => {
      display.innerText = recordedShortcut.display;
    });
  } else {
    loadShortcut();
  }
}

function loadShortcut() {
  chrome.storage.sync.get(["kullaniciKisayol"], (result) => {
    const kisayol = result.kullaniciKisayol || { ctrl: false, alt: true, shift: false, key: "KeyT", display: "Alt + T" };
    display.innerText = kisayol.display;
  });
}