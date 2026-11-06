const $=id=>document.getElementById(id);
const flash=(id,t,ok=true)=>{const e=$(id);e.textContent=t;e.className='form-msg '+(ok?'ok':'error')};
async function init(){
  try{const me=await apiGet('/auth/me');$('whoami').textContent=me.email||'';$('adminShell').classList.add('show');$('checkingMsg').remove();bind();loadNews();loadHome();loadMission()}
  catch(e){location.href='login.html'}
}
function bind(){
  document.querySelectorAll('.admin-tab').forEach(t=>t.addEventListener('click',()=>{
    document.querySelectorAll('.admin-tab,.admin-panel').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');$('panel-'+t.dataset.tab).classList.add('active')}));
  $('logoutBtn').onclick=async()=>{try{await apiSend('/auth/logout','POST')}catch(e){}location.href='login.html'};
  $('newsSaveBtn').onclick=saveNews;$('newsResetBtn').onclick=resetNews;
  $('homeSaveBtn').onclick=saveHome;$('missionSaveBtn').onclick=saveMission;
}
/* News */
let newsCache=[];
function resetNews(){['newsId','newsTitle','newsSummary','newsBody'].forEach(i=>$(i).value='');$('newsPublished').checked=false;$('newsFormTitle').textContent='New article'}
async function loadNews(){
  try{newsCache=await apiGet('/admin/news');
    $('newsList').innerHTML=newsCache.length?newsCache.map(n=>`<div class="admin-list-row"><span>${escapeHtml(n.title)} <span class="loading-line">· ${n.published?'Published':'Draft'}</span></span><span><button class="btn btn-ghost" data-edit="${n.id}">Edit</button><button class="btn btn-ghost" data-del="${n.id}">Delete</button></span></div>`).join(''):'<div class="admin-list-row"><span class="loading-line">No articles yet.</span></div>';
    $('newsList').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editNews(b.dataset.edit));
    $('newsList').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>delNews(b.dataset.del));
  }catch(e){$('newsList').innerHTML='<div class="admin-list-row"><span class="loading-line">Could not load articles.</span></div>'}
}
function editNews(id){const n=newsCache.find(x=>x.id===id);if(!n)return;
  $('newsId').value=n.id;$('newsTitle').value=n.title;$('newsCategory').value=n.category;$('newsAuthor').value=n.author;$('newsSummary').value=n.summary;$('newsBody').value=n.body||'';$('newsPublished').checked=!!n.published;$('newsFormTitle').textContent='Edit article';scrollTo({top:0,behavior:'smooth'})}
async function delNews(id){if(!confirm('Delete this article?'))return;try{await apiSend('/admin/news/'+id,'DELETE');loadNews()}catch(e){flash('newsFormMsg',e.message,false)}}
async function saveNews(){
  const title=$('newsTitle').value.trim();if(!title)return flash('newsFormMsg','Add a title before saving.',false);
  try{await apiSend('/admin/news','POST',{id:$('newsId').value||undefined,title,category:$('newsCategory').value,author:$('newsAuthor').value.trim(),summary:$('newsSummary').value.trim(),body:$('newsBody').value.trim(),published:$('newsPublished').checked});
    flash('newsFormMsg','Article saved.');resetNews();loadNews()}catch(e){flash('newsFormMsg',e.message,false)}
}
/* Home */
function cardRows(id,n,fields,vals,prefix){$(id).innerHTML=Array.from({length:n},(_,i)=>`<div class="${i?'sub-item':''}">${fields.map(([k,l,tag])=>`<div class="field"><label>${l} ${i+1}</label>${tag==='ta'?`<textarea rows="2" data-${prefix}="${k}" data-i="${i}">`:`<input type="text" data-${prefix}="${k}" data-i="${i}" value="`}${escapeHtml(((vals||[])[i]||{})[k]||'')}${tag==='ta'?'</textarea>':'">'}</div>`).join('')}</div>`).join('')}
async function loadHome(){let c={};try{c=await apiGet('/content/home')||{}}catch(e){}
  $('homeEyebrow').value=c.eyebrow||'';$('homeHeadlinePre').value=c.headlinePre||'';$('homeHeadlineHighlight').value=c.headlineHighlight||'';$('homeLead').value=c.lead||'';
  cardRows('homeCardsEditor',3,[['title','Card title'],['desc','Card description','ta']],c.cards,'hc')}
async function saveHome(){
  const cards=[0,1,2].map(i=>({title:document.querySelector(`[data-hc="title"][data-i="${i}"]`).value.trim(),desc:document.querySelector(`[data-hc="desc"][data-i="${i}"]`).value.trim()}));
  try{await apiSend('/content/home','POST',{eyebrow:$('homeEyebrow').value.trim(),headlinePre:$('homeHeadlinePre').value.trim(),headlineHighlight:$('homeHeadlineHighlight').value.trim(),lead:$('homeLead').value.trim(),cards});flash('homeFormMsg','Home page saved. Blank fields keep the default text.')}catch(e){flash('homeFormMsg',e.message,false)}}
/* Mission */
async function loadMission(){let c={};try{c=await apiGet('/content/mission')||{}}catch(e){}
  $('missionIntroInput').value=c.intro||'';$('missionStatementInput').value=c.statement||'';
  cardRows('missionPillarsEditor',4,[['label','Pillar label'],['title','Pillar title'],['desc','Pillar description','ta']],c.pillars,'mp')}
async function saveMission(){
  const pillars=[0,1,2,3].map(i=>{const g=k=>document.querySelector(`[data-mp="${k}"][data-i="${i}"]`).value.trim();return{label:g('label'),title:g('title'),desc:g('desc')}});
  try{await apiSend('/content/mission','POST',{intro:$('missionIntroInput').value.trim(),statement:$('missionStatementInput').value.trim(),pillars});flash('missionFormMsg','Mission page saved. Blank fields keep the default text.')}catch(e){flash('missionFormMsg',e.message,false)}}
document.addEventListener('DOMContentLoaded',init);
