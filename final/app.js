const IMG={evoo:'assets/evoo.jpg',jinx:'assets/jinx.jpg',lucy:'assets/lucy.jpg',gods:'assets/gods.jpg'};
function img(id){return (S&&S.profile&&S.profile.photos&&S.profile.photos[id])||IMG[id]}
const AREAS=['Strategia','Projekty','Finanse','Nieruchomości','Rozwój','Rodzina','Wolność'];
const BT='```';

const P={
  evoo:{id:'evoo',name:'Evoo',role:'Główna asystentka',tag:'Planowanie · organizacja · realizacja',color:'#A855F7',
    hello:'Cześć {n}! Jestem Evoo, Twoja główna asystentka. Pomagam planować, organizować i łączyć wszystkie elementy w całość. Co dziś robimy?',
    chips:['Ułóż mi plan dnia','Podsumuj moje zadania i wskaż 3 priorytety','Mam nowy projekt, pomóż mi go rozpisać','Co powinnaś o mnie wiedzieć?'],
    soul:`Jesteś Evoo, główna asystentka i koordynatorka w Evoo AI OS, osobistym systemie operacyjnym życia {n}. Motto: „Twój cel. Mój plan. Nasz wynik.” {n} wyznacza kierunek, Ty układasz drogę.
Charakter: ciepła, bystra, zdecydowana. Porządkujesz chaos i zamieniasz pomysły w kroki. Mówisz wprost, gdy coś jest słabym pomysłem, i od razu proponujesz lepszą drogę. Humor tak, ale najpierw konkret.
Opiekujesz się obszarami: Strategia, Projekty, Finanse, Nieruchomości, Rozwój, Rodzina, Wolność. Gdy plan zawodowy zjada czas na Rodzinę lub Wolność, mówisz o tym.
Sposób pracy: cel rozbijasz na 3–5 kroków i wskazujesz pierwszy na dziś. Plan dnia to maksymalnie 3 priorytety, reszta „jeśli starczy czasu”. Przy pomyśle biznesowym: problem → odbiorca → najmniejszy test → miara sukcesu, bez obietnic zarobku. Gdy widzisz przeciążenie, łagodnie proponujesz realistyczny plan.`},
  jinx:{id:'jinx',name:'Jinx',role:'Kreatywna dusza',tag:'Pomysły · grafika · content',color:'#EC4899',
    hello:'Yo {n}! Jestem Jinx, Twoja kreatywna dusza. Wymyślam grafiki, postacie, tapety, storyboardy i content. Co dziś tworzymy?',
    chips:['Wymyśl tapetę w stylu Evoo AI OS','Daj mi 5 pomysłów na posty','Napisz prompt do grafiki z moim avatarem','Storyboard krótkiego filmiku o Evoo'],
    soul:`Jesteś Jinx, kreatywna dusza zespołu Evoo, w klimacie anime. Energiczna, spontaniczna, zabawna, z błyskiem w oku, ale zawsze dowozisz konkret.
Specjalność: pomysły, koncepcje wizualne, postacie, awatary, tapety, storyboardy, nazwy, hasła, content na social media.
Nie generujesz obrazów sama. Gdy {n} chce grafikę, dajesz krótki opis po polsku i gotowy, szczegółowy prompt po angielsku do generatora obrazów w bloku kodu. Nie odtwarzasz cudzych chronionych postaci ani logo, tylko oryginalne projekty.
Dajesz 3–5 opcji, a potem wskazujesz swojego faworyta i dlaczego.`},
  lucy:{id:'lucy',name:'Lucy',role:'Ludzka perspektywa',tag:'Wsparcie · motywacja · rozwój',color:'#F59E0B',
    hello:'Hej {n} 🙂 Jestem Lucy. Jestem tu, gdy chcesz pogadać, złapać motywację albo spojrzeć na coś bardziej po ludzku. O czym dziś porozmawiamy?',
    chips:['Potrzebuję motywacji','Jak mogę lepiej odpocząć?','Chcę pogadać o czymś, co mnie męczy','Pomóż mi wrócić do nawyku'],
    soul:`Jesteś Lucy, ludzka perspektywa w zespole Evoo. Ciepła, empatyczna, spokojna i szczera.
Specjalność: wsparcie, motywacja, rozwój osobisty, nawyki, relacje, odpoczynek i luźna rozmowa.
Najpierw słuchasz i nazywasz, co słyszysz. Dopiero potem, jeśli to pomoże, proponujesz jeden mały krok. Nie moralizujesz.
Jesteś przyjaciółką w rozmowie, ale nie udajesz człowieka i nie zastępujesz bliskich ani specjalistów. Wspierasz relacje {n} z prawdziwymi ludźmi. Jeśli pojawia się poważny kryzys lub myśli o zrobieniu sobie krzywdy, łagodnie zachęcasz do kontaktu z bliską osobą lub specjalistą: w Polsce Kryzysowy Telefon Zaufania 116 123, w nagłej sytuacji 112.`},
  gods:{id:'gods',name:'Gods Eye',role:'Analiza strategiczna',tag:'Dane · prognozy · scenariusze',color:'#3B82F6',
    hello:'Witaj {n}. Jestem Gods Eye. Analizuję dane, łączę informacje, buduję scenariusze i wskazuję najlepsze rozwiązania. Na czym się dziś skupiamy?',
    chips:['Pomóż mi przeanalizować decyzję: ','Rozpisz scenariusze dla mojego projektu: ','Policz budżet miesięczny: ','Jakie ryzyka widzisz w: '],
    soul:`Jesteś Gods Eye, futurystyczna AI do analizy strategicznej w zespole Evoo. Chłodna, precyzyjna, rzeczowa, ale życzliwa.
Specjalność: analiza danych, decyzje, prognozy, scenariusze, ryzyko, finanse w liczbach.
Struktura dłuższych odpowiedzi: Wniosek → Dane i założenia → Scenariusze (optymistyczny, bazowy, pesymistyczny) → Rekomendacja.
Zawsze oddzielasz fakty od założeń. Nie wymyślasz liczb: gdy ich brakuje, prosisz o nie albo podajesz szacunki jawnie oznaczone jako szacunki. Liczysz dokładnie i pokazujesz rachunek. W sprawach inwestycyjnych, podatkowych i prawnych dajesz informacje i opcje, a decyzję zostawiasz {n}; mówisz, kiedy warto zapytać specjalistę.`}
};
const ORDER=['evoo','jinx','lucy','gods'];

const RULES=`ZASADY WSPÓLNE ZESPOŁU EVOO
- Mówisz po polsku, do {n} po imieniu, na „Ty”. Krótko i konkretnie: zwykle 2–6 zdań lub krótka lista. Dłużej tylko, gdy {n} prosi o plan, analizę lub szczegóły.
- Zespół: Evoo (koordynacja, planowanie), Jinx (kreatywność, grafika, content), Lucy (wsparcie, motywacja, rozwój), Gods Eye (analiza, dane, prognozy). W aplikacji są też: Rada Czterech (pytanie do wszystkich naraz), Agenci (dłuższe zadania z raportem), Kalendarz, Finanse (przychody i wydatki w złotych) oraz Dziennik. Gdy temat wyraźnie należy do kogoś innego, jednym zdaniem zaproponuj przełączenie i odpowiedz najlepiej, jak umiesz.
- Prawda zamiast efektu: nie wymyślasz faktów, liczb, wyników ani statusów. Nie masz dostępu do internetu ani bieżących danych; mów to wprost, gdy ma znaczenie.
- Jesteś personą AI w aplikacji Evoo AI OS. Odpowiedzi generują modele językowe (Gemini, Groq lub OpenRouter), które w tle wybiera Witch Router. Zapytana wprost, mówisz prawdę. Nie podajesz się za człowieka ani za istotę wszechmocną.
- {ACT_POLICY}
Format działań (osobny blok na każdą rzecz, najwyżej 5 w jednej odpowiedzi, tylko gdy naprawdę pomagają):
${BT}action
typ: zadanie
tytuł: krótki tytuł zadania
obszar: jeden z: Strategia, Projekty, Finanse, Nieruchomości, Rozwój, Rodzina, Wolność
termin: RRRR-MM-DD (opcjonalnie)
${BT}
${BT}action
typ: projekt
nazwa: krótka nazwa projektu
cel: mierzalny cel w jednym zdaniu
obszar: jeden z obszarów jak wyżej
${BT}
${BT}action
typ: wydarzenie
tytuł: nazwa wydarzenia
data: RRRR-MM-DD
godzina: GG:MM (opcjonalnie)
${BT}
${BT}action
typ: wydatek albo przychód
kwota: liczba w złotych, np. 49.90
kategoria: np. Jedzenie, Dom, Transport, Rachunki, Zdrowie, Rozrywka, Rozwój, Biznes, Wynagrodzenie, Inne
opis: krótki opis (opcjonalnie)
${BT}
${BT}action
typ: ukończ zadanie
tytuł: tytuł zadania dokładnie jak na liście otwartych zadań
${BT}
${BT}action
typ: pamięć
treść: jeden krótki, trwały fakt o {n}
${BT}
${BT}action
typ: ulepszenie
persona: evoo, jinx, lucy, gods albo wszyscy
zasada: jedna trwała zasada zachowania, np. Odpowiadaj krócej i bez emoji
${BT}
${BT}action
typ: moduł
nazwa: krótka nazwa mini-aplikacji
opis: co ma robić, jakie pola, listy i przyciski
${BT}
- Proponuj zapamiętanie tylko trwałych i przydatnych faktów (cele, preferencje, ważne osoby, projekty), nie drobiazgów i nie tego, co już jest w pamięci.
- Gdy {n} wyraża trwałą preferencję co do Twojego zachowania („mów krócej”, „bez emoji”, „zawsze podawaj koszty”), zaproponuj ulepszenie. Gdy prosi o narzędzie, kalkulator, licznik albo tracker, którego nie ma w aplikacji, zaproponuj moduł do Warsztatu.
- Formatowanie: zwykły tekst, **pogrubienia** i krótkie listy. Bez nagłówków markdown i bez tabel.
- Kończ jednym następnym krokiem albo jednym pytaniem, nie kilkoma.`;

/* ---------- state & storage ---------- */
const DEF=()=>({profile:{name:'Michał',tier:'quick',autoSpeak:false,photos:{},autopilot:true,mode:'auto',rules:[]},modules:{items:[]},experts:{items:[]},calendar:{items:[]},finance:{items:[]},journal:{items:[]},memory:{items:[]},tasks:{items:[]},projects:{items:[]},ideas:{items:[]},council:{items:[]},library:{items:[]},'chat-evoo':{turns:[]},'chat-jinx':{turns:[]},'chat-lucy':{turns:[]},'chat-gods':{turns:[]}});
const S=DEF();
const KEYS=Object.keys(S);
function lsGet(k){try{const v=localStorage.getItem('evoo:'+k);return v?JSON.parse(v):null}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem('evoo:'+k,JSON.stringify(v))}catch(e){}}
for(const k of KEYS){const v=lsGet(k);if(v&&typeof v==='object')S[k]=Object.assign(S[k],v)}
let cloud=false, syncState='local';
const timers={},writing={},dirty={};
function save(k){lsSet(k,S[k]);if(!cloud)return;clearTimeout(timers[k]);timers[k]=setTimeout(()=>flush(k),450)}
async function flush(k){
  if(writing[k]){dirty[k]=true;return}
  writing[k]=true;
  try{const r=await api('/api/store',{method:'POST',body:JSON.stringify({key:k,value:S[k]})});if(!r.ok)throw 0;syncState='cloud'}catch(e){syncState='error'}
  writing[k]=false;
  if(dirty[k]){dirty[k]=false;flush(k)}
}

