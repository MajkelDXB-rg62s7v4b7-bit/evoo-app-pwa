/* v18: menu - akordeon: otwarta tylko jedna grupa */
(function(){
var nav=document.getElementById('nav');if(!nav)return;
var st=document.createElement('style');st.textContent='@media(min-width:1000px){.ngh{border-radius:8px}.ngh:hover{background:var(--p2)}.ng:not(.shut)>.ngh{color:#27b6f2}}';document.head.appendChild(st);
function wide(){return window.matchMedia&&window.matchMedia('(min-width:1000px)').matches}
var openG=null,busy=false;
function apply(){if(!wide()||busy)return;busy=true;
 var gs=nav.querySelectorAll('.ng');
 if(openG===null){var on=nav.querySelector('button.on'),g=on&&on.closest('.ng');openG=g?g.querySelector('.ngh').dataset.g:''}
 [].forEach.call(gs,function(x){var h=x.querySelector('.ngh'),sh=h.dataset.g!==openG;x.classList.toggle('shut',sh);h.querySelector('span').textContent=sh?'▸':'▾'});
 busy=false}
nav.addEventListener('click',function(e){var h=e.target.closest('.ngh');if(!h)return;e.stopImmediatePropagation();e.preventDefault();
 openG=(openG===h.dataset.g)?'':h.dataset.g;apply()},true);
new MutationObserver(function(){apply()}).observe(nav,{childList:true});
var _g=go;go=function(t){_g(t);if(wide()){var b=nav.querySelector('button[data-t="'+t+'"]'),g=b&&b.closest('.ng');if(g)openG=g.querySelector('.ngh').dataset.g;apply()}};
apply();
})();
