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