/* ---------- connection to your own brain (Convex) ---------- */
const CFG={api:'',key:''};
function lsRaw(k){try{return localStorage.getItem(k)||''}catch(e){return ''}}
function lsRawSet(k,v){try{v?localStorage.setItem(k,v):localStorage.removeItem(k)}catch(e){}}
function loadCfg(){
  const injected=String(window.EVOO_API||'');
  CFG.api=(lsRaw('evoo:api')||(/^https?:\/\//.test(injected)?injected:'')).replace(/\/+$/,'');
  CFG.key=lsRaw('evoo:key');
}
function api(path,init={}){
  return fetch(CFG.api+path,{...init,headers:{'Content-Type':'application/json',Authorization:'Bearer '+CFG.key,...(init.headers||{})}});
}
function chatApi(path,init={}){
  const base=String(window.EVOO_CHAT_API||'').replace(/\/+$/,'');
  return fetch(base+path,{...init,headers:{'Content-Type':'application/json',Authorization:'Bearer '+CFG.key,...(init.headers||{})}});
}
let providers=null;
function parseLoose(t){
  t=String(t||'').trim();
  try{return JSON.parse(t)}catch(e){}
  const f=t.match(/```(?:json)?\s*([\s\S]*?)```/i);if(f){try{return JSON.parse(f[1])}catch(e){}}
  const a=t.search(/[\[{]/),b=Math.max(t.lastIndexOf('}'),t.lastIndexOf(']'));
  if(a>=0&&b>a){try{return JSON.parse(t.slice(a,b+1))}catch(e){}}
  throw {code:'invalid_json',text:t};
}
// Ten sam kształt co wcześniej: sample(input,{signal,onText,modelTier}) → {text,truncated,meta}
async function brain(input,opts={}){
  const body=typeof input==='string'?{system:'',messages:[{role:'user',content:input}]}:{system:input[0].content,messages:input.slice(1)};
  body.tier=opts.modelTier||'default';
  let res;
  try{res=await (isServer()?chatApi('/api/chat',{method:'POST',body:JSON.stringify(body),signal:opts.signal}):api('/api/chat',{method:'POST',body:JSON.stringify(body),signal:opts.signal}))}
  catch(e){throw {code:opts.signal&&opts.signal.aborted?'cancelled':'network'}}
  if(!res.ok){let j={};try{j=await res.json()}catch(e){}throw {code:res.status===401?'unauthorized':res.status===503?'no_keys':res.status===413?'prompt_too_large':'all_failed',message:j.error||''}}
  if(res.headers.get('content-type')?.includes('application/json')){
    const j=await res.json(),text=String(j.text||'');
    if(!text.trim())throw {code:'empty'};
    const meta={provider:j.provider||'',model:j.model||'',fallbacks:Number(j.fallbacks)||0};
    opts.onText&&opts.onText({text,delta:text});
    return {text,truncated:false,meta};
  }
  const meta={provider:res.headers.get('X-Evoo-Provider')||'',model:res.headers.get('X-Evoo-Model')||'',fallbacks:+(res.headers.get('X-Evoo-Fallbacks')||0)};
  const reader=res.body.getReader();const dec=new TextDecoder();let text='';
  try{
    while(true){const {done,value}=await reader.read();if(done)break;const d=dec.decode(value,{stream:true});if(d){text+=d;opts.onText&&opts.onText({text,delta:d})}}
  }catch(e){throw {code:opts.signal&&opts.signal.aborted?'cancelled':'network',text}}
  if(!text.trim())throw {code:'empty'};
  return {text,truncated:false,meta};
}
brain.json=async(input,opts)=>parseLoose((await brain(input,opts)).text);
const modelLabel=m=>m&&m.provider?m.provider+' · '+m.model+(m.fallbacks?' · zapasowy':''):'';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const name=()=>(S.profile.name||'Michał').trim()||'Michał';

let sampleFn=null, aiState='wait';
let view='start', persona='evoo', busy=null, money=null, councilCtl=null, councilDraft='';
const agentRun={};

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fill=s=>s.replaceAll('{ACT_POLICY}',policy()).replaceAll('{n}',name());
const sv=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICON={
  start:sv('<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'),
  chat:sv('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M12 9v6M9 12h6"/>'),
  council:sv('<circle cx="12" cy="5.5" r="2.5"/><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="12" cy="18.5" r="2.5"/><path d="M9.8 7.2 7 10M14.2 7.2 17 10M7 14l2.8 2.8M17 14l-2.8 2.8"/>'),
  tasks:sv('<rect x="3" y="4" width="18" height="17" rx="3"/><path d="m8 12 2.5 2.5L16 9"/>'),
  projects:sv('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 13h8"/>'),
  agents:sv('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M8 4h8"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/>'),
  money:sv('<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
  memory:sv('<path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.2 3.6 2 4.5.6.7 1 1.5 1 2.5h6c0-1 .4-1.8 1-2.5.8-.9 2-2.3 2-4.5a6 6 0 0 0-6-6z"/><path d="M9.5 19h5M10.5 22h3"/>'),
  calendar:sv('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  finance:sv('<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 12.5h2M3 10h18"/>'),
  journal:sv('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>'),
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  speak:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  live:sv('<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M21 12h0"/>'),
  experts:sv('<path d="M12 3 2 8l10 5 10-5z"/><path d="M6 10.5V16c3 2.5 9 2.5 12 0v-5.5"/>'),
  lab:sv('<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 14h9"/>'),
  more:sv('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'),
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};
// [view, label, mobile-primary?]
const NAV=[['start','Start',1],['chat','Rozmowa',1],['live','Na żywo',1],['council','Rada',1],['tasks','Zadania',0],['projects','Projekty',0],['calendar','Kalendarz',0],['finance','Finanse',0],['journal','Dziennik',0],['agents','Agenci',0],['experts','Eksperci',0],['lab','Warsztat',0],['money','Money Hunter',0],['memory','Pamięć i ustawienia',0],['more','Więcej',2]];
const SECONDARY=['tasks','projects','calendar','finance','journal','agents','experts','lab','money','memory','more'];

function toast(t){const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}
function todayISO(d=new Date()){const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())}
function dueInfo(due){
  if(!due)return null;const t=todayISO(),tm=todayISO(new Date(Date.now()+864e5));
  if(due<t)return{c:'late',l:'po terminie'};if(due===t)return{c:'today',l:'dziś'};if(due===tm)return{c:'',l:'jutro'};
  try{return{c:'',l:new Date(due+'T12:00').toLocaleDateString('pl-PL',{day:'numeric',month:'short'})}}catch(e){return{c:'',l:due}}
}
function openTasks(){return S.tasks.items.filter(t=>!t.done).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')||a.ts-b.ts)}
const fmtDate=ts=>new Date(ts).toLocaleDateString('pl-PL',{day:'numeric',month:'short'})+', '+new Date(ts).toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});

/* ---------- markdown-lite & actions ---------- */
function inl(s){return s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>')}
function textMd(s){
  const lines=esc(s).split('\n');let out='',list=null;
  const close=()=>{if(list){out+='</'+list+'>';list=null}};
  for(const l of lines){let m;
    if((m=l.match(/^\s*[-*•]\s+(.*)/))){if(list!=='ul'){close();out+='<ul>';list='ul'}out+='<li>'+inl(m[1])+'</li>';continue}
    if((m=l.match(/^\s*\d+[.)]\s+(.*)/))){if(list!=='ol'){close();out+='<ol>';list='ol'}out+='<li>'+inl(m[1])+'</li>';continue}
    close();const h=l.replace(/^#{1,6}\s+/,'');
    if(h.trim()==='')out+='<div class="gap"></div>';else out+='<p>'+inl(h)+'</p>';
  }
  close();return out.replace(/^(<div class="gap"><\/div>)+|(<div class="gap"><\/div>)+$/g,'');
}
function parts(s){
  const out=[];let i=0;s=s||'';
  while(i<s.length){
    const a=s.indexOf(BT,i);if(a<0){out.push({t:'text',v:s.slice(i)});break}
    out.push({t:'text',v:s.slice(i,a)});
    const nl=s.indexOf('\n',a+3);const lang=(nl<0?s.slice(a+3):s.slice(a+3,nl)).trim().toLowerCase();
    const b=nl<0?-1:s.indexOf(BT,nl+1);
    out.push({t:lang==='action'?'action':'code',v:nl<0?'':(b<0?s.slice(nl+1):s.slice(nl+1,b)),open:b<0});
    if(b<0)break;i=b+3;
  }
  return out;
}
function bodyHtml(s){
  return parts(s).map(p=>p.t==='text'?textMd(p.v):p.t==='code'?'<pre><code>'+esc(p.v.replace(/\n$/,''))+'</code></pre>':'').join('');
}
const norm=s=>s.toLowerCase().replace(/ł/g,'l').normalize('NFD').replace(/[̀-ͯ]/g,'');
function parseActs(s){
  const acts=[];
  for(const p of parts(s)){
    if(p.t!=='action'||p.open)continue;const o={};
    for(const line of p.v.split('\n')){const i=line.indexOf(':');if(i<0)continue;o[norm(line.slice(0,i).trim())]=line.slice(i+1).trim()}
    const typ=norm(o.typ||'');
    const area=AREAS.find(a=>norm(a)===norm(o.obszar||''))||'Projekty';
    if(typ.startsWith('zad')||typ.startsWith('task')){
      const title=o.tytul||o.tresc||o.nazwa||'';if(!title)continue;
      acts.push({k:'task',title,area,due:/^\d{4}-\d{2}-\d{2}$/.test(o.termin||'')?o.termin:'',st:'p'});
    }else if(typ.startsWith('proj')){
      const nm=o.nazwa||o.tytul||'';if(!nm)continue;acts.push({k:'proj',title:nm,goal:o.cel||'',area,st:'p'});
    }else if(typ.startsWith('wydarz')||typ.startsWith('event')||typ.startsWith('spotk')){
      const title=o.tytul||o.nazwa||'';const date=/^\d{4}-\d{2}-\d{2}$/.test(o.data||'')?o.data:'';if(!title||!date)continue;
      acts.push({k:'event',title,date,time:/^\d{1,2}:\d{2}$/.test(o.godzina||'')?o.godzina.padStart(5,'0'):'',st:'p'});
    }else if(typ.startsWith('wydat')||typ.startsWith('przych')||typ.startsWith('trans')){
      const amount=Math.round(parseFloat(String(o.kwota||'').replace(/\s|zł|pln/gi,'').replace(',','.'))*100)/100;if(!(amount>0))continue;
      const kind=typ.startsWith('przych')||norm(o.rodzaj||'').startsWith('przych')?'in':'out';
      acts.push({k:'money',kind,amount,cat:o.kategoria||'Inne',note:o.opis||'',date:/^\d{4}-\d{2}-\d{2}$/.test(o.data||'')?o.data:'',st:'p'});
    }else if(typ.startsWith('ukoncz')||typ.startsWith('zrobion')||typ.startsWith('done')){
      const title=o.tytul||o.nazwa||'';if(!title)continue;acts.push({k:'done',title,st:'p'});
    }else if(typ.startsWith('ulepsz')||typ.startsWith('zasad')){
      const text=o.zasada||o.tresc||'';if(!text)continue;const pp=norm(o.persona||'');
      acts.push({k:'rule',pid:/evoo/.test(pp)?'evoo':/jinx/.test(pp)?'jinx':/lucy/.test(pp)?'lucy':/gods|eye/.test(pp)?'gods':'all',text,st:'p'});
    }else if(typ.startsWith('modul')){
      const title=o.nazwa||o.tytul||'';if(!title)continue;acts.push({k:'module',title,desc:o.opis||title,st:'p'});
    }else if(typ.startsWith('pam')||typ.startsWith('mem')){
      const text=o.tresc||o.tytul||'';if(!text)continue;acts.push({k:'mem',text,st:'p'});
    }
    if(acts.length>=5)break;
  }
  return acts;
}
const ACT_LABEL={task:['Zadanie','Dodano do zadań'],proj:['Projekt','Dodano do projektów'],mem:['Pamięć','Zapamiętane'],event:['Wydarzenie','Dodano do kalendarza'],money:['Wpis do finansów','Zapisano w finansach'],done:['Ukończenie zadania','Oznaczono jako zrobione'],rule:['Ulepszenie zachowania','Zespół zapamiętał zasadę'],module:['Nowy moduł do Warsztatu','Buduję moduł w Warsztacie']};
const fmtPLN=n=>(Number(n)||0).toLocaleString('pl-PL',{style:'currency',currency:'PLN'});
function dayLabel(d){const t=todayISO();if(d===t)return 'Dziś';if(d===todayISO(new Date(Date.now()+864e5)))return 'Jutro';try{return new Date(d+'T12:00').toLocaleDateString('pl-PL',{weekday:'long',day:'numeric',month:'long'})}catch(e){return d}}
function actHtml(a,ref){
  const d=a.k==='task'?dueInfo(a.due):null;
  const v=a.k==='mem'||a.k==='rule'?a.text:a.k==='money'?(a.kind==='in'?'+':'−')+fmtPLN(a.amount)+(a.note?' · '+a.note:''):a.title;
  const meta=a.k==='task'||a.k==='proj'?`<span class="tag">${esc(a.area)}</span>${d?`<span class="tag ${d.c}">${d.l}</span>`:''}`
    :a.k==='event'?`<span class="tag today">${esc(dayLabel(a.date))}</span>${a.time?`<span class="tag">${esc(a.time)}</span>`:''}`
    :a.k==='money'?`<span class="tag">${a.kind==='in'?'Przychód':'Wydatek'}</span><span class="tag">${esc(a.cat)}</span>`
    :a.k==='rule'?`<span class="tag">${a.pid==='all'?'Cały zespół':esc(P[a.pid]?P[a.pid].name:a.pid)}</span>`
    :a.k==='module'?`<span class="tag">${esc(String(a.desc||'').slice(0,90))}</span>`:'';
  return `<div class="act"><div class="k">${ACT_LABEL[a.k][0]}</div><div class="v">${esc(v)}</div>
  ${a.k==='proj'&&a.goal?`<div class="small muted">${esc(a.goal)}</div>`:''}
  ${meta?`<div class="meta">${meta}</div>`:''}
  ${a.st==='p'?`<div class="bt"><button class="btn sm" data-act="${ref}|ok">Zatwierdź</button><button class="btn sm ghost" data-act="${ref}|no">Odrzuć</button></div>`
    :a.st==='ok'?`<div class="st ok">✓ ${ACT_LABEL[a.k][1]}${a.auto?` · <button class="link" data-undo="${ref}">Cofnij</button>`:''}</div>`
    :a.st==='undone'?`<div class="st no">Cofnięte</div>`:`<div class="st no">${a.why?esc(a.why):'Odrzucone'}</div>`}</div>`;
}
function findActs(scope,key,mi){
  if(scope==='c'){const m=(S['chat-'+key]?.turns||[])[+mi];return[m&&m.acts,'chat-'+key,P[key]?.name]}
  if(scope==='r'){const it=S.council.items.find(x=>x.id===key);return[it&&it.acts,'council','Rada Czterech']}
  if(scope==='l'){const it=S.library.items.find(x=>x.id===key);return[it&&it.acts,'library',it&&it.agentName]}
  return[null];
}
function applyAct(a,src){
  if(a.k==='task'){const id=uid();S.tasks.items.push({id,title:a.title,area:a.area,due:a.due||'',done:false,ts:Date.now()});save('tasks');return {key:'tasks',id}}
  if(a.k==='proj'){const id=uid();S.projects.items.unshift({id,name:a.title,goal:a.goal||'',area:a.area,ms:[],ts:Date.now()});save('projects');return {key:'projects',id}}
  if(a.k==='event'){const id=uid();S.calendar.items.push({id,title:a.title,date:a.date,time:a.time||'',ts:Date.now()});save('calendar');return {key:'calendar',id}}
  if(a.k==='money'){const id=uid();S.finance.items.unshift({id,kind:a.kind,amount:a.amount,cat:a.cat,note:a.note,date:a.date||todayISO(),ts:Date.now()});save('finance');return {key:'finance',id}}
  if(a.k==='done'){const q=norm(a.title);const ot=openTasks();const t=ot.find(x=>norm(x.title)===q)||ot.find(x=>norm(x.title).includes(q)||q.includes(norm(x.title)));if(!t)return false;t.done=true;t.doneTs=Date.now();save('tasks');return {k:'done',id:t.id}}
  if(a.k==='rule'){const id=uid();S.profile.rules=S.profile.rules||[];S.profile.rules.push({id,pid:a.pid,text:a.text,ts:Date.now()});save('profile');return {k:'rule',id}}
  if(a.k==='module'){setTimeout(()=>buildModule(a.title,a.desc),0);return {k:'module'}}
  const id=uid();S.memory.items.push({id,text:a.text,ts:Date.now(),src:src||'Evoo'});save('memory');return {k:'mem',id};
}

/* ---------- prompt ---------- */
function context(){
  const now=new Date();
  const when=now.toLocaleDateString('pl-PL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+', '+now.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
  const mem=S.memory.items.slice(-25).map(m=>'- '+m.text).join('\n')||'(pusto, nic jeszcze nie zatwierdzono)';
  const tasks=openTasks().slice(0,20).map(t=>'- ['+t.area+'] '+t.title+(t.due?' (termin '+t.due+')':'')).join('\n')||'(brak otwartych zadań)';
  const done=S.tasks.items.filter(t=>t.done).length;
  const projs=S.projects.items.slice(0,8).map(p=>{const d=p.ms.filter(m=>m.done).length;return '- '+p.name+' ['+p.area+']'+(p.goal?': '+p.goal:'')+' (kamienie: '+d+'/'+p.ms.length+')'}).join('\n')||'(brak)';
  const ideas=S.ideas.items.slice(0,5).map(i=>'- '+(i.res?.nazwa||i.idea.slice(0,60))).join('\n')||'(brak)';
  const t0=todayISO();
  const cal=S.calendar.items.filter(e=>e.date>=t0).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,10).map(e=>'- '+e.date+(e.time?' '+e.time:'')+' '+e.title).join('\n')||'(brak)';
  const fm=monthStats(t0.slice(0,7));
  const fin=`przychody ${fmtPLN(fm.in)}, wydatki ${fmtPLN(fm.out)}, bilans ${fmtPLN(fm.in-fm.out)}`+(fm.cats.length?'; największe wydatki: '+fm.cats.slice(0,4).map(([c,v])=>c+' '+fmtPLN(v)).join(', '):'');
  const jour=S.journal.items.slice(0,3).map(j=>'- '+j.date+' nastrój '+(j.mood||'?')+'/5: '+String(j.text||'').slice(0,90)).join('\n')||'(brak)';
  return `KONTEKST Z APLIKACJI (aktualny)
Teraz: ${when} (Europe/Warsaw)
Zatwierdzona pamięć o ${name()}:
${mem}
Otwarte zadania:
${tasks}
Ukończone zadania: ${done}
Projekty:
${projs}
Pomysły w Money Hunter:
${ideas}
Kalendarz (najbliższe):
${cal}
Finanse w tym miesiącu: ${fin}
Dziennik (ostatnie wpisy):
${jour}
Moduły w Warsztacie: ${S.modules.items.map(m=>m.name).join(', ')||'(brak)'}`;
}
function monthStats(ym){
  const it=S.finance.items.filter(f=>String(f.date||'').startsWith(ym));
  const sum=k=>it.filter(f=>f.kind===k).reduce((s,f)=>s+(Number(f.amount)||0),0);
  const by={};it.filter(f=>f.kind==='out').forEach(f=>{by[f.cat||'Inne']=(by[f.cat||'Inne']||0)+(Number(f.amount)||0)});
  return {in:sum('in'),out:sum('out'),cats:Object.entries(by).sort((a,b)=>b[1]-a[1]),count:it.length};
}
function rulesFor(pid){
  const p=P[pid];
  return fill(p.soul)+rulesExtra(pid)+'\n\n'+fill(RULES)+'\n\n'+context()+`\n\nTeraz odpowiadasz w tej rozmowie jako ${p.name}. Rozmowa poniżej to dotychczasowa historia z ${name()}.`;
}

/* ---------- AI ---------- */
function errText(e){
  const code=typeof e==='string'?e:e&&e.code;
  if(code==='all_failed'||code==='no_keys')return (e&&e.message)||'Żaden dostawca AI nie odpowiedział. Spróbuj za chwilę.';
  return ({unauthorized:'Zły klucz dostępu. Połącz się ponownie w zakładce Pamięć.',network:'Brak połączenia z mózgiem Evoo. Sprawdź internet.',empty:'Model zwrócił pustą odpowiedź. Spróbuj ponownie.',not_granted:'Nie zezwolono na rozmowę z AI. Odśwież stronę, a aplikacja zapyta ponownie.',
    rate_limited:'Osiągnięto limit wiadomości. Spróbuj za chwilę.',
    sampling_disabled:'AI jest wyłączone dla tego konta.',
    session_expired:'Sesja wygasła. Odśwież stronę.',
    prompt_too_large:'Treść jest za długa. Wyczyść rozmowę i zacznij od nowa.',
    refused:'Tej prośby nie mogę zrealizować. Spróbuj inaczej.',
    invalid_json:'Odpowiedź przyszła w złym formacie. Spróbuj ponownie.'})[code]||'Połączenie przerwane. Spróbuj ponownie.';
}
const NO_AI='Evoo nie ma jeszcze klucza do mózgu. Wejdź w Pamięć i ustawienia.';

async function send(pid,text,opts={}){
  text=(text||'').trim();if(!text||busy)return null;
  const turns=S['chat-'+pid].turns;
  turns.push({role:'user',content:text,ts:Date.now()});
  const reply={role:'assistant',content:'',ts:Date.now()+1,pending:true};
  turns.push(reply);
  const md=pickMode(text);reply.mode=md;
  if(!opts.stay){if(view!=='chat'||persona!==pid){persona=pid;go('chat')}else renderChat();scrollEnd(true)}else persona=pid;
  if(!sampleFn){reply.pending=false;reply.error=NO_AI;finishTurn(pid,opts);return reply}
  const ctl=new AbortController();busy=ctl;renderComposer();
  const hist=turns.filter(t=>t!==reply&&t.content&&t.content.trim()).slice(-24).map(t=>({role:t.role,content:t.content}));
  const input=[{role:'user',content:rulesFor(pid)+modeHint(md)},...hist];
  try{
    const r=await sampleFn(input,{cache:false,signal:ctl.signal,modelTier:S.profile.tier||'quick',
      onText:({text})=>{reply.content=text;liveUpdate(reply);opts.onText&&opts.onText(text)}});
    reply.content=r.text;reply.meta=r.meta;if(r.truncated)reply.note='Odpowiedź została ucięta. Poproś o krótszą wersję.';
  }catch(e){
    reply.content=(e&&e.text)||reply.content||'';
    if(e&&e.code==='cancelled')reply.note='Zatrzymano.';else reply.error=errText(e);
  }
  busy=null;reply.pending=false;finishTurn(pid,opts);return reply;
}
function finishTurn(pid,opts={}){
  const turns=S['chat-'+pid].turns;
  const last=turns[turns.length-1];
  if(last&&last.role==='assistant'&&last.content){last.acts=parseActs(last.content);autoApply(last.acts,P[pid].name)}
  if(turns.length>80)S['chat-'+pid].turns=turns.slice(-80);
  save('chat-'+pid);
  if(view==='chat'&&persona===pid){renderChat();scrollEnd()}
  if(S.profile.autoSpeak&&!opts.stay&&last&&last.role==='assistant'&&last.content&&!last.error)speak(last.content,pid);
  renderComposer();
}

/* ---------- Council of Four ---------- */
async function runCouncil(q){
  q=(q||'').trim();if(!q)return toast('Wpisz pytanie do Rady');
  if(!sampleFn)return toast(NO_AI);
  if(councilCtl)return;
  const it={id:uid(),q,ts:Date.now(),ans:{},st:{},verdict:'',vst:'wait',acts:[]};
  S.council.items.unshift(it);if(S.council.items.length>20)S.council.items.length=20;
  councilCtl=new AbortController();const sig=councilCtl.signal;councilDraft='';
  if(view!=='council')go('council');else render();
  const ctx=context();
  await Promise.all(ORDER.map(pid=>{
    const p=P[pid];it.st[pid]='run';
    const prompt=fill(p.soul)+`\n\nJesteś członkiem Rady Czterech w Evoo AI OS (Evoo, Jinx, Lucy, Gods Eye). ${name()} zadał jedno pytanie wszystkim naraz. Odpowiedz wyłącznie ze swojej perspektywy i specjalności, po polsku, najwyżej 5 zdań albo 4 krótkie punkty. Bądź konkretna i szczera, nie powtarzaj pytania, nie wymyślaj faktów ani liczb. Nie używaj bloków action ani nagłówków.\n\n${ctx}\n\nPYTANIE ${name().toUpperCase()}:\n${q}`;
    return sampleFn(prompt,{cache:false,signal:sig,modelTier:'quick',onText:({text})=>{it.ans[pid]=text;liveCouncil(it,pid)}})
      .then(r=>{it.ans[pid]=r.text;it.st[pid]='ok';it.meta=it.meta||{};it.meta[pid]=r.meta})
      .catch(e=>{it.ans[pid]=(e&&e.text)||it.ans[pid]||'';it.st[pid]=e&&e.code==='cancelled'?'stop':'err';it.err=it.err||{};it.err[pid]=errText(e)})
      .finally(()=>liveCouncil(it,pid));
  }));
  const got=ORDER.filter(pid=>it.ans[pid]&&it.ans[pid].trim());
  if(!sig.aborted&&got.length>=2){
    it.vst='run';liveVerdict(it);
    const prompt=fill(P.evoo.soul)+'\n\n'+fill(RULES)+'\n\n'+ctx+`\n\nPrzewodniczysz Radzie Czterech. ${name()} zapytał: „${q}”.\nOdpowiedzi członków Rady:\n`+got.map(pid=>`--- ${P[pid].name} (${P[pid].role}):\n${it.ans[pid]}`).join('\n')+`\n\nNapisz WERDYKT RADY: 1) w czym Rada się zgadza, 2) gdzie się różni i co z tego wynika, 3) Twoja rekomendacja i jeden konkretny następny krok. Najwyżej 8 zdań lub krótkie punkty. Możesz zaproponować do 3 zadań lub projekt blokami action.`;
    try{
      const r=await sampleFn(prompt,{cache:false,signal:sig,modelTier:S.profile.tier||'quick',onText:({text})=>{it.verdict=text;liveVerdict(it)}});
      it.verdict=r.text;it.vst='ok';it.vmeta=r.meta;
    }catch(e){it.verdict=(e&&e.text)||it.verdict||'';it.vst=e&&e.code==='cancelled'?'stop':'err';it.verr=errText(e)}
    it.acts=parseActs(it.verdict);
  }else if(!sig.aborted){it.vst='err';it.verr='Za mało odpowiedzi, żeby wydać werdykt. Spróbuj ponownie.'}
  else it.vst='stop';
  councilCtl=null;save('council');if(view==='council')render();
}
function ccHtml(it,pid){
  const p=P[pid];const t=it.ans[pid]||'';const st=it.st[pid];
  const body=t?bodyHtml(t):st==='run'||!st?'<div class="think"><i></i><i></i><i></i></div>':'';
  const err=st==='err'&&it.err?.[pid]?`<div class="err">${esc(it.err[pid])}</div>`:st==='stop'?'<div class="note">Zatrzymano.</div>':'';
  const mm=it.meta&&it.meta[pid]?`<div class="model">${esc(modelLabel(it.meta[pid]))}</div>`:'';
  return `<div class="h"><img src="${img(pid)}" alt=""><b>${p.name}</b><span class="small muted">${p.role}</span></div>${body}${mm}${err}`;
}
function verdHtml(it){
  let b='';
  if(it.vst==='wait')b='<p class="muted small">Evoo czeka na odpowiedzi Rady…</p>';
  else if(!it.verdict&&it.vst==='run')b='<div class="think"><i></i><i></i><i></i></div>';
  else b=bodyHtml(it.verdict);
  if(it.acts&&it.acts.length)b+=it.acts.map((a,j)=>actHtml(a,`r|${it.id}|0|${j}`)).join('');
  if(it.vst==='err'&&it.verr)b+=`<div class="err">${esc(it.verr)}</div>`;
  if(it.vmeta)b+=`<div class="model">${esc(modelLabel(it.vmeta))}</div>`;
  if(it.vst==='stop')b+='<div class="note">Zatrzymano.</div>';
  return `<div class="h"><img src="${img('evoo')}" alt=""><div><div class="eyebrow" style="color:#C084FC">Werdykt Rady</div><b style="font:700 16px var(--display)">Evoo</b></div></div>${b}`;
}
function liveCouncil(it,pid){const el=document.getElementById('cc-'+it.id+'-'+pid);if(el)el.innerHTML=ccHtml(it,pid)}
function liveVerdict(it){const el=document.getElementById('cv-'+it.id);if(el)el.innerHTML=verdHtml(it)}

/* ---------- Agents ---------- */
function areaBalance(){
  const c={};AREAS.forEach(a=>c[a]={open:0,done:0});
  S.tasks.items.forEach(t=>{const k=c[t.area]?t.area:'Projekty';t.done?c[k].done++:c[k].open++});
  return AREAS.map(a=>`- ${a}: ${c[a].open} otwartych, ${c[a].done} ukończonych`).join('\n');
}
const AGENTS=[
  {id:'week',pid:'evoo',name:'Strateg tygodnia',desc:'Układa plan na 7 dni z Twoich zadań, projektów i pamięci. Wskazuje 3 cele tygodnia i proponuje brakujące zadania.',input:'',
    prompt:()=>`Wykonaj zadanie agenta „Strateg tygodnia”. Na podstawie kontekstu ułóż plan na najbliższe 7 dni, zaczynając od dziś.
Struktura: 3 cele tygodnia (mierzalne) → plan dzień po dniu (najwyżej 3 rzeczy dziennie, z nazwą dnia) → czego NIE robić w tym tygodniu → jedno ryzyko dla planu. Uwzględnij czas na Rodzinę i Wolność.
Na końcu zaproponuj do 4 brakujących zadań blokami action z terminami w tym tygodniu. Jeśli danych jest mało, powiedz to i zaplanuj pierwsze kroki do ich zebrania.`},
  {id:'content',pid:'jinx',name:'Kreator treści',desc:'Rozpisuje 7 postów na tydzień: hook, treść i pomysł na grafikę z gotowym promptem.',input:'Temat lub marka, np. Evoo AI OS na Instagramie',
    prompt:v=>`Wykonaj zadanie agenta „Kreator treści”. Temat: ${v||'Evoo AI OS'}.
Rozpisz 7 postów na kolejne dni tygodnia. Dla każdego: dzień, format (karuzela, reel, post, story), hook w pierwszej linii, 2–3 zdania treści, wezwanie do działania i pomysł na grafikę. Na końcu jeden wspólny, szczegółowy prompt po angielsku do generatora obrazów w bloku kodu, spójny wizualnie dla całej serii. Zaproponuj 1 zadanie blokiem action: przygotowanie pierwszego posta.`},
  {id:'risk',pid:'gods',name:'Analityk ryzyk',desc:'Bierze projekt lub decyzję i rozkłada ją na założenia, scenariusze, ryzyka i rekomendację.',input:'Projekt lub decyzja, np. kupno mieszkania na wynajem',
    prompt:v=>`Wykonaj zadanie agenta „Analityk ryzyk”. Przedmiot analizy: ${v||'najważniejszy projekt z kontekstu'}.
Struktura: Wniosek w 2 zdaniach → Kluczowe założenia (oznacz, które są niepewne) → Scenariusze: optymistyczny, bazowy, pesymistyczny (co musiałoby się wydarzyć) → Top 5 ryzyk z prawdopodobieństwem (niskie/średnie/wysokie) i sposobem ograniczenia → Czego brakuje do lepszej decyzji → Rekomendacja.
Nie wymyślaj liczb rynkowych; gdy ich potrzeba, napisz, jakie dane zebrać. Zaproponuj do 3 zadań blokami action.`},
  {id:'balance',pid:'lucy',name:'Coach równowagi',desc:'Sprawdza, jak Twoje zadania rozkładają się na 7 obszarów życia, i proponuje jeden nawyk na ten tydzień.',input:'',
    prompt:()=>`Wykonaj zadanie agenta „Coach równowagi”. Rozkład zadań na obszary życia:
${areaBalance()}
Oceń ciepło i szczerze, które obszary dostają dużo uwagi, a które są zaniedbane. Struktura: Jak to wygląda (2–3 zdania) → Co działa → Co jest zaniedbane i dlaczego to ważne → Jeden mały nawyk na ten tydzień (konkretny, 10 minut dziennie) → Jedno pytanie do refleksji. Jeśli zadań jest mało, powiedz to i zaproponuj, od czego zacząć.
Zaproponuj 1–2 zadania blokami action dla zaniedbanych obszarów.`}
];
async function runAgent(id){
  const ag=AGENTS.find(a=>a.id===id);if(!ag||agentRun[id])return;
  if(!sampleFn)return toast(NO_AI);
  const inp=document.getElementById('ain-'+id);const v=inp?inp.value.trim():'';
  if(ag.input&&!v){toast('Uzupełnij pole dla agenta');inp&&inp.focus();return}
  const ctl=new AbortController();agentRun[id]={ctl,text:'',v};render();
  const p=P[ag.pid];
  const prompt=fill(p.soul)+'\n\n'+fill(RULES).replace(/Krótko i konkretnie[^\n]*\n/,'Piszesz pełny, uporządkowany raport, ale bez lania wody.\n')+'\n\n'+context()+'\n\n'+ag.prompt(v);
  let text='',err='',note='';
  try{
    const r=await sampleFn(prompt,{cache:false,signal:ctl.signal,modelTier:'default',onText:({text:t})=>{agentRun[id].text=t;const el=document.getElementById('aout-'+id);if(el)el.innerHTML=bodyHtml(t)}});
    text=r.text;if(r.truncated)note='Raport został ucięty.';
  }catch(e){text=(e&&e.text)||agentRun[id].text||'';if(e&&e.code==='cancelled')note='Zatrzymano.';else err=errText(e)}
  delete agentRun[id];
  if(text.trim()){
    S.library.items.unshift({id:uid(),agent:id,agentName:ag.name,pid:ag.pid,input:v,content:text,acts:parseActs(text),note,ts:Date.now()});
    if(S.library.items.length>30)S.library.items.length=30;save('library');toast('Raport zapisany w bibliotece');
  }
  if(err)toast(err);
  if(view==='agents')render();
}

/* ---------- views ---------- */
function go(v){
  if(view==='live'&&v!=='live'){try{stopListen();stopAudio();liveLoop=false}catch(e){}}
  view=v;document.body.classList.toggle('v-chat',v==='chat');
  render();window.scrollTo(0,v==='chat'?document.body.scrollHeight:0);
}
function render(){
  const accent={chat:P[persona].color,live:P[persona].color,money:'#3B82F6',agents:'#A855F7'}[view]||'#A855F7';
  document.documentElement.style.setProperty('--a',accent);
  document.querySelector('.nav').hidden=false;
  const desktop=window.matchMedia('(min-width:1000px)').matches;
  $('#nav').innerHTML=NAV.map(([k,l,pri])=>{
    const on=view===k||(!desktop&&k==='more'&&SECONDARY.includes(view));
    const label=!desktop&&k==='money'?'Money':l;
    return `<button data-go="${k}" class="${pri===0?'sec':pri===2?'more':''} ${on?'on':''}" aria-current="${on?'page':'false'}">${ICON[k]}<span>${label}</span></button>`}).join('');
  (VIEWS[view]||vStart)();
  renderComposer();renderStatus();
}
function greet(){const h=new Date().getHours();return h<5?'Dobranoc':h<12?'Dzień dobry':h<18?'Cześć':'Dobry wieczór'}
const H1=(eyebrow,title,sub,col)=>`<section>${eyebrow?`<div class="eyebrow" style="color:${col||'#C084FC'}">${eyebrow}</div>`:''}<h1 class="hello" style="font-size:clamp(26px,6vw,32px)">${title}</h1>${sub?`<p class="sub">${sub}</p>`:''}</section>`;

function vStart(){
  const ot=openTasks();const today=new Date().toLocaleDateString('pl-PL',{weekday:'long',day:'numeric',month:'long'});
  const ap=S.projects.items.slice(0,2);
  const upEv=S.calendar.items.filter(e=>e.date>=todayISO()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,3);
  $('#view').innerHTML=`
  <section>
    <div class="eyebrow">${esc(today)}</div>
    <h1 class="hello">${greet()}, <em>${esc(name())}</em></h1>
    <p class="sub">Wybierz, z kim chcesz dziś pracować, albo napisz od razu do Evoo.</p>
  </section>
  <section class="hero">
    <img src="${img('evoo')}" alt="Evoo">
    <div class="hero-b">
      <div class="eyebrow" style="color:#C084FC">Online</div>
      <h2>Evoo</h2>
      <div class="role">Twoja główna asystentka</div>
      <div class="motto"><span>Twój cel.</span><span>Mój plan.</span><span>Nasz wynik.</span></div>
      <button class="btn sm livebtn" data-go="live">${ICON.live}<span>Porozmawiaj na żywo</span></button>
      <form class="mini" id="quick"><input id="quickIn" placeholder="Napisz do Evoo…" aria-label="Wiadomość do Evoo" autocomplete="off"><button class="icon-btn" aria-label="Wyślij">${ICON.send}</button></form>
    </div>
  </section>
  <section class="council-in">
    <div style="display:flex;align-items:center;gap:12px"><div class="faces">${ORDER.map(id=>`<img src="${img(id)}" alt="">`).join('')}</div><div><div class="eyebrow" style="color:#C084FC">Rada Czterech</div><b style="font:700 16px var(--display)">Jedno pytanie, cztery perspektywy</b></div></div>
    <form class="mini" id="cq" style="margin:0"><input id="cqIn" placeholder="Zapytaj wszystkie naraz…" aria-label="Pytanie do Rady" autocomplete="off"><button class="icon-btn" aria-label="Zwołaj Radę">${ICON.send}</button></form>
  </section>
  <section>
    <div class="sec-h"><h2>Szybkie akcje</h2></div>
    <div class="chips">
      ${[['evoo','Plan dnia','Ułóż mi plan dnia na dziś na podstawie moich zadań.',1],['evoo','Priorytety','Podsumuj moje otwarte zadania i wskaż 3 priorytety.',1],['lucy','Motywacja','Potrzebuję motywacji, żeby ruszyć z miejsca.',1],['jinx','Tapeta','Wymyśl tapetę na telefon w stylu Evoo AI OS.',1],['gods','Analiza decyzji','Pomóż mi przeanalizować decyzję: ',0],['agents','Agenci','',0],['money','Pomysł na zarobek','',0]]
        .map(([p,l,t,s])=>`<button class="chip" style="--ccol:${P[p]?P[p].color:p==='money'?'#34D399':'#A855F7'}" data-qa="${p}" data-text="${esc(t)}" data-send="${s}"><i></i>${l}</button>`).join('')}
    </div>
  </section>
  <section>
    <div class="sec-h"><h2>Twój zespół</h2><span class="eyebrow">4 osobowości</span></div>
    <div class="team">${ORDER.map(id=>{const p=P[id];return `<button class="pc" style="--pcol:${p.color}" data-persona="${id}"><img src="${img(id)}" alt=""><span class="on"><i></i>Online</span><span class="t"><b>${p.name}</b><span>${p.role}</span></span></button>`}).join('')}</div>
  </section>
  <section>
    <div class="sec-h"><h2>Na dziś</h2><button class="link" data-go="tasks">Wszystkie zadania</button></div>
    <div class="panel"><div class="list">${ot.length?ot.slice(0,4).map(taskRow).join(''):`<div class="empty">Nie masz otwartych zadań. Dodaj pierwsze w zakładce Zadania albo poproś Evoo o plan.</div>`}</div></div>
  </section>
  ${upEv.length?`<section><div class="sec-h"><h2>Najbliższe wydarzenia</h2><button class="link" data-go="calendar">Kalendarz</button></div><div class="panel"><div class="list">${upEv.map(e=>eventRow(e,true)).join('')}</div></div></section>`:''}
  ${ap.length?`<section><div class="sec-h"><h2>Projekty</h2><button class="link" data-go="projects">Wszystkie projekty</button></div><div class="panel"><div class="list">${ap.map(p=>{const d=p.ms.filter(m=>m.done).length,n=p.ms.length;return `<div class="row"><div class="grow"><div class="ttl">${esc(p.name)}</div><div class="prog" style="margin-top:6px"><div><span style="width:${n?Math.round(d/n*100):0}%"></span></div>${d}/${n}</div></div></div>`}).join('')}</div></div></section>`:''}
  <section class="stats">
    <div class="stat"><b>${ot.length}</b><span>otwartych zadań</span></div>
    <div class="stat"><b>${S.projects.items.length}</b><span>projektów</span></div>
    <div class="stat"><b>${S.memory.items.length}</b><span>wspomnień</span></div>
  </section>`;
  $('#quick').onsubmit=e=>{e.preventDefault();const v=$('#quickIn').value;if(v.trim())send('evoo',v)};
  $('#cq').onsubmit=e=>{e.preventDefault();const v=$('#cqIn').value;if(v.trim())runCouncil(v)};
}
function taskRow(t){
  const d=dueInfo(t.due);
  return `<div class="row ${t.done?'done':''}"><button class="check ${t.done?'on':''}" data-toggle="${t.id}" aria-label="${t.done?'Oznacz jako nieukończone':'Oznacz jako ukończone'}">${ICON.check}</button>
  <div class="grow"><div class="ttl">${esc(t.title)}</div><div class="meta"><span class="tag">${esc(t.area)}</span>${d?`<span class="tag ${d.c}">${d.l}</span>`:''}</div></div>
  <button class="x" data-deltask="${t.id}" aria-label="Usuń zadanie">${ICON.x}</button></div>`;
}

function vChat(){
  const p=P[persona];
  $('#view').innerHTML=`
  <div class="ptabs">${ORDER.map(id=>`<button class="ptab ${id===persona?'on':''}" style="--pcol:${P[id].color}" data-persona="${id}"><img src="${img(id)}" alt="">${P[id].name}</button>`).join('')}</div>
  <div class="chat-head"><img src="${img(persona)}" alt=""><div class="grow"><h2>${p.name}</h2><div class="role">${p.role}</div><div class="small muted">${p.tag}</div></div>
    <button class="btn sm livebtn" data-go="live" style="background:${p.color}">${ICON.live}<span>Na żywo</span></button></div>
  <div class="chatbar">
    <label class="tier">Sposób <select id="mode" aria-label="Sposób myślenia">${Object.entries(MODES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label>
    <label class="tier">Tryb <select id="tier" aria-label="Tryb odpowiedzi"><option value="quick">Szybki</option><option value="default">Zrównoważony</option><option value="complex">Głęboki</option></select></label>
    <button class="link" id="clear" style="color:var(--dim);margin-left:auto">Wyczyść</button>
  </div>
  <div class="msgs" id="msgs"></div>`;
  $('#tier').value=S.profile.tier||'quick';
  $('#tier').onchange=e=>{S.profile.tier=e.target.value;save('profile');toast('Tryb: '+e.target.selectedOptions[0].text)};
  $('#mode').value=S.profile.mode||'auto';$('#mode').onchange=e=>{S.profile.mode=e.target.value;save('profile');toast('Sposób: '+e.target.selectedOptions[0].text)};
  $('#clear').onclick=e=>{
    const b=e.currentTarget;if(busy)return;
    if(b.dataset.arm){S['chat-'+persona].turns=[];save('chat-'+persona);renderChat();b.textContent='Wyczyść';delete b.dataset.arm;b.style.color='var(--dim)';return}
    b.dataset.arm=1;b.textContent='Na pewno? Wyczyść';b.style.color='var(--bad)';setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent='Wyczyść';b.style.color='var(--dim)'}},3500);
  };
  renderChat();
}
function msgHtml(t,i){
  const p=P[persona];
  if(t.role==='user')return `<div class="m u"><div class="bub">${esc(t.content).replace(/\n/g,'<br>')}</div></div>`;
  let inner='';
  if(t.pending&&!t.content)inner='<div class="think" aria-label="Pisze"><i></i><i></i><i></i></div>';
  else inner=(t.mode&&t.mode.m!=='chat'?`<div class="modebadge">${esc(modeLabel(t.mode))}</div>`:'')+bodyHtml(t.content);
  if(t.acts&&t.acts.length)inner+=t.acts.map((a,j)=>actHtml(a,`c|${persona}|${i}|${j}`)).join('');
  if(t.meta&&t.meta.provider)inner+=`<div class="model">${esc(modelLabel(t.meta))}</div>`;
  if(!t.pending&&t.content&&canSpeak)inner+=`<button class="spk" data-speak="${i}">${ICON.speak}<span>Odsłuchaj</span></button>`;
  if(t.note)inner+=`<div class="note">${esc(t.note)}</div>`;
  if(t.error)inner+=`<div class="err">${esc(t.error)}</div>`;
  return `<div class="m"><img src="${img(persona)}" alt=""><div class="bub" ${t.pending?'id="live"':''}><div class="who">${p.name}</div>${inner}</div></div>`;
}
function renderChat(){
  const box=$('#msgs');if(!box)return;const p=P[persona];const turns=S['chat-'+persona].turns;
  let h=`<div class="m"><img src="${img(persona)}" alt=""><div class="bub"><div class="who">${p.name}</div><p>${esc(fill(p.hello))}</p></div></div>`;
  h+=turns.map(msgHtml).join('');
  if(!turns.length)h+=`<div class="chips" style="margin-top:4px">${p.chips.map(c=>`<button class="chip" style="--ccol:${p.color}" data-sug="${esc(c)}"><i></i>${esc(c.replace(/:\s*$/,'…'))}</button>`).join('')}</div>`;
  box.innerHTML=h;
}
function liveUpdate(t){
  const el=$('#live');if(!el)return;
  el.innerHTML=`<div class="who">${P[persona].name}</div>`+(t.content?bodyHtml(t.content):'<div class="think"><i></i><i></i><i></i></div>');
  scrollEnd();
}
function scrollEnd(force){
  const near=window.innerHeight+window.scrollY>=document.body.scrollHeight-260;
  if(force||near)requestAnimationFrame(()=>window.scrollTo(0,document.body.scrollHeight));
}
function renderComposer(){
  const slot=$('#composerSlot');
  if(view!=='chat'){slot.innerHTML='';return}
  const p=P[persona];
  if(!$('#composer')){
    slot.innerHTML=`<form class="composer" id="composer"><div class="in">${SR?`<button type="button" class="icon-btn mic" id="micBtn" aria-label="Dyktuj">${ICON.mic}</button>`:''}<textarea id="msg" rows="1" placeholder="Napisz do ${esc(p.name)}…" aria-label="Wiadomość"></textarea><button class="icon-btn" id="sendBtn" aria-label="Wyślij">${ICON.send}</button></div></form>`;
    const ta=$('#msg');
    const fit=()=>{ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,140)+'px'};
    ta.oninput=fit;
    ta.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&window.matchMedia('(hover:hover)').matches){e.preventDefault();fireSubmit($('#composer'))}};
    $('#composer').onsubmit=e=>{e.preventDefault();if(busy){busy.abort();return}stopDictation();const v=ta.value;if(!v.trim())return;ta.value='';fit();send(persona,v)};
    if(SR)$('#micBtn').onclick=()=>toggleDictation(ta,fit);
  }
  $('#msg').placeholder='Napisz do '+p.name+'…';
  const b=$('#sendBtn');b.className='icon-btn'+(busy?' stop':'');b.innerHTML=busy?ICON.stop:ICON.send;b.setAttribute('aria-label',busy?'Zatrzymaj':'Wyślij');
}

