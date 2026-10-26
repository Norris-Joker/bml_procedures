(()=>{
const C=window.BML_CFG||{},A=document.getElementById('app');let ok=!C.pin,selCat=null,flash='';
const P={shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',alert:'M10.3 4l-8 14a2 2 0 001.7 3h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z M12 9v4 M12 17h.01',box:'M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8',file:'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z M14 3v5h5 M9 13h6 M9 17h6',search:'M11 4a7 7 0 100 14 7 7 0 000-14z M21 21l-5-5',home:'M3 11l9-8 9 8 M5 10v10h14V10',list:'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',phone:'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',cr:'M9 6l6 6-6 6',cl:'M15 6l-6 6 6 6',cd:'M6 9l6 6 6-6',ck:'M5 12l5 5 10-10',plus:'M12 5v14 M5 12h14',sliders:'M4 6h10 M18 6h2 M4 12h4 M12 12h8 M4 18h12 M14 4v4 M8 10v4 M16 16v4'};
const ic=(n,s=24)=>`<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="${P[n]||P.file}"/></svg>`;
const ls=k=>{try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const db=new Promise((res,rej)=>{const r=indexedDB.open('bml',1);r.onupgradeneeded=()=>r.result.createObjectStore('p',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=async(m,f)=>{const d=await db;return new Promise((res,rej)=>{const t=d.transaction('p',m),q=f(t.objectStore('p'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const toggle=(k,id)=>{const a=ls(k),i=a.indexOf(id);i<0?a.push(id):a.splice(i,1);sv(k,a);return i<0};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const joli=s=>{s=s.replace(/[-_]+/g,' ').trim();return s.charAt(0).toUpperCase()+s.slice(1)};
const icone=n=>{n=norm(n);return /secur/.test(n)?'shield':/incid|urgen|panne|accid/.test(n)?'alert':/charg|livr/.test(n)?'box':'file'};
if(!C.serveur&&localStorage.getItem('cats')===null)sv('cats',['Sécurité','Incidents','Chargement','Documents'].map((n,i)=>({id:'c'+i,nom:n,icone:icone(n),local:true})));
const cats=()=>ls('cats'),procs=()=>ls('procs');
const cat=id=>cats().find(c=>c.id===id),pr=id=>procs().find(p=>p.id===id);
const nb=id=>procs().filter(p=>p.cat===id).length,fich=n=>n+(n>1?' fiches':' fiche');
const tile=(n,s=48)=>`<span class="tile" style="width:${s}px;height:${s}px">${ic(n)}</span>`;
const nav=a=>`<nav class="nav">${[['','home','Accueil'],['sommaire','list','Sommaire'],['favoris','star','Favoris']].map(([h,i,l])=>`<a href="#/${h}" class="${a===h?'on':''}">${ic(i,22)}${l}</a>`).join('')}</nav>`;
const row=p=>{const c=cat(p.cat);return `<a class="card row" href="#/proc/${p.id}">${tile(c?c.icone:'file')}<span class="grow"><b>${esc(p.titre)}</b><small>${esc(c?c.nom:'')}${ls('lu').includes(p.id)?' · lu':''}</small></span>${ic('cr',20)}</a>`};
const list=a=>a.length?a.map(row).join(''):'';
const head=(back,title,sub='',extra='')=>`<header class="head"><div class="top"><a class="back" href="${back}" aria-label="Retour">${ic('cl',22)}</a>${extra}</div><h1>${esc(title)}</h1>${sub?`<small>${sub}</small>`:''}</header>`;

const homeBody=()=>{const rec=ls('rec').map(pr).filter(Boolean).slice(0,3);
return `<div class="grid">${cats().map(c=>`<a class="card cat" href="#/cat/${c.id}">${tile(c.icone)}<span><b>${esc(c.nom)}</b><small>${fich(nb(c.id))}</small></span></a>`).join('')}</div>${pr(localStorage.getItem('urg'))?`<a class="urg" href="#/proc/${localStorage.getItem('urg')}">${ic('alert',26)}<span class="grow">Urgence : que faire ?</span>${ic('cr',22)}</a>`:''}${rec.length?`<h2>Consultées récemment</h2>${list(rec)}`:''}`};
const results=q=>{const t=norm(q.trim()),r=procs().filter(p=>norm(p.titre).includes(t));return r.length?list(r):`<p class="empty">Aucune procédure ne correspond à « ${esc(q)} ». Essayez un autre mot.</p>`};

const views={
 home(){A.innerHTML=`<header class="head"><div class="brand"><img src="logo.jpeg" alt="BML"><div><small>Bonjour</small><h1>Procédures chauffeur</h1></div></div><label class="search">${ic('search',20)}<input id="q" type="search" aria-label="Rechercher une procédure" placeholder="Rechercher une procédure" autocomplete="off"></label></header><main id="body" class="body">${procs().length?homeBody():homeBody()+'<p class="empty">Aucune procédure pour le moment. Connectez le téléphone à Internet pour les télécharger.</p>'}</main>${nav('')}`;
  const q=document.getElementById('q'),b=document.getElementById('body');q.oninput=()=>{b.innerHTML=q.value.trim()?results(q.value):homeBody()};let n=0;document.querySelector('.brand img').onclick=()=>{if(++n>=5){n=0;location.hash='#/gerer'}}},
 cat(id){const c=cat(id);A.innerHTML=`${head('#/',c.nom,fich(nb(id)))}<main class="body">${list(procs().filter(p=>p.cat===id))||'<p class="empty">Aucune procédure dans ce thème pour le moment.</p>'}</main>${nav('')}`},
 sommaire(){A.innerHTML=`<header class="head"><h1>Sommaire</h1><small>${procs().length} procédures classées par thème</small></header><main class="body">${cats().map(c=>`<details class="card sec"><summary>${tile(c.icone,40)}<span class="grow"><b>${esc(c.nom)}</b><small>${fich(nb(c.id))}</small></span>${ic('cd',20)}</summary>${procs().filter(p=>p.cat===c.id).map(p=>`<a class="it" href="#/proc/${p.id}">${esc(p.titre)}${ic('cr',18)}</a>`).join('')}</details>`).join('')}${C.serveur?`<p class="empty" id="sync">${msg||stamp()}</p><button class="btn" id="maj">Mettre à jour</button>`:''}</main>${nav('sommaire')}`;const mj=document.getElementById('maj');if(mj)mj.onclick=()=>sync()},
 favoris(){const f=ls('fav').map(pr).filter(Boolean);A.innerHTML=`<header class="head"><h1>Favoris</h1><small>${fich(f.length)}</small></header><main class="body">${list(f)||'<p class="empty">Aucun favori. Touchez l’étoile dans une procédure pour la retrouver ici.</p>'}</main>${nav('favoris')}`},
 gerer(){const go=()=>views.gerer();
  if(!ok){A.innerHTML=`<header class="head"><h1>Gérer</h1><small>Accès réservé à l’administrateur</small></header><main class="body"><label class="card pad">Code administrateur<input id="pin" class="field" type="password" inputmode="numeric" autocomplete="off"></label><button class="btn" id="go">Valider</button><p class="empty" id="msg" role="status"></p></main>${nav('')}`;
   document.getElementById('go').onclick=()=>{if(document.getElementById('pin').value===String(C.pin)){ok=true;go()}else document.getElementById('msg').textContent='Code incorrect.'};return}
  const cs=cats(),ps=procs(),mine=ps.filter(p=>p.local),urg=localStorage.getItem('urg')||'';if(!cs.find(c=>c.id===selCat))selCat=cs[0]&&cs[0].id;
  const fl=flash;flash='';
  A.innerHTML=`<header class="head"><h1>Gérer</h1><small>Vos PDF restent enregistrés dans l’application</small></header><main class="body">
<section class="card pad"><h2>Ajouter des PDF</h2><label>Thème<select id="sel" class="field">${cs.map(c=>`<option value="${c.id}"${c.id===selCat?' selected':''}>${esc(c.nom)}</option>`).join('')}</select></label><label class="btn" for="files">${ic('plus',22)}Choisir des PDF</label><input id="files" type="file" accept="application/pdf" multiple hidden><p class="msg" id="msg" role="status">${esc(fl)}</p></section>
<section class="card pad"><h2>Thèmes</h2>${cs.filter(c=>c.local).map(c=>`<div class="mrow"><span class="grow">${esc(c.nom)}<small>${fich(nb(c.id))}</small></span><button class="del" data-c="${c.id}">Supprimer</button></div>`).join('')}<div class="mrow"><input id="nc" class="field" placeholder="Nouveau thème" aria-label="Nom du nouveau thème"><button class="btn sm" id="addc">Ajouter</button></div></section>
<section class="card pad"><h2>Procédures ajoutées (${mine.length})</h2>${mine.map(p=>`<div class="mrow"><input class="field" data-p="${p.id}" value="${esc(p.titre)}" aria-label="Titre de la procédure"><button class="del" data-d="${p.id}">Supprimer</button></div>`).join('')||'<p class="empty">Aucune procédure.</p>'}</section>
<section class="card pad"><h2>Procédure d’urgence</h2><select id="urg" class="field" aria-label="Procédure d’urgence"><option value="">Aucune</option>${ps.map(p=>`<option value="${p.id}"${p.id===urg?' selected':''}>${esc(p.titre)}</option>`).join('')}</select></section>
<button class="btn" id="out">Verrouiller et quitter</button></main>${nav('')}`;
  document.getElementById('out').onclick=()=>{ok=!C.pin;location.hash='#/'};
  document.getElementById('sel').onchange=e=>{selCat=e.target.value};
  document.getElementById('urg').onchange=e=>{localStorage.setItem('urg',e.target.value)};
  document.getElementById('files').onchange=async e=>{const fs=[...e.target.files];if(!selCat){flash='Créez d’abord un thème.';return go()}
   for(const f of fs){const id='p'+Date.now()+Math.random().toString(36).slice(2,6);await tx('readwrite',x=>x.put({id:id+'@l',blob:f}));const a=procs();a.push({id,cat:selCat,titre:joli(f.name.replace(/\.pdf$/i,'')),maj:'l',local:true});sv('procs',a)}
   flash=fs.length+(fs.length>1?' procédures ajoutées.':' procédure ajoutée.');go()};
  document.getElementById('addc').onclick=()=>{const n=document.getElementById('nc').value.trim();if(!n)return;const a=cats();a.push({id:'c'+Date.now(),nom:n,icone:icone(n),local:true});sv('cats',a);flash='Thème « '+n+' » ajouté.';go()};
  document.querySelectorAll('[data-p]').forEach(i=>i.onchange=()=>{const a=procs(),p=a.find(x=>x.id===i.dataset.p);if(p&&i.value.trim()){p.titre=i.value.trim();sv('procs',a)}});
  document.querySelectorAll('.del').forEach(b=>b.onclick=async()=>{if(!b.dataset.a){b.dataset.a=1;b.textContent='Confirmer ?';setTimeout(()=>{delete b.dataset.a;b.textContent='Supprimer'},3000);return}
   if(b.dataset.c){if(nb(b.dataset.c)){flash='Videz ce thème avant de le supprimer.';return go()}sv('cats',cats().filter(c=>c.id!==b.dataset.c))}
   else{const id=b.dataset.d;await tx('readwrite',x=>x.delete(id+'@l'));sv('procs',procs().filter(p=>p.id!==id));if(localStorage.getItem('urg')===id)localStorage.setItem('urg','')}
   flash='Supprimé.';go()})
 },
 proc(id){const p=pr(id),fav=ls('fav').includes(id),lu=ls('lu').includes(id);
  sv('rec',[id,...ls('rec').filter(x=>x!==id)].slice(0,5));
  A.innerHTML=`${head('#/cat/'+p.cat,p.titre,'',`<button class="star" id="fav" aria-pressed="${fav}" aria-label="Ajouter aux favoris">${ic('star',22)}</button>`)}<main id="pdf" class="pdf"><p class="empty">Chargement de la procédure…</p></main><div class="bar">${C.tel?`<a class="call" href="tel:${esc(C.tel)}" aria-label="Appeler le régulateur">${ic('phone',22)}</a>`:''}<button class="read" id="lu" aria-pressed="${lu}">${ic('ck',20)}<span>${lu?'Lu':'Marquer comme lu'}</span></button></div>`;
  const f=document.getElementById('fav'),l=document.getElementById('lu');
  f.onclick=()=>f.setAttribute('aria-pressed',toggle('fav',id));
  l.onclick=()=>{const v=toggle('lu',id);l.setAttribute('aria-pressed',v);l.lastChild.textContent=v?'Lu':'Marquer comme lu'};
  show(p)}
};
async function show(p){const box=document.getElementById('pdf');
 try{pdfjsLib.GlobalWorkerOptions.workerSrc='lib/pdf.worker.min.js';
  const rec=await tx('readonly',x=>x.get(p.id+'@'+p.maj)),doc=await pdfjsLib.getDocument({data:new Uint8Array(await rec.blob.arrayBuffer())}).promise;box.innerHTML='';
  const w=box.clientWidth-24,r=window.devicePixelRatio||1;
  for(let i=1;i<=doc.numPages;i++){const pg=await doc.getPage(i),s=w/pg.getViewport({scale:1}).width,v=pg.getViewport({scale:s*r}),cv=document.createElement('canvas');
   cv.width=v.width;cv.height=v.height;cv.style.width=w+'px';cv.style.height=v.height/r+'px';box.appendChild(cv);
   await pg.render({canvasContext:cv.getContext('2d'),viewport:v}).promise}
 }catch(e){box.innerHTML='<p class="empty">Impossible d’ouvrir ce PDF. Il n’est pas encore téléchargé. Connectez le téléphone à Internet puis rouvrez l’application.</p>'}}
function route(){const [,r,id]=(location.hash||'#/').split('/');if(r!=='gerer')ok=!C.pin;
 if(r==='cat'&&cat(id))views.cat(id);else if(r==='proc'&&pr(id))views.proc(id);else if(r==='sommaire')views.sommaire();else if(r==='favoris')views.favoris();else if(r==='gerer')views.gerer();else views.home()}
let msg='',busy=false;const setMsg=t=>{msg=t;const e=document.getElementById('sync');if(e)e.textContent=t};
const stamp=()=>{const t=localStorage.getItem('sync');return t?'Dernière mise à jour : '+new Date(+t).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}):'Pas encore de mise à jour.'};
async function sync(){if(busy||!C.serveur)return;busy=true;setMsg('Mise à jour en cours…');
 try{const base=C.serveur.replace(/\/?$/,'/'),r=await fetch(base+'manifest.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('manifest');const m=await r.json();
  const have=new Set((await tx('readonly',x=>x.getAllKeys()))||[]),old=Object.fromEntries(procs().map(p=>[p.id,p])),out=[],used=new Set(),loc=procs().filter(p=>p.local),lc=cats().filter(c=>c.local);loc.forEach(p=>used.add(p.id+'@l'));
  for(const p of m.procedures||[]){const k=p.id+'@'+p.maj;
   try{if(!have.has(k)){const f=await fetch(base+encodeURI(p.fichier),{cache:'no-store'});if(!f.ok)throw new Error('pdf');const blob=await f.blob();await tx('readwrite',x=>x.put({id:k,blob}));have.add(k)}out.push(p);used.add(k)}
   catch(e){const o=old[p.id],ok=o&&o.id+'@'+o.maj;if(ok&&have.has(ok)){out.push(o);used.add(ok)}}}
  sv('cats',[...(m.categories||[]),...lc]);sv('procs',[...out,...loc]);if(m.urgence)localStorage.setItem('urg',m.urgence);
  for(const k of have)if(!used.has(k))await tx('readwrite',x=>x.delete(k));
  localStorage.setItem('sync',Date.now());setMsg(stamp());
  if(!location.hash.startsWith('#/proc'))route();
 }catch(e){setMsg((procs().length?'Hors connexion. ':'Connectez le téléphone à Internet. ')+stamp())}
 busy=false}
addEventListener('hashchange',route);route();sync();addEventListener('online',sync);
})();
