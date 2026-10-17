/* ===== Gemini 3.8: nowe domyślne modele + łańcuch zapasowy głosu ===== */
(function(){
var NEW='gemini-3.8-flash',TTS=['gemini-3.8-flash-tts','gemini-3.8-flash-lite-tts','gemini-2.5-flash-preview-tts'];
if(!S.gtts||/2\.5-flash-preview-tts/.test(S.gtts))S.gtts=TTS[0];
if(S.prov==='gemini'&&(!S.model||/^gemini-(2\.0|1\.5)/.test(S.model))){S.model=NEW;$('#model').value=NEW}
if(!S.fb&&S.prov==='gemini')S.fb='gemini-3.5-flash-lite';
var g=$('#gtts');if(g&&g.value!==S.gtts)g.value=S.gtts;
var pr=$('#prov');var old=pr.onchange;pr.onchange=function(){var r=old.apply(this,arguments);if(this.value==='gemini')$('#model').value=NEW;return r};
var oc=$('#v-cat').onclick;$('#v-cat').onclick=function(e){var r=oc.apply(this,arguments);if(e.target.dataset&&e.target.dataset.use==='gemini'){S.model=NEW;save();fill()}return r};
function body(t,v){return{contents:[{parts:[{text:'Powiedz po polsku, '+v.s+': '+t}]}],generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:v.g}}}}}}
gtts=function(t,v){var list=[S.gtts].concat(TTS.filter(function(m){return m!==S.gtts}));
 function one(i){return jf('https://generativelanguage.googleapis.com/v1beta/models/'+list[i]+':generateContent',{'x-goog-api-key':S.key},body(t,v)).then(function(j){return wav(j.candidates[0].content.parts[0].inlineData.data)}).catch(function(e){if(i+1<list.length)return one(i+1);throw e})}
 return one(0)};
var h=document.querySelector('#v-set .scroll');if(h){var s=h.querySelector('small');[].forEach.call(h.querySelectorAll('small'),function(x){if(/gemini-2\.0-flash/.test(x.textContent))x.textContent='Podpowiedź: Gemini 3.8 Flash (gemini-3.8-flash) jest domyślny i ma darmowy limit; OpenAI gpt-4o / gpt-4.1; Claude claude-sonnet-4-5. Aktualne nazwy znajdziesz po „Pobierz modele”.'})}
})();
/* ===== v11: limity darmowego planu (429), model zapasowy w czacie, czystszy czat ===== */
function qerr(e){return/quota|rate.?limit|limit zapyta|RESOURCE_EXHAUSTED|retry in|429|no longer available|not found|overloaded|unavailable/i.test(String(e&&e.message||e))}
var _jf=jf;
jf=function(url,h,b){return _jf(url,h,b).catch(function(e){var m=String(e&&e.message||e);if(!/quota|rate.?limit|RESOURCE_EXHAUSTED|retry in|429/i.test(m))throw e;
 var s=(m.match(/retry in ([\d.]+)\s*s/i)||[])[1];s=s?Math.ceil(parseFloat(s))+1:15;
 if(s>40||(S.fb&&S.fb!==S.model&&s>8&&!window.__fbTry))throw new Error('Darmowy limit zapytań wyczerpany. Odczekaj chwilę, przełącz model (np. gemini-3.5-flash-lite) albo użyj innego dostawcy w Katalogu.');
 try{$('#status').textContent='Darmowy limit: czekam '+s+' s i ponawiam…'}catch(x){}
 return new Promise(function(r){setTimeout(r,s*1000)}).then(function(){try{theme()}catch(x){}return _jf(url,h,b)})})};