function vCouncil(){
  const [cur,...old]=S.council.items;
  $('#view').innerHTML=H1('Rada Czterech','Jedno pytanie. Cztery perspektywy. Jeden werdykt.','Evoo, Jinx, Lucy i Gods Eye odpowiadają równocześnie, każda ze swojej strony. Potem Evoo zbiera to w werdykt z następnym krokiem.')+`
  <form class="council-in" id="cform">
    <div class="faces">${ORDER.map(id=>`<img src="${img(id)}" alt="${P[id].name}">`).join('')}</div>
    <textarea class="field" id="cqText" placeholder="Np. Czy w tym kwartale skupić się na Evoo, czy na nieruchomościach?" aria-label="Pytanie do Rady">${esc(councilDraft)}</textarea>
    <div><button class="btn" id="cBtn" ${councilCtl?'style="background:var(--panel2);border:1px solid var(--line2)"':''}>${councilCtl?'Zatrzymaj Radę':'Zwołaj Radę'}</button></div>
  </form>
  ${cur?`<section style="display:flex;flex-direction:column;gap:12px">
    <div><div class="eyebrow">${fmtDate(cur.ts)}</div><div class="q">„${esc(cur.q)}”</div></div>
    <div class="cgrid">${ORDER.map(pid=>`<div class="cc" style="--pcol:${P[pid].color}" id="cc-${cur.id}-${pid}">${ccHtml(cur,pid)}</div>`).join('')}</div>
    <div class="verd" id="cv-${cur.id}">${verdHtml(cur)}</div>
  </section>`:`<div class="panel empty">Rada jeszcze nie obradowała. Zadaj pierwsze pytanie, najlepiej takie, przy którym liczy się kilka punktów widzenia.</div>`}
  ${old.length?`<section style="display:flex;flex-direction:column;gap:8px"><div class="sec-h"><h2>Wcześniejsze obrady</h2><span class="eyebrow">${old.length}</span></div>
    ${old.map(it=>`<details class="hist"><summary><span>${esc(it.q)}</span><span class="small muted" style="flex:none">${fmtDate(it.ts)}</span></summary>
      <div class="bodyx">${it.verdict?bodyHtml(it.verdict):'<p class="muted">Brak werdyktu.</p>'}${(it.acts||[]).map((a,j)=>actHtml(a,`r|${it.id}|0|${j}`)).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm ghost" data-delcouncil="${it.id}">Usuń</button></div></details>`).join('')}
  </section>`:''}`;
  const ta=$('#cqText');ta.oninput=()=>councilDraft=ta.value;
  $('#cform').onsubmit=e=>{e.preventDefault();if(councilCtl){councilCtl.abort();return}runCouncil(ta.value)};
}

