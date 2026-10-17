/* ===== v19: jedna Evoo + osobowości, kreator, rozpoznawanie intencji, koncepcje myślowe, Świadomość ===== */
(function(){
var ST={strateg:{n:'Strateg',i:'🎯',c:'#3ee0ff',d:'#0b4f6b',ex:'„Opcje A i B. Rekomenduję A, bo szybciej da wynik.”',p:'Osobowość: Strateg. Konkretny, zwięzły, nastawiony na decyzje i wyniki. Najpierw rekomendacja, potem krótkie uzasadnienie.'},
 towarzysz:{n:'Towarzysz',i:'🌿',c:'#ffb067',d:'#8a4a14',ex:'„Słyszę, że to dla Ciebie ważne. Co czujesz najmocniej?”',p:'Osobowość: Towarzysz. Ciepły, spokojny, uważny. Najpierw nazywasz to, co słyszysz, potem pomagasz zrozumieć siebie.'},
 tworca:{n:'Twórca',i:'⚡',c:'#ff4fb0',d:'#7a1456',ex:'„A gdyby zrobić to odwrotnie? Mam 3 szalone kierunki!”',p:'Osobowość: Twórca. Energiczny, dowcipny, śmiały. Rzucasz pomysły i odważne kierunki, ale zawsze użyteczne.'},
 mentor:{n:'Mentor',i:'🧭',c:'#7c5cff',d:'#2b1b8a',ex:'„Zanim odpowiem: co jest tu faktem, a co założeniem?”',p:'Osobowość: Mentor. Zadajesz celne pytania, uczysz myślenia i dobierasz koncepcje myślowe do problemu.'}};
S.style=S.style||'mentor';S.aname=S.aname||'Evoo';S.tone=S.tone||{len:'kr',reg:'luz'};S.aw=S.aw||[];S.pers='evoo';
function applyStyle(){var s=ST[S.style]||ST.mentor;P.evoo.n=S.aname;P.evoo.c=s.c;P.evoo.d=s.d;P.evoo.t=s.n;S.pers='evoo';try{theme()}catch(e){}}
applyStyle();
/* ---- koncepcje myślowe ---- */
var FR={decyzja:['Decyzja','Plusy i minusy, koszt odwrócenia decyzji (czy da się wycofać), najtańszy test, na końcu jasna rekomendacja.'],
 pomysl:['Myślenie od podstaw','Oddziel fakty od założeń, wskaż co naprawdę trzeba udowodnić i zaproponuj najtańszy wariant testu.'],
 premortem:['Pre-mortem','Załóż, że to się nie udało. Podaj 3-5 najbardziej prawdopodobnych przyczyn i jak im zapobiec.'],
 priorytety:['Eisenhower + 80/20','Podziel na pilne/ważne (macierz Eisenhowera) i wskaż 20% działań dających 80% efektu.'],
 swot:['SWOT i alternatywy','Mocne i słabe strony, szanse i zagrożenia, oraz co jeszcze można zrobić zamiast tego.'],
 odwrotne:['Pytania odwrotne','Rozbij problem na części i zapytaj odwrotnie: co musiałoby się stać, żeby to się NIE udało? Co już działa?']};
function frame(t){t=t.toLowerCase();if(/ryzyk|nie wyjdzie|a jeśli/.test(t))return'premortem';if(/priorytet|pilne|od czego zacz/.test(t))return'priorytety';if(/strategi|konkuren|swot|rynek/.test(t))return'swot';if(/utkn|nie wiem jak|nie mogę/.test(t))return'odwrotne';if(/pomys|a gdyby|nowy/.test(t))return'pomysl';return'decyzja'}
/* ---- rozpoznawanie intencji (lokalne, bez wysyłania) ---- */
var DN={poniedzia:1,wtor:2,srod:3,czwart:4,piat:5,sobot:6,niedziel:0};
function iso(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function pdate(t){t=t.toLowerCase();var n=new Date(),d=null,m;
 if(/dzisiaj|dziś|dzis/.test(t))d=new Date(n);else if(/pojutrze/.test(t)){d=new Date(n);d.setDate(d.getDate()+2)}else if(/jutro/.test(t)){d=new Date(n);d.setDate(d.getDate()+1)}
 else if((m=t.match(/za (\d+) dni/))){d=new Date(n);d.setDate(d.getDate()+ +m[1])}
 else if((m=t.match(/(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{2,4}))?/))){var y=m[3]?(+m[3]<100?2000+ +m[3]:+m[3]):n.getFullYear();d=new Date(y,+m[2]-1,+m[1]);if(!m[3]&&d<new Date(n.getFullYear(),n.getMonth(),n.getDate()))d.setFullYear(y+1)}
 else for(var k in DN){if(t.indexOf(k)>=0){d=new Date(n);var diff=(DN[k]-d.getDay()+7)%7;if(diff===0)diff=7;d.setDate(d.getDate()+diff);break}}
 return d?iso(d):''}
function ptime(t){var m=t.match(/(?:o|na|godz\.?)\s*(\d{1,2})(?::(\d{2}))?(?!\d)/i)||t.match(/\b(\d{1,2}):(\d{2})\b/);if(!m)return'';var h=+m[1];if(h>23)return'';return p2(h)+':'+p2(+(m[2]||0))}
function ptitle(t){return t.replace(/\b(wpisz|dodaj|do kalendarza|w kalendarzu|przypomnij mi|przypomnij|umów|zaplanuj)\b/gi,'').replace(/\b(dzisiaj|dziś|jutro|pojutrze|za \d+ dni|w?\s*(poniedziałek|wtorek|środę|środa|czwartek|piątek|sobotę|sobota|niedzielę|niedziela))\b/gi,'').replace(/\d{1,2}[.\/-]\d{1,2}([.\/-]\d{2,4})?/g,'').replace(/(?:o|na|godz\.?)\s*\d{1,2}(:\d{2})?/gi,'').replace(/\s+/g,' ').replace(/^[\s,.:-]+|[\s,.:-]+$/g,'').slice(0,80)||'Wydarzenie'}
function detect(t){var l=t.toLowerCase(),d=pdate(t),tm=ptime(t);
 if(d&&(tm||/spotkan|wizyt|zadzwo|przypomn|umów|kalendarz|lekarz|dentyst|termin/.test(l))||/do kalendarza|wpisz.*kalendarz/.test(l))return{m:'kalendarz',d:d,t:tm};
 if(/podsumuj|streść|skróć|w skrócie|tl;?dr/.test(l))return{m:'podsumowanie'};
 if(/zaplanuj|rozpisz|harmonogram|plan na|plan działania|krok po kroku|roadmap/.test(l))return{m:'plan'};
 if(/czy warto|porównaj|analiz|dlaczego|co lepsze|wady i zalety|ryzyk|decyzj|strategi|priorytet|utkn|pomysł/.test(l))return{m:'analiza',f:frame(t)};
 if(/jak minął dzień|czuję się|mam doł|zestresowan|nastrój/.test(l))return{m:'swiadomosc'};
 if(/zapamiętaj|pamiętaj że/.test(l))return{m:'pamiec'};
 return{m:'czat'}}
var MN={czat:'💬 Rozmowa',analiza:'🔍 Analiza',plan:'🗺️ Plan',podsumowanie:'📝 Podsumowanie',kalendarz:'📅 Kalendarz',swiadomosc:'🪞 Świadomość',pamiec:'🧠 Pamięć'},ORDER=['czat','analiza','plan','podsumowanie','kalendarz'];
var hint='',manual=null;
function modeHint(r){if(r.m==='analiza'){var f=FR[r.f||'decyzja'];return'\nTRYB ANALIZA: użyj koncepcji „'+f[0]+'”. '+f[1]+' Struktura: krótkie nagłówki, zwięźle. Na początku jedna linijka: „Użyłam: '+f[0]+'”.'}
 if(r.m==='plan')return'\nTRYB PLAN: rozpisz kroki z orientacyjnymi terminami (dzisiejsza data jest podana). Na końcu zapytaj, czy zapisać jako projekt (narzędzie add_project) lub dodać terminy do kalendarza.';
 if(r.m==='podsumowanie')return'\nTRYB PODSUMOWANIE: odpowiedz krótko, w 3-6 punktach, tylko esencja, bez wstępów.';
 if(r.m==='swiadomosc')return'\nTRYB ŚWIADOMOŚĆ: ciepło nazwij emocje, zaproponuj jedną perspektywę i mały krok. Nie diagnozuj.';
 return''}
var _sys=sys;sys=function(){var s=ST[S.style]||ST.mentor,to=S.tone||{};return _sys()+'\nMasz na imię '+S.aname+'. '+s.p+(to.len==='szcz'?' Odpowiadaj szerzej, z uzasadnieniem.':' Odpowiadaj krótko.')+(to.reg==='form'?' Styl formalny.':' Styl swobodny.')+hint};
/* ---- UI czatu: chip trybu + karta zatwierdzenia ---- */
var st=document.createElement('style');st.textContent='#mchip{display:flex;gap:8px;align-items:center;padding:4px 12px;font-size:12px;color:var(--m)}#mchip button{background:var(--p2);border:1px solid var(--l);color:#27b6f2;border-radius:999px;padding:3px 10px;font-size:12px;cursor:pointer}#icard{margin:6px 12px;padding:12px;border:1px solid #14577a;background:#0b2a3b;border-radius:14px}#icard input{width:100%;margin:4px 0}#icard .row{gap:6px}#avs{display:none!important}'+
'#wiz{position:fixed;inset:0;z-index:100;background:#070a14f2;overflow:auto;padding:20px calc(16px + env(safe-area-inset-right)) 40px 16px}#wiz .w{max-width:560px;margin:0 auto}#wiz h2{margin:0 0 4px}.sty{display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border:2px solid var(--l);border-radius:14px;background:var(--p);color:var(--t);cursor:pointer;font-family:inherit}.sty.on{border-color:#27b6f2;background:#0b2a3b}.sty b{font-size:16px}.sty small{display:block;color:var(--m);margin-top:3px}#wiz .seg button{margin:2px}.seg .on{border-color:#27b6f2;color:#27b6f2}'+
'.awc{background:var(--p);border:1px solid var(--l);border-radius:14px;padding:12px;margin:10px 0}.awc input[type=range]{width:100%}.awr{white-space:pre-wrap;margin-top:8px;font-size:14px}';document.head.appendChild(st);
var chat=$('#v-chat'),bar=$('#bar');
var chip=document.createElement('div');chip.id='mchip';chip.innerHTML='<span id="mtxt">Tryb: auto</span><button id="mbtn">zmień</button>';chat.insertBefore(chip,bar);
var card=document.createElement('div');card.id='icard';card.style.display='none';chat.insertBefore(card,chip);
function cur(){var v=$('#inp').value;return manual?{m:manual,f:manual==='analiza'?frame(v):undefined,d:pdate(v),t:ptime(v)}:detect(v)}
function upd(){var v=$('#inp').value,r=v.trim()?cur():{m:'czat'},x=MN[r.m]||'💬 Rozmowa';if(r.m==='analiza'&&FR[r.f])x+=' · '+FR[r.f][0];$('#mtxt').textContent='Tryb: '+(manual?'ręczny ':'auto ')+x}
$('#inp').addEventListener('input',upd);
$('#mbtn').onclick=function(){var i=manual?ORDER.indexOf(manual):-1;manual=i+1>=ORDER.length?null:ORDER[i+1];upd()};
var _ask=ask;
function showCard(txt,r){card.style.display='block';card.innerHTML='<b>📅 Dodać do kalendarza?</b><input id="ic-t" value="'+esc(ptitle(txt))+'"><div class="row"><input id="ic-d" type="date" value="'+(r.d||today())+'"><input id="ic-h" type="time" value="'+(r.t||'')+'"></div><div class="row" style="margin-top:6px"><button class="pri" id="ic-ok">Dodaj</button><button class="gh" id="ic-ch">Raczej porozmawiajmy</button><button class="gh" id="ic-x">✕</button></div>';
 $('#ic-ok').onclick=function(){var t=$('#ic-t').value.trim();if(!t)return;S.cal.push({id:uid(),title:t,d:$('#ic-d').value,t:$('#ic-h').value||''});try{logEv('Wydarzenie: '+t+' '+$('#ic-d').value)}catch(e){}save();card.style.display='none';alert('Dodano do kalendarza: '+t+' · '+$('#ic-d').value+' '+($('#ic-h').value||''))};
 $('#ic-ch').onclick=function(){card.style.display='none';hint='';_ask(txt)};$('#ic-x').onclick=function(){card.style.display='none'}}
ask=function(text){var r=manual?{m:manual,f:frame(text),d:pdate(text),t:ptime(text)}:detect(text);manual=null;upd();
 if(r.m==='kalendarz'){showCard(text,r);return}
 hint=modeHint(r);
 if(r.m==='analiza'||r.m==='plan'||r.m==='podsumowanie'){var h=H();h.push({role:'note',text:'🧠 '+MN[r.m]+(r.f?' · '+FR[r.f][0]:''),cls:'t',show:1})}
 return _ask(text)};
/* ---- kreator postaci ---- */
function wiz(first){var w=document.getElementById('wiz');if(w)w.remove();w=document.createElement('div');w.id='wiz';var sel=S.style;
 function draw(){w.innerHTML='<div class="w"><h2>'+(first?'Poznajmy się':'Postać asystenta')+'</h2><p class="mut">Jedna asystentka, Ty wybierasz jej charakter. Zmienisz to w każdej chwili w Ustawieniach.</p>'+
 '<b>1. Imię</b><input id="wz-n" value="'+esc(S.aname)+'" placeholder="Imię asystentki">'+
 '<b style="display:block;margin-top:14px">2. Osobowość</b>'+Object.keys(ST).map(function(k){var s=ST[k];return '<button class="sty'+(k===sel?' on':'')+'" data-s="'+k+'"><b>'+s.i+' '+s.n+'</b><small>'+s.ex+'</small></button>'}).join('')+
 '<b style="display:block;margin-top:14px">3. Avatar</b><p class="mut">Wgraj zdjęcie/postać albo zostaw poświatę w kolorze osobowości.</p><input type="file" id="wz-f" accept="image/*">'+
 '<b style="display:block;margin-top:14px">4. Styl odpowiedzi</b><div class="seg"><button class="gh'+(S.tone.len==='kr'?' on':'')+'" data-l="kr">Krótko</button><button class="gh'+(S.tone.len==='szcz'?' on':'')+'" data-l="szcz">Szczegółowo</button><button class="gh'+(S.tone.reg==='luz'?' on':'')+'" data-r="luz">Swobodnie</button><button class="gh'+(S.tone.reg==='form'?' on':'')+'" data-r="form">Formalnie</button></div>'+
 '<button class="pri" id="wz-ok" style="width:100%;margin-top:18px">Gotowe</button>'+(first?'':'<button class="gh" id="wz-x" style="width:100%;margin-top:8px">Anuluj</button>')+'</div>'}
 draw();document.body.appendChild(w);
 w.onclick=function(e){var t=e.target.closest('button');if(!t)return;var d=t.dataset;
  if(d.s){S.aname=($('#wz-n').value.trim()||S.aname);sel=d.s;draw();return}
  if(d.l){S.tone.len=d.l;S.aname=$('#wz-n').value.trim()||S.aname;draw();return}if(d.r){S.tone.reg=d.r;S.aname=$('#wz-n').value.trim()||S.aname;draw();return}
  if(t.id==='wz-x'){w.remove();return}
  if(t.id==='wz-ok'){S.aname=$('#wz-n').value.trim()||'Evoo';S.style=sel;S.setup=1;applyStyle();save();w.remove();try{fill()}catch(e){}return}};
 w.addEventListener('change',function(e){if(e.target.id==='wz-f'&&e.target.files[0]){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement('canvas'),s=Math.min(1,320/Math.max(im.width,im.height));c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);try{localStorage.setItem('evoo_photo_evoo',c.toDataURL('image/jpeg',.82))}catch(x){}try{theme()}catch(x){}};im.src=r.result};r.readAsDataURL(e.target.files[0])}})}
