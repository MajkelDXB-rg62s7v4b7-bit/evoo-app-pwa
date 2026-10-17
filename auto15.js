/* ===== v15: Dodaj API, automatyczne wykrywanie (wklej klucz lub adres URL) ===== */
(function(){
var DET=[[/^sk-ant-/,['anthropic']],[/^sk-or-/,['openrouter']],[/^gsk_/,['groq']],[/^AIza/,['gemini']],[/^nvapi-/,['nvidia']],[/^xai-/,['xai']],[/^csk-/,['cerebras']],[/^sk-/,['openai','deepseek']],[/^[a-f0-9]{64}$/,['together']],[/^[A-Za-z0-9]{32}$/,['mistral']]];
function cands(k){for(var i=0;i<DET.length;i++)if(DET[i][0].test(k))return DET[i][1];return[]}
function nm(id){var c=CAT.filter(function(x){return x.id===id})[0];return c?c.n:id}
function st(t){var e=$('#ad-st');if(e)e.textContent=t}
function done(id,list){S.models[id]=list.slice().sort();S.prov=id;S.model='';save();provOpts();fill();mfill();
 st('Wykryto: '+nm(id)+' ('+list.length+' modeli). Dobieram najlepszy…');
 var f=window.__autoPick&&window.__autoPick();if(f)f.then(function(){st($('#mstat').textContent);instList()});else instList()}
function tryOne(id,key){var c=CAT.filter(function(x){return x.id===id})[0];
 if(c&&c.built){var oldK=S.key,oldP=S.prov;S.key=key;S.prov=id;$('#key').value=key;return listModels().then(function(l){return l},function(e){S.key=oldK;S.prov=oldP;throw e})}
 var had=cust(id);addProv(c,key);return listModels().then(function(l){return l},function(e){if(!had)S.cust=S.cust.filter(function(x){return x.id!==id});save();throw e})}
function run(){var raw=($('#ad-in').value||'').trim(),k2=($('#ad-k2').value||'').trim();if(!raw){alert('Wklej klucz API lub adres URL.');return}
 if(/^https:\/\//i.test(raw)){var b=raw.replace(/\/+$/,'');if(!/\/v\d/.test(b))b+='/v1';var host=b.replace(/^https:\/\//,'').split('/')[0],id='x'+uid();
  S.cust.push({id:id,n:host,base:b,key:k2,custom:1});S.prov=id;save();provOpts();st('Sprawdzam '+host+'…');
  return listModels().then(function(l){done(id,l)},function(e){S.cust=S.cust.filter(function(x){return x.id!==id});S.prov='openai';save();provOpts();st('❌ Nie udało się połączyć z '+host+': '+e.message)})}
 var cs=cands(raw);if(!cs.length){st('❌ Nie rozpoznano dostawcy po kluczu. Wklej adres API (https://…/v1) i klucz w drugim polu.');return}
 var i=0,last=null;function nx(){if(i>=cs.length){st('❌ Klucz nie działa albo dostawca blokuje wywołania z przeglądarki ('+(last&&last.message||'błąd')+').');return}var id=cs[i++];st('Próbuję: '+nm(id)+'…');return tryOne(id,raw).then(function(l){done(id,l)},function(e){last=e;return nx()})}
 return nx()}
function instList(){var el=$('#ad-list');if(!el)return;var h='';
 var built=[['gemini','Google Gemini'],['openai','OpenAI'],['anthropic','Anthropic Claude']];
 S.cust.forEach(function(c){var l=(S.models[c.id]||[]).slice(0,4);h+='<div class="card"><div class="row"><b class="grow">'+(S.prov===c.id?'🟢 ':'⚪ ')+esc(c.n)+'</b><button class="gh" data-adu="'+c.id+'">Użyj</button><button class="gh" data-adr="'+c.id+'">🗑</button></div><small class="mut">'+esc(c.base)+'</small><div class="chips">'+l.map(function(m){return '<span class="chip">'+esc(m)+'</span>'}).join('')+'</div></div>'});
 if(S.key)built.forEach(function(b){if(b[0]===S.prov&&!cust(b[0]))h='<div class="card"><div class="row"><b class="grow">🟢 '+b[1]+'</b></div><small class="mut">'+esc(S.model||'')+'</small></div>'+h});
 el.innerHTML='<b>Zainstalowane API ('+(S.cust.length+((S.key&&!cust(S.prov))?1:0))+')</b>'+(h||'<p class="mut">Jeszcze nic. Wklej klucz powyżej.</p>')}
var sc=$('#v-set .scroll'),card=document.createElement('div');card.className='card';
card.innerHTML='<b>🔑 Dodaj API: automatyczne wykrywanie</b><p class="mut" style="margin:4px 0">Wklej klucz API (np. sk-…, AIza…, gsk_…, nvapi-…) albo adres URL. Evoo rozpozna dostawcę, pobierze modele i wybierze najlepszy.</p><input id="ad-in" type="password" autocomplete="off" placeholder="Klucz API lub adres https://…"><input id="ad-k2" type="password" autocomplete="off" placeholder="Klucz (tylko gdy wkleiłeś adres URL)"><button class="pri" id="ad-go">Dodaj i dobierz modele</button><small id="ad-st"></small><div id="ad-list" style="margin-top:12px"></div>';
sc.insertBefore(card,sc.children[1]);
$('#ad-go').onclick=function(){var b=this;work(b,'Wykrywam…',Promise.resolve(run()))};
card.addEventListener('click',function(e){var d=e.target.dataset||{};
 if(d.adu){S.prov=d.adu;S.model='';save();provOpts();fill();mfill();instList();var f=window.__autoPick&&window.__autoPick();if(f)f.then(instList);return}
 if(d.adr){S.cust=S.cust.filter(function(x){return x.id!==d.adr});if(S.prov===d.adr){S.prov='openai';S.model=''}save();provOpts();fill();mfill();instList()}});
var _go=go;go=function(t){_go(t);if(t==='set')instList()};instList();
window.__adrun=run;
})();
/* ===== v15: menu drzewko (duży ekran) + Ustawienia w zwijanych sekcjach ===== */
(function(){
var G=[['assist','🤖 Asystent',['chat','exp','jour']],['work','🗂️ Praca',['dash','tasks','proj','cal','agents','studio']],['money','💰 Pieniądze',['money']],['know','🧠 Wiedza',['mem']],['build','🛠️ Rozbudowa',['lab','imp','cat','conn']],['sett','⚙️ Ustawienia',['set']]];
var cur='chat',open={assist:1,work:1,money:1,know:1,build:1,sett:1},nav=$('#nav');
function tab(k){return TABS.filter(function(t){return t[0]===k})[0]}
function btn(k){var t=tab(k);return t?'<button data-t="'+k+'"><b>'+t[1]+'</b>'+t[2]+'</button>':''}
function wide(){return window.matchMedia&&window.matchMedia('(min-width:1000px)').matches}
function build(){if(wide()){nav.innerHTML=G.map(function(g){return '<div class="ng'+(open[g[0]]?'':' shut')+'"><button class="ngh" data-g="'+g[0]+'"><span>'+(open[g[0]]?'▾':'▸')+'</span> '+g[1]+'</button><div class="nc">'+g[2].map(btn).join('')+'</div></div>'}).join('')}
 else nav.innerHTML=TABS.map(function(t){return '<button data-t="'+t[0]+'"><b>'+t[1]+'</b>'+t[2]+'</button>'}).join('');mark()}
function mark(){[].forEach.call(nav.querySelectorAll('button[data-t]'),function(b){b.classList.toggle('on',b.dataset.t===cur)})}
nav.addEventListener('click',function(e){var h=e.target.closest('.ngh');if(!h)return;e.stopPropagation();var k=h.dataset.g;open[k]=!open[k];build()},true);
var _g2=go;go=function(t){cur=t;if(wide()){G.forEach(function(g){if(g[2].indexOf(t)>=0)open[g[0]]=1});build()}_g2(t);mark()};
if(window.matchMedia){var mq=window.matchMedia('(min-width:1000px)');(mq.addEventListener?mq.addEventListener.bind(mq,'change'):mq.addListener.bind(mq))(build)}
var css=document.createElement('style');css.textContent='.ng{display:contents}.ngh{display:none}.nc{display:contents}@media(min-width:1000px){nav{width:200px}.ng{display:block;margin-bottom:6px}.ngh{display:flex;gap:6px;width:100%;background:none;border:0;color:var(--m);font:600 12px inherit;letter-spacing:.04em;text-transform:uppercase;padding:8px 10px;cursor:pointer;text-align:left}.nc{display:block;padding-left:6px}.ng.shut .nc{display:none}}details.sec{background:var(--p);border:1px solid var(--l);border-radius:14px;margin-bottom:10px;padding:0 10px}details.sec>summary{cursor:pointer;font-weight:600;padding:14px 4px;list-style:none}details.sec>summary::-webkit-details-marker{display:none}details.sec[open]>summary{border-bottom:1px solid var(--l);margin-bottom:10px}details.sec .card{background:none;border:0;padding:0 0 10px;margin:0 0 6px}#setbar{position:sticky;bottom:0;background:linear-gradient(transparent,var(--bg) 30%);padding:14px 0 8px;margin-top:6px}';document.head.appendChild(css);
/* Ustawienia: sekcje */
var sc=$('#v-set .scroll'),cards=[].slice.call(sc.children).filter(function(c){return c.classList.contains('card')}),foot=[].slice.call(sc.children).filter(function(c){return c.classList.contains('row')}).pop();
var S2=[['🔑 API i modele',/Dodaj API|Model myślowy/,1],['🎙️ Głos i avatar',/Głos|Avatar|Zdjęcie avatara/,0],['🧠 Osobowość asystenta',/Osobowość/,0],['🔒 Serwer i dane',/Serwer prywatny/,0]];
var used=[];S2.forEach(function(s){var d=document.createElement('details');d.className='sec';if(s[2])d.open=true;var sm=document.createElement('summary');sm.textContent=s[0];d.appendChild(sm);var n=0;
 cards.forEach(function(c){if(used.indexOf(c)>=0)return;var b=c.querySelector('b');var t=b?b.textContent:'';if(s[1].test(t)){d.appendChild(c);used.push(c);n++}});if(n)sc.insertBefore(d,foot)});
cards.forEach(function(c){if(used.indexOf(c)<0){var d=document.createElement('details');d.className='sec';d.innerHTML='<summary>Inne</summary>';d.appendChild(c);sc.insertBefore(d,foot)}});
if(foot){foot.id='setbar'}
build();
})();