var _llm=llm;
llm=function(msgs){return _llm(msgs).catch(function(e){if(qerr(e)&&S.fb&&S.fb!==S.model){var keep=S.model;S.model=S.fb;return _llm(msgs).then(function(r){S.model=keep;return r},function(e2){S.model=keep;throw e2})}throw e})};
memTick=function(){S.mc++;Object.keys(S.hist).forEach(function(k){if(S.hist[k].length>300)S.hist[k].splice(0,S.hist[k].length-300)});if(S.mc>=10)consolidate()};
render=function(){var h=H();$('#msgs').innerHTML=h.filter(function(m){return m.show}).map(function(m){var t=m.text;if(m.cls==='t'){t=String(t).split('\n')[0];if(t.length>90)t=t.slice(0,90)+'…'}return '<div class="m '+m.cls+'">'+esc(t)+'</div>'}).join('')||'<div class="m t">Cześć! Jestem '+esc(P[S.pers].n)+'. Napisz lub naciśnij 🎤.</div>';$('#msgs').scrollTop=1e9};
render();
/* ===== v13: automatyczny dobór modelu do API ===== */
(function(){
var BAD=/whisper|tts|orpheus|guard|safeguard|embed|moderation|transcribe|image|imagen|veo|dall|audio|live|realtime|allam|rerank|robotics|aqa|nano-banana|omni/i;
var SC=[[/pro\b/,30],[/opus/,35],[/sonnet/,30],[/gpt-5/,35],[/gpt-4\.1(?!-mini|-nano)/,25],[/gpt-4o(?!-mini)/,20],[/3\.8/,28],[/3\.6/,20],[/3\.5/,14],[/405b/,30],[/120b/,28],[/70b/,25],[/32b|27b/,15],[/qwen3|qwen-3/,10],[/llama-3\.3/,12],[/reasoner|deepseek-r1|deepseek-chat/,15],[/flash/,10],[/lite|mini|nano|small|instant|haiku/,-8],[/\b8b\b|-8b|7b/,-10],[/preview|exp/,-2]];
function score(id){if(BAD.test(id))return -999;var s=0;SC.forEach(function(r){if(r[0].test(id))s+=r[1]});return s}
function rank(l){return l.filter(function(m){return score(m)>-999}).sort(function(a,b){return score(b)-score(a)})}
function autoPick(){var st=$('#mstat');S.key=$('#key').value.trim()||S.key;S.prov=$('#prov').value;st.textContent='Pobieram listę modeli…';
 return listModels().then(function(l){S.models[S.prov]=l.slice().sort();var r=rank(l);if(!r.length)throw new Error('Brak modeli do rozmowy na tej liście');
  var cand=r.slice(0,4),oks=[],i=0;S.ok[S.prov]=S.ok[S.prov]||{};
  function nx(){if(i>=cand.length||oks.length>=3)return Promise.resolve();var m=cand[i++];st.textContent='Testuję '+m+' ('+i+'/'+cand.length+')…';return ping(m).then(function(x){S.ok[S.prov][m]=x;if(x===true)oks.push(m);return nx()})}
  return nx().then(function(){if(!oks.length)throw new Error('Żaden z najlepszych modeli nie odpowiedział. Sprawdź klucz i limity.');
   S.model=oks[0];S.fb=oks[1]||'';S.fast=oks.filter(function(m){return/lite|mini|nano|small|instant|haiku|8b|20b/i.test(m)})[0]||oks[oks.length-1];S.fastp=S.prov;
   S.chain=oks.concat(r.filter(function(m){return oks.indexOf(m)<0}).slice(0,3));S.chainp=S.prov;$('#model').value=S.model;save();mfill();
   st.textContent='✅ Główny: '+S.model+(S.fb?' · zapasowy: '+S.fb:'')+' · szybki: '+S.fast})}).catch(function(e){st.textContent='❌ '+e.message})}
var row=$('#testall').parentNode,b=document.createElement('button');b.className='pri';b.id='autob';b.textContent='🤖 Auto-dobór najlepszego modelu';b.style.margin='8px 0';row.parentNode.insertBefore(b,row);
b.onclick=function(){work(b,'Dobieram…',autoPick())};
var LIGHT=/^(router|mem|dash)$/,_o=once;once=function(s,u,o){o=o||{};if(!o.model&&!(S.mm&&S.mm[o.mod])&&S.fast&&S.fastp===S.prov&&LIGHT.test(o.mod||''))o.model=S.fast;return _o(s,u,o)};
var _l=llm;llm=function(m){return _l(m).catch(function(e){var t=String(e&&e.message||e);if(!/does not exist|not found|no longer available|decommission|access to it|model_not_found/i.test(t)||S.chainp!==S.prov)throw e;
 var ch=(S.chain||[]).filter(function(x){return x!==S.model});function nx(i){if(i>=ch.length)throw e;var keep=S.model;S.model=ch[i];return _l(m).then(function(r){$('#model').value=S.model;save();return r},function(e2){S.model=keep;return nx(i+1)})}return nx(0)})};
window.__autoPick=autoPick;
})();
