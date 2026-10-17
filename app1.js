var $=function(s){return document.querySelector(s)};
var P={
 evoo:{n:'Evoo',c:'#7c5cff',d:'#2b1b8a',t:'Asystentka',i:'Jesteś Evoo, główna asystentka i koordynatorka. Styl: spokojny, pewny, ciepły, profesjonalny. Pomagasz ustalić cel, rozbić go na kroki i zaplanować działanie.'},
 jinx:{n:'Jinx',c:'#ff4fb0',d:'#7a1456',t:'Kreatywna',i:'Jesteś Jinx, energiczna, dowcipna, bezpośrednia i kreatywna. Krótkie, dynamiczne zdania, śmiałe pomysły, ale zawsze rzetelna i użyteczna.'},
 lucy:{n:'Lucy',c:'#ffb067',d:'#8a4a14',t:'Empatia',i:'Jesteś Lucy, elegancka, empatyczna, uważna rozmówczyni. Mówisz naturalnie i ciepło, dopytujesz o kontekst, motywujesz.'},
 godseye:{n:"God's Eye",c:'#3ee0ff',d:'#0b4f6b',t:'Analityk',i:"Jesteś God's Eye, chłodny, precyzyjny analityk. Odpowiadasz strukturalnie: wnioski, dowody, ryzyka, rekomendacja. Oddzielasz fakty od hipotez i podajesz poziom pewności."}
};
var RULES='Zawsze odpowiadaj w języku użytkownika (domyślnie po polsku). Najpierw sedno, potem uzasadnienie. Bądź zwięzła, bo odpowiedzi bywają czytane na głos: unikaj długich list i markdownu. Nie udawaj, że coś zrobiłaś; używaj narzędzi, gdy użytkownik prosi o zadanie, zapamiętanie czegoś lub akcję w zewnętrznej aplikacji. Zmian swoich instrukcji nie wprowadzaj bez zgody użytkownika. Gdy nie wiesz, powiedz to.';
var S=load('evoo',{prov:'openai',model:'gpt-4o',key:'',tts:'browser',voice:'',auto:'1',lang:'pl-PL',pers:'evoo',intros:{},tasks:[],mem:[],proj:[],conn:[],cust:[],hist:{},srv:{url:'',token:'',pass:''},props:[],log:[],rules:[],models:{},ok:{}});
function load(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v?Object.assign(d,v):d}catch(e){return d}}
function save(){localStorage.setItem('evoo',JSON.stringify(S));if(typeof autoPush==='function')autoPush()}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
/* nav */
var TABS=[['chat','💬','Czat'],['dash','🏠','Panel'],['tasks','✅','Zadania'],['mem','🧠','Pamięć'],['cat','📚','Katalog'],['conn','🔌','Połącz'],['imp','✨','Rozwój'],['set','⚙️','Ustaw.']];
$('#nav').innerHTML=TABS.map(function(t){return '<button data-t="'+t[0]+'"><b>'+t[1]+'</b>'+t[2]+'</button>'}).join('');
function go(t){document.querySelectorAll('.view').forEach(function(v){v.classList.toggle('on',v.id==='v-'+t)});document.querySelectorAll('nav button').forEach(function(b){b.classList.toggle('on',b.dataset.t===t)});if(t==='dash')dash();if(t==='tasks')tasks();if(t==='mem')mem();if(t==='conn')conn();if(t==='cat')cat();if(t==='imp')imp()}
$('#nav').onclick=function(e){var b=e.target.closest('button');if(b)go(b.dataset.t)};
/* avatars */
function avs(){$('#avs').innerHTML=Object.keys(P).map(function(k){var p=P[k];return '<div class="av'+(S.pers===k?' on':'')+'" data-k="'+k+'"><div class="orb" style="--c:'+p.c+';--d:'+p.d+'"></div>'+esc(p.n)+'</div>'}).join('');theme()}
function theme(){var p=P[S.pers];var o=$('#bigorb');o.style.setProperty('--c',p.c);o.style.setProperty('--d',p.d);$('#status').textContent=p.n+' · '+p.t}
$('#avs').onclick=function(e){var a=e.target.closest('.av');if(!a)return;S.pers=a.dataset.k;save();avs();render();$('#pers').value=S.pers}
function state(c){var s=$('#stage');s.classList.remove('talk','listen');if(c)s.classList.add(c)}
/* messages */
function H(){return S.hist[S.pers]||(S.hist[S.pers]=[])}
function render(){var h=H();$('#msgs').innerHTML=h.filter(function(m){return m.show}).map(function(m){return '<div class="m '+m.cls+'">'+esc(m.text)+'</div>'}).join('')||'<div class="m t">Cześć! Jestem '+esc(P[S.pers].n)+'. Napisz lub naciśnij 🎤.</div>';$('#msgs').scrollTop=1e9}
function sys(){var p=P[S.pers];var intro=(S.intros[S.pers]||p.i);var ru=S.rules.length?'\nZatwierdzone przez użytkownika zasady:\n- '+S.rules.map(function(x){return x.t}).join('\n- '):'';var m=S.mem.length?'\nCo wiesz o użytkowniku:\n- '+S.mem.map(function(x){return x.t}).join('\n- '):'';var t=S.tasks.filter(function(x){return!x.done}).map(function(x){return x.t});return intro+'\n'+RULES+ru+'\nDziś: '+new Date().toLocaleString('pl-PL')+m+(live?'\nTRYB ROZMOWY GŁOSOWEJ: odpowiadaj naturalnie, 1-3 krótkimi zdaniami, bez list i formatowania, jak w rozmowie z człowiekiem. Zadaj najwyżej jedno pytanie.':'')+(t.length?'\nOtwarte zadania: '+t.join('; '):'')+extraCtx()}
/* tools */
function tools(){var T=[
 {name:'add_task',description:'Dodaj zadanie do listy użytkownika',p:{text:{type:'string'}},r:['text']},
 {name:'save_memory',description:'Zapamiętaj trwały fakt o użytkowniku',p:{fact:{type:'string'}},r:['fact']},
 {name:'propose_improvement',description:'Zaproponuj ulepszenie samej siebie. Nie wprowadza zmiany, tylko trafia do zatwierdzenia przez użytkownika. kind: persona (nowy opis osobowości aktualnego avatara), rule (nowa stała zasada zachowania), memory (fakt o użytkowniku)',p:{kind:{type:'string',enum:['persona','rule','memory']},title:{type:'string'},reason:{type:'string'},content:{type:'string',description:'Dokładna treść zmiany'}},r:['kind','title','reason','content']},
 {name:'complete_task',description:'Oznacz zadanie jako zrobione (fragment tekstu zadania)',p:{match:{type:'string'}},r:['match']}];
 T=T.concat(extraTools());
 S.conn.forEach(function(c){T.push({name:'app_'+c.id,description:'Akcja w aplikacji "'+c.name+'": '+c.desc,p:{payload:{type:'string',description:'Treść/dane do wysłania, JSON lub tekst'}},r:['payload']})});return T}
