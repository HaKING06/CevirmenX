chrome.storage.sync.get('arayuzDili').then(settings => {
 const language = settings.arayuzDili || navigator.language.split('-')[0];
 document.documentElement.lang = cxMessages[language] ? language : 'en';
 document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
 for (const label of document.querySelectorAll('[data-msg]')) label.textContent = cxText(label.dataset.msg,language);
});