from pathlib import Path
import json,urllib.request,urllib.parse,concurrent.futures,time
root=Path('.')
def translate(text,lang):
 url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl='+lang+'&dt=t&q='+urllib.parse.quote(text)
 for attempt in range(3):
  try:
   with urllib.request.urlopen(url,timeout=25) as response:d=json.load(response)
   return ''.join(x[0] or '' for x in d[0])
  except Exception:
   if attempt==2:raise
   time.sleep(1)
def work(name,lang):
 p=root/'scripts'/f'{name}-strings.json';d=json.loads(p.read_text(encoding='utf-8'));en=d['en'];out={}
 for key,value in en.items():out[key]=translate(value,lang)
 return name,lang,out
jobs=[(name,lang) for name in ['options','popup'] for lang in ['de','es','fr','pt','ar']]
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
 for name,lang,out in pool.map(lambda args:work(*args),jobs):
  p=root/'scripts'/f'{name}-{lang}.json';p.write_text(json.dumps(out,ensure_ascii=False),encoding='utf-8');print(name,lang,flush=True)

