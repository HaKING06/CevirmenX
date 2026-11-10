from pathlib import Path
import json
from PIL import Image,ImageDraw,ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
r=Path(".")
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
  for line in lines:draw.text((w*.065,y),get_display(arabic_reshaper.reshape(line)) if lang=='ar' else line,font=f,fill='#f4f2ff');y+=f.size*1.35
  draw.text((w*.065,h*.80),'Alt + T   ·   cevir.haking.tr',font=small,fill='#c6c1eb')
  im.save(folder/(name+'.png'))
