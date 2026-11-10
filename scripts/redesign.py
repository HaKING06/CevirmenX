from pathlib import Path
import re,json
r=Path('src/website')
labels={
'en':['A SMALL EXTENSION. A BIGGER WORLD.','See it in action','Translation preview','Your browser. Your language.','A familiar workflow, wherever you browse.','Read without interruption','One shortcut away','Everything stays within reach','Try the preview','Selected text','Translation ready','Built for your everyday tabs.'],
'tr':['KÜÇÜK BİR EKLENTİ. DAHA BÜYÜK BİR DÜNYA.','Nasıl çalıştığını gör','Çeviri önizlemesi','Senin tarayıcın. Senin dilin.','Hangi tarayıcıyı kullanırsan kullan, aynı kolaylık.','Okuma akışın bölünmesin','Bir kısayol uzağında','Her şey elinin altında','Önizlemeyi dene','Seçili metin','Çeviri hazır','Her gün açtığın sekmeler için.'],
'de':['KLEINE ERWEITERUNG. GRÖSSERE WELT.','So funktioniert es','Übersetzungsvorschau','Dein Browser. Deine Sprache.','Ein vertrauter Ablauf in jedem Browser.','Ohne Unterbrechung lesen','Nur ein Tastenkürzel entfernt','Alles in Reichweite','Vorschau starten','Ausgewählter Text','Übersetzung bereit','Für deine täglichen Tabs.'],
'es':['UNA PEQUEÑA EXTENSIÓN. UN MUNDO MAYOR.','Mira cómo funciona','Vista previa de traducción','Tu navegador. Tu idioma.','Un flujo familiar en cualquier navegador.','Lee sin interrupciones','A un atajo de distancia','Todo a tu alcance','Probar vista previa','Texto seleccionado','Traducción lista','Para tus pestañas de cada día.'],
'fr':['UNE PETITE EXTENSION. UN MONDE PLUS GRAND.','Voir comment ça marche','Aperçu de traduction','Votre navigateur. Votre langue.','Une expérience familière dans chaque navigateur.','Lisez sans interruption','À un raccourci près','Tout à portée de main','Essayer l’aperçu','Texte sélectionné','Traduction prête','Pour vos onglets du quotidien.'],
'pt':['UMA PEQUENA EXTENSÃO. UM MUNDO MAIOR.','Veja como funciona','Prévia de tradução','Seu navegador. Seu idioma.','Uma experiência familiar em qualquer navegador.','Leia sem interrupções','A um atalho de distância','Tudo ao seu alcance','Experimentar prévia','Texto selecionado','Tradução pronta','Para suas abas do dia a dia.'],
'ar':['إضافة صغيرة. عالم أكبر.','شاهد كيف تعمل','معاينة الترجمة','متصفحك. لغتك.','تجربة مألوفة أينما تتصفح.','اقرأ دون انقطاع','على بُعد اختصار واحد','كل شيء في متناول يدك','جرّب المعاينة','النص المحدد','الترجمة جاهزة','لعلامات تبويبك اليومية.']}
p=r/'site.js';s=p.read_text(encoding='utf-8');end=s.index(';\n');d=json.loads(s[len('const data='):end]);
for lang in d:d[lang]=d[lang][:33]+labels[lang]
s='const data='+json.dumps(d,ensure_ascii=False)+s[end:];p.write_text(s,encoding='utf-8')
for p in r.glob('*.html'):
 s=p.read_text(encoding='utf-8')
 s=s.replace('<body>','<body><div class="reading-progress" aria-hidden="true"></div><div class="ambient" aria-hidden="true"></div>')
 s=s.replace('<section class="hero"><div>','<section class="hero"><div class="hero-copy"><span class="eyebrow" data-t="33"></span>')
 s=s.replace('<small data-t="19"></small></div>','<small class="trust-note" data-t="19"></small><a class="text-link" href="#product-preview" data-t="34"></a></div>')
 s=s.replace('<div class="preview">','<div class="preview" id="product-preview"><div class="preview-orbit" aria-hidden="true"></div>')
 s=s.replace('<div class="window">● ● ● <span>ÇevirmenX</span></div>','<div class="window"><div class="traffic"><i></i><i></i><i></i></div><span class="address">cevirmenx / preview</span><span class="window-badge" data-t="35"></span></div>')
 s=s.replace('<div class="document">','<div class="product-layout"><aside class="product-rail" aria-hidden="true"><b>✦</b><span>▤</span><span>◷</span><span>⚙</span></aside><div class="document">')
 s=s.replace('<p><mark>','<div class="sample-lines" aria-hidden="true"><i></i><i></i></div><p class="selection-line"><mark>')
 s=s.replace('<span>◉ &nbsp; ⧉ &nbsp; ☆</span>','<div class="preview-tools"><span>◉</span><span>⧉</span><span>☆</span><span class="preview-status" data-t="43"></span></div>')
 s=s.replace('</div></div></div></section><section class="browser-section">','</div></div></div><div class="preview-bottom"><span data-t="35"></span><button id="preview-replay" type="button" data-t="41"></button></div></div></section><section class="browser-section">',1)
 # Browser choices follow the feature story rather than interrupting the opening.
 m=re.search(r'<section class="browser-section">.*?</section>',s)
 if m:
  browser=m.group();s=s[:m.start()]+s[m.end():];browser=browser.replace('<h2 data-t="30"></h2>','<div class="section-intro"><span class="eyebrow" data-t="30"></span><h2 data-t="36"></h2><p data-t="37"></p></div>');s=s.replace('<section class="note"',browser+'<section class="note"')
 s=s.replace('<section id="features"><small>ÇEVİRMENX / WORKSPACE</small>','<section id="features"><div class="section-intro"><span class="eyebrow" data-t="40"></span>')
 s=s.replace('<h2 data-t="1"></h2><div class="cards">','<h2 data-t="1"></h2></div><div class="cards">')
 s=s.replace('<article><span>↗</span><h3 data-t="13">','<article class="feature-dictionary"><div class="feature-visual dictionary-visual" aria-hidden="true"><div>hello <span>→</span> merhaba</div><div>workflow <span>→</span> iş akışı</div><div class="add-term">＋</div></div><h3 data-t="13">')
 s=s.replace('<article><span>↗</span><h3 data-t="14">','<article class="feature-history"><div class="feature-visual history-visual" aria-hidden="true"><div><i></i><span>EN → TR</span><b>☆</b></div><div><i></i><span>DE → EN</span><b>★</b></div><div><i></i><span>FR → EN</span><b>☆</b></div></div><h3 data-t="14">')
 s=s.replace('<article><span>↗</span><h3 data-t="15">','<article class="feature-memory"><div class="feature-visual memory-visual" aria-hidden="true"><span>↻</span><div>local memory</div><i></i></div><h3 data-t="15">')
 s=s.replace('<script src="site.js"></script>','<script src="site.js"></script><script src="motion.js"></script>')
 p.write_text(s,encoding='utf-8')
