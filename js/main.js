(function(){
  const links=[['index.html','Home'],['mission.html','Mission'],['team-simha.html','Team SIMHA'],['vision-2036.html','Vision 2036'],['news.html','News'],['directors.html','Directors'],['parent-company.html','Parent Company'],['mani-aerospace-article.html','MANI Research Organization']];
  const here=(location.pathname.split('/').pop()||'index.html');
  function build(){
    const h=document.getElementById('site-header'),f=document.getElementById('site-footer');
    if(h)h.outerHTML=`<header class="site-header"><nav class="nav"><a class="brand" href="index.html"><img src="assets/logo.png" alt="MANI Aerospace — Man And Nature Innovation"></a><button class="nav-toggle" aria-label="Menu" aria-expanded="false">Menu</button><ul class="nav-links">${links.map(l=>`<li><a href="${l[0]}"${l[0]===here?' class="active"':''}>${l[1]}</a></li>`).join('')}</ul></nav></header>`;
    if(f)f.outerHTML=`<footer class="site-footer"><div class="footer-inner"><span>© 2026 MANI Aerospace — a division of MANI Market Private Limited. CIN U58130AP2026PTC127065</span><span><a href="login.html">Admin</a></span></div></footer>`;
    const t=document.querySelector('.nav-toggle'),u=document.querySelector('.nav-links');
    if(t)t.addEventListener('click',()=>{const o=u.classList.toggle('open');t.setAttribute('aria-expanded',o)});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',build):build();
})();
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