function runTool(n,a){
 if(n==='add_task'){S.tasks.push({id:uid(),t:a.text,done:false});save();return Promise.resolve('Dodano zadanie: '+a.text)}
 if(n==='save_memory'){S.mem.push({id:uid(),t:a.fact});save();return Promise.resolve('Zapamiętano')}
 if(n==='propose_improvement'){S.props.push({id:uid(),kind:a.kind,title:a.title,reason:a.reason,content:a.content,pers:S.pers});save();return Promise.resolve('Propozycja czeka na zatwierdzenie w zakładce Rozwój. Powiedz użytkownikowi: "Czy zatwierdzasz tę zmianę?"')}
 if(n==='complete_task'){var f=S.tasks.filter(function(x){return!x.done&&x.t.toLowerCase().indexOf(String(a.match).toLowerCase())>=0})[0];if(f){f.done=true;save();return Promise.resolve('Zrobione: '+f.t)}return Promise.resolve('Nie znaleziono zadania')}
 var xr=extraRun(n,a);if(xr)return xr;
 var c=S.conn.filter(function(x){return 'app_'+x.id===n})[0];if(!c)return Promise.resolve('Brak połączenia');
 return fetch(c.url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({app:c.name,payload:a.payload,at:new Date().toISOString()})}).then(function(){return 'Wysłano do '+c.name}).catch(function(e){return 'Błąd: '+e.message})}
