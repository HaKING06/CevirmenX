from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
r=Path('src/website/images');r.mkdir(exist_ok=True)
def font(size,bold=False):return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',size)
for filename,w,h,title,subtitle in [('cevirmenx-browser-translation-banner',1200,630,'Read beyond language.','Selected text. Personal dictionary. Your flow.'),('cevirmenx-ceviri-eklentisi',1200,630,'Dil engelini geride bırak.','Seçili metin çevirisi. Kişisel sözlük. Tek kısayol.'),('cevirmenx-social-square',1080,1080,'Select. Translate.','Keep your flow.')]:
 im=Image.new('RGB',(w,h));px=im.load()
 for y in range(h):
  for x in range(w):
   glow=max(0,1-(((x-w*.80)/(w*.7))**2+((y-h*.35)/(h*.9))**2))
   px[x,y]=(int(10+glow*18),int(10+glow*15),int(20+glow*43))
 d=ImageDraw.Draw(im);pad=65
 d.rounded_rectangle((pad,50,pad+42,92),12,fill='#7570ff');d.text((pad+11,51),'✦',font=font(28),fill='white');d.text((pad+57,54),'ÇevirmenX',font=font(26,True),fill='#f7f4ff')
 size=57 if w==1200 else 65
 while d.textlength(title,font=font(size,True))>w-2*pad:size-=1
 d.text((pad,145),title,font=font(size,True),fill='#f5f3ff');d.text((pad,222),subtitle,font=font(23),fill='#b7b1d3')
 top=310 if h==630 else 370;bottom=h-95
 d.rounded_rectangle((pad,top,w-pad,bottom),18,fill='#151523',outline='#353147',width=2)
 d.text((pad+26,top+20),'EN → TR',font=font(16),fill='#aaa0ff');d.text((pad+26,top+60),'Every word opens a new perspective.',font=font(23),fill='#f4f1ff');d.text((pad+26,top+105),'Her kelime yeni bir bakış açısı açar.',font=font(22),fill='#c0b9df')
 d.text((pad,h-52),'cevir.haking.tr',font=font(20,True),fill='#aaa0ff');d.text((w-240,h-52),'HaKING / FREE',font=font(15),fill='#aaa6bf');im.save(r/(filename+'.png'),optimize=True)