window.__wiz=wiz;if(!S.setup)wiz(true);
var sc=$('#v-set .scroll');if(sc){var sb=document.createElement('div');sb.className='card';sb.innerHTML='<b>🎭 Postać asystenta</b><p class="mut">Imię, osobowość, avatar i styl odpowiedzi.</p><button class="pri" id="wz-open">Zmień postać</button>';sc.insertBefore(sb,sc.firstChild);sb.querySelector('#wz-open').onclick=function(){wiz(false)}}
/* ---- Świadomość ---- */
var CON={stoicy:'Stoicyzm: co zależy ode mnie, a co nie; skup się na swojej reakcji.',jung:'Perspektywa Junga: cień, archetypy, co w tej sytuacji jest projekcją.',act:'ACT: wartości, akceptacja myśli bez walki, zaangażowane działanie.',uwaznosc:'Uważność: tu i teraz, obserwacja bez oceny, oddech i ciało.',cbt:'CBT: myśli automatyczne, zniekształcenia, bardziej zrównoważona myśl.',wartosci:'Wartości: co jest dla mnie naprawdę ważne i czy to pasuje do mojej decyzji.'};
var vw=document.createElement('section');vw.className='view';vw.id='v-aware';vw.innerHTML='<div class="scroll"><h2>🪞 Świadomość</h2><p class="mut">Poznawanie siebie, nie diagnoza. Dane zostają w tej przeglądarce.</p>'+
 '<div class="awc"><b>Check-in dnia</b><label class="mut">Nastrój <span id="aw-mv">3</span>/5</label><input type="range" id="aw-m" min="1" max="5" value="3"><label class="mut">Energia <span id="aw-ev">3</span>/5</label><input type="range" id="aw-e" min="1" max="5" value="3"><label class="mut">Sen (godz.)</label><input type="number" id="aw-s" min="0" max="14" step="0.5" value="7"><input id="aw-w" placeholder="Jedno słowo na dziś"><button class="pri" id="aw-save" style="margin-top:8px">Zapisz</button><div id="aw-chart" style="margin-top:10px"></div></div>'+
 '<div class="awc"><b>Wzorce i tydzień</b><div class="row"><button class="gh" id="aw-pat">Wyłap wzorce</button><button class="gh" id="aw-wk">Przegląd tygodnia</button></div><div class="awr" id="aw-out1"></div></div>'+
 '<div class="awc"><b>Perspektywy</b><select id="aw-c">'+Object.keys(CON).map(function(k){return '<option value="'+k+'">'+CON[k].split(':')[0]+'</option>'}).join('')+'</select><textarea id="aw-q" rows="3" placeholder="Co chcesz przemyśleć?"></textarea><button class="pri" id="aw-go">Spójrz z tej perspektywy</button><div class="awr" id="aw-out2"></div></div>'+
 '<div class="awc"><b>Moje wartości</b><textarea id="aw-v" rows="2" placeholder="Co było dziś ważne? Co dało Ci energię?"></textarea><button class="gh" id="aw-vgo">Wyciągnij wartości</button><div class="awr" id="aw-out3"></div></div></div>';
