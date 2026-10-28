const POPUP_STRINGS = {
  tr: {
    title: "ÇevirmenX",
    lblSource: "Kaynak Dil (Source)",
    lblTarget: "Hedef Dil (Target)",
    lblBubble: "Çeviri Balonu Göster",
    lblDict: "Özel Sözlük Etkin",
    btnSettings: "Yönetim Paneli",
    toastSaved: "✓ Ayarlar Kaydedildi",
    optAuto: "🌐 Otomatik Tespit",
    
    // Dil Eşleşmeleri
    langTr: "🇹🇷 Türkçe",
    langEn: "🇬🇧 İngilizce",
    langDe: "🇩🇪 Almanca",
    langFr: "🇫🇷 Fransızca",
    langEs: "🇪🇸 İspanyolca",
    langIt: "🇮🇹 İtalyanca",
    langRu: "🇷🇺 Rusça",
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
    lblSource: "Source Language",
    lblTarget: "Target Language",
    lblBubble: "Show Hover Bubble",
    lblDict: "Enable Custom Dictionary",
    btnSettings: "Management Panel",
    toastSaved: "✓ Settings Saved",
    optAuto: "🌐 Auto-Detect",
    
    // Language Matches
    langTr: "🇹🇷 Turkish",
    langEn: "🇬🇧 English",
    langDe: "🇩🇪 German",
    langFr: "🇫🇷 French",
    langEs: "🇪🇸 Spanish",
    langIt: "🇮🇹 Italian",
    langRu: "🇷🇺 Russian",
    langZh: "🇨🇳 Chinese (ZH)",
    langJa: "🇯🇵 Japanese (JA)",
    langKo: "🇰🇷 Korean (KO)",
    langAr: "🇸🇦 Arabic (AR)",
    langPt: "🇵🇹 Portuguese (PT)",
    langNl: "🇳🇱 Dutch (NL)",
    langPl: "🇵🇱 Polish (PL)",
    langSv: "🇸🇪 Swedish (SV)",
    langEl: "🇬🇷 Greek (EL)",
    langHi: "🇮🇳 Hindi (HI)"
  }
};

let activeLang = 'tr';
let kaynakSelect = null;
let hedefSelect = null;

let currentKaynakDil = 'auto';
let currentHedefDil = 'en';

document.addEventListener('DOMContentLoaded', () => {
  // Temayı ve dili yükle ve uygula
  chrome.storage.sync.get(['eklentiTemasi', 'arayuzDili', 'hedefDil', 'kaynakDil', 'sozlukCevirisiEtkin', 'balonGoster'], (result) => {
    if (result.eklentiTemasi) {
      document.body.setAttribute('data-theme', result.eklentiTemasi);
    }
    
    activeLang = result.arayuzDili || 'tr';
    
    currentKaynakDil = result.kaynakDil || 'auto';
    currentHedefDil = result.hedefDil || 'en';
    
    // Toggles set
    document.getElementById("balonGosterToggle").checked = result.balonGoster !== false;
    document.getElementById("sozlukCevirisiEtkinToggle").checked = result.sozlukCevirisiEtkin !== false;

    applyPopupLanguage(activeLang);
  });
});

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

function getKaynakList(strings) {
  return [
    { value: "auto", text: strings.optAuto },
    { value: "tr", text: strings.langTr },
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

function getHedefList(strings) {
  return [
    { value: "en", text: strings.langEn },
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

function applyPopupLanguage(lang) {
  const strings = POPUP_STRINGS[lang];
  
  // Brand title
  document.querySelector('.brand-name').innerHTML = strings.title;

  // Labels
  document.getElementById('lblKaynakDil').innerText = strings.lblSource;
  document.getElementById('lblHedefDil').innerText = strings.lblTarget;
  
  document.querySelectorAll('.toggle-label')[0].innerText = strings.lblBubble;
  document.querySelectorAll('.toggle-label')[1].innerText = strings.lblDict;
  
  // Buttons and Toasts
  document.querySelector('#ayarlarBtn span').innerText = strings.btnSettings;
  document.querySelector('#statusToast span').innerText = strings.toastSaved;

  // Searchable Select initialization
  kaynakSelect = makeSearchableSelect("kaynakDilContainer", getKaynakList(strings), currentKaynakDil, (val) => {
    currentKaynakDil = val;
    ayarKaydet();
  });
  
  hedefSelect = makeSearchableSelect("hedefDilContainer", getHedefList(strings), currentHedefDil, (val) => {
    currentHedefDil = val;
    ayarKaydet();
  });
}

let toastTimeout = null;
function ayarKaydet() {
  let hedefDil = hedefSelect ? hedefSelect.getValue() : currentHedefDil;
  let kaynakDil = kaynakSelect ? kaynakSelect.getValue() : currentKaynakDil;
  let balonGoster = document.getElementById("balonGosterToggle").checked;
  let sozlukCevirisiEtkin = document.getElementById("sozlukCevirisiEtkinToggle").checked;

  chrome.storage.sync.set({
    hedefDil,
    kaynakDil,
    balonGoster,
    sozlukCevirisiEtkin
  }, () => {
    let toast = document.getElementById("statusToast");
    toast.classList.add("show");
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 1200);
  });
}

// Toggles change event listeners
document.getElementById("balonGosterToggle").addEventListener("change", ayarKaydet);
document.getElementById("sozlukCevirisiEtkinToggle").addEventListener("change", ayarKaydet);

// Ayarlar Sayfasını Açma
document.getElementById("ayarlarBtn").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});