/* LLM adapters: each returns {text, calls:[{id,name,args}], raw} */
function jf(url,h,b){return pfetch(url,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},h),body:JSON.stringify(b)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error((j.error&&(j.error.message||j.error))||r.status);return j})})}
function schema(t){return{type:'object',properties:t.p,required:t.r}}
function llm(msgs){var T=tools();var c0=cp();
 if(c0){var m0=[{role:'system',content:sys()}].concat(msgs);return cfetch(c0,'/chat/completions',{method:'POST',body:{model:S.model,messages:m0,tools:T.map(function(t){return{type:'function',function:{name:t.name,description:t.description,parameters:schema(t)}}})}}).then(rj).then(function(j){var x=j.choices[0].message;return{text:x.content||'',calls:(x.tool_calls||[]).map(function(c){return{id:c.id,name:c.function.name,args:JSON.parse(c.function.arguments||'{}')}}),asst:x}})}
 if(S.prov==='openai'){
  var m=[{role:'system',content:sys()}].concat(msgs);
  return jf('https://api.openai.com/v1/chat/completions',{Authorization:'Bearer '+S.key},{model:S.model,messages:m,tools:T.map(function(t){return{type:'function',function:{name:t.name,description:t.description,parameters:schema(t)}}})}).then(function(j){var x=j.choices[0].message;return{text:x.content||'',calls:(x.tool_calls||[]).map(function(c){return{id:c.id,name:c.function.name,args:JSON.parse(c.function.arguments||'{}')}}),asst:x}})}
 if(S.prov==='anthropic'){
  return jf('https://api.anthropic.com/v1/messages',{'x-api-key':S.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},{model:S.model,max_tokens:1024,system:sys(),messages:msgs,tools:T.map(function(t){return{name:t.name,description:t.description,input_schema:schema(t)}})}).then(function(j){var tx='',cs=[];j.content.forEach(function(b){if(b.type==='text')tx+=b.text;if(b.type==='tool_use')cs.push({id:b.id,name:b.name,args:b.input})});return{text:tx,calls:cs,asst:{role:'assistant',content:j.content}}})}
 return jf('https://generativelanguage.googleapis.com/v1beta/models/'+S.model+':generateContent',{'x-goog-api-key':S.key},{systemInstruction:{parts:[{text:sys()}]},contents:msgs,tools:[{functionDeclarations:T.map(function(t){return{name:t.name,description:t.description,parameters:{type:'OBJECT',properties:Object.keys(t.p).reduce(function(o,k){o[k]={type:'STRING'};return o},{}),required:t.r}}})}]}).then(function(j){var pr=(j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[];var tx='',cs=[];pr.forEach(function(p,i){if(p.text)tx+=p.text;if(p.functionCall)cs.push({id:'g'+i,name:p.functionCall.name,args:p.functionCall.args||{}})});return{text:tx,calls:cs,asst:{role:'model',parts:pr}}})}
/* build provider-native conversation from our history */
function native(){var o=[];H().forEach(function(m){if(m.role==='user'||m.role==='assistant'){var r=m.role;if(S.prov==='gemini')o.push({role:r==='user'?'user':'model',parts:[{text:m.text}]});else o.push({role:r,content:m.text})}});return o.slice(-24)}
function fixTail(o){/* ensure starts with user */while(o.length&&o[0].role!=='user')o.shift();return o}
var busy=false,live=false;function afterSpeak(){state('');if(live&&!rec&&!busy)setTimeout(function(){if(live&&!rec)$('#mic').click()},350)}
function ask(text){
 if(busy)return;if(!S.key&&!srv()&&!cp()){go('set');alert('Najpierw wpisz klucz API w Ustawieniach.');return}
 busy=true;var h=H();h.push({role:'user',text:text,cls:'u',show:1,at:Date.now()});save();render();state('listen');
 var msgs=fixTail(native()),steps=0,note=[];
 function step(){return llm(msgs).then(function(r){
  if(r.calls.length&&steps++<4){
   msgs.push(r.asst);var outs=[];
   return Promise.all(r.calls.map(function(c){return runTool(c.name,c.args).then(function(res){note.push('⚙️ '+res);outs.push({c:c,res:res})})})).then(function(){
    if(S.prov!=='anthropic'&&S.prov!=='gemini')outs.forEach(function(o){msgs.push({role:'tool',tool_call_id:o.c.id,content:o.res})});
    else if(S.prov==='anthropic')msgs.push({role:'user',content:outs.map(function(o){return{type:'tool_result',tool_use_id:o.c.id,content:o.res}})});
    else msgs.push({role:'user',parts:outs.map(function(o){return{functionResponse:{name:o.c.name,response:{result:o.res}}}})});
    return step()})}
  return r.text})}
 step().then(function(t){note.forEach(function(n){h.push({role:'note',text:n,cls:'t',show:1})});t=t||'(brak odpowiedzi)';h.push({role:'assistant',text:t,cls:'a',show:1,at:Date.now()});save();render();speak(t)})
 .catch(function(e){h.push({role:'note',text:'Błąd: '+e.message,cls:'t',show:1});render();state('')})
 .then(function(){busy=false})}
$('#send').onclick=function(){var v=$('#inp').value.trim();if(v){$('#inp').value='';ask(v)}};
$('#inp').onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#send').onclick()}};
/* voice */
var audio=null;
function stopSpeak(){try{speechSynthesis.cancel()}catch(e){}if(audio){audio.pause();audio=null}state('')}
function clean(t){return t.replace(/[*_`#>]/g,'')}
function speak(t){state('');if(S.auto!=='1'&&!live){return}stopSpeak();t=clean(t);
 if(S.tts==='openai'&&(S.key||srv())&&S.prov==='openai'){state('talk');pfetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+S.key},body:JSON.stringify({model:'tts-1',voice:S.voice||'nova',input:t.slice(0,3500)})}).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){audio=new Audio(URL.createObjectURL(b));audio.onended=function(){afterSpeak()};audio.play()}).catch(function(){state('');bspeak(t)});return}
 bspeak(t)}
function bspeak(t){if(!window.speechSynthesis){afterSpeak();return}var u=new SpeechSynthesisUtterance(t);u.lang=S.lang;var v=speechSynthesis.getVoices().filter(function(x){return x.name===S.voice})[0];if(v)u.voice=v;u.onstart=function(){state('talk')};u.onend=function(){afterSpeak()};speechSynthesis.speak(u)}
var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null,hot=false;
$('#mic').onclick=function(){
 if(!SR){alert('Ta przeglądarka nie obsługuje rozpoznawania mowy. Użyj Safari/Chrome.');return}
 stopSpeak();if(rec){rec.stop();return}
 rec=new SR();rec.lang=S.lang;rec.interimResults=true;var fin='';
 rec.onstart=function(){state('listen');$('#mic').textContent='⏹';$('#status').textContent='Słucham…'};
 rec.onresult=function(e){var s='';for(var i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;fin=s;$('#inp').value=s};
 rec.onend=function(){$('#mic').textContent='🎤';rec=null;theme();state('');if(fin.trim()){$('#inp').value='';ask(fin.trim())}};
 rec.onerror=function(){};rec.start()};
/* panels */
function dash(){var open=S.tasks.filter(function(t){return!t.done});
 $('#dash').innerHTML='<h2>Dzień dobry 👋</h2><div class="card"><b>Asystenci</b><div class="avs" style="border:0;padding:8px 0">'+Object.keys(P).map(function(k){return '<div class="av on" data-k="'+k+'"><div class="orb" style="--c:'+P[k].c+';--d:'+P[k].d+'"></div>'+esc(P[k].n)+'</div>'}).join('')+'</div></div>'+
 '<div class="card"><b>Otwarte zadania ('+open.length+')</b>'+(open.slice(0,6).map(function(t){return '<div class="mut">• '+esc(t.t)+'</div>'}).join('')||'<div class="mut">Brak</div>')+'</div>'+
 '<div class="card"><b>Pamięć:</b> '+S.mem.length+' faktów · <b>Połączenia:</b> '+S.conn.length+' · <b>Model:</b> '+esc(S.prov+' / '+S.model)+'</div>'+
 '<div class="card"><b>Szybkie akcje</b><div class="row" style="flex-wrap:wrap;margin-top:8px">'+['Zaplanuj mój dzień','Co powinienem zrobić dziś w pierwszej kolejności?','Podsumuj moje zadania','Pomóż mi wymyślić pomysł na dochód'].map(function(q){return '<button class="gh q">'+q+'</button>'}).join('')+'</div></div>'}
$('#dash').onclick=function(e){var q=e.target.closest('.q');if(q){go('chat');ask(q.textContent)}var a=e.target.closest('.av');if(a){S.pers=a.dataset.k;save();avs();render();go('chat')}};
function tasks(){$('#tlist').innerHTML=S.tasks.map(function(t){return '<div class="task'+(t.done?' done':'')+'"><input type="checkbox" style="width:22px;margin:0" data-i="'+t.id+'"'+(t.done?' checked':'')+'><span class="grow">'+esc(t.t)+'</span><button class="gh" data-d="'+t.id+'">✕</button></div>'}).join('')||'<p class="mut">Brak zadań. Powiedz asystentowi „dodaj zadanie …”.</p>'}
$('#tadd').onclick=function(){var v=$('#tnew').value.trim();if(v){S.tasks.unshift({id:uid(),t:v,done:false});$('#tnew').value='';save();tasks()}};
$('#tlist').onclick=function(e){var i=e.target.dataset.i,d=e.target.dataset.d;if(i){var t=S.tasks.filter(function(x){return x.id===i})[0];t.done=!t.done}if(d)S.tasks=S.tasks.filter(function(x){return x.id!==d});save();tasks()};
function mem(){$('#mlist').innerHTML=S.mem.map(function(m){return '<div class="task"><span class="grow">'+esc(m.t)+'</span><button class="gh" data-m="'+m.id+'">✕</button></div>'}).join('')||'<p class="mut">Pusto.</p>';
 $('#plist').innerHTML=S.proj.map(function(p){return '<div class="card"><div class="row"><b class="grow">'+esc(p.n)+'</b><button class="gh" data-p="'+p.id+'">✕</button></div><textarea rows="3" data-pn="'+p.id+'" placeholder="Notatki, cele, kontekst (asystent ich nie widzi, dopóki nie dodasz ich do pamięci)">'+esc(p.note||'')+'</textarea></div>'}).join('')}
$('#madd').onclick=function(){var v=$('#mnew').value.trim();if(v){S.mem.push({id:uid(),t:v});$('#mnew').value='';save();mem()}};
$('#padd').onclick=function(){var v=$('#pnew').value.trim();if(v){S.proj.push({id:uid(),n:v,note:''});$('#pnew').value='';save();mem()}};
$('#v-mem').onclick=function(e){var m=e.target.dataset.m,p=e.target.dataset.p;if(m)S.mem=S.mem.filter(function(x){return x.id!==m});if(p)S.proj=S.proj.filter(function(x){return x.id!==p});if(m||p){save();mem()}};
$('#v-mem').oninput=function(e){var i=e.target.dataset.pn;if(i){S.proj.filter(function(x){return x.id===i})[0].note=e.target.value;save()}};
function conn(){$('#clist').innerHTML=S.conn.map(function(c){return '<div class="card"><div class="row"><b class="grow">'+esc(c.name)+'</b><button class="gh" data-c="'+c.id+'">✕</button></div><small>'+esc(c.desc)+'</small></div>'}).join('')}
$('#cadd').onclick=function(){var n=$('#cn').value.trim(),u=$('#cu').value.trim();if(!n||!/^https:\/\//.test(u)){alert('Podaj nazwę i adres https://');return}S.conn.push({id:uid(),name:n,desc:$('#cd').value.trim()||n,url:u});['#cn','#cd','#cu'].forEach(function(s){$(s).value=''});save();conn()};
$('#clist').onclick=function(e){var c=e.target.dataset.c;if(c){S.conn=S.conn.filter(function(x){return x.id!==c});save();conn()}};


/* katalog */
var CAT=[
 {id:'gemini',n:'Google Gemini',f:1,d:'Darmowy limit zapytań, dobry na start. Wbudowany.',b:'',k:'https://aistudio.google.com/apikey',built:1},
 {id:'openrouter',n:'OpenRouter',f:1,d:'Wiele modeli w jednym miejscu; dostępne warianty :free z limitami.',b:'https://openrouter.ai/api/v1',k:'https://openrouter.ai/keys',only:':free'},
 {id:'groq',n:'Groq',f:1,d:'Bardzo szybkie modele otwarte, darmowy plan z limitami.',b:'https://api.groq.com/openai/v1',k:'https://console.groq.com/keys'},
 {id:'cerebras',n:'Cerebras',f:1,d:'Szybkie modele otwarte, darmowy plan z limitami.',b:'https://api.cerebras.ai/v1',k:'https://cloud.cerebras.ai'},
 {id:'mistral',n:'Mistral',f:1,d:'Darmowy plan eksperymentalny z limitami, modele płatne.',b:'https://api.mistral.ai/v1',k:'https://console.mistral.ai/api-keys'},
 {id:'nvidia',n:'NVIDIA NIM',f:1,d:'Darmowe kredyty na start, wiele modeli otwartych.',b:'https://integrate.api.nvidia.com/v1',k:'https://build.nvidia.com'},
 {id:'deepseek',n:'DeepSeek',f:0,d:'Płatny, bardzo tani model rozumujący.',b:'https://api.deepseek.com/v1',k:'https://platform.deepseek.com/api_keys'},
 {id:'together',n:'Together AI',f:0,d:'Płatny, szeroki wybór modeli otwartych.',b:'https://api.together.xyz/v1',k:'https://api.together.ai/settings/api-keys'},
 {id:'xai',n:'xAI Grok',f:0,d:'Płatny.',b:'https://api.x.ai/v1',k:'https://console.x.ai'},
 {id:'openai',n:'OpenAI',f:0,d:'Płatny (GPT i inne). Wbudowany.',b:'',k:'https://platform.openai.com/api-keys',built:1},
 {id:'anthropic',n:'Anthropic Claude',f:0,d:'Płatny. Wbudowany.',b:'',k:'https://console.anthropic.com/settings/keys',built:1}];
function cust(id){return S.cust.filter(function(c){return c.id===id})[0]}
function cat(){$('#catl').innerHTML=CAT.map(function(c){var u=cust(c.id);return '<div class="card"><div class="row"><b class="grow">'+esc(c.n)+'</b><span class="mut">'+(c.f?'🆓 free tier':'💳 płatny')+'</span></div><p class="mut">'+esc(c.d)+'</p><div class="row" style="flex-wrap:wrap">'+(c.built?'<button class="gh" data-use="'+c.id+'">Użyj</button>':u?'<button class="gh" data-use="'+c.id+'">Użyj</button><button class="gh" data-rm="'+c.id+'">Usuń</button>':'<button class="pri" data-add="'+c.id+'">Dodaj do Evoo</button>')+'<a class="mut" target="_blank" rel="noopener" href="'+c.k+'">Zdobądź klucz</a></div></div>'}).join('')+'<div class="card"><b>Własny dostawca (zgodny z OpenAI)</b><input id="xn" placeholder="Nazwa"><input id="xb" placeholder="Adres bazowy, np. https://host/v1"><input id="xk" type="password" placeholder="Klucz API"><button class="gh" id="xadd">Dodaj</button><small>Własne adresy łączą się bezpośrednio z przeglądarki (bez serwera).</small></div>'}
function provOpts(){var o='<option value="openai">OpenAI</option><option value="gemini">Google Gemini</option><option value="anthropic">Anthropic Claude</option>'+S.cust.map(function(c){return '<option value="'+c.id+'">'+esc(c.n)+'</option>'}).join('');$('#prov').innerHTML=o;$('#prov').value=S.prov}
function addProv(c,key){var e=cust(c.id);if(e)e.key=key;else S.cust.push({id:c.id,n:c.n,base:c.b,key:key,only:c.only||''});save();S.prov=c.id;provOpts()}
$('#v-cat').onclick=function(e){var d=e.target.dataset;
 if(d.add){var c=CAT.filter(function(x){return x.id===d.add})[0],k=prompt('Wklej klucz API dla '+c.n+' (zostaje tylko w tej przeglądarce'+(srv()?', albo ustaw go jako sekret na serwerze i zostaw puste':'')+')');if(k===null)return;addProv(c,(k||'').trim());S.prov=c.id;save();cat();go('set');$('#fetchm').click()}
 if(d.use){S.prov=d.use;var d2={gemini:'gemini-2.0-flash',openai:'gpt-4o',anthropic:'claude-sonnet-4-5'};if(d2[d.use])S.model=d2[d.use];save();provOpts();fill();mfill();go('set')}
 if(d.rm){S.cust=S.cust.filter(function(x){return x.id!==d.rm});if(S.prov===d.rm)S.prov='openai';save();provOpts();cat()}
 if(e.target.id==='xadd'){var n=$('#xn').value.trim(),b=$('#xb').value.trim().replace(/\/$/,'');if(!n||!/^https:\/\//.test(b)){alert('Podaj nazwę i adres https://');return}S.cust.push({id:'x'+uid(),n:n,base:b,key:$('#xk').value.trim(),custom:1});save();provOpts();cat()}};
function cp(){return cust(S.prov)}
function cfetch(c,path,o){o=o||{};var url=c.base+path;var CATH=CAT.filter(function(x){return x.id===c.id})[0];if(srv()&&CATH)return fetch(S.srv.url.replace(/\/$/,'')+'/proxy',{method:'POST',headers:{'Content-Type':'application/json','X-Token':S.srv.token},body:JSON.stringify({url:url,method:o.method||'GET',body:o.body||null,auth:c.key||undefined})});
 return fetch(url,{method:o.method||'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.key},body:o.body?JSON.stringify(o.body):undefined})}