main_=document.querySelector('main');main_.appendChild(vw);
function chart(){var l=S.aw.slice(0,14).reverse();if(l.length<2){$('#aw-chart').innerHTML='<small class="mut">Wykres pojawi się po 2 check-inach.</small>';return}var W=300,H2=70,n=l.length;function pts(k){return l.map(function(e,i){return (i*(W/(n-1))).toFixed(1)+','+(H2-(e[k]-1)/4*H2).toFixed(1)}).join(' ')}
 $('#aw-chart').innerHTML='<svg viewBox="0 0 '+W+' '+H2+'" width="100%" height="80"><polyline fill="none" stroke="#27b6f2" stroke-width="2" points="'+pts('mood')+'"/><polyline fill="none" stroke="#ffb067" stroke-width="2" points="'+pts('en')+'"/></svg><small class="mut"><span style="color:#27b6f2">━</span> nastrój <span style="color:#ffb067">━</span> energia</small>'}
function awSum(){return S.aw.slice(0,14).map(function(e){return e.d+': nastrój '+e.mood+', energia '+e.en+', sen '+e.sl+'h, słowo: '+e.w}).join('\n')||'brak danych'}
var AWS='Jesteś '+'towarzyszem rozwoju świadomości użytkownika. Po polsku, ciepło i konkretnie. Nie diagnozujesz; wnioski podawaj jako hipotezy i pytania. ';
function run(btn,out,p){var o=$(out);o.textContent='Myślę…';btn.disabled=true;p.then(function(t){o.textContent=t;btn.disabled=false}).catch(function(e){o.textContent='Błąd: '+e.message;btn.disabled=false})}
$('#aw-m').oninput=function(){$('#aw-mv').textContent=this.value};$('#aw-e').oninput=function(){$('#aw-ev').textContent=this.value};
$('#aw-save').onclick=function(){S.aw.unshift({d:today(),mood:+$('#aw-m').value,en:+$('#aw-e').value,sl:+$('#aw-s').value,w:$('#aw-w').value.trim()});S.aw=S.aw.slice(0,365);save();$('#aw-w').value='';chart();alert('Zapisano check-in ✔')};
$('#aw-pat').onclick=function(){run(this,'#aw-out1',once(AWS+'Znajdź powtarzające się wzorce w check-inach (nastrój, energia, sen, słowa). Podaj 3 hipotezy i 1 pytanie do refleksji.',awSum(),{mod:'analysis'}))};
$('#aw-wk').onclick=function(){var b=this,o=$('#aw-out1');o.textContent='Myślę…';b.disabled=true;once(AWS+'Przegląd tygodnia: co dało energię, co ją zabrało, jedna rzecz do zmiany. Maksymalnie 6 zdań.',awSum(),{mod:'analysis'}).then(function(t){o.textContent=t;S.mem.push({id:uid(),t:'Przegląd tygodnia '+today()+': '+t.slice(0,300)});save();b.disabled=false}).catch(function(e){o.textContent='Błąd: '+e.message;b.disabled=false})};
$('#aw-go').onclick=function(){var q=$('#aw-q').value.trim();if(!q)return;run(this,'#aw-out2',once(AWS+'Perspektywa: '+CON[$('#aw-c').value]+' Zastosuj ją do pytania użytkownika, bez przesady, z jednym małym krokiem.',q,{mod:'analysis'}))};
$('#aw-vgo').onclick=function(){var q=$('#aw-v').value.trim();if(!q)return;run(this,'#aw-out3',once(AWS+'Z wypowiedzi wyciągnij 3-5 wartości, które za tym stoją (po jednym zdaniu każda) i zadaj jedno pytanie pogłębiające.',q,{mod:'analysis'}))};
chart();
TABS.push(['aware','🪞','Świadomość']);
var nv=document.getElementById('nav');function addAw(){if(!nv.querySelector('[data-t="aware"]')){var g=nv.querySelector('.ng .nc');if(g){var b=document.createElement('button');b.dataset.t='aware';b.innerHTML='<b>🪞</b>Świadomość';g.appendChild(b)}}}
new MutationObserver(addAw).observe(nv,{childList:true});addAw();
upd();
})();
var main_;