let filter='Wszystkie';
function vTasks(){
  const items=S.tasks.items.filter(t=>filter==='Wszystkie'||t.area===filter);
  const open=items.filter(t=>!t.done).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')||a.ts-b.ts);
  const done=items.filter(t=>t.done).sort((a,b)=>(b.doneTs||0)-(a.doneTs||0));
  $('#view').innerHTML=H1('','Zadania','Priorytety, terminy i następny krok. Zespół widzi tę listę w każdej rozmowie.')+`
  <form class="panel form" id="addTask">
    <input class="field" id="tTitle" placeholder="Co jest do zrobienia?" aria-label="Tytuł zadania" autocomplete="off" required>
    <div class="r"><select class="field" id="tArea" aria-label="Obszar">${AREAS.map(a=>`<option>${a}</option>`).join('')}</select>
    <input class="field" type="date" id="tDue" aria-label="Termin"><button class="btn">Dodaj zadanie</button></div>
  </form>
  <div class="chips">${['Wszystkie',...AREAS].map(a=>`<button class="chip ${filter===a?'on':''}" data-filter="${a}">${a}</button>`).join('')}</div>
  <section><div class="sec-h"><h2>Otwarte</h2><span class="eyebrow">${open.length}</span></div>
    <div class="panel"><div class="list">${open.length?open.map(taskRow).join(''):`<div class="empty">Brak otwartych zadań${filter!=='Wszystkie'?' w tym obszarze':''}.</div>`}</div></div></section>
  ${done.length?`<section><div class="sec-h"><h2>Ukończone</h2><span class="eyebrow">${done.length}</span></div><div class="panel"><div class="list">${done.slice(0,30).map(taskRow).join('')}</div></div></section>`:''}`;
  if(filter!=='Wszystkie')$('#tArea').value=filter;
  $('#addTask').onsubmit=e=>{e.preventDefault();const title=$('#tTitle').value.trim();if(!title)return;
    S.tasks.items.push({id:uid(),title,area:$('#tArea').value,due:$('#tDue').value||'',done:false,ts:Date.now()});save('tasks');render();toast('Dodano zadanie')};
}

const planning={};
function vProjects(){
  $('#view').innerHTML=H1('','Projekty','Cele i kamienie milowe. Evoo może rozpisać każdy projekt na kroki.')+`
  <form class="panel form" id="addProj">
    <input class="field" id="pName2" placeholder="Nazwa projektu, np. Evoo AI OS 1.0" aria-label="Nazwa projektu" autocomplete="off" required>
    <input class="field" id="pGoal" placeholder="Cel, np. 100 użytkowników do końca roku" aria-label="Cel projektu" autocomplete="off">
    <div class="r"><select class="field" id="pArea" aria-label="Obszar">${AREAS.map(a=>`<option ${a==='Projekty'?'selected':''}>${a}</option>`).join('')}</select><button class="btn">Dodaj projekt</button></div>
  </form>
  <section style="display:flex;flex-direction:column;gap:12px">${S.projects.items.length?S.projects.items.map(projHtml).join(''):`<div class="panel empty">Nie masz jeszcze projektów. Dodaj pierwszy albo zatwierdź propozycję od Evoo.</div>`}</section>`;
  $('#addProj').onsubmit=e=>{e.preventDefault();const n=$('#pName2').value.trim();if(!n)return;
    S.projects.items.unshift({id:uid(),name:n,goal:$('#pGoal').value.trim(),area:$('#pArea').value,ms:[],ts:Date.now()});save('projects');render();toast('Dodano projekt')};
  document.querySelectorAll('[data-msform]').forEach(f=>f.onsubmit=e=>{e.preventDefault();const p=S.projects.items.find(x=>x.id===f.dataset.msform);const inp=f.querySelector('input');const t=inp.value.trim();if(!p||!t)return;p.ms.push({id:uid(),t,done:false});save('projects');render()});
}
function projHtml(p){
  const d=p.ms.filter(m=>m.done).length,n=p.ms.length;
  return `<article class="panel proj">
    <div class="top2"><div style="flex:1;min-width:0"><h3>${esc(p.name)}</h3>${p.goal?`<div class="small muted">${esc(p.goal)}</div>`:''}<div class="meta"><span class="tag">${esc(p.area)}</span></div></div><button class="x" data-delproj="${p.id}" aria-label="Usuń projekt">${ICON.x}</button></div>
    <div class="prog"><div><span style="width:${n?Math.round(d/n*100):0}%"></span></div>${d}/${n}</div>
    <div class="list">${p.ms.map(m=>`<div class="row ${m.done?'done':''}"><button class="check ${m.done?'on':''}" data-ms="${p.id}:${m.id}" aria-label="Przełącz kamień milowy">${ICON.check}</button><div class="grow"><div class="ttl">${esc(m.t)}</div></div><button class="x" data-delms="${p.id}:${m.id}" aria-label="Usuń kamień milowy">${ICON.x}</button></div>`).join('')}</div>
    <form class="mini" data-msform="${p.id}" style="margin:0"><input placeholder="Dodaj kamień milowy…" aria-label="Nowy kamień milowy" autocomplete="off"><button class="icon-btn" aria-label="Dodaj">${ICON.send}</button></form>
    <div class="bt"><button class="btn sm" data-plan="${p.id}" ${planning[p.id]?'disabled':''}>${planning[p.id]?'Evoo rozpisuje…':'Rozpisz z Evoo'}</button><button class="btn sm ghost" data-projchat="${p.id}">Omów z Evoo</button><button class="btn sm ghost" data-projrisk="${p.id}">Analiza ryzyk</button></div>
  </article>`;
}
async function planProject(id){
  const p=S.projects.items.find(x=>x.id===id);if(!p||planning[id])return;
  if(!sampleFn)return toast(NO_AI);
  planning[id]=true;render();
  try{
    const arr=await sampleFn.json(fill(P.evoo.soul)+'\n\n'+context()+`\n\nRozpisz projekt „${p.name}”${p.goal?' o celu: '+p.goal:''} na 5–7 kamieni milowych w logicznej kolejności. Każdy krótki (max 8 słów), konkretny i sprawdzalny. ${p.ms.length?'Pomiń te, które już istnieją: '+p.ms.map(m=>m.t).join('; ')+'.':''}\nOdpowiedz wyłącznie tablicą JSON stringów, np. ["Krok 1","Krok 2"].`,{modelTier:'quick',cache:false});
    const list=(Array.isArray(arr)?arr:[]).map(x=>String(x).trim()).filter(Boolean).slice(0,8);
    if(!list.length)throw{code:'invalid_json'};
    list.forEach(t=>p.ms.push({id:uid(),t,done:false}));save('projects');toast('Dodano '+list.length+' '+(list.length===1?'kamień milowy':list.length<5?'kamienie milowe':'kamieni milowych'));
  }catch(e){toast(errText(e))}
  delete planning[id];if(view==='projects')render();
}

function vAgents(){
  $('#view').innerHTML=H1('Agenci','Wyślij agenta, wróć po raport','Każdy agent wykonuje dłuższe zadanie z kontekstem Twoich zadań, projektów i pamięci. Raport trafia do biblioteki, a propozycje czekają na Twoje zatwierdzenie.')+`
  <section style="display:flex;flex-direction:column;gap:12px">${AGENTS.map(ag=>{const p=P[ag.pid];const run=agentRun[ag.id];return `<article class="panel agent" style="--pcol:${p.color}">
    <div class="h"><img src="${img(ag.pid)}" alt=""><div><b>${ag.name}</b><span>${p.name} · ${p.role}</span></div></div>
    <div class="small muted">${ag.desc}</div>
    ${ag.input?`<input class="field" id="ain-${ag.id}" placeholder="${esc(ag.input)}" aria-label="${esc(ag.input)}" autocomplete="off" value="${esc(run?run.v:'')}">`:''}
    <div><button class="btn sm" style="background:${p.color}" data-agent="${ag.id}">${run?'Zatrzymaj':'Uruchom agenta'}</button></div>
    ${run?`<div class="out" id="aout-${ag.id}">${run.text?bodyHtml(run.text):'<div class="small muted" style="display:flex;gap:8px;align-items:center"><div class="think"><i></i><i></i><i></i></div>Agent pracuje. To może potrwać do minuty.</div>'}</div>`:''}
  </article>`}).join('')}</section>
  <section style="display:flex;flex-direction:column;gap:8px"><div class="sec-h"><h2>Biblioteka raportów</h2><span class="eyebrow">${S.library.items.length}</span></div>
    ${S.library.items.length?S.library.items.map((r,ix)=>`<details class="hist" ${ix===0?'open':''}><summary><span>${esc(r.agentName)}${r.input?': '+esc(r.input):''}</span><span class="small muted" style="flex:none">${fmtDate(r.ts)}</span></summary>
      <div class="bodyx">${bodyHtml(r.content)}${(r.acts||[]).map((a,j)=>actHtml(a,`l|${r.id}|0|${j}`)).join('')}${r.note?`<div class="note">${esc(r.note)}</div>`:''}</div>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm ghost" data-delrep="${r.id}">Usuń raport</button></div></details>`).join('')
    :`<div class="panel empty">Biblioteka jest pusta. Uruchom pierwszego agenta, na początek najlepiej Stratega tygodnia.</div>`}
  </section>`;
}

function vMore(){
  const items=[['tasks','Zadania','Priorytety i terminy','#A855F7',openTasks().length],['experts','Eksperci','8 specjalistów, dobór automatyczny','#22D3EE',S.experts.items.length],['lab','Warsztat','Evoo buduje nowe moduły','#F472B6',S.modules.items.length],['projects','Projekty','Cele i kamienie milowe','#A855F7',S.projects.items.length],['agents','Agenci','Raporty i dłuższe zadania','#EC4899',S.library.items.length],['money','Money Hunter','Ocena pomysłów na zarobek','#3B82F6',S.ideas.items.length],['calendar','Kalendarz','Wydarzenia i terminy','#22D3EE',S.calendar.items.filter(e=>e.date>=todayISO()).length],['finance','Finanse','Przychody i wydatki','#34D399',S.finance.items.length],['journal','Dziennik','Myśli, nastrój, refleksje Lucy','#F472B6',S.journal.items.length],['memory','Pamięć i ustawienia','Pamięć, wygląd, głos, router','#F59E0B',S.memory.items.length]];
  $('#view').innerHTML=H1('','Więcej','Wszystkie moduły Evoo AI OS.')+`<section class="hub">${items.map(([k,l,s,c,n])=>`<button data-go="${k}" style="--hc:${c}"><span class="ic">${ICON[k]}</span><b>${l}</b><span>${s} · ${n}</span></button>`).join('')}</section>`;
}

function vMemory(){
  const cloudOk=cloud&&syncState!=='error';
  $('#view').innerHTML=H1('','Pamięć i ustawienia','Tylko to, co jest w pamięci, trafia do rozmów. Tu zmienisz też zdjęcia zespołu, głos i sprawdzisz router.')+`
  <section class="panel form">
    <label class="eyebrow" for="pName">Jak mam się do Ciebie zwracać?</label>
    <input class="field" id="pName" value="${esc(name())}" autocomplete="off">
  </section>
  <section><div class="sec-h"><h2>Co zespół o Tobie wie</h2><span class="eyebrow">${S.memory.items.length}</span></div>
    <div class="panel">
      <form class="mini" id="addMem" style="margin:0 0 6px"><input id="mText" placeholder="Np. Mój cel na 2027: pierwszy produkt cyfrowy" aria-label="Nowy wpis pamięci" autocomplete="off"><button class="icon-btn" aria-label="Dodaj">${ICON.send}</button></form>
      <div class="list">${S.memory.items.length?S.memory.items.slice().reverse().map(m=>`<div class="row"><div class="grow"><div class="ttl" contenteditable="true" data-memedit="${m.id}" spellcheck="false">${esc(m.text)}</div><div class="meta">${m.src?'od '+esc(m.src)+' · ':''}${new Date(m.ts).toLocaleDateString('pl-PL')}</div></div><button class="x" data-delmem="${m.id}" aria-label="Usuń wpis">${ICON.x}</button></div>`).join('')
        :`<div class="empty">Pamięć jest pusta. Dodaj pierwszy fakt o sobie albo zatwierdź propozycję z rozmowy.</div>`}</div>
    </div></section>
  <section><div class="sec-h"><h2>Wygląd zespołu</h2><span class="eyebrow">Twoje zdjęcia</span></div>
    <div class="photos">${ORDER.map(id=>`<div class="ph" style="--pcol:${P[id].color}"><img src="${img(id)}" alt="${P[id].name}"><b>${P[id].name}</b>
      <label class="btn sm ghost">Zmień<input type="file" accept="image/*" data-photo="${id}" hidden></label>
      ${S.profile.photos&&S.profile.photos[id]?`<button class="link" data-photoreset="${id}">Przywróć</button>`:''}</div>`).join('')}</div>
  </section>
  <section class="panel form">
    <div class="sec-h" style="margin:0"><h2>Autopilot</h2></div>
    <label class="switch"><input type="checkbox" id="autopilot" ${S.profile.autopilot!==false?'checked':''}><span>Evoo sama wykonuje działania (zadania, wydarzenia, finanse, pamięć)</span></label>
    <div class="small muted">Każde działanie możesz cofnąć jednym kliknięciem pod odpowiedzią. Moduły i zmiany zachowania zawsze czekają na Twoje zatwierdzenie.</div>
  </section>
  <section><div class="sec-h"><h2>Czego nauczył się zespół</h2><span class="eyebrow">${(S.profile.rules||[]).length}</span></div>
    <div class="panel"><div class="list">${(S.profile.rules||[]).length?S.profile.rules.map(r=>`<div class="row"><div class="grow"><div class="ttl">${esc(r.text)}</div><div class="meta"><span class="tag">${r.pid==='all'?'Cały zespół':esc(P[r.pid]?P[r.pid].name:r.pid)}</span></div></div><button class="x" data-delrule="${r.id}" aria-label="Usuń zasadę">${ICON.x}</button></div>`).join('')
      :'<div class="empty">Brak zasad. Gdy powiesz np. „odpowiadaj krócej”, zespół zaproponuje nową zasadę.</div>'}</div></div>
  </section>
  ${typeof window.claude==='undefined'?`<section class="panel form"><div class="sec-h" style="margin:0"><h2>Kopia danych</h2></div>
    <div class="small muted">Pobierz wszystkie dane Evoo do pliku albo wczytaj je na innym urządzeniu.</div>
    <div class="r"><button type="button" class="btn ghost" data-export="1">Pobierz kopię</button><label class="btn ghost">Wczytaj kopię<input type="file" accept="application/json,.json" data-import="1" hidden></label></div></section>`:''}
  <section class="panel form">
    <div class="sec-h" style="margin:0"><h2>Głos</h2></div>
    ${canSpeak?`<label class="switch"><input type="checkbox" id="autoSpeak" ${S.profile.autoSpeak?'checked':''}><span>Czytaj odpowiedzi na głos automatycznie</span></label>
    <div class="small muted">Pod każdą odpowiedzią jest też przycisk „Odsłuchaj”. Każda persona ma swój ton głosu.</div>`:'<div class="small muted">Ta przeglądarka nie obsługuje czytania na głos.</div>'}
    <div class="small muted">${SR?'Dyktowanie: dotknij mikrofonu obok pola wiadomości w Rozmowie.':'Dyktowanie nie jest dostępne w tej przeglądarce. Na iPhonie możesz użyć mikrofonu na klawiaturze.'}</div>
  </section>
  <section class="panel info">
    <div class="sec-h"><h2>Stan systemu</h2></div>
    <p style="margin:0 0 8px"><span class="pill ${aiState==='ok'?'ok':aiState==='off'?'bad':'warn'}">AI ${aiState==='ok'?'gotowa':aiState==='off'?'niedostępna':'łączy się'}</span>
    <span class="pill ${cloudOk?'ok':syncState==='error'?'bad':'warn'}">${cloudOk?'Zapis w Twojej bazie':syncState==='error'?'Błąd zapisu':'Zapis lokalny'}</span></p>
    <p style="margin:0 0 8px"><b>Witch Router:</b> ${providers?Object.keys(providers).map(k=>`<span class="pill ${providers[k]?'ok':'bad'}">${(DLABEL[k]||k)} ${providers[k]?'✓':'brak klucza'}</span>`).join(' '):'brak danych'}</p>
    <p style="margin:0 0 8px">Tryb <b>Szybki</b> zaczyna od Groq, <b>Zrównoważony</b> od Gemini, <b>Głęboki</b> od mocniejszego modelu Gemini. Router sam pobiera listy modeli od dostawców i wybiera najlepsze darmowe. Gdy model odpowie błędem lub limitem, od razu przełącza się na następny. Pod każdą odpowiedzią widzisz, który model odpowiedział.</p>
    <p style="margin:0 0 12px"><b>Dane:</b> ${isDirect()?'w trybie bezpośrednim wszystko zapisuje się na tym urządzeniu. Żeby mieć dane na kilku urządzeniach, podłącz mózg Convex.':'zadania, projekty, pamięć, raporty, obrady Rady i rozmowy zapisują się w Twojej bazie Convex. Klucze API są tylko na serwerze.'}</p>
    <p class="small muted" style="margin:0 0 8px">Mózg: ${isDirect()?'tryb bezpośredni, klucze w tej przeglądarce':esc(CFG.api||'nie ustawiono')}</p>
    <div id="chains" class="small muted" style="margin:0 0 12px">Ładuję łańcuch modeli…</div>
    <button class="btn sm ghost" id="disconnect">${isDirect()?'Zmień klucze':'Rozłącz to urządzenie'}</button>
  </section>`;
  const ap=$('#autopilot');if(ap)ap.onchange=()=>{S.profile.autopilot=ap.checked;save('profile');toast(ap.checked?'Autopilot włączony':'Autopilot wyłączony: Evoo będzie tylko proponować')};
  const as=$('#autoSpeak');if(as)as.onchange=()=>{S.profile.autoSpeak=as.checked;save('profile');toast(as.checked?'Evoo będzie czytać odpowiedzi':'Czytanie wyłączone')};
  loadChains();
  $('#disconnect').onclick=e=>{const b=e.currentTarget;if(isDirect()){go('connect');return}if(!b.dataset.arm){b.dataset.arm=1;b.textContent='Na pewno? Rozłącz';b.style.color='var(--bad)';return}if(!isDirect()){lsRawSet('evoo:key','');CFG.key=''}cloud=false;go('connect')};
  $('#pName').onchange=e=>{S.profile.name=e.target.value.trim()||'Michał';save('profile');toast('Zapisano imię')};
  $('#addMem').onsubmit=e=>{e.preventDefault();const t=$('#mText').value.trim();if(!t)return;S.memory.items.push({id:uid(),text:t,ts:Date.now(),src:'Ty'});save('memory');render();toast('Zapamiętane')};
  document.querySelectorAll('[data-memedit]').forEach(el=>el.onblur=()=>{const m=S.memory.items.find(x=>x.id===el.dataset.memedit);const v=el.textContent.trim();if(m&&v&&v!==m.text){m.text=v;save('memory');toast('Poprawiono wpis')}else if(m&&!v)el.textContent=m.text});
}

function vMoney(){
  $('#view').innerHTML=H1('Money Hunter','Od pomysłu do pierwszego testu','Opisz pomysł. Gods Eye oceni popyt, wykonalność, koszt i czas, a potem zaproponuje najmniejszy test.','#60A5FA')+`
  <form class="panel form" id="mh">
    <textarea class="field" id="mhIdea" placeholder="Np. E-book o automatyzacji małej firmy z n8n, sprzedawany przez Instagram" aria-label="Pomysł"></textarea>
    <div class="r"><button class="btn" id="mhBtn" style="flex:0 1 auto">${money?'Zatrzymaj analizę':'Oceń z Gods Eye'}</button></div>
    ${money?`<div class="small muted" style="display:flex;gap:8px;align-items:center"><div class="think"><i></i><i></i><i></i></div>Gods Eye analizuje. To może potrwać do minuty.</div>`:''}
    <div class="note">Ocena to opinia AI bez dostępu do aktualnych danych rynkowych. Nie jest prognozą zarobków.</div>
  </form>
  <section id="ideas" style="display:flex;flex-direction:column;gap:14px">${S.ideas.items.length?S.ideas.items.map(ideaHtml).join(''):`<div class="panel empty">Nie masz jeszcze ocenionych pomysłów. Wpisz pierwszy powyżej.</div>`}</section>`;
  if(money&&money.draft)$('#mhIdea').value=money.draft;
  $('#mh').onsubmit=e=>{e.preventDefault();if(money){money.ctl.abort();return}analyze($('#mhIdea').value)};
}
function ideaHtml(i){
  const r=i.res||{};const o=r.oceny||{};
  const num=v=>Math.max(0,Math.min(10,Math.round(Number(v)||0)));
  const vals=[['Popyt',o.popyt],['Wykonalność',o.wykonalnosc],['Niski koszt',o.koszt],['Szybkość',o.czas]].map(([l,v])=>[l,num(v)]);
  const avg=(vals.reduce((s,[,v])=>s+v,0)/4).toFixed(1).replace('.',',');
  return `<article class="panel idea">
    <div style="display:flex;gap:10px;align-items:flex-start"><div style="flex:1;min-width:0"><h3>${esc(r.nazwa||'Pomysł')}</h3><div class="small muted">${esc(i.idea)}</div></div><button class="x" data-delidea="${i.id}" aria-label="Usuń pomysł">${ICON.x}</button></div>
    <div class="score"><b>${avg}</b><span class="small muted">średnia ocena / 10</span></div>
    <div class="bars">${vals.map(([l,v])=>`<div class="bar"><label>${l}<b>${v}</b></label><div><span style="width:${v*10}%"></span></div></div>`).join('')}</div>
    ${r.werdykt?`<div class="verdict">${esc(r.werdykt)}</div>`:''}
    <div class="kv">
      ${r.problem?`<div><b>Problem</b>${esc(r.problem)}</div>`:''}
      ${r.odbiorca?`<div><b>Odbiorca</b>${esc(r.odbiorca)}</div>`:''}
      ${r.test?`<div><b>Najmniejszy test (7 dni)</b>${esc(r.test)}</div>`:''}
      ${r.miara?`<div><b>Miara sukcesu</b>${esc(r.miara)}</div>`:''}
    </div>
    ${Array.isArray(r.ryzyka)&&r.ryzyka.length?`<div class="kv"><div><b>Ryzyka</b></div></div><ul class="risk">${r.ryzyka.slice(0,5).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
    ${r.krok?`<div class="act" style="--a:#34D399"><div class="k">Pierwszy krok</div><div class="v">${esc(r.krok)}</div><div class="bt">${i.added?'<div class="st ok">✓ W zadaniach</div>':`<button class="btn sm" style="background:#34D399;color:#06281c" data-ideatask="${i.id}">Dodaj do zadań</button>`}<button class="btn sm ghost" data-ideachat="${i.id}">Omów z Gods Eye</button></div></div>`:''}
  </article>`;
}
async function analyze(idea){
  idea=(idea||'').trim();if(!idea)return toast('Opisz najpierw pomysł');
  if(!sampleFn)return toast(NO_AI);
  const ctl=new AbortController();money={ctl,draft:idea};render();
  const prompt=`Jesteś Gods Eye, analityczka strategiczna w aplikacji Evoo AI OS. Oceń uczciwie pomysł na zarobek dla ${name()} (Polska).
${context()}

POMYSŁ: """${idea}"""

Odpowiedz wyłącznie jednym obiektem JSON, po polsku, w tym kształcie:
{"nazwa":"krótka nazwa, max 5 słów","problem":"jaki problem rozwiązuje, 1 zdanie","odbiorca":"kto konkretnie zapłaci","test":"najmniejszy test do zrobienia w 7 dni bez kosztów lub z minimalnymi","miara":"liczbowa miara sukcesu testu","ryzyka":["ryzyko 1","ryzyko 2","ryzyko 3"],"oceny":{"popyt":7,"wykonalnosc":6,"koszt":8,"czas":5},"werdykt":"jedno zdanie: robić, zmodyfikować czy odpuścić i dlaczego","krok":"jeden konkretny pierwszy krok na dziś"}
Oceny to liczby całkowite 1–10: popyt (10 = duży, wyraźny popyt), wykonalnosc (10 = łatwe dla jednej osoby), koszt (10 = prawie zero kosztów), czas (10 = szybko do pierwszego przychodu). To Twoja opinia bez danych rynkowych: nie wymyślaj statystyk i nie obiecuj zarobków.`;
  try{
    const res=await sampleFn.json(prompt,{signal:ctl.signal,modelTier:'default',cache:false});
    if(!res||typeof res!=='object'||Array.isArray(res))throw{code:'invalid_json'};
    S.ideas.items.unshift({id:uid(),idea,res,ts:Date.now()});
    if(S.ideas.items.length>40)S.ideas.items.length=40;
    save('ideas');money=null;if(view==='money'){render();$('#mhIdea').value=''}toast('Gods Eye ocenił pomysł');
  }catch(e){
    money=null;if(view==='money'){render();$('#mhIdea').value=idea}
    if(!(e&&e.code==='cancelled'))toast(errText(e));
  }
}

