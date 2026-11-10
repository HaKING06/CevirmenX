(() => {
 if(location.origin!=='https://cevir.haking.tr')return;
 const allowed=['indigo','purple','emerald','amber'];
 function send(value){if(allowed.includes(value))window.postMessage({type:'CEVIRMENX_PALETTE',palette:value},location.origin);}
 chrome.storage.sync.get('eklentiTemasi').then(x=>send(x.eklentiTemasi || 'indigo'));
 chrome.storage.onChanged.addListener((changes,area)=>{if(area==='sync'&&changes.eklentiTemasi)send(changes.eklentiTemasi.newValue);});
})();