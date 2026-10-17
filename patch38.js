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