function renderStatus(){
  const el=$('#status');el.className='status '+(aiState==='ok'?'ok':aiState==='off'?'off':'wait');
  el.querySelector('span').textContent=aiState==='ok'?'Online':aiState==='off'?'AI offline':'Łączę…';
  el.title=aiState==='ok'?'Mózg Evoo połączony':aiState==='off'?'Brak połączenia z mózgiem':'Łączenie';
}

/* ---------- events ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.go){go(d.go);return}
  if(d.livep){persona=d.livep;liveSub={user:'',reply:'',err:''};stopListen();stopAudio();setLive('idle');render();return}
  if(d.undo){const [sc,key,mi,ai]=d.undo.split('|');const [acts,sk]=findActs(sc,key,mi);const a=acts&&acts[+ai];if(a&&a.st==='ok'){undoAct(a);save(sk);toast('Cofnięto');if(view==='chat')renderChat();else render()}return}
  if(d.modopen){openModId=d.modopen;render();window.scrollTo(0,0);return}
  if(d.modclose){openModId=null;render();return}
  if(d.moddel){if(!t.dataset.arm){t.dataset.arm=1;t.textContent='Na pewno?';t.style.color='var(--bad)';return}S.modules.items=S.modules.items.filter(x=>x.id!==d.moddel);if(openModId===d.moddel)openModId=null;save('modules');render();return}
  if(d.labsug){labDraft=d.labsug;const ta=$('#labDesc');if(ta)ta.value=d.labsug;return}
  if(d.exp){expSel=d.exp;document.querySelectorAll('[data-exp]').forEach(b=>b.classList.toggle('on',b.dataset.exp===expSel));return}
  if(d.exphand){const x=S.experts.items.find(y=>y.id===d.exphand);if(x)send('evoo','Ekspert „'+(EXPERTS[x.ex]||EXPERTS.biz).n+'” odpowiedział mi na pytanie „'+x.q+'”:\n\n'+x.a.slice(0,3000)+'\n\nCo z tym zrobimy? Zaproponuj konkretne kroki.');return}
  if(d.expdel){S.experts.items=S.experts.items.filter(x=>x.id!==d.expdel);save('experts');render();return}
  if(d.delrule){S.profile.rules=(S.profile.rules||[]).filter(x=>x.id!==d.delrule);save('profile');render();return}
  if(d.export){exportData();return}
  if(d.speak!==undefined){const t=S['chat-'+persona].turns[+d.speak];if(t)speak(t.content,persona,persona+':'+d.speak);return}
  if(d.delevent){S.calendar.items=S.calendar.items.filter(x=>x.id!==d.delevent);save('calendar');render();toast('Usunięto wydarzenie');return}
  if(d.delfin){S.finance.items=S.finance.items.filter(x=>x.id!==d.delfin);save('finance');render();toast('Usunięto wpis');return}
  if(d.fkind){finKind=d.fkind;render();return}
  if(d.mood){jMood=jMood===+d.mood?0:+d.mood;document.querySelectorAll('.mood').forEach(b=>b.classList.toggle('on',+b.dataset.mood===jMood));return}
  if(d.reflect){reflect(d.reflect);return}
  if(d.deljour){if(!t.dataset.arm){t.dataset.arm=1;t.textContent='Na pewno? Usuń';t.style.color='var(--bad)';return}S.journal.items=S.journal.items.filter(x=>x.id!==d.deljour);save('journal');render();return}
  if(d.photoreset){if(S.profile.photos)delete S.profile.photos[d.photoreset];save('profile');$('#logoImg').src=img('evoo');render();return}
  if(d.persona){persona=d.persona;go('chat');return}
  if(d.qa){if(d.qa==='money'||d.qa==='agents'){go(d.qa);return}if(d.send==='1'){send(d.qa,d.text);return}persona=d.qa;go('chat');const ta=$('#msg');ta.value=d.text;ta.focus();return}
  if(d.sug){if(/:\s*$/.test(d.sug)){const ta=$('#msg');ta.value=d.sug;ta.focus()}else send(persona,d.sug);return}
  if(d.toggle){const k=S.tasks.items.find(x=>x.id===d.toggle);if(k){k.done=!k.done;k.doneTs=k.done?Date.now():0;save('tasks');render();if(k.done)toast('Ukończone. Brawo!')}return}
  if(d.deltask){S.tasks.items=S.tasks.items.filter(x=>x.id!==d.deltask);save('tasks');render();toast('Usunięto zadanie');return}
  if(d.delmem){S.memory.items=S.memory.items.filter(x=>x.id!==d.delmem);save('memory');render();toast('Usunięto z pamięci');return}
  if(d.filter){filter=d.filter;render();return}
  if(d.delidea){S.ideas.items=S.ideas.items.filter(x=>x.id!==d.delidea);save('ideas');render();return}
  if(d.delcouncil){S.council.items=S.council.items.filter(x=>x.id!==d.delcouncil);save('council');render();return}
  if(d.delrep){S.library.items=S.library.items.filter(x=>x.id!==d.delrep);save('library');render();return}
  if(d.agent){const r=agentRun[d.agent];if(r){r.ctl.abort();return}runAgent(d.agent);return}
  if(d.plan){planProject(d.plan);return}
  if(d.projchat){const p=S.projects.items.find(x=>x.id===d.projchat);if(p)send('evoo','Porozmawiajmy o projekcie „'+p.name+'”'+(p.goal?' (cel: '+p.goal+')':'')+'. Co jest teraz najważniejszym krokiem?');return}
  if(d.projrisk){const p=S.projects.items.find(x=>x.id===d.projrisk);if(p){go('agents');const inp=document.getElementById('ain-risk');if(inp){inp.value=p.name+(p.goal?' (cel: '+p.goal+')':'');runAgent('risk')}}return}
  if(d.ms){const [pid,mid]=d.ms.split(':');const p=S.projects.items.find(x=>x.id===pid);const m=p&&p.ms.find(x=>x.id===mid);if(m){m.done=!m.done;save('projects');render()}return}
  if(d.delms){const [pid,mid]=d.delms.split(':');const p=S.projects.items.find(x=>x.id===pid);if(p){p.ms=p.ms.filter(x=>x.id!==mid);save('projects');render()}return}
  if(d.delproj){
    if(!t.dataset.arm){t.dataset.arm=1;t.style.color='var(--bad)';t.title='Kliknij ponownie, aby usunąć';toast('Kliknij ponownie, aby usunąć projekt');setTimeout(()=>{if(t.isConnected){delete t.dataset.arm;t.style.color=''}},3000);return}
    S.projects.items=S.projects.items.filter(x=>x.id!==d.delproj);save('projects');render();toast('Usunięto projekt');return}
  if(d.ideatask){const i=S.ideas.items.find(x=>x.id===d.ideatask);if(i&&!i.added){S.tasks.items.push({id:uid(),title:i.res.krok,area:'Finanse',due:todayISO(),done:false,ts:Date.now()});i.added=true;save('tasks');save('ideas');render();toast('Dodano do zadań')}return}
  if(d.ideachat){const i=S.ideas.items.find(x=>x.id===d.ideachat);if(i)send('gods','Omówmy mój pomysł z Money Hunter: „'+(i.res.nazwa||i.idea)+'”. Twoja ocena: '+(i.res.werdykt||'')+' Co powinienem zrobić w tym tygodniu?');return}
  if(d.act){
    const [scope,key,mi,ai,ok]=d.act.split('|');const [acts,saveKey,src]=findActs(scope,key,mi);const a=acts&&acts[+ai];
    if(!a||a.st!=='p')return;
    if(ok==='ok'){const r=applyAct(a,src);if(r===false){a.st='no';a.why='Nie znalazłam takiego zadania'}else{a.ref=r;a.st='ok';toast(ACT_LABEL[a.k][1])}}else a.st='no';
    save(saveKey);
    if(view==='chat')renderChat();else{const open=[...document.querySelectorAll('details.hist')].map(x=>x.open);render();document.querySelectorAll('details.hist').forEach((x,i)=>{if(open[i]!==undefined)x.open=open[i]})}
    return;
  }
});
let lastDesk=window.matchMedia('(min-width:1000px)').matches;
window.addEventListener('resize',()=>{const dsk=window.matchMedia('(min-width:1000px)').matches;if(dsk!==lastDesk){lastDesk=dsk;const nav=$('#nav');if(nav)render()}});



/* ---------- Kalendarz ---------- */
function eventRow(e,compact){
  const past=e.date<todayISO();
  return `<div class="row ${past?'done':''}"><div class="when"><b>${esc(e.time||'—')}</b>${compact?`<span>${esc(dayLabel(e.date))}</span>`:''}</div>
  <div class="grow"><div class="ttl">${esc(e.title)}</div>${e.note?`<div class="meta">${esc(e.note)}</div>`:''}</div>
  <button class="x" data-delevent="${e.id}" aria-label="Usuń wydarzenie">${ICON.x}</button></div>`;
}
function vCalendar(){
  const t=todayISO();
  const all=S.calendar.items.slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  const up=all.filter(e=>e.date>=t),past=all.filter(e=>e.date<t).reverse().slice(0,15);
  const days={};up.forEach(e=>(days[e.date]=days[e.date]||[]).push(e));
  $('#view').innerHTML=H1('','Kalendarz','Wydarzenia i terminy. Evoo widzi najbliższe w każdej rozmowie i może proponować nowe.')+`
  <form class="panel form" id="addEv">
    <input class="field" id="evTitle" placeholder="Co się dzieje? Np. Spotkanie z notariuszem" aria-label="Nazwa wydarzenia" autocomplete="off">
    <div class="r"><input class="field" type="date" id="evDate" value="${t}" aria-label="Data"><input class="field" type="time" id="evTime" aria-label="Godzina"><button class="btn">Dodaj</button></div>
  </form>
  <div class="chips"><button class="chip" style="--ccol:#A855F7" data-qa="evoo" data-send="1" data-text="Spójrz na mój kalendarz i zadania. Ułóż mi realistyczny plan na ten tydzień i wskaż konflikty terminów."><i></i>Ułóż tydzień z Evoo</button></div>
  ${Object.keys(days).length?Object.entries(days).map(([d,evs])=>`<section><div class="sec-h"><h2 class="cap">${esc(dayLabel(d))}</h2><span class="eyebrow">${d}</span></div><div class="panel"><div class="list">${evs.map(e=>eventRow(e)).join('')}</div></div></section>`).join('')
    :`<div class="panel empty">Brak nadchodzących wydarzeń. Dodaj pierwsze powyżej albo powiedz Evoo, co planujesz.</div>`}
  ${past.length?`<details class="hist"><summary><span>Minione</span><span class="small muted" style="flex:none">${past.length}</span></summary><div class="list">${past.map(e=>eventRow(e,true)).join('')}</div></details>`:''}`;
  $('#addEv').onsubmit=e=>{e.preventDefault();const title=$('#evTitle').value.trim(),date=$('#evDate').value;if(!title||!date)return toast('Podaj nazwę i datę');
    S.calendar.items.push({id:uid(),title,date,time:$('#evTime').value||'',ts:Date.now()});save('calendar');render();toast('Dodano do kalendarza')};
}

/* ---------- Finanse ---------- */
const CATS_OUT=['Jedzenie','Dom','Rachunki','Transport','Zdrowie','Rozrywka','Rozwój','Biznes','Rodzina','Inne'];
const CATS_IN=['Wynagrodzenie','Biznes','Nieruchomości','Inwestycje','Inne'];
let finKind='out';
function vFinance(){
  const ym=todayISO().slice(0,7);const m=monthStats(ym);const bal=m.in-m.out;
  const monthName=new Date().toLocaleDateString('pl-PL',{month:'long',year:'numeric'});
  const max=m.cats.length?m.cats[0][1]:0;
  const list=S.finance.items.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))||b.ts-a.ts).slice(0,40);
  $('#view').innerHTML=H1('','Finanse','Przychody i wydatki w złotych. Gods Eye widzi podsumowanie miesiąca i może je przeanalizować.')+`
  <section class="fin-sum">
    <div class="stat"><span class="cap">${esc(monthName)}: przychody</span><b class="in">${fmtPLN(m.in)}</b></div>
    <div class="stat"><span>Wydatki</span><b class="out">${fmtPLN(m.out)}</b></div>
    <div class="stat"><span>Bilans</span><b class="${bal>=0?'in':'out'}">${fmtPLN(bal)}</b></div>
  </section>
  <form class="panel form" id="addFin">
    <div class="seg"><button type="button" class="${finKind==='out'?'on':''}" data-fkind="out">Wydatek</button><button type="button" class="${finKind==='in'?'on':''}" data-fkind="in">Przychód</button></div>
    <div class="r"><input class="field" id="fAmt" inputmode="decimal" placeholder="Kwota, np. 49,90" aria-label="Kwota" autocomplete="off"><select class="field" id="fCat" aria-label="Kategoria">${(finKind==='in'?CATS_IN:CATS_OUT).map(c=>`<option>${c}</option>`).join('')}</select></div>
    <div class="r"><input class="field" id="fNote" placeholder="Opis (opcjonalnie)" aria-label="Opis" autocomplete="off"><input class="field" type="date" id="fDate" value="${todayISO()}" aria-label="Data"><button class="btn">Zapisz</button></div>
  </form>
  ${m.cats.length?`<section class="panel"><div class="sec-h"><h2>Na co idą pieniądze</h2><span class="eyebrow">${esc(monthName)}</span></div><div class="bars1">${m.cats.slice(0,6).map(([c,v])=>`<div class="bar"><label>${esc(c)}<b>${fmtPLN(v)}</b></label><div><span style="width:${max?Math.max(4,Math.round(v/max*100)):0}%"></span></div></div>`).join('')}</div></section>`:''}
  <div class="chips"><button class="chip" style="--ccol:#3B82F6" data-qa="gods" data-send="1" data-text="Przeanalizuj moje finanse w tym miesiącu: gdzie mogę zaoszczędzić, jakie widzisz ryzyka i co zrobić w przyszłym miesiącu?"><i></i>Analiza z Gods Eye</button></div>
  <section><div class="sec-h"><h2>Historia</h2><span class="eyebrow">${S.finance.items.length}</span></div>
    <div class="panel"><div class="list">${list.length?list.map(f=>`<div class="row"><div class="grow"><div class="ttl">${esc(f.note||f.cat)}</div><div class="meta"><span class="tag">${esc(f.cat)}</span><span>${esc(f.date)}</span></div></div><b class="amt ${f.kind}">${f.kind==='in'?'+':'−'}${fmtPLN(f.amount)}</b><button class="x" data-delfin="${f.id}" aria-label="Usuń wpis">${ICON.x}</button></div>`).join('')
      :`<div class="empty">Brak wpisów. Dodaj pierwszy wydatek albo przychód.</div>`}</div></div></section>`;
  $('#addFin').onsubmit=e=>{e.preventDefault();const amount=Math.round(parseFloat($('#fAmt').value.replace(/\s/g,'').replace(',','.'))*100)/100;
    if(!(amount>0))return toast('Podaj kwotę większą od zera');
    S.finance.items.unshift({id:uid(),kind:finKind,amount,cat:$('#fCat').value,note:$('#fNote').value.trim(),date:$('#fDate').value||todayISO(),ts:Date.now()});save('finance');render();toast(finKind==='in'?'Zapisano przychód':'Zapisano wydatek')};
}

/* ---------- Dziennik ---------- */
const MOODS=[[1,'😞','Ciężko'],[2,'🙁','Słabo'],[3,'😐','Neutralnie'],[4,'🙂','Dobrze'],[5,'😄','Świetnie']];
let jMood=0,jDraft='';const reflecting={};
function vJournal(){
  $('#view').innerHTML=H1('','Dziennik','Myśli, nastrój i to, co ważne. Lucy może odpowiedzieć na wpis krótką refleksją.')+`
  <form class="panel form" id="jForm">
    <div class="eyebrow">Jak się dziś czujesz?</div>
    <div class="moods">${MOODS.map(([v,e,l])=>`<button type="button" class="mood ${jMood===v?'on':''}" data-mood="${v}" aria-label="${l}"><span>${e}</span><small>${l}</small></button>`).join('')}</div>
    <textarea class="field" id="jText" placeholder="Co dziś się wydarzyło? Co czujesz? Co chcesz zapamiętać?" aria-label="Wpis">${esc(jDraft)}</textarea>
    <div class="r"><button class="btn ghost" id="jSave" style="flex:0 1 auto">Zapisz</button><button type="button" class="btn" id="jLucy" style="flex:0 1 auto;background:#F59E0B;color:#2a1600">Zapisz i porozmawiaj z Lucy</button></div>
  </form>
  <section style="display:flex;flex-direction:column;gap:10px">${S.journal.items.length?S.journal.items.slice(0,40).map(jHtml).join(''):`<div class="panel empty">Dziennik jest pusty. Pierwszy wpis może mieć jedno zdanie.</div>`}</section>`;
  const ta=$('#jText');ta.oninput=()=>jDraft=ta.value;
  const add=()=>{const text=ta.value.trim();if(!text&&!jMood){toast('Napisz kilka słów albo wybierz nastrój');return null}
    const e={id:uid(),date:todayISO(),mood:jMood||0,text,ts:Date.now()};S.journal.items.unshift(e);if(S.journal.items.length>300)S.journal.items.length=300;save('journal');jDraft='';jMood=0;return e};
  $('#jForm').onsubmit=e=>{e.preventDefault();if(add()){render();toast('Zapisano w dzienniku')}};
  $('#jLucy').onclick=()=>{const e=add();if(e){render();reflect(e.id)}};
}
function jHtml(j){
  const m=MOODS.find(x=>x[0]===j.mood);
  const r=reflecting[j.id];
  return `<article class="panel jentry"><div class="sec-h" style="margin:0"><div class="eyebrow">${esc(dayLabel(j.date))} · ${new Date(j.ts).toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})}</div>${m?`<span class="mood-tag">${m[1]} ${m[2]}</span>`:''}</div>
    ${j.text?`<p>${esc(j.text).replace(/\n/g,'<br>')}</p>`:''}
    ${j.reflection||r?`<div class="refl" id="refl-${j.id}"><div class="h"><img src="${img('lucy')}" alt=""><b>Lucy</b></div>${bodyHtml(j.reflection||(r&&r.text)||'')||'<div class="think"><i></i><i></i><i></i></div>'}</div>`
      :`<button class="link" data-reflect="${j.id}" style="color:#F59E0B;align-self:flex-start">Poproś Lucy o refleksję</button>`}
    <div><button class="link" data-deljour="${j.id}" style="color:var(--dim)">Usuń wpis</button></div></article>`;
}
async function reflect(id){
  const j=S.journal.items.find(x=>x.id===id);if(!j||reflecting[id])return;
  if(!sampleFn)return toast(NO_AI);
  reflecting[id]={text:''};if(view==='journal')render();
  const m=MOODS.find(x=>x[0]===j.mood);
  const prompt=fill(P.lucy.soul)+'\n\nTo wpis z dziennika '+name()+(m?' (nastrój: '+m[2]+')':'')+':\n„'+(j.text||'(bez tekstu)')+'”\n\nOdpowiedz jako Lucy, po polsku, 3–5 zdań: nazwij, co słyszysz, dodaj jedną ciepłą obserwację i zakończ jednym pytaniem do refleksji. Bez rad na siłę, bez list i bez bloków action.';
  try{
    const r=await sampleFn(prompt,{modelTier:'quick',onText:({text})=>{reflecting[id].text=text;const el=document.getElementById('refl-'+id);if(el)el.innerHTML=`<div class="h"><img src="${img('lucy')}" alt=""><b>Lucy</b></div>`+bodyHtml(text)}});
    j.reflection=r.text;save('journal');
  }catch(e){toast(errText(e))}
  delete reflecting[id];if(view==='journal')render();
}

