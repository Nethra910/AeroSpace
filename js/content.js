/* Applies admin-edited text over the static defaults already in the HTML. */
const setText=(sel,v)=>{if(v!=null&&v!=='')document.querySelectorAll(sel).forEach(e=>e.textContent=v)};
async function loadHomeContent(){
  try{const c=await apiGet('/content/home');if(!c)return;
    setText('#heroEyebrow',c.eyebrow);setText('#heroLead',c.lead);
    if(c.headlinePre&&c.headlineHighlight)document.getElementById('heroHeadline').innerHTML=escapeHtml(c.headlinePre)+' <em>'+escapeHtml(c.headlineHighlight)+'</em>';
    (c.cards||[]).forEach((x,i)=>{setText(`.card-title[data-idx="${i}"]`,x.title);setText(`.card-desc[data-idx="${i}"]`,x.desc)});
  }catch(e){}
}
async function loadMissionContent(){
  try{const c=await apiGet('/content/mission');if(!c)return;
    setText('#missionIntro',c.intro);setText('#missionStatement',c.statement);
    (c.pillars||[]).forEach((x,i)=>{setText(`.pillar-index[data-idx="${i}"]`,x.label);setText(`.pillar-title[data-idx="${i}"]`,x.title);setText(`.pillar-desc[data-idx="${i}"]`,x.desc)});
  }catch(e){}
}
