"""Render the ÇevirmenX mark, browser icons and localized release artwork."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / 'src/website'
EXT = ROOT / 'src/extension'
languages = {'en':'English','tr':'Türkçe','de':'Deutsch','es':'Español','fr':'Français','pt':'Português','ar':'العربية','ru':'Русский'}
titles = dict(zip(languages, ['Translate in context.', 'Metni yerinde çevir.', 'Direkt im Kontext übersetzen.', 'Traduce en contexto.', 'Traduisez en contexte.', 'Traduza no contexto.', 'ترجم النص في سياقه.', 'Переводите в контексте.']))
subtitles = dict(zip(languages, ['Select text and press Alt + T','Metni seç ve Alt + T tuşlarına bas','Text auswählen und Alt + T drücken','Selecciona texto y pulsa Alt + T','Sélectionnez le texte et appuyez sur Alt + T','Selecione o texto e pressione Alt + T','حدد النص واضغط على Alt + T','Выделите текст и нажмите Alt + T']))
def font(size, bold=False):
    return ImageFont.truetype('arialbd.ttf' if bold else 'arial.ttf', size)
def display(value, lang):
    return get_display(arabic_reshaper.reshape(value)) if lang == 'ar' else value

mark=Image.new('RGBA',(256,256))
pen=ImageDraw.Draw(mark)
pen.rounded_rectangle((4,4,252,252),60,fill='#302680')
pen.polygon([(38,64),(127,64),(179,125),(145,125),(183,171),(130,171)],fill='#b8aaff')
pen.polygon([(217,78),(172,78),(128,130),(159,130),(83,205),(131,205)],fill='#77ebe4')
for size in [16,32,48,128]:
    mark.resize((size,size),Image.Resampling.LANCZOS).save(EXT/f'icon-{size}.png')
mark.resize((128,128),Image.Resampling.LANCZOS).save(EXT/'icon.png')
mark.save(WEB/'icon.png')
mark.save(WEB/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
for lang in languages:
    art=Image.new('RGB',(1200,630),'#16122b')
    draw=ImageDraw.Draw(art)
    for i in range(11):
        x=735+i*25
        draw.arc((x,-135,x+460,615),75,285,fill=(75+i*4,65+i*4,131+i*5),width=3)
    art.paste(mark.resize((62,62)),(60,52),mark.resize((62,62)))
    draw.text((140,62),'ÇevirmenX',font=font(33,True),fill='white')
    title=display(titles[lang],lang)
    size=79
    while draw.textlength(title,font=font(size,True))>1070:size-=2
    draw.text((60,235),title,font=font(size,True),fill='#f7f6ff')
    draw.text((64,357),display(subtitles[lang],lang),font=font(30),fill='#c2b8ea')
    draw.line((65,505,1135,505),fill='#565173',width=2)
    draw.text((65,546),'cevir.haking.tr',font=font(25),fill='#86e6df')
    draw.text((965,546),'v 1.4.0',font=font(25),fill='#cec6ee')
    art.save(WEB/'images'/f'poster-{lang}.png',optimize=True)