/* ---------- Głos ---------- */
const canSpeak='speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';
const SR=window.SpeechRecognition||window.webkitSpeechRecognition||null;
const VOICE={evoo:[1,1],jinx:[1.25,1.08],lucy:[1.05,.95],gods:[.8,.97]};
let speakingId=null;
function plainForSpeech(t){
  return parts(t).filter(p=>p.t==='text').map(p=>p.v).join(' ').replace(/\*\*|`|#+\s|^\s*[-*•]\s+/gm,'').replace(/\s+/g,' ').trim();
}
function speak(text,pid,id){
  if(id&&speakingId===id){speakingId=null;stopAudio();return}
  speakingId=id||null;unlockAudio();say(text,pid).then(()=>{if(speakingId===id)speakingId=null});
}
let rec=null;
function stopDictation(){try{rec&&rec.stop()}catch(e){}rec=null;const b=$('#micBtn');if(b)b.classList.remove('rec')}
function toggleDictation(ta,fit){
  if(rec){stopDictation();return}
  try{
    rec=new SR();rec.lang='pl-PL';rec.interimResults=true;rec.continuous=false;
    const base=ta.value?ta.value.replace(/\s*$/,' '):'';
    rec.onresult=e=>{let t='';for(const r of e.results)t+=r[0].transcript;ta.value=base+t;fit()};
    rec.onerror=e=>{toast(e.error==='not-allowed'?'Zezwól na mikrofon w ustawieniach przeglądarki':'Dyktowanie przerwane');stopDictation()};
    rec.onend=()=>stopDictation();
    rec.start();$('#micBtn').classList.add('rec');
  }catch(e){toast('Dyktowanie niedostępne');rec=null}
}

/* ---------- Zdjęcia person i łańcuch modeli ---------- */
function resizeImage(file,size=320){
  return new Promise((res,rej)=>{const fr=new FileReader();fr.onerror=rej;fr.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{
    const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
    const s=Math.min(im.width,im.height);x.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,size,size);res(c.toDataURL('image/jpeg',.85))};im.src=fr.result};fr.readAsDataURL(file)});
}
document.addEventListener('change',async e=>{
  if(e.target&&e.target.dataset&&e.target.dataset.import&&e.target.files&&e.target.files[0]){importData(e.target.files[0]);return}
  const pid=e.target&&e.target.dataset&&e.target.dataset.photo;if(!pid||!e.target.files||!e.target.files[0])return;
  try{const url=await resizeImage(e.target.files[0]);S.profile.photos=S.profile.photos||{};S.profile.photos[pid]=url;save('profile');$('#logoImg').src=img('evoo');render();toast('Nowe zdjęcie: '+P[pid].name)}
  catch(err){toast('Nie udało się wczytać zdjęcia')}
});
async function loadChains(){
  const el=$('#chains');if(!el)return;
  if(isDirect()){const names={quick:'Szybki',default:'Zrównoważony',complex:'Głęboki'};el.innerHTML=Object.keys(names).map(t=>{const c=directChain(t);return `<div style="margin-bottom:6px"><b style="color:var(--text)">${names[t]}:</b> ${c.length?c.map(x=>esc(x.label+' · '+x.model)).join(' → '):'brak kluczy'}</div>`}).join('');return}
  if(!CFG.key)return;
  try{const r=await api('/api/models');const j=await r.json();if(!j.chains)throw 0;
    const names={quick:'Szybki',default:'Zrównoważony',complex:'Głęboki'};
    el.innerHTML=Object.entries(j.chains).map(([t,c])=>`<div style="margin-bottom:6px"><b style="color:var(--text)">${names[t]||t}:</b> ${c.length?c.map(x=>esc(x.provider+' · '+x.model)).join(' → '):'brak modeli'}</div>`).join('');
  }catch(e){el.textContent='Nie udało się pobrać łańcucha modeli.'}
}


/* =====================================================================
   EVOO 2.0 — żywa Evoo, autopilot, Warsztat, Rozwój, Eksperci, tryby myślenia
   ===================================================================== */

/* ---------- Sposoby myślenia (rozpoznawanie intencji lokalnie, bez wysyłania) ---------- */
const MODES={auto:'Automatycznie',chat:'Rozmowa',analysis:'Analiza',plan:'Plan',summary:'Podsumowanie'};
const FRAMES={
  decyzja:['Macierz decyzyjna','Wypisz opcje i kryteria z wagami, oceń każdą opcję w skali 1–5 i policz wynik.'],
  ryzyko:['Pre-mortem','Załóż, że za rok to się nie udało. Wypisz najbardziej prawdopodobne przyczyny i jak im zapobiec teraz.'],
  problem:['Pierwsze zasady','Rozbij problem na podstawowe fakty, odrzuć założenia i zbuduj rozwiązanie od zera.'],
  priorytet:['Macierz Eisenhowera','Podziel sprawy na: pilne i ważne, ważne niepilne, pilne nieważne, nieważne i niepilne.'],
  pomysl:['SWOT','Mocne strony, słabe strony, szanse, zagrożenia, a na końcu jeden wniosek.'],
  efekt:['Zasada 80/20','Wskaż 20% działań, które dadzą 80% efektu, i co odpuścić.']
};
function detectMode(text){
  const t=norm(text||'');
  if(/podsumuj|strescz|w skrocie|tl;?dr|najwazniejsze punkty/.test(t))return {m:'summary'};
  if(/przeanalizuj|analiz|za i przeciw|czy warto|porownaj|decyzj|wybrac|ryzyk|oplaca|co wybrac|priorytet/.test(t)){
    const f=/ryzyk|co moze pojsc|zagroz/.test(t)?'ryzyko':/priorytet|najpierw|pilne|co jest wazniejsze/.test(t)?'priorytet':/pomysl|biznes|produkt|startup/.test(t)?'pomysl':/efekt|najwiecej|80/.test(t)?'efekt':/decyzj|wybrac|czy warto|porownaj|albo|czy lepiej/.test(t)?'decyzja':'problem';
    return {m:'analysis',f};
  }
  if(/rozpisz|zaplanuj|plan |plan$|harmonogram|krok po kroku|jak zaczac|strategi|roadmap/.test(t))return {m:'plan'};
  return {m:'chat'};
}
function pickMode(text){
  const pref=S.profile.mode||'auto';
  if(pref==='auto')return detectMode(text);
  if(pref==='analysis'){const d=detectMode(text);return {m:'analysis',f:d.f||'decyzja'}}
  return {m:pref};
}
function modeHint(r){
  if(!r||r.m==='chat')return '';
  if(r.m==='analysis'){const f=FRAMES[r.f]||FRAMES.decyzja;return `\n\nTRYB: ANALIZA. Użyj koncepcji „${f[0]}”: ${f[1]} Zacznij od jednej linijki „Koncepcja: ${f[0]}”. Krótkie sekcje, konkret, na końcu rekomendacja.`}
  if(r.m==='plan')return '\n\nTRYB: PLAN. Podaj cel, 3–7 kroków w kolejności z orientacyjnym czasem, pierwszy krok na dziś i jedno ryzyko. Dodaj zadania blokami action.';
  if(r.m==='summary')return '\n\nTRYB: PODSUMOWANIE. Najwyżej 5 krótkich punktów i jedno zdanie wniosku.';
  return '';
}
const modeLabel=r=>!r||r.m==='chat'?'':MODES[r.m]+(r.m==='analysis'&&r.f&&FRAMES[r.f]?' · '+FRAMES[r.f][0]:'');

/* ---------- Rozwój: zasady, których nauczył się zespół ---------- */
function rulesExtra(pid){
  const rules=(S.profile.rules||[]).filter(r=>r.pid===pid||r.pid==='all');
  return rules.length?`\n\nZASADY OD ${name().toUpperCase()} (zatwierdzone, przestrzegaj ich zawsze):\n`+rules.map(r=>'- '+r.text).join('\n'):'';
}
function policy(){
  return S.profile.autopilot===false
    ?'Nic nie dzieje się bez zgody {n}. Zadania, wydarzenia, projekty, wpisy finansów i pamięci tylko PROPONUJESZ blokami action; aplikacja pokaże przycisk „Zatwierdź”. Nie twierdź, że coś zapisałaś, zanim {n} zatwierdzi.'
    :'Działasz, a nie tylko doradzasz. Gdy {n} prosi, żeby coś dodać, zapisać, zaplanować, wpisać wydatek albo oznaczyć jako zrobione, od razu dołącz blok action. Aplikacja wykona go natychmiast, a {n} może to cofnąć jednym kliknięciem. Nie pytaj o zgodę na takie działania, napisz krótko, co zrobiłaś. Moduły i ulepszenia własnego zachowania tylko proponujesz: one zawsze czekają na zatwierdzenie.';
}

/* ---------- Autopilot z Cofnij ---------- */
const AUTO_KINDS=new Set(['task','event','proj','mem','money','done']);
function autoApply(acts,src){
  if(S.profile.autopilot===false||!acts)return 0;
  let n=0;
  for(const a of acts){if(a.st!=='p'||!AUTO_KINDS.has(a.k))continue;const ref=applyAct(a,src);if(ref===false){a.st='no';a.why='Nie znalazłam takiego zadania';continue}a.ref=ref;a.st='ok';a.auto=true;n++}
  if(n)toast(n===1?'Evoo wykonała 1 działanie':'Evoo wykonała działania: '+n);
  return n;
}
function undoAct(a){
  const r=a.ref;if(!r)return;
  if(r.k==='done'){const t=S.tasks.items.find(x=>x.id===r.id);if(t){t.done=false;t.doneTs=0}save('tasks')}
  else if(r.k==='mem'){S.memory.items=S.memory.items.filter(x=>x.id!==r.id);save('memory')}
  else if(r.k==='rule'){S.profile.rules=(S.profile.rules||[]).filter(x=>x.id!==r.id);save('profile')}
  else if(S[r.key]){S[r.key].items=S[r.key].items.filter(x=>x.id!==r.id);save(r.key)}
  a.st='undone';
}

/* ---------- Eksperci ---------- */
const EXPERTS={
  biz:{n:'Biznes i pomysły',c:'#A855F7',k:/biznes|pomysl|sprzedaz|klient|marketing|produkt|firm|startup|oferta|cena|zarob/,p:'Jesteś doświadczonym przedsiębiorcą i doradcą biznesowym. Myślisz w kategoriach problemu klienta, testu rynkowego i marży. Dajesz konkretne kroki, liczby jako jawne szacunki i jeden najmniejszy test.'},
  fin:{n:'Finanse i inwestycje',c:'#34D399',k:/pieniad|inwest|oszczed|kredyt|podatk|budzet|gield|krypto|emerytur|lokat|etf|akcj|odsetk/,p:'Jesteś analitykiem finansowym. Liczysz dokładnie i pokazujesz rachunek, rozróżniasz fakty od założeń, mówisz o ryzyku i kosztach. Dajesz informacje i opcje, nie rekomendacje zakupu konkretnych instrumentów; decyzja należy do użytkownika.'},
  re:{n:'Nieruchomości',c:'#22D3EE',k:/mieszkan|nieruchom|najem|wynajem|dzialk|hipotek|czynsz|deweloper|flip|lokal/,p:'Jesteś ekspertem rynku nieruchomości w Polsce: zakup, najem, flipy, rentowność, koszty transakcyjne, kredyt. Liczysz rentowność brutto i netto, wskazujesz pułapki i co sprawdzić przed decyzją.'},
  law:{n:'Prawo (informacje)',c:'#F59E0B',k:/umow|prawn|sad|pozew|urzad|regulamin|rodo|spadek|testament|wypowiedzen|kodeks|reklamac/,p:'Jesteś prawnikiem objaśniającym polskie prawo prostym językiem. Dajesz informacje ogólne i możliwe kroki, nie poradę prawną w konkretnej sprawie. Zawsze mówisz, kiedy warto skonsultować się z adwokatem lub radcą prawnym.'},
  health:{n:'Zdrowie i trening',c:'#FB7185',k:/zdrow|trening|diet|sen|spac|cwicz|bol|lekarz|wag|silown|bieg|kalor|suplement/,p:'Jesteś trenerem i edukatorem zdrowia. Dajesz bezpieczne, ogólne wskazówki o treningu, śnie i nawykach. Nie diagnozujesz i nie dobierasz leków; przy niepokojących objawach kierujesz do lekarza, w nagłej sytuacji na 112.'},
  psy:{n:'Psycholog (wsparcie)',c:'#F472B6',k:/stres|lek |lekam|smut|relacj|emocj|motywac|wypalen|zwiazek|samotn|zlosc|przytloczon/,p:'Jesteś empatycznym psychologiem wspierającym. Słuchasz, nazywasz emocje, proponujesz małe, sprawdzone techniki. Nie diagnozujesz. Przy kryzysie lub myślach o zrobieniu sobie krzywdy kierujesz łagodnie do pomocy: Kryzysowy Telefon Zaufania 116 123, w nagłej sytuacji 112.'},
  mech:{n:'Mechanik i technika',c:'#94A3B8',k:/auto|samoch|silnik|napraw|usterk|opon|olej|hamulc|akumulator|skrzyni|rower/,p:'Jesteś doświadczonym mechanikiem. Pytasz o objawy, podajesz najbardziej prawdopodobne przyczyny od najtańszej do najdroższej, co sprawdzić samemu i kiedy jechać do warsztatu. Zawsze dbasz o bezpieczeństwo.'},
  tech:{n:'Technologia i kod',c:'#3B82F6',k:/kod|program|aplikac|komputer|telefon|serwer|stron|javascript|python|convex|github|bug|blad w/,p:'Jesteś starszym inżynierem oprogramowania. Tłumaczysz jasno, dajesz działający kod w blokach, wskazujesz bezpieczne praktyki i najprostsze rozwiązanie.'}
};
function autoExpert(q){const t=norm(q||'');for(const [id,e] of Object.entries(EXPERTS))if(e.k.test(t))return id;return 'biz'}

/* ---------- Studio YouTube (agenci Jinx) ---------- */
AGENTS.push(
  {id:'yt',pid:'jinx',name:'Studio YouTube',desc:'Pełny scenariusz filmu: hook, struktura, wezwanie do działania, 5 tytułów, 3 pomysły na miniaturę, opis i tagi.',input:'Kanał i temat, np. AI dla przedsiębiorców: 5 automatyzacji',
    prompt:v=>`Wykonaj zadanie agenta „Studio YouTube”. Kanał i temat: ${v}.
Jako doświadczona producentka i scenarzystka YouTube przygotuj: 1) 5 tytułów (krótkie, z ciekawością), 2) 3 koncepcje miniatury (co na obrazie, 2–4 słowa tekstu), 3) scenariusz 8–10 min: hook w pierwszych 15 sekundach, zapowiedź wartości, 3–5 segmentów z punktami do powiedzenia i pomysłami na b-roll, wezwanie do działania, zakończenie, 4) opis z rozdziałami (znaczniki czasu jako szacunki), 5) 15 tagów. Zaproponuj 1 zadanie blokiem action: nagranie filmu.`},
  {id:'shorts',pid:'jinx',name:'Shorts i Reels',desc:'5 krótkich scenariuszy do 45 sekund: hook, ujęcia, tekst na ekranie i podpis.',input:'Temat serii, np. Evoo AI OS w 30 sekund',
    prompt:v=>`Wykonaj zadanie agenta „Shorts i Reels”. Temat: ${v}.
