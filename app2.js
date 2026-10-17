/* models */
function listModels(){
 var cc=cp();if(cc)return cfetch(cc,'/models').then(rj).then(function(j){var l=(j.data||[]).map(function(m){return m.id});return cc.only?l.filter(function(i){return i.slice(-cc.only.length)===cc.only}):l});
 if(!S.key&&!srv())return Promise.reject(new Error('Brak klucza'));
 if(S.prov==='openai')return pfetch('https://api.openai.com/v1/models',{headers:{Authorization:'Bearer '+S.key}}).then(rj).then(function(j){return j.data.map(function(m){return m.id}).filter(function(i){return/^(gpt|o\d|chatgpt)/.test(i)&&!/(embed|tts|whisper|dall|image|audio|realtime|transcribe|moderation|search|instruct)/.test(i)})});
 if(S.prov==='anthropic')return pfetch('https://api.anthropic.com/v1/models?limit=100',{headers:{'x-api-key':S.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'}}).then(rj).then(function(j){return j.data.map(function(m){return m.id})});
 return pfetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200',{headers:{'x-goog-api-key':S.key}}).then(rj).then(function(j){return j.models.filter(function(m){return(m.supportedGenerationMethods||[]).indexOf('generateContent')>=0}).map(function(m){return m.name.replace('models/','')}).filter(function(i){return/gemini/.test(i)&&!/(embed|vision|aqa|tts|image|live)/.test(i)})})}
function rj(r){return r.json().then(function(j){if(!r.ok)throw new Error((j.error&&(j.error.message||j.error))||r.status);return j})}
function ping(model){var hold=S.model;S.model=model;var cc=cp();
 var p=cc?cfetch(cc,'/chat/completions',{method:'POST',body:{model:model,messages:[{role:'user',content:'ok'}],max_tokens:16}}).then(rj):S.prov==='openai'?jf('https://api.openai.com/v1/chat/completions',{Authorization:'Bearer '+S.key},{model:model,messages:[{role:'user',content:'Odpowiedz: ok'}],max_completion_tokens:16}):
 S.prov==='anthropic'?jf('https://api.anthropic.com/v1/messages',{'x-api-key':S.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},{model:model,max_tokens:16,messages:[{role:'user',content:'ok'}]}):
 jf('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{'x-goog-api-key':S.key},{contents:[{role:'user',parts:[{text:'ok'}]}],generationConfig:{maxOutputTokens:16}});
 S.model=hold;return p.then(function(){return true},function(e){return e.message||'błąd'})}
function mfill(){var k=S.prov,l=(S.models[k]||[]),ok=S.ok[k]||{};$('#mdl').innerHTML='<option value="">— wybierz model —</option>'+l.map(function(m){return '<option value="'+esc(m)+'">'+(ok[m]===true?'✅ ':ok[m]?'❌ ':'')+esc(m)+'</option>'}).join('');$('#mdl').value=l.indexOf(S.model)>=0?S.model:''}
$('#mdl').onchange=function(){if(this.value)$('#model').value=this.value};
$('#fetchm').onclick=function(){S.key=$('#key').value.trim()||S.key;S.prov=$('#prov').value;$('#mstat').textContent='Pobieram…';listModels().then(function(l){S.models[S.prov]=l.sort();save();mfill();$('#mstat').textContent='Znaleziono '+l.length+'. Użyj Testuj, aby sprawdzić, które działają.'}).catch(function(e){$('#mstat').textContent='Błąd: '+e.message})};
function t1(m){S.ok[S.prov]=S.ok[S.prov]||{};return ping(m).then(function(r){S.ok[S.prov][m]=r;save();mfill()})}
$('#testm').onclick=function(){S.key=$('#key').value.trim()||S.key;S.prov=$('#prov').value;var m=$('#model').value.trim();if(!m)return;$('#mstat').textContent='Testuję '+m+'…';t1(m).then(function(){var r=S.ok[S.prov][m];$('#mstat').textContent=r===true?'✅ '+m+' działa':'❌ '+r})};
$('#testall').onclick=function(){S.key=$('#key').value.trim()||S.key;S.prov=$('#prov').value;var l=(S.models[S.prov]||[]).slice();if(!l.length){$('#mstat').textContent='Najpierw pobierz modele';return}if(!confirm('Test wyśle ok. '+l.length+' bardzo krótkich zapytań (grosze). Kontynuować?'))return;var i=0;(function nx(){if(i>=l.length){$('#mstat').textContent='Gotowe. ✅ = działa';return}$('#mstat').textContent='Test '+(i+1)+'/'+l.length+': '+l[i];t1(l[i++]).then(nx)})()};
/* improvement */
function imp(){$('#plist2').innerHTML=S.props.map(function(p){return '<div class="card"><b>'+esc(p.title)+'</b> <small>('+p.kind+(p.kind==='persona'?', '+esc(P[p.pers].n):'')+')</small><p class="mut">'+esc(p.reason)+'</p><div class="card" style="background:#0f0d2b;white-space:pre-wrap">'+esc(p.content)+'</div><div class="row"><button class="pri" data-ok="'+p.id+'">Zatwierdzam</button><button class="gh" data-no="'+p.id+'">Odrzuć</button></div></div>'}).join('')||'<p class="mut">Brak propozycji.</p>';
 $('#hlist').innerHTML=S.log.slice().reverse().map(function(l){return '<div class="task"><span class="grow">'+esc(l.title)+' <small>'+new Date(l.at).toLocaleString('pl-PL')+(l.undone?' (cofnięte)':'')+'</small></span>'+(l.undone?'':'<button class="gh" data-un="'+l.id+'">Cofnij</button>')+'</div>'}).join('')}
$('#v-imp').onclick=function(e){var d=e.target.dataset;
 if(e.target.id==='analyze'){go('chat');ask('Przeanalizuj naszą dotychczasową rozmowę, pamięć i zadania. Zaproponuj 1 do 3 konkretnych ulepszeń siebie przez narzędzie propose_improvement. Niczego nie wprowadzaj sama.');return}
 if(d.ok){var p=S.props.filter(function(x){return x.id===d.ok})[0],u={id:uid(),title:p.title,at:Date.now(),kind:p.kind,pers:p.pers};
  if(p.kind==='persona'){u.prev=S.intros[p.pers]||null;S.intros[p.pers]=p.content}
  else if(p.kind==='rule'){var r={id:uid(),t:p.content};S.rules.push(r);u.rid=r.id}
  else{var m={id:uid(),t:p.content};S.mem.push(m);u.mid=m.id}
  S.log.push(u);S.props=S.props.filter(function(x){return x.id!==d.ok});save();imp()}
 if(d.no){S.props=S.props.filter(function(x){return x.id!==d.no});save();imp()}
 if(d.un){var l=S.log.filter(function(x){return x.id===d.un})[0];l.undone=true;
  if(l.kind==='persona'){if(l.prev)S.intros[l.pers]=l.prev;else delete S.intros[l.pers]}
  if(l.rid)S.rules=S.rules.filter(function(x){return x.id!==l.rid});if(l.mid)S.mem=S.mem.filter(function(x){return x.id!==l.mid});save();imp()}};

/* serwer + szyfrowanie */
function srv(){return S.srv&&S.srv.url&&S.srv.token}
function pfetch(url,o){o=o||{};if(!srv())return fetch(url,o);var m=o.method||'GET';var b=o.body?JSON.parse(o.body):null;
 return fetch(S.srv.url.replace(/\/$/,'')+'/proxy',{method:'POST',headers:{'Content-Type':'application/json','X-Token':S.srv.token},body:JSON.stringify({url:url,method:m,body:b})})}
var enc=new TextEncoder(),dec=new TextDecoder();
function b64(a){var s='';new Uint8Array(a).forEach(function(c){s+=String.fromCharCode(c)});return btoa(s)}
function unb(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
function dkey(pass,salt){return crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']).then(function(k){return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:250000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])})}
function seal(obj){var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));return dkey(S.srv.pass,salt).then(function(k){return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},k,enc.encode(JSON.stringify(obj)))}).then(function(c){return JSON.stringify({v:1,s:b64(salt),i:b64(iv),c:b64(c)})})}
function unseal(t){var j=JSON.parse(t);return dkey(S.srv.pass,unb(j.s)).then(function(k){return crypto.subtle.decrypt({name:'AES-GCM',iv:unb(j.i)},k,unb(j.c))}).then(function(p){return JSON.parse(dec.decode(p))})}
function snapshot(){var d=Object.assign({},S);delete d.srv;delete d.key;delete d.ok;delete d.models;d.at=Date.now();return d}
function sh(){return{'X-Token':S.srv.token}}
function push(){if(!srv()||(S.srv.pass||'').length<12)return Promise.reject(new Error('Uzupełnij serwer, token i hasło (min. 12 znaków)'));return seal(snapshot()).then(function(t){return fetch(S.srv.url.replace(/\/$/,'')+'/sync',{method:'PUT',headers:sh(),body:t})}).then(function(r){if(!r.ok)throw new Error('serwer: '+r.status)})}
function pull(){if(!srv())return Promise.reject(new Error('Brak serwera'));return fetch(S.srv.url.replace(/\/$/,'')+'/sync',{headers:sh()}).then(function(r){if(!r.ok)throw new Error('serwer: '+r.status);return r.text()}).then(function(t){if(!t)throw new Error('Brak danych na serwerze');return unseal(t).catch(function(){throw new Error('Złe hasło szyfrowania')})}).then(function(d){var keep={srv:S.srv,key:S.key,ok:S.ok,models:S.models,prov:S.prov,model:S.model,tts:S.tts,voice:S.voice,auto:S.auto,lang:S.lang};Object.assign(S,d,keep);localStorage.setItem('evoo',JSON.stringify(S));avs();render()})}
var pt=null;function autoPush(){if(!srv()||(S.srv.pass||'').length<12)return;clearTimeout(pt);pt=setTimeout(function(){push().catch(function(){})},4000)}
function sfill(){$('#surl').value=S.srv.url;$('#stok').value=S.srv.token;$('#spass').value=S.srv.pass}
function sread(){S.srv={url:$('#surl').value.trim(),token:$('#stok').value.trim(),pass:$('#spass').value};save()}
$('#spush').onclick=function(){sread();$('#sst').textContent='Szyfruję i wysyłam…';push().then(function(){$('#sst').textContent='✅ Zaszyfrowane dane wysłane'}).catch(function(e){$('#sst').textContent='❌ '+e.message})};
$('#spull').onclick=function(){sread();$('#sst').textContent='Pobieram…';pull().then(function(){$('#sst').textContent='✅ Dane pobrane i odszyfrowane'}).catch(function(e){$('#sst').textContent='❌ '+e.message})};

$('#live').onclick=function(){live=!live;this.style.background=live?'var(--a)':'';if(live){S.auto='1';stopSpeak();if(!rec)$('#mic').click()}else{try{rec&&rec.stop()}catch(e){}stopSpeak()}};
/* avatar 3D */
var DB=null;function idb(){return new Promise(function(ok,no){if(DB)return ok(DB);var r=indexedDB.open('evoo3d',1);r.onupgradeneeded=function(){r.result.createObjectStore('f')};r.onsuccess=function(){DB=r.result;ok(DB)};r.onerror=no})}
function idbGet(){return idb().then(function(d){return new Promise(function(ok){var q=d.transaction('f').objectStore('f').get('vrm');q.onsuccess=function(){ok(q.result)};q.onerror=function(){ok(null)}})})}
function idbSet(b){return idb().then(function(d){return new Promise(function(ok){var t=d.transaction('f','readwrite');b?t.objectStore('f').put(b,'vrm'):t.objectStore('f').delete('vrm');t.oncomplete=ok})})}
var AV=null;
function start3d(blob){
 var T='https://esm.sh/three@0.160.0?target=es2018',L='https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?target=es2018',V='https://esm.sh/@pixiv/three-vrm@2.1.0?target=es2018&deps=three@0.160.0';
 $('#vst').textContent='Ładuję avatara…';
 return Promise.all([import(T),import(L),import(V)]).then(function(m){
  var THREE=m[0],GL=m[1].GLTFLoader,VR=m[2];var cv=$('#cv');
  var ren=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.setSize(360,360,false);
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(24,1,.1,20);cam.position.set(0,1.45,1.5);cam.lookAt(0,1.4,0);
  sc.add(new THREE.AmbientLight(0xffffff,.9));var dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(1,2,2);sc.add(dl);
  var ld=new GL();ld.register(function(p){return new VR.VRMLoaderPlugin(p)});var url=URL.createObjectURL(blob);
  return new Promise(function(ok,no){ld.load(url,ok,undefined,no)}).then(function(g){
   var vrm=g.userData.vrm;if(!vrm)throw new Error('To nie jest model VRM');VR.VRMUtils.rotateVRM0&&VR.VRMUtils.rotateVRM0(vrm);sc.add(vrm.scene);
   if(vrm.humanoid){var a=vrm.humanoid.getNormalizedBoneNode('leftUpperArm'),b=vrm.humanoid.getNormalizedBoneNode('rightUpperArm');if(a)a.rotation.z=1.2;if(b)b.rotation.z=-1.2}
   var clk=new THREE.Clock(),nb=2;
   (function loop(){AV=requestAnimationFrame(loop);var dt=clk.getDelta(),t=clk.elapsedTime,em=vrm.expressionManager,talking=$('#stage').classList.contains('talk');
    if(em){em.setValue('aa',talking?Math.max(0,Math.sin(t*14))*.7*Math.abs(Math.sin(t*3.1)):0);nb-=dt;var bl=nb<0&&nb>-.15?1:0;if(nb<-.15)nb=2+Math.random()*3;em.setValue('blink',bl);em.setValue('happy',talking?.25:0)}
    var hd=vrm.humanoid&&vrm.humanoid.getNormalizedBoneNode('head');if(hd){hd.rotation.y=Math.sin(t*.6)*.07;hd.rotation.x=Math.sin(t*.9)*.03+(talking?Math.sin(t*5)*.02:0)}
    var sp=vrm.humanoid&&vrm.humanoid.getNormalizedBoneNode('spine');if(sp)sp.rotation.x=Math.sin(t*1.2)*.012;
    vrm.update(dt);ren.render(sc,cam)})();
   cv.style.display='block';$('#bigorb').style.display='none';$('#vst').textContent='✅ Avatar 3D załadowany'})})
 .catch(function(e){$('#vst').textContent='❌ '+(e&&e.message||'nie udało się załadować')+' (używam kuli)';stop3d()})}
function stop3d(){if(AV)cancelAnimationFrame(AV);AV=null;$('#cv').style.display='none';$('#bigorb').style.display=''}
$('#vrm').onchange=function(){var f=this.files[0];if(!f)return;idbSet(f).then(function(){stop3d();start3d(f)})};
$('#vrmx').onclick=function(){idbSet(null).then(function(){stop3d();$('#vst').textContent='Usunięto'})};
idbGet().then(function(b){if(b)start3d(b)}).catch(function(){});
/* settings */
function voices(){var v=window.speechSynthesis?speechSynthesis.getVoices():[];var sel=$('#voice');if(S.tts==='openai')sel.innerHTML=['nova','shimmer','alloy','echo','onyx','fable'].map(function(x){return '<option>'+x+'</option>'}).join('');else sel.innerHTML='<option value="">(domyślny)</option>'+v.filter(function(x){return/^(pl|en|de)/i.test(x.lang)}).map(function(x){return '<option>'+esc(x.name)+'</option>'}).join('');sel.value=S.voice||''}
if(window.speechSynthesis)speechSynthesis.onvoiceschanged=voices;
$('#pers').innerHTML=Object.keys(P).map(function(k){return '<option value="'+k+'">'+esc(P[k].n)+'</option>'}).join('');
function fill(){['prov','model','key','tts','auto','lang'].forEach(function(k){$('#'+k).value=S[k]});$('#pers').value=S.pers;$('#pintro').value=S.intros[S.pers]||'';voices()}
$('#tts').onchange=function(){S.tts=this.value;S.voice='';voices()};
$('#pers').onchange=function(){S.pers=this.value;$('#pintro').value=S.intros[S.pers]||''};
$('#prov').onchange=function(){S.prov=this.value;mfill();var d={openai:'gpt-4o',gemini:'gemini-2.0-flash',anthropic:'claude-sonnet-4-5'};if(d[this.value])$('#model').value=d[this.value]};
$('#save').onclick=function(){['prov','model','key','tts','auto','lang'].forEach(function(k){S[k]=$('#'+k).value.trim()});S.voice=$('#voice').value;S.pers=$('#pers').value;var i=$('#pintro').value.trim();if(i)S.intros[S.pers]=i;else delete S.intros[S.pers];save();avs();render();go('chat')};
$('#exp').onclick=function(){var d=Object.assign({},S,{key:'',el:null,cust:[],srv:null});var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:'application/json'}));a.download='evoo-dane.json';a.click()};
$('#wipe').onclick=function(){if(confirm('Usunąć wszystkie dane?')){localStorage.removeItem('evoo');location.reload()}};
provOpts();fill();sfill();mfill();avs();render();go(S.key||srv()?'chat':'set');if(srv()&&(S.srv.pass||'').length>=12)pull().catch(function(){});
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(function(){});
