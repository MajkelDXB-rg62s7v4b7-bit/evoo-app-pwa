/* ===== v14: bez okienek (prompt/alert) - pole klucza w karcie dostawcy, komunikaty jako toast ===== */
(function(){
var tt=null,tb=document.createElement('div');tb.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:99;background:#2a2766;color:#fff;border-radius:12px;padding:12px 14px;font-size:14px;display:none;white-space:pre-wrap;box-shadow:0 6px 24px #000a';tb.onclick=function(){tb.style.display='none'};document.body.appendChild(tb);
window.alert=function(m){m=String(m);tb.textContent=m;tb.style.display='block';clearTimeout(tt);tt=setTimeout(function(){tb.style.display='none'},Math.min(25000,3500+m.length*60))};
cat=function(){$('#catl').innerHTML=CAT.map(function(c){var u=cust(c.id);
 var act=c.built?'<button class="gh" data-use="'+c.id+'">Użyj</button>':u?'<button class="gh" data-use="'+c.id+'">Użyj</button><button class="gh" data-rm="'+c.id+'">Usuń</button>':'<input id="k_'+c.id+'" type="password" placeholder="Klucz API '+esc(c.n)+'" autocomplete="off"><button class="pri" data-addk="'+c.id+'">Dodaj do Evoo</button>';
 return '<div class="card"><div class="row"><b class="grow">'+esc(c.n)+'</b><span class="mut">'+(c.f?'🆓 free tier':'💳 płatny')+(u?' · ✅ dodany':'')+'</span></div><p class="mut">'+esc(c.d)+'</p>'+act+'<div style="margin-top:6px"><a class="mut" target="_blank" rel="noopener" href="'+c.k+'">Zdobądź klucz</a></div></div>'}).join('')+'<div class="card"><b>Własny dostawca (zgodny z OpenAI)</b><input id="xn" placeholder="Nazwa"><input id="xb" placeholder="Adres bazowy, np. https://host/v1"><input id="xk" type="password" placeholder="Klucz API"><button class="gh" id="xadd">Dodaj</button><small>Własne adresy łączą się bezpośrednio z przeglądarki (bez serwera).</small></div>'};
$('#v-cat').onclick=function(e){var t=e.target,d=t.dataset||{};
 if(d.addk){var c=CAT.filter(function(x){return x.id===d.addk})[0],i=$('#k_'+c.id),k=(i&&i.value||'').trim();
  if(!k&&!srv()){alert('Wklej klucz API dla '+c.n+' w pole nad przyciskiem.');return}
  addProv(c,k);S.prov=c.id;S.model='';$('#model').value='';save();cat();go('set');provOpts();fill();mfill();
  var f=window.__autoPick&&window.__autoPick();if(f)f.then(function(){var m=$('#mstat').textContent;if(/Failed to fetch|Load failed|NetworkError/i.test(m))$('#mstat').textContent=m+' (ten dostawca blokuje wywołania z przeglądarki; użyj serwera Worker)'});return}
 if(d.use){S.prov=d.use;var d2={gemini:'gemini-3.8-flash',openai:'gpt-4o',anthropic:'claude-sonnet-4-5'};S.model=d2[d.use]||S.model;save();provOpts();fill();mfill();go('set');return}
 if(d.rm){S.cust=S.cust.filter(function(x){return x.id!==d.rm});if(S.prov===d.rm){S.prov='openai';S.model=''}save();provOpts();cat();return}
 if(t.id==='xadd'){var n=$('#xn').value.trim(),b=$('#xb').value.trim().replace(/\/$/,'');if(!n||!/^https:\/\//.test(b)){alert('Podaj nazwę i adres https://');return}S.cust.push({id:'x'+uid(),n:n,base:b,key:$('#xk').value.trim(),custom:1});save();provOpts();cat()}};
})();
(function(){var s=document.createElement('script');s.src='auto15.js?v=15';s.onload=function(){var t=document.createElement('script');t.src='look16.js?v=16';document.body.appendChild(t)};document.body.appendChild(s)})();
