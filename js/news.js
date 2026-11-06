function newsCard(n){return `<article class="news-card"><span class="news-meta">${escapeHtml(n.category)} · ${escapeHtml(n.date||'')}</span><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.summary)}</p>${n.body?`<details><summary>Read full article</summary><p>${escapeHtml(n.body)}</p></details>`:''}</article>`}
async function renderNews(id,limit){
  const el=document.getElementById(id);if(!el)return;
  try{let list=await apiGet('/news');if(limit)list=list.slice(0,limit);el.innerHTML=list.length?list.map(newsCard).join(''):'<p class="loading-line">No news published yet.</p>'}
  catch(e){el.innerHTML='<p class="loading-line">News is unavailable right now.</p>'}
}
const loadHomeNews=()=>renderNews('homeNewsGrid',3),loadFullNews=()=>renderNews('newsGrid');
