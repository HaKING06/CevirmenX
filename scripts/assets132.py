from pathlib import Path
import json,shutil,html
from PIL import Image,ImageDraw,ImageFont
r=Path('.')
for name,key in [('options','UI_STRINGS'),('popup','POPUP_STRINGS')]:
 p=r/'src/extension'/f'{name}.js';s=p.read_text(encoding='utf-8');inserts=''
 for lang in ['de','es','fr','pt','ar']:inserts+=key+'['+json.dumps(lang)+']='+ (r/'scripts'/f'{name}-{lang}.json').read_text(encoding='utf-8')+';\n'
 s=s.replace("let activeLang = 'tr';",inserts+"let activeLang = 'en';");s=s.replace("result.arayuzDili || 'tr'","result.arayuzDili || (['tr','en','de','es','fr','pt','ar'].includes(navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : 'en')")
 if name=='options':
  s=s.replace('function applyUiLanguage(lang) {',"function applyUiLanguage(lang) {\n document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';")
 p.write_text(s,encoding='utf-8')
p=r/'src/extension/options.html';s=p.read_text(encoding='utf-8').replace('<button class="lang-change-btn" data-lang="en">EN</button>',''.join(f'<button class="lang-change-btn" data-lang="{x}">{x.upper()}</button>' for x in ['en','de','es','fr','pt','ar']));s=s.replace('.lang-switcher {','.lang-switcher { flex-wrap:wrap;');p.write_text(s,encoding='utf-8')
d=json.loads((r/'src/website/locales.json').read_text(encoding='utf-8'))
assets=r/'store-assets/1.3.2';assets.mkdir(parents=True,exist_ok=True)
font='C:/Windows/Fonts/arial.ttf';bold='C:/Windows/Fonts/arialbd.ttf'
for lang,rows in d.items():
 folder=assets/lang;folder.mkdir(exist_ok=True)
 description='ÇevirmenX 1.3.2\n\n'+rows[2]+'\n\n'+'\n'.join('• '+rows[i]+': '+rows[i+3] for i in [13,14,15])+'\n\n'+rows[19]+'\n\n'+rows[22]+'\n\nhttps://cevir.haking.tr/\nhttps://buymeacoffee.com/haking\n'
 (folder/'store-description.txt').write_text(description,encoding='utf-8')
 for name,w,h in [('promo-440x280',440,280),('marquee-1400x560',1400,560),('screenshot-1280x800',1280,800)]:
  im=Image.new('RGB',(w,h),'#0c0c19');draw=ImageDraw.Draw(im);scale=w/1400
  draw.ellipse((w*.70,-h*.3,w*1.2,h*.95),fill='#28244f')
  f=ImageFont.truetype(bold,max(18,int(w*.042)));small=ImageFont.truetype(font,max(12,int(w*.018)))
  draw.text((w*.065,h*.12),'ÇevirmenX  /  1.3.2',font=small,fill='#bdb8ff')
  words=rows[0].split();lines=[];line=''
  for word in words:
   nxt=(line+' '+word).strip()
   if draw.textlength(nxt,font=f)>w*.80:lines.append(line);line=word
   else:line=nxt
  lines.append(line)
  y=h*.30
  for line in lines:draw.text((w*.065,y),line,font=f,fill='#f4f2ff',direction='rtl' if lang=='ar' else 'ltr');y+=f.size*1.35
  draw.text((w*.065,h*.80),'Alt + T   ·   cevir.haking.tr',font=small,fill='#c6c1eb')
  im.save(folder/(name+'.png'))