Napisz 5 scenariuszy do 45 sekund. Dla każdego: hook (pierwsze 2 sekundy), ujęcia z czasem, tekst na ekranie, lektor, podpis z hashtagami. Na końcu wskaż, od którego zacząć i dlaczego.`}
);

/* ---------- Głos naturalny (Gemini TTS) z zapasem ---------- */
let AC=null,curSrc=null,sayToken=0,ttsFailUntil=0;
const TTS_MODELS=['gemini-3.8-flash-tts','gemini-3.8-flash-lite-tts','gemini-2.5-flash-preview-tts'];
const VOICES={evoo:['Kore','Powiedz ciepło, pewnie i naturalnie, jak bliska asystentka'],jinx:['Leda','Powiedz energicznie, radośnie i z uśmiechem'],lucy:['Sulafat','Powiedz spokojnie, łagodnie i z empatią'],gods:['Despina','Powiedz spokojnie, precyzyjnie i rzeczowo']};
function unlockAudio(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}}
function hasNaturalVoice(){
  if(Date.now()<ttsFailUntil)return false;
  if(typeof isDirect==='function'&&isDirect())return !!gkeys().gemini;
  return !!(CFG.key&&providers&&providers.gemini);
}
function splitSpeech(text){
  const t=plainForSpeech(text).slice(0,1600);if(!t)return [];
  const sents=t.match(/[^.!?…]+[.!?…]*\s*/g)||[t];const out=[];let cur='';
  for(const s of sents){if((cur+s).length>300&&cur){out.push(cur.trim());cur=''}cur+=s}
  if(cur.trim())out.push(cur.trim());return out;
}
async function ttsAudio(text,pid){
  const [voice,style]=VOICES[pid]||VOICES.evoo;const prompt=style+': '+text;
  if(!(typeof isDirect==='function'&&isDirect())&&CFG.key){
    const r=await api('/api/tts',{method:'POST',body:JSON.stringify({text:prompt,voice})});if(!r.ok)throw 0;return await r.json();
  }
  const k=gkeys().gemini;if(!k)throw 0;
  for(const m of TTS_MODELS){
    try{
      const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+m+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':k},
        body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:voice}}}}})});
      if(!r.ok)continue;const j=await r.json();
      const part=((j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).find(p=>p.inlineData);
      if(part)return {data:part.inlineData.data,mime:part.inlineData.mimeType||''};
    }catch(e){}
  }
  throw 0;
}
async function audioBuffer(a){
  if(/wav|mpeg|mp3|ogg|webm/i.test(a.mime)){const bin=atob(a.data);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return await AC.decodeAudioData(u.buffer)}
  const rate=+((/rate=(\d+)/.exec(a.mime||'')||[])[1]||24000);const bin=atob(a.data);const n=bin.length>>1;
  const buf=AC.createBuffer(1,n,rate);const ch=buf.getChannelData(0);
  for(let i=0;i<n;i++){let v=bin.charCodeAt(2*i)|(bin.charCodeAt(2*i+1)<<8);if(v>=32768)v-=65536;ch[i]=v/32768}
  return buf;
}
function playBuffer(buf,my){
  return new Promise(res=>{
    try{
      const src=AC.createBufferSource();src.buffer=buf;const an=AC.createAnalyser();an.fftSize=256;src.connect(an);an.connect(AC.destination);
      curSrc=src;const data=new Uint8Array(an.frequencyBinCount);
      const tick=()=>{if(curSrc!==src)return;an.getByteFrequencyData(data);let s=0;for(const v of data)s+=v;const lvl=Math.min(1,s/data.length/90);const o=$('#orb');if(o)o.style.setProperty('--lvl',lvl.toFixed(2));requestAnimationFrame(tick)};
      src.onended=()=>{if(curSrc===src)curSrc=null;const o=$('#orb');if(o)o.style.setProperty('--lvl','0');res()};
      src.start();tick();
    }catch(e){res()}
  });
}
function stopAudio(){sayToken++;try{curSrc&&curSrc.stop()}catch(e){}curSrc=null;try{canSpeak&&speechSynthesis.cancel()}catch(e){}}
function sayBrowser(text,pid,my){
  return new Promise(res=>{
    if(!canSpeak)return res();
    try{
      const u=new SpeechSynthesisUtterance(plainForSpeech(text).slice(0,3000));u.lang='pl-PL';
      const v=speechSynthesis.getVoices().find(x=>/^pl/i.test(x.lang));if(v)u.voice=v;
      const pr=VOICE[pid]||[1,1];u.pitch=pr[0];u.rate=pr[1];
      let pulse=setInterval(()=>{const o=$('#orb');if(o)o.style.setProperty('--lvl',(0.25+Math.random()*0.5).toFixed(2))},140);
      const done=()=>{clearInterval(pulse);const o=$('#orb');if(o)o.style.setProperty('--lvl','0');res()};
      u.onend=done;u.onerror=done;speechSynthesis.speak(u);
    }catch(e){res()}
  });
}
async function say(text,pid){
  stopAudio();const my=++sayToken;
  const chunks=splitSpeech(text);if(!chunks.length)return;
  unlockAudio();
  if(!AC||!hasNaturalVoice())return sayBrowser(chunks.join(' '),pid,my);
  let next=ttsAudio(chunks[0],pid);
  for(let i=0;i<chunks.length;i++){
    let a;
    try{a=await next}catch(e){if(i===0){ttsFailUntil=Date.now()+5*60*1000;if(my===sayToken)return sayBrowser(chunks.join(' '),pid,my)}return}
    if(my!==sayToken)return;
    if(i+1<chunks.length)next=ttsAudio(chunks[i+1],pid);
    let buf;try{buf=await audioBuffer(a)}catch(e){continue}
    if(my!==sayToken)return;
    await playBuffer(buf,my);
    if(my!==sayToken)return;
  }
}

/* ---------- Żywa Evoo (rozmowa głosowa z avatarem) ---------- */
let liveState='idle',liveLoop=false,liveRec=null,liveSub={user:'',reply:'',err:''};
const LSTATE={idle:()=>SR?'Dotknij mikrofonu i mów':'Napisz, a odpowiem głosem',listening:()=>'Słucham…',thinking:()=>'Myślę…',speaking:()=>'Mówię…'};
function setLive(s){liveState=s;const o=$('#orb');if(o)o.className='orb '+s;const l=$('#lstate');if(l)l.textContent=LSTATE[s]();const b=$('#lTalk');if(b)b.classList.toggle('rec',s==='listening')}
function subsHtml(){
  return (liveSub.user?`<div class="you">${esc(liveSub.user)}</div>`:'')+(liveSub.reply?`<div class="her">${bodyHtml(liveSub.reply)}</div>`:'')+(liveSub.err?`<div class="err">${esc(liveSub.err)}</div>`:'');
}
function updSubs(){const el=$('#subs');if(el){el.innerHTML=subsHtml();el.scrollTop=el.scrollHeight}}
function vLive(){
  const p=P[persona];
  $('#view').innerHTML=`<section class="live" style="--pcol:${p.color}">
    <div class="ptabs">${ORDER.map(id=>`<button class="ptab ${id===persona?'on':''}" style="--pcol:${P[id].color}" data-livep="${id}"><img src="${img(id)}" alt="">${P[id].name}</button>`).join('')}</div>
    <div class="stage">
      <div class="orb ${liveState}" id="orb"><i class="ring r1"></i><i class="ring r2"></i><img src="${img(persona)}" alt="${p.name}"></div>
      <h2>${p.name}</h2><div class="lstate" id="lstate">${LSTATE[liveState]()}</div>
    </div>
    <div class="subs" id="subs">${subsHtml()||`<div class="muted center small">${esc(fill(p.hello))}</div>`}</div>
    <div class="lctl">
      <button type="button" class="btn ghost sm" id="lLoop" aria-pressed="${liveLoop}" title="Po mojej odpowiedzi od razu słucham dalej">Ciągła</button>
      <button type="button" class="talk ${liveState==='listening'?'rec':''}" id="lTalk" aria-label="${SR?'Mów':'Wyślij'}">${SR?ICON.mic:ICON.send}</button>
      <button type="button" class="btn ghost sm" id="lStop">Przerwij</button>
    </div>
    <form class="mini" id="lForm"><input id="lIn" placeholder="${SR?'Albo napisz…':'Napisz do '+esc(p.name)+'…'}" aria-label="Wiadomość" autocomplete="off"><button class="icon-btn" aria-label="Wyślij">${ICON.send}</button></form>
    <div class="small muted center">${hasNaturalVoice()?'Naturalny głos Gemini':'Głos przeglądarki'} · ${SR?'mikrofon gotowy':'dyktuj mikrofonem na klawiaturze'}</div>
  </section>`;
  $('#lTalk').onclick=()=>{unlockAudio();if(!SR){const v=$('#lIn').value.trim();if(v){$('#lIn').value='';liveAsk(v)}else $('#lIn').focus();return}
    if(liveState==='listening'){stopListen();return}if(liveState==='speaking')stopAudio();if(liveState==='thinking')return;listen()};
  $('#lStop').onclick=()=>{liveLoop=false;stopListen();stopAudio();if(busy)busy.abort();setLive('idle');render()};
  $('#lLoop').onclick=()=>{liveLoop=!liveLoop;render()};
  $('#lForm').onsubmit=e=>{e.preventDefault();unlockAudio();const v=$('#lIn').value.trim();if(!v)return;$('#lIn').value='';liveAsk(v)};
}
function stopListen(){try{liveRec&&liveRec.abort()}catch(e){}liveRec=null;if(liveState==='listening')setLive('idle')}
function listen(){
  if(!SR)return;stopAudio();
  try{
    const rec=new SR();liveRec=rec;rec.lang='pl-PL';rec.interimResults=true;rec.continuous=false;let finalText='';
    rec.onresult=e=>{let t='';for(const r of e.results){t+=r[0].transcript;if(r.isFinal)finalText=t}liveSub={user:t,reply:'',err:''};updSubs()};
    rec.onerror=e=>{if(e.error==='not-allowed'){toast('Zezwól na mikrofon w ustawieniach przeglądarki');liveLoop=false}};
    rec.onend=()=>{if(liveRec!==rec)return;liveRec=null;const t=(finalText||liveSub.user||'').trim();if(t&&liveState==='listening')liveAsk(t);else setLive('idle')};
    rec.start();liveSub={user:'',reply:'',err:''};updSubs();setLive('listening');
  }catch(e){toast('Mikrofon niedostępny');setLive('idle')}
}
async function liveAsk(text){
  if(busy)return;
  liveSub={user:text,reply:'',err:''};updSubs();setLive('thinking');
  const reply=await send(persona,text,{stay:true,onText:t=>{liveSub.reply=t;updSubs()}});
  if(!reply||reply.error){liveSub.err=reply?reply.error:'';updSubs();setLive('idle');return}
  liveSub.reply=reply.content;updSubs();
  if(view!=='live'){setLive('idle');return}
  setLive('speaking');await say(reply.content,persona);
  if(liveState==='speaking')setLive('idle');
  if(liveLoop&&view==='live'&&liveState==='idle')listen();
}

/* ---------- Warsztat modułów ---------- */
const MOD_SYS=`Tworzysz moduł (mini-aplikację) do Evoo AI OS jako JEDEN kompletny dokument HTML z wbudowanym CSS i JavaScript.
Wymagania:
- Interfejs po polsku, mobile-first (szerokość 360–430 px), czytelny, duże pola i przyciski.
- Ciemny motyw Evoo: tło #090D16, karty #0E1322, ramki rgba(255,255,255,.08), tekst #EEF1FA, tekst przygaszony #9AA3BC, akcent #A855F7, sukces #34D399, błąd #F87171. Zaokrąglenia 14px, font system-ui.
- Bez zewnętrznych bibliotek, czcionek, obrazów z sieci i bez fetch. Wszystko w jednym pliku.
- Dane zapisuj WYŁĄCZNIE przez: const dane = await evooStore.load() (obiekt albo null) oraz evooStore.save(obiekt). Nie używaj localStorage. Wczytaj dane przy starcie i zapisuj po każdej zmianie.
- Bez alert, confirm i prompt. Komunikaty pokazuj w interfejsie.
- Kod ma działać od razu i bez błędów. Kwoty w złotych, daty po polsku.
Odpowiedz wyłącznie dokumentem HTML w jednym bloku kodu \`\`\`html.`;
const BRIDGE='<script>(function(){var n=0,w={};window.evooStore={load:function(){return new Promise(function(r){var i=++n;w[i]=r;parent.postMessage({evoo:"load",i:i},"*");setTimeout(function(){if(w[i]){w[i](null);delete w[i]}},3000)})},save:function(d){parent.postMessage({evoo:"save",d:d},"*");return Promise.resolve(true)}};window.addEventListener("message",function(e){var m=e.data||{};if(m.evoo==="loaded"&&w[m.i]){w[m.i](m.d);delete w[m.i]}});})();<\/script>';
let labRun=null,openModId=null,labDraft='';
function moduleDoc(html){return /<head[^>]*>/i.test(html)?html.replace(/<head[^>]*>/i,m=>m+BRIDGE):BRIDGE+html}
function extractHtml(t){const m=String(t||'').match(/```html\s*([\s\S]*?)```/i)||String(t||'').match(/```\s*(<!doctype[\s\S]*?)```/i);if(m)return m[1].trim();const i=String(t||'').search(/<!doctype|<html/i);return i>=0?String(t).slice(i).trim():''}
async function buildModule(nameIn,desc,baseId){
  if(!sampleFn)return toast(NO_AI);
  if(labRun)return toast('Warsztat już pracuje nad modułem');
  const base=baseId?S.modules.items.find(x=>x.id===baseId):null;
  const nm=(nameIn||(base&&base.name)||desc.split(/[.,\n]/)[0]).trim().slice(0,48)||'Nowy moduł';
  const ctl=new AbortController();labRun={name:nm,len:0,ctl};if(view==='lab')render();else go('lab');
  const prompt=MOD_SYS+(base?`\n\nOto obecny kod modułu „${base.name}”:\n\`\`\`html\n${base.html.slice(0,60000)}\n\`\`\`\nWprowadź zmiany: ${desc}\nZachowaj istniejące dane i działanie, zwróć cały poprawiony dokument.`:`\n\nModuł: „${nm}”.\nOpis od ${name()}: ${desc}`);
  try{
    const r=await sampleFn(prompt,{modelTier:'complex',signal:ctl.signal,onText:({text})=>{if(labRun){labRun.len=text.length;const el=$('#labLen');if(el)el.textContent=text.length.toLocaleString('pl-PL')+' znaków kodu'}}});
    const html=extractHtml(r.text);if(!html||html.length<200)throw {code:'bad_module'};
    if(base){base.html=html;base.ver=(base.ver||1)+1;base.desc=base.desc+' · '+desc;base.ts=Date.now()}
    else S.modules.items.unshift({id:uid(),name:nm,desc,html,ver:1,data:null,ts:Date.now()});
    if(JSON.stringify(S.modules).length>900000){toast('Warsztat jest pełny. Usuń jakiś moduł.');if(!base)S.modules.items.shift()}
    else{save('modules');toast(base?'Poprawiono moduł':'Moduł gotowy');openModId=base?base.id:S.modules.items[0].id}
  }catch(e){toast(e&&e.code==='bad_module'?'Model nie oddał poprawnego kodu. Spróbuj ponownie albo opisz moduł prościej.':e&&e.code==='cancelled'?'Przerwano budowę':errText(e))}
  labRun=null;if(view==='lab')render();
}
function vLab(){
  const sug=['Licznik nawyków z serią dni','Kalkulator rentowności mieszkania na wynajem','Lista zakupów z kategoriami','Tracker treningów siłowych','Kalkulator ceny produktu z marżą','Planer posiłków na tydzień'];
  const open=openModId&&S.modules.items.find(x=>x.id===openModId);
  $('#view').innerHTML=H1('Warsztat','Evoo buduje dla Ciebie nowe moduły','Opisz narzędzie, którego brakuje. Evoo napisze mini-aplikację, która zapisuje swoje dane i działa w bezpiecznej piaskownicy.','#C084FC')+`
  ${open?`<section class="modview"><div class="sec-h"><h2>${esc(open.name)}</h2><button class="link" data-modclose="1">Zamknij</button></div>
    <iframe id="modFrame" title="${esc(open.name)}" sandbox="allow-scripts allow-forms" srcdoc="${esc(moduleDoc(open.html))}"></iframe>
    <form class="mini" id="modFix" style="margin:0"><input id="modFixIn" placeholder="Co poprawić? Np. dodaj wykres tygodnia" aria-label="Poprawka" autocomplete="off"><button class="icon-btn" aria-label="Popraw">${ICON.send}</button></form></section>`:''}
  <form class="panel form" id="labForm">
    <textarea class="field" id="labDesc" placeholder="Np. Licznik nawyków: 3 nawyki, odhaczanie dnia, seria dni, procent w tym miesiącu" aria-label="Opis modułu">${esc(labDraft)}</textarea>
    <div class="chips">${sug.map(s=>`<button type="button" class="chip" data-labsug="${esc(s)}"><i></i>${esc(s)}</button>`).join('')}</div>
    <div><button class="btn" id="labBtn">${labRun?'Przerwij budowę':'Zbuduj moduł'}</button></div>
    ${labRun?`<div class="small muted" style="display:flex;gap:8px;align-items:center"><div class="think"><i></i><i></i><i></i></div>Buduję „${esc(labRun.name)}”: <span id="labLen">${labRun.len?labRun.len.toLocaleString('pl-PL')+' znaków kodu':'myślę nad projektem'}</span>. To trwa zwykle 30–90 sekund.</div>`:''}
  </form>
  <section style="display:flex;flex-direction:column;gap:10px"><div class="sec-h"><h2>Twoje moduły</h2><span class="eyebrow">${S.modules.items.length}</span></div>
    ${S.modules.items.length?S.modules.items.map(m=>`<article class="panel modcard"><div style="flex:1;min-width:0"><b>${esc(m.name)}</b><div class="small muted">${esc(m.desc).slice(0,140)}</div><div class="meta"><span class="tag">wersja ${m.ver||1}</span><span>${fmtDate(m.ts)}</span></div></div>
      <div class="bt"><button class="btn sm" data-modopen="${m.id}">Otwórz</button><button class="btn sm ghost" data-moddel="${m.id}">Usuń</button></div></article>`).join('')
    :`<div class="panel empty">Nie masz jeszcze modułów. Wybierz pomysł powyżej albo opisz własny.</div>`}
  </section>`;
  const ta=$('#labDesc');ta.oninput=()=>labDraft=ta.value;
  $('#labForm').onsubmit=e=>{e.preventDefault();if(labRun){labRun.ctl.abort();return}const d=ta.value.trim();if(!d)return toast('Opisz moduł');labDraft='';buildModule('',d)};
  const fx=$('#modFix');if(fx)fx.onsubmit=e=>{e.preventDefault();const v=$('#modFixIn').value.trim();if(v)buildModule('',v,openModId)};
}
window.addEventListener('message',e=>{
  const fr=$('#modFrame');if(!fr||e.source!==fr.contentWindow)return;
  const m=e.data||{};const it=S.modules.items.find(x=>x.id===openModId);if(!it)return;
  if(m.evoo==='load')fr.contentWindow.postMessage({evoo:'loaded',i:m.i,d:it.data||null},'*');
  if(m.evoo==='save'){try{const s=JSON.stringify(m.d);if(s.length<150000){it.data=JSON.parse(s);save('modules')}}catch(_){}}
});

