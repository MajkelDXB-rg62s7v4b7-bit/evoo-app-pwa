/* v17: aktywny dostawca na górze, reszta zwinięta */
(function(){
var st=document.createElement('style');st.textContent='#catl.fold{display:none}#catl.fold.open{display:block}.apic.hid{display:none}#cattog,#instsel{width:100%;margin:8px 0}';document.head.appendChild(st);
var catl=document.getElementById('catl'),lst=document.getElementById('ad-list');
if(catl){catl.classList.add('fold');var b=document.createElement('button');b.id='cattog';b.className='gh';b.textContent='▾ Wybierz innego dostawcę';catl.parentNode.insertBefore(b,catl);
b.onclick=function(){var o=catl.classList.toggle('open');b.textContent=(o?'▴ Zwiń listę dostawców':'▾ Wybierz innego dostawcę')}}
function fold(){if(!lst)return;var c=lst.querySelectorAll('.apic');if(c.length<2)return;
 var hid=0;[].forEach.call(c,function(x){var off=x.classList.contains('off');x.classList.toggle('hid',off);if(off)hid++});
 if(hid&&!document.getElementById('instsel')){var s=document.createElement('button');s.id='instsel';s.className='gh';s.textContent='Pokaż pozostałe ('+hid+')';
  s.onclick=function(){var sh=lst.classList.toggle('all');[].forEach.call(lst.querySelectorAll('.apic.off'),function(x){x.classList.toggle('hid',!sh)});s.textContent=sh?'Ukryj pozostałe':'Pokaż pozostałe ('+hid+')'};lst.appendChild(s)}}
if(lst){new MutationObserver(function(){setTimeout(fold,0)}).observe(lst,{childList:true});fold()}
})();
