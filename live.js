/* ===== v12: naprawa pustego modelu, rozmowa pełnoekranowa, avatar ze zdjęcia ===== */
(function(){
var PREF=/gpt-oss-120b|llama-3\.3-70b|llama.*70b|gemini-3\.8-flash|gpt-4o|claude-sonnet/i;
function ensureModel(){if(S.model&&String(S.model).trim())return;var l=(S.models&&S.models[S.prov])||[],m=l.filter(function(x){return PREF.test(x)})[0]||l[0];
 if(!m)throw new Error('Nie wybrano modelu. Wejdź w Ustawienia, kliknij „Pobierz modele”, wybierz model i „Zapisz”.');S.model=m;var i=$('#model');if(i)i.value=m;save()}
var _llm2=llm;llm=function(m){try{ensureModel()}catch(e){return Promise.reject(e)}return _llm2(m)};
var _once2=once;once=function(s,u,o){try{ensureModel()}catch(e){return Promise.reject(e)}return _once2(s,u,o)};
$('#mdl').addEventListener('change',function(){if(this.value){S.model=this.value;save()}});
/* zdjęcie avatara */
function pk(){return 'evoo_photo_'+S.pers}
function photo(){try{return localStorage.getItem(pk())}catch(e){return null}}
function applyPhoto(){var p=photo(),o=$('#bigorb');if(p){o.style.background='url('+p+') center/cover no-repeat';o.style.boxShadow='0 0 30px '+P[S.pers].c}else{o.style.background='';o.style.boxShadow=''}
 var c=$('#callav');if(c){if(p){c.style.background='url('+p+') center/cover no-repeat'}else{c.style.background=''}c.style.setProperty('--c',P[S.pers].c);c.style.setProperty('--d',P[S.pers].d)}}
var _theme=theme;theme=function(){_theme();applyPhoto()};
var card=document.createElement('div');card.className='card';card.innerHTML='<b>Zdjęcie avatara (dla wybranej osobowości)</b><br><small>Wgraj zdjęcie postaci (np. Evoo). Zostaje tylko w tym urządzeniu. Wybierz osobowość u góry czatu, potem wgraj jej zdjęcie.</small><input id="phf" type="file" accept="image/*"><div class="row"><button class="gh" id="phx">Usuń zdjęcie</button></div><small id="phs"></small>';
var sc=$('#v-set .scroll');sc.insertBefore(card,sc.lastElementChild);
$('#phf').onchange=function(){var f=this.files[0];if(!f)return;var im=new Image(),u=URL.createObjectURL(f);im.onload=function(){var n=512,c=document.createElement('canvas');c.width=c.height=n;var s=Math.min(im.width,im.height),x=(im.width-s)/2,y=(im.height-s)/4;if(y<0)y=0;if(y+s>im.height)y=im.height-s;c.getContext('2d').drawImage(im,x,y,s,s,0,0,n,n);try{localStorage.setItem(pk(),c.toDataURL('image/jpeg',.82));$('#phs').textContent='✅ Zdjęcie zapisane dla: '+P[S.pers].n}catch(e){$('#phs').textContent='❌ Za duże lub brak miejsca'}URL.revokeObjectURL(u);applyPhoto()};im.src=u};
$('#phx').onclick=function(){localStorage.removeItem(pk());applyPhoto();$('#phs').textContent='Usunięto'};
/* rozmowa pełnoekranowa */
var st=document.createElement('style');st.textContent='#call{position:fixed;inset:0;z-index:50;background:radial-gradient(circle at 50% 30%,#241a63,#0b0a1f 70%);display:none;flex-direction:column;align-items:center;justify-content:space-between;padding:calc(24px + env(safe-area-inset-top)) 20px calc(28px + env(safe-area-inset-bottom));text-align:center}#call.on{display:flex}#call .nm{font-size:20px;font-weight:600}#call .sub{color:var(--m);font-size:13px;margin-top:2px}#callav{width:min(62vw,300px);height:min(62vw,300px);border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff9 0,var(--c) 35%,var(--d) 100%);box-shadow:0 0 50px var(--c);transition:transform .2s;animation:fl 5s ease-in-out infinite}#call.talk #callav{animation:pulse .55s ease-in-out infinite alternate}#call.listen #callav{animation:pulse 1.3s ease-in-out infinite alternate;box-shadow:0 0 40px #3ee0ff}#callcap{max-width:520px;min-height:92px;max-height:30vh;overflow:auto;font-size:17px;line-height:1.45}#callcap small{display:block;color:var(--m);margin-bottom:4px}#call .btns{display:flex;gap:18px}#call .btns button{width:64px;height:64px;border-radius:50%;border:0;font-size:26px;cursor:pointer;background:var(--p2);color:#fff}#call .btns .end{background:#e5484d}';document.head.appendChild(st);
var call=document.createElement('div');call.id='call';call.innerHTML='<div><div class="nm" id="callnm"></div><div class="sub" id="callst"></div></div><div id="callav"></div><div id="callcap"></div><div class="btns"><button id="callmute" title="Wycisz mikrofon">🎤</button><button class="end" id="callend" title="Zakończ">✕</button></div>';document.body.appendChild(call);
var tm=null,muted=false,last='';
function sync(){var stg=$('#stage');call.classList.toggle('talk',stg.classList.contains('talk'));call.classList.toggle('listen',stg.classList.contains('listen'));
 var h=H().filter(function(m){return m.role==='user'||m.role==='assistant'}),la=h.slice().reverse().filter(function(m){return m.role==='assistant'})[0];
 var inp=$('#inp').value.trim(),s=call.classList.contains('talk')?'Mówię…':call.classList.contains('listen')?(inp?'Słucham…':'Słucham…'):(busy?'Myślę…':(muted?'Mikrofon wyciszony':'Gotowa'));
 $('#callst').textContent=s;var txt=inp&&call.classList.contains('listen')?'<small>Ty</small>'+esc(inp):(la?'<small>'+esc(P[S.pers].n)+'</small>'+esc(la.text.length>420?la.text.slice(0,420)+'…':la.text):'<small>Zacznij mówić</small>');if(txt!==last){$('#callcap').innerHTML=txt;last=txt}}
function openCall(){if(!S.key&&!srv()&&!cp()){go('set');alert('Najpierw wpisz klucz API w Ustawieniach.');return}
 live=true;S.auto='1';muted=false;$('#callmute').textContent='🎤';$('#callnm').textContent=P[S.pers].n;applyPhoto();call.classList.add('on');last='';stopSpeak();tm=setInterval(sync,250);sync();if(!rec)$('#mic').click()}
function endCall(){live=false;clearInterval(tm);call.classList.remove('on','talk','listen');try{rec&&rec.stop()}catch(e){}stopSpeak();$('#live').style.background=''}
$('#live').onclick=function(){if(call.classList.contains('on'))endCall();else openCall()};
$('#callend').onclick=endCall;
$('#callmute').onclick=function(){muted=!muted;this.textContent=muted?'🔇':'🎤';if(muted){live=false;try{rec&&rec.stop()}catch(e){}}else{live=true;if(!rec&&!busy)$('#mic').click()}};
applyPhoto();
window.__call={open:openCall,end:endCall};
})();
