/* API client. Talks to your backend at API_BASE; if it is unreachable, falls back to a
   browser-only demo store (localStorage) so the site and admin panel still work offline. */
const API_BASE=window.MANI_API_BASE||'/api';
const DEMO_USER={email:'admin@maniaerospace.local',password:'admin123'};
const DB_KEY='mani_demo_db',SESSION_KEY='mani_demo_session';
const SEED={
  news:[{id:'1',title:'MANI Aerospace is incorporated',category:'Company Update',author:'MANI Aerospace',summary:'MANI Market Private Limited, the parent company of MANI Aerospace, was incorporated on 21 July 2026.',body:'MANI Market Private Limited was incorporated with the Ministry of Corporate Affairs on 21 July 2026, registered with RoC-Vijayawada.',published:true,date:'2026-07-21'}],
  home:{},mission:{}
};
function demoDb(){try{return JSON.parse(localStorage.getItem(DB_KEY))||structuredClone(SEED)}catch(e){return structuredClone(SEED)}}
function demoSave(d){try{localStorage.setItem(DB_KEY,JSON.stringify(d))}catch(e){}}
function demoCall(path,method,body){
  const db=demoDb(),authed=()=>{if(!sessionStorage.getItem(SESSION_KEY))throw new Error('Not signed in.')};
  if(path==='/auth/me'){authed();return{email:DEMO_USER.email}}
  if(path==='/auth/login'){if(body.email===DEMO_USER.email&&body.password===DEMO_USER.password){sessionStorage.setItem(SESSION_KEY,'1');return{ok:true}}throw new Error('Invalid email or password.')}
  if(path==='/auth/logout'){sessionStorage.removeItem(SESSION_KEY);return{ok:true}}
  if(path==='/news')return db.news.filter(n=>n.published).sort((a,b)=>b.date.localeCompare(a.date));
  if(path==='/admin/news'&&method==='GET'){authed();return db.news}
  if(path==='/admin/news'&&method==='POST'){authed();const n={...body,id:body.id||String(Date.now()),date:body.date||new Date().toISOString().slice(0,10)};const i=db.news.findIndex(x=>x.id===n.id);i>=0?db.news[i]=n:db.news.push(n);demoSave(db);return n}
  if(path.startsWith('/admin/news/')&&method==='DELETE'){authed();db.news=db.news.filter(n=>n.id!==path.split('/').pop());demoSave(db);return{ok:true}}
  if(path==='/content/home'||path==='/content/mission'){const k=path.split('/').pop();if(method==='GET')return db[k]||{};authed();db[k]=body;demoSave(db);return body}
  throw new Error('Not found: '+path);
}
async function apiSend(path,method='GET',body){
  try{
    const r=await fetch(API_BASE+path,{method,credentials:'include',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
    const ct=r.headers.get('content-type')||'';
    if(!ct.includes('json')||r.status===404)throw new TypeError('no-backend');
    const data=await r.json();
    if(!r.ok)throw new Error(data.error||data.message||'Request failed.');
    return data;
  }catch(e){
    if(e instanceof TypeError)return demoCall(path,method,body);
    throw e;
  }
}
const apiGet=p=>apiSend(p,'GET');