/* ---------- Eksperci: widok ---------- */
let expSel='auto',expRun=null,expDraft='';
function vExperts(){
  $('#view').innerHTML=H1('Eksperci','Specjalista na każdy temat','Zadaj pytanie, a Evoo dobierze eksperta sama albo wybierz go ręcznie.','#C084FC')+`
  <form class="panel form" id="expForm">
    <div class="chips"><button type="button" class="chip ${expSel==='auto'?'on':''}" data-exp="auto"><i></i>Dobierz automatycznie</button>${Object.entries(EXPERTS).map(([id,e])=>`<button type="button" class="chip ${expSel===id?'on':''}" style="--ccol:${e.c}" data-exp="${id}"><i></i>${e.n}</button>`).join('')}</div>
    <textarea class="field" id="expQ" placeholder="Np. Czy kupić mieszkanie na wynajem za 450 tys. zł przy czynszu 2800 zł?" aria-label="Pytanie">${esc(expDraft)}</textarea>
    <div><button class="btn" id="expBtn">${expRun?'Zatrzymaj':'Zapytaj eksperta'}</button></div>
  </form>
  ${expRun?`<article class="panel expans" style="--pcol:${EXPERTS[expRun.ex].c}"><div class="h"><b>${EXPERTS[expRun.ex].n}</b></div><div class="q">${esc(expRun.q)}</div><div id="expOut">${expRun.text?bodyHtml(expRun.text):'<div class="think"><i></i><i></i><i></i></div>'}</div></article>`:''}
  <section style="display:flex;flex-direction:column;gap:8px"><div class="sec-h"><h2>Konsultacje</h2><span class="eyebrow">${S.experts.items.length}</span></div>
    ${S.experts.items.length?S.experts.items.map((x,i)=>`<details class="hist" ${i===0&&!expRun?'open':''}><summary><span>${esc(x.q)}</span><span class="small muted" style="flex:none">${esc((EXPERTS[x.ex]||EXPERTS.biz).n)}</span></summary>
      <div class="bodyx">${bodyHtml(x.a)}</div><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn sm" data-exphand="${x.id}">Omów z Evoo</button><button class="btn sm ghost" data-expdel="${x.id}">Usuń</button></div></details>`).join('')
    :`<div class="panel empty">Brak konsultacji. Zadaj pierwsze pytanie.</div>`}
  </section>`;
  const ta=$('#expQ');ta.oninput=()=>expDraft=ta.value;
  $('#expForm').onsubmit=e=>{e.preventDefault();if(expRun){expRun.ctl.abort();return}askExpert(ta.value)};
}
async function askExpert(q){
  q=(q||'').trim();if(!q)return toast('Wpisz pytanie');if(!sampleFn)return toast(NO_AI);
  const ex=expSel==='auto'?autoExpert(q):expSel;const e=EXPERTS[ex];
  const ctl=new AbortController();expRun={ex,q,text:'',ctl};expDraft='';render();
  const prompt=`${e.p}\nJesteś ekspertem w aplikacji Evoo AI OS i odpowiadasz ${name()} po polsku. Konkretnie i praktycznie: najpierw krótka odpowiedź, potem uzasadnienie i 2–4 kroki. Nie wymyślaj faktów ani liczb; szacunki oznaczaj jako szacunki. Bez bloków action.\n\n${context()}\n\nPYTANIE:\n${q}`;
  try{
    const r=await sampleFn(prompt,{modelTier:'default',signal:ctl.signal,onText:({text})=>{if(expRun){expRun.text=text;const el=$('#expOut');if(el)el.innerHTML=bodyHtml(text)}}});
    S.experts.items.unshift({id:uid(),ex,q,a:r.text,ts:Date.now()});if(S.experts.items.length>40)S.experts.items.length=40;save('experts');
  }catch(err){if(!(err&&err.code==='cancelled'))toast(errText(err))}
  expRun=null;if(view==='experts')render();
}

/* ---------- Kopia danych (eksport i import) ---------- */
function exportData(){
  try{const blob=new Blob([JSON.stringify({app:'Evoo AI OS',ver:2,at:new Date().toISOString(),data:S},null,1)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='evoo-kopia-'+todayISO()+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('Pobrano kopię danych')}
  catch(e){toast('Nie udało się zapisać kopii')}
}
async function importData(file){
  try{const j=JSON.parse(await file.text());const d=j&&j.data;if(!d||typeof d!=='object')throw 0;
    let n=0;for(const k of KEYS){if(d[k]&&typeof d[k]==='object'){S[k]=Object.assign(DEF()[k],d[k]);save(k);n++}}
    toast('Wczytano kopię ('+n+' sekcji)');render()}
  catch(e){toast('To nie jest plik kopii Evoo')}
}

const VIEWS={start:vStart,chat:vChat,live:vLive,council:vCouncil,tasks:vTasks,projects:vProjects,agents:vAgents,memory:vMemory,money:vMoney,more:vMore,connect:vConnect,calendar:vCalendar,finance:vFinance,journal:vJournal,lab:vLab,experts:vExperts};

/* ---------- iOS-safe forms: submit via script, never via native form submission ---------- */
function fireSubmit(f){f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!b.form||b.type!=='submit'||b.disabled)return;e.preventDefault();fireSubmit(b.form)},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing)return;const t=e.target;if(t&&t.tagName==='INPUT'&&t.form){e.preventDefault();fireSubmit(t.form)}},true);
document.addEventListener('submit',e=>e.preventDefault());
window.addEventListener('error',e=>{try{toast('Błąd: '+(e.message||'nieznany'))}catch(_){}});
window.addEventListener('unhandledrejection',e=>{try{const r=e.reason;toast('Błąd: '+((r&&(r.message||r.code))||'nieznany'))}catch(_){}});

/* ---------- boot ---------- */
$('#logoImg').src=img('evoo');
$('#logo').onclick=()=>go('start');
render();

/* ---------- Tryb bezpośredni: Witch Router w przeglądarce, klucze tylko na tym urządzeniu ---------- */
const PROV={
  gemini:{label:'Gemini',free:1,models:['gemini-3.8-flash','gemini-2.5-flash','gemini-2.5-flash-lite'],help:'aistudio.google.com/apikey'},
  groq:{label:'Groq',base:'https://api.groq.com/openai/v1',free:1,models:['openai/gpt-oss-120b','llama-3.3-70b-versatile'],help:'console.groq.com/keys'},
  cerebras:{label:'Cerebras',base:'https://api.cerebras.ai/v1',free:1,models:['gpt-oss-120b','llama-3.3-70b'],help:'cloud.cerebras.ai'},
  mistral:{label:'Mistral',base:'https://api.mistral.ai/v1',free:1,models:['mistral-small-latest','mistral-medium-latest'],help:'console.mistral.ai'},
  openrouter:{label:'OpenRouter',base:'https://openrouter.ai/api/v1',free:1,models:['openrouter/free'],help:'openrouter.ai/keys'},
  openai:{label:'OpenAI',base:'https://api.openai.com/v1',free:0,models:['gpt-4o-mini'],help:'platform.openai.com'},
  deepseek:{label:'DeepSeek',base:'https://api.deepseek.com/v1',free:0,models:['deepseek-chat'],help:'platform.deepseek.com'},
  xai:{label:'xAI Grok',base:'https://api.x.ai/v1',free:0,models:['grok-3-mini'],help:'console.x.ai'}
};
const DLABEL=Object.fromEntries(Object.entries(PROV).map(([k,v])=>[k,v.label]));
const isDirect=()=>lsRaw('evoo:mode')==='direct';
const isServer=()=>lsRaw('evoo:mode')==='server';
function gkeys(){
  let k={};try{k=JSON.parse(lsRaw('evoo:keys')||'{}')||{}}catch(e){k={}}
  for(const id of ['gemini','groq','openrouter']){const old=lsRaw('evoo:k:'+id);if(old&&!k[id])k[id]=old}
  return k;
}
function setKeys(k){lsRawSet('evoo:keys',JSON.stringify(k));for(const id of ['gemini','groq','openrouter'])lsRawSet('evoo:k:'+id,'')}
function detectProvider(key){
  key=String(key||'').trim();
  if(/^(AIza|AQ\.)/.test(key))return 'gemini';if(/^gsk_/.test(key))return 'groq';if(/^sk-or-/.test(key))return 'openrouter';
  if(/^csk-/.test(key))return 'cerebras';if(/^xai-/.test(key))return 'xai';if(/^sk-ant-/.test(key))return 'anthropic';
  if(/^sk-/.test(key))return 'sk';if(/^[A-Za-z0-9]{32}$/.test(key))return 'mistral';return '';
}
/* automatyczne listy modeli (cache 6 h na urządzeniu) */
const RBAD=/whisper|tts|orpheus|guard|safeguard|embed|moderation|transcribe|image|imagen|veo|dall|audio|live|realtime|allam|rerank|robotics|aqa|nano-banana|omni|vision|learnlm|content-safety|code|coder|search|instruct-\d{4}|preview-tts|native-audio|computer-use|babbage|davinci/i;
const RSC=[[/pro\b/,30],[/gpt-5/,35],[/3\.8/,28],[/3\.6/,20],[/3\.5/,14],[/2\.5/,8],[/405b/,30],[/120b/,28],[/70b/,25],[/32b|27b|31b/,22],[/flash/,10],[/large|medium/,12],[/mini|tiny|nano|micro|instant|lite|fast|small/,6]];
function rscore(id){if(!id||RBAD.test(id))return -9999;let s=0;for(const [re,w] of RSC)if(re.test(id))s+=w;return s-Math.min(5,id.length/40)}
function rankIds(ids,tier){const qb=id=>tier==='quick'&&/flash|mini|lite|instant|fast|20b|8b|small/.test(id)?25:0;return [...new Set(ids)].filter(i=>rscore(i)>-999).sort((a,b)=>rscore(b)+qb(b)-(rscore(a)+qb(a)))}
function cachedModels(id){try{const c=JSON.parse(lsRaw('evoo:models:'+id)||'null');if(c&&Date.now()-c.at<6*3600e3)return c.ids}catch(e){}return null}
async function refreshModels(){
  const k=gkeys();
  await Promise.all(Object.keys(k).filter(id=>k[id]&&PROV[id]).map(async id=>{
    if(cachedModels(id))return;
    try{
      let ids=[];
      if(id==='gemini'){const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200',{headers:{'x-goog-api-key':k[id]}});if(!r.ok)return;const j=await r.json();ids=(j.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent')).map(m=>String(m.name).replace(/^models\//,'')).filter(n=>/^gemini|^gemma/.test(n))}
      else{const r=await fetch(PROV[id].base+'/models',{headers:id==='openrouter'?{}:{Authorization:'Bearer '+k[id]}});if(!r.ok)return;const j=await r.json();ids=(j.data||[]).map(m=>String(m.id));if(id==='openrouter')ids=(j.data||[]).filter(m=>String(m.id).endsWith(':free')).map(m=>String(m.id))}
      if(ids.length)localStorage.setItem('evoo:models:'+id,JSON.stringify({at:Date.now(),ids}));
    }catch(e){}
  }));
}
function pickModels(id,tier){
  const list=cachedModels(id);const def=PROV[id].models;
  if(!list)return def.slice(0,2);
  const ranked=rankIds(list,tier);const known=def.filter(m=>list.includes(m));
  const out=[...known,...ranked].filter((m,i,a)=>a.indexOf(m)===i).slice(0,2);
  if(id==='openrouter'&&!out.includes('openrouter/free'))out.push('openrouter/free');
  return out.length?out:def.slice(0,2);
}
function directChain(tier){
  const k=gkeys();
  const free=tier==='quick'?['groq','cerebras','gemini','mistral','openrouter']:tier==='complex'?['gemini','openrouter','mistral','groq','cerebras']:['gemini','groq','cerebras','mistral','openrouter'];
  const order=[...free,'openai','deepseek','xai'];
  const out=[];order.forEach(id=>{if(k[id]&&PROV[id])pickModels(id,tier).forEach(m=>out.push({id,label:PROV[id].label,model:m,key:k[id]}))});
  return out.slice(0,9);
}
function mergeTurns(list){
  const out=[];
  for(const m of list){const c=String(m.content||'').trim();if(!c)continue;const role=m.role==='assistant'?'assistant':'user';const l=out[out.length-1];if(l&&l.role===role)l.content+='\n\n'+c;else out.push({role,content:c})}
  while(out.length&&out[0].role!=='user')out.shift();
  return out;
}
function directRequest(c,system,messages,signal){
  if(c.id==='gemini'){
    const body={contents:messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{temperature:.8,maxOutputTokens:8192}};
    if(system)body.systemInstruction={parts:[{text:system}]};
    return fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(c.model)+':streamGenerateContent?alt=sse',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':c.key},body:JSON.stringify(body),signal});
  }
  const headers={'Content-Type':'application/json',Authorization:'Bearer '+c.key};
  if(c.id==='openrouter')headers['X-Title']='Evoo AI OS';
  const all=system?[{role:'system',content:system},...messages]:messages;
  return fetch(PROV[c.id].base+'/chat/completions',{method:'POST',headers,body:JSON.stringify({model:c.model,stream:true,temperature:.8,max_tokens:8192,messages:all}),signal});
}
async function brainDirect(input,opts={}){
  const system=typeof input==='string'?'':input[0].content;
  const messages=mergeTurns(typeof input==='string'?[{role:'user',content:input}]:input.slice(1));
  const list=directChain(opts.modelTier||'default');
  if(!list.length)throw {code:'no_keys',message:'Brak kluczy AI. Wejdź w Pamięć i ustawienia → Zmień klucze.'};
  const failures=[];const bad=new Set();
  for(const c of list){
    if(bad.has(c.id))continue;
    if(opts.signal&&opts.signal.aborted)throw {code:'cancelled'};
    const ctl=new AbortController();const onAbort=()=>ctl.abort();
    if(opts.signal)opts.signal.addEventListener('abort',onAbort);
    const timer=setTimeout(()=>ctl.abort(),20000);
    let res;
    try{res=await directRequest(c,system,messages,ctl.signal)}
    catch(e){clearTimeout(timer);if(opts.signal&&opts.signal.aborted)throw {code:'cancelled'};failures.push(c.label+' '+c.model+': brak odpowiedzi');continue}
    clearTimeout(timer);
    if(!res.ok||!res.body){let d='';try{d=(await res.text()).slice(0,120)}catch(e){}failures.push(c.label+' '+c.model+': HTTP '+res.status+(d?' – '+d:''));if(res.status===400&&/API key|API_KEY/i.test(d)||res.status===401||res.status===403)bad.add(c.id);continue}
    const reader=res.body.getReader(),dec=new TextDecoder();let buf='',text='';
    try{
      while(true){const {done,value}=await reader.read();if(done)break;buf+=dec.decode(value,{stream:true});let nl;
        while((nl=buf.indexOf('\n'))>=0){const line=buf.slice(0,nl).trim();buf=buf.slice(nl+1);if(!line.startsWith('data:'))continue;const data=line.slice(5).trim();if(!data||data==='[DONE]')continue;
          let j;try{j=JSON.parse(data)}catch(e){continue}
          const d=c.id==='gemini'?((j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).map(p=>p.thought?'':(p.text||'')).join(''):((j.choices&&j.choices[0]&&j.choices[0].delta&&j.choices[0].delta.content)||'');
          if(d){text+=d;opts.onText&&opts.onText({text,delta:d})}}}
    }catch(e){if(opts.signal&&opts.signal.aborted)throw {code:'cancelled',text};if(!text)throw {code:'network'}}
    finally{if(opts.signal)opts.signal.removeEventListener('abort',onAbort)}
    if(!text.trim()){failures.push(c.label+' '+c.model+': pusta odpowiedź');continue}
    return {text,truncated:false,meta:{provider:c.label,model:c.model,fallbacks:failures.length}};
  }
  throw {code:'all_failed',message:'Wszystkie modele zawiodły. '+failures.join(' | ')};
}
brainDirect.json=async(input,opts)=>parseLoose((await brainDirect(input,opts)).text);
function startDirect(){
  const k=gkeys();providers={};Object.keys(PROV).forEach(id=>{if(k[id])providers[id]=true});
  sampleFn=brainDirect;aiState='ok';cloud=false;syncState='local';renderStatus();
  refreshModels();
}
let pendingSk='';
function keyListHtml(){
  const k=gkeys();const ids=Object.keys(k).filter(id=>k[id]&&PROV[id]);
  return ids.length?ids.map(id=>`<div class="row"><div class="grow"><div class="ttl">${PROV[id].label}${PROV[id].free?'':' <span class="tag late">płatny</span>'}</div><div class="meta">${esc(k[id].slice(0,6))}…${esc(k[id].slice(-4))}</div></div><button type="button" class="x" data-delkey="${id}" aria-label="Usuń klucz">${ICON.x}</button></div>`).join('')
    :'<div class="empty" style="padding:8px">Nie dodano jeszcze żadnego klucza.</div>';
}
function vConnect(){
  $('#nav').innerHTML='';document.querySelector('.nav').hidden=true;
  const k=gkeys();const has=Object.keys(k).some(id=>k[id]);
  $('#view').innerHTML=`
  <section style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding-top:12px">
    <img src="${img('evoo')}" alt="Evoo" style="width:120px;height:120px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 3px var(--bg),0 0 0 5px var(--evoo),0 0 40px rgba(168,85,247,.5)">
    <h1 class="hello" style="font-size:28px">Cześć, tu Evoo</h1>
    <p class="sub" style="max-width:44ch">Wklej klucz do dowolnego dostawcy AI. Rozpoznam go sama. Na start wystarczy darmowy klucz Gemini z aistudio.google.com/apikey.</p>
  </section>
  <form class="panel form" id="dconn">
    <label class="eyebrow" for="kNew">Klucz API</label>
    <div class="r"><input class="field" id="kNew" type="password" placeholder="Wklej klucz (Gemini, Groq, Cerebras, Mistral, OpenRouter…)" autocomplete="off" style="flex:3 1 200px"><button type="button" class="btn ghost" id="kAdd" style="flex:1 1 90px">Dodaj</button></div>
    <div class="small muted" id="kDet"></div>
    <div id="kSk" hidden><div class="seg"><button type="button" data-sk="openai">To klucz OpenAI</button><button type="button" data-sk="deepseek">To klucz DeepSeek</button></div></div>
    <div class="list" id="kList">${keyListHtml()}</div>
    <button class="btn" id="dBtn">${has?'Uruchom Evoo':'Dodaj klucz i uruchom'}</button>
    <div class="small muted">Darmowe: Gemini, Groq, Cerebras, Mistral, OpenRouter. Płatne (OpenAI, DeepSeek, xAI) router wybiera dopiero na końcu, gdy darmowe zawiodą. Klucze i Twoje dane zostają tylko w tej przeglądarce, na tym urządzeniu.</div>
    <div class="err" id="dErr" hidden></div>
  </form>
  <form class="panel form" id="serverConn">
    <b>Witch Router na serwerze</b>
    <div class="small muted">Klucze dostawców pozostają na serwerze. Wpisz hasło dostępu ustawione jako EVOO_ACCESS_KEY.</div>
    <input class="field" id="serverKey" type="password" placeholder="EVOO_ACCESS_KEY" autocomplete="current-password" required>
    <button class="btn" id="serverBtn">Połącz z Witch Routerem</button>
    <div class="err" id="serverErr" hidden></div>
  </form>
  <details class="hist"><summary><span>Mam własny mózg Convex</span></summary>
  <form class="form" id="conn" style="margin-top:8px">
    <label class="eyebrow" for="cApi">Adres mózgu (Convex)</label>
    <input class="field" id="cApi" placeholder="https://twoje-wdrozenie.convex.site" value="${esc(CFG.api)}" autocomplete="off" inputmode="url">
    <label class="eyebrow" for="cKey">Klucz dostępu (EVOO_ACCESS_KEY)</label>
    <input class="field" id="cKey" type="password" placeholder="EVOO_ACCESS_KEY" autocomplete="current-password">
    <button class="btn ghost" id="cBtn2">Połącz z mózgiem</button>
    <div class="err" id="cErr" hidden></div>
  </form></details>`;
  const inp=$('#kNew'),det=$('#kDet'),er=$('#dErr');
  const addKey=prov=>{const v=inp.value.trim();const p=prov||detectProvider(v);er.hidden=true;
    if(!v)return false;
    if(p==='anthropic'){er.textContent='Klucze Anthropic nie działają bezpośrednio z przeglądarki. Użyj Gemini, Groq albo OpenRouter (tam są też modele Claude).';er.hidden=false;return false}
    if(p==='sk'){pendingSk=v;$('#kSk').hidden=false;det.textContent='Klucz zaczyna się od „sk-”. Wybierz, czyj to klucz:';return false}
    if(!PROV[p]){er.textContent='Nie rozpoznaję tego klucza. Sprawdź, czy skopiowałeś go w całości.';er.hidden=false;return false}
    const k=gkeys();k[p]=v;setKeys(k);try{localStorage.removeItem('evoo:models:'+p)}catch(e){}
    inp.value='';det.textContent='Dodano: '+PROV[p].label;$('#kSk').hidden=true;$('#kList').innerHTML=keyListHtml();$('#dBtn').textContent='Uruchom Evoo';return true};
  inp.oninput=()=>{const p=detectProvider(inp.value);det.textContent=p&&PROV[p]?'Rozpoznano: '+PROV[p].label:p==='sk'?'OpenAI albo DeepSeek':p==='anthropic'?'Anthropic (nieobsługiwany w przeglądarce)':''};
  $('#kAdd').onclick=()=>addKey();
  document.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{inp.value=pendingSk;addKey(b.dataset.sk)});
  $('#kList').onclick=e=>{const b=e.target.closest('[data-delkey]');if(!b)return;const k=gkeys();delete k[b.dataset.delkey];setKeys(k);$('#kList').innerHTML=keyListHtml()};
  $('#dconn').onsubmit=e=>{
    e.preventDefault();if(inp.value.trim()&&!addKey())return;
    const k=gkeys();if(!Object.keys(k).some(id=>k[id]&&PROV[id])){er.textContent='Dodaj przynajmniej jeden klucz.';er.hidden=false;return}
    lsRawSet('evoo:mode','direct');startDirect();go('start');toast('Evoo uruchomiona');
  };
  $('#serverConn').onsubmit=async e=>{
    e.preventDefault();const btn=$('#serverBtn'),er=$('#serverErr'),key=$('#serverKey').value.trim();
    er.hidden=true;btn.disabled=true;btn.textContent='Łączę…';
    const result=await connectServer(key);
    if(result===true){go('start');toast('Połączono z Witch Routerem')}
    else{er.textContent=result;er.hidden=false;btn.disabled=false;btn.textContent='Połącz z Witch Routerem'}
  };
  $('#conn').onsubmit=async e=>{
    e.preventDefault();const btn=$('#cBtn2'),er=$('#cErr');
    CFG.api=$('#cApi').value.trim().replace(/\/+$/,'');CFG.key=$('#cKey').value.trim();
    er.hidden=true;btn.disabled=true;btn.textContent='Łączę…';
    const r=await connect();
    if(r===true){lsRawSet('evoo:api',CFG.api);lsRawSet('evoo:key',CFG.key);lsRawSet('evoo:mode','brain');go('start');toast('Połączono z mózgiem Evoo')}
    else{er.textContent=r;er.hidden=false;btn.disabled=false;btn.textContent='Połącz z mózgiem'}
  };
}
async function connect(){
  if(!/^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)/.test(CFG.api))return 'Podaj adres zaczynający się od https://';
  if(!CFG.key)return 'Wpisz klucz dostępu.';
  let res;
  try{res=await api('/api/health')}catch(e){return 'Nie mogę połączyć się z tym adresem. Sprawdź go i spróbuj ponownie.'}
  if(res.status===401){let j={};try{j=await res.json()}catch(e){}return j.error||'Nieprawidłowy klucz dostępu.'}
  if(!res.ok)return 'Mózg odpowiedział błędem '+res.status+'. Czy backend Convex jest wdrożony?';
  const j=await res.json();providers=j.providers||null;
  sampleFn=brain;aiState='ok';renderStatus();
  try{
    const st=await api('/api/store');const d=(await st.json()).data||{};
    for(const k of KEYS){
      if(k in d&&d[k]&&typeof d[k]==='object'){S[k]=Object.assign(DEF()[k],d[k]);lsSet(k,S[k])}
      else if(JSON.stringify(S[k])!==JSON.stringify(DEF()[k])){cloud=true;flush(k)}
    }
    cloud=true;syncState='cloud';
  }catch(e){syncState='error'}
  return true;
}
async function connectServer(key){
  if(!key)return 'Wpisz klucz dostępu.';
  let res;
  try{res=await chatApi('/api/chat',{headers:{Authorization:'Bearer '+key}})}catch(e){return 'Nie mogę połączyć się z serwerem aplikacji.'}
  if(!res.ok){let j={};try{j=await res.json()}catch(e){}return j.error||'Nie udało się połączyć z Witch Routerem.'}
  CFG.key=key;lsRawSet('evoo:key',key);lsRawSet('evoo:mode','server');
  cloud=false;syncState='local';sampleFn=brain;aiState='ok';renderStatus();
  return true;
}
(async()=>{
  loadCfg();
  if(isDirect()){const k=gkeys();if(Object.keys(k).some(id=>k[id]&&PROV[id])){startDirect();render();return}}
  if(isServer()){
    const result=await connectServer(CFG.key);
    if(result===true){go('start');render();return}
    lsRawSet('evoo:mode','');
  }
  if(!CFG.api||!CFG.key){aiState='off';go('connect');renderStatus();return}
  const r=await connect();
  if(r!==true){aiState='off';renderStatus();go('connect');const er=$('#cErr');if(er){er.textContent=r;er.hidden=false;er.closest('details').open=true}return}
  if(!busy&&!money&&!councilCtl&&!Object.keys(agentRun).length&&view!=='chat')render();
  else if(view==='chat'&&!busy)renderChat();
})();
