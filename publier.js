// Prépare le dossier www/contenu : un dossier = un thème, un PDF = une procédure.
// Usage : node publier.js   (ou double-clic sur publier.bat sous Windows)
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'www','contenu');
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const joli=s=>{s=s.replace(/[-_]+/g,' ').trim();return s.charAt(0).toUpperCase()+s.slice(1)};
const icone=n=>/secur/.test(n)?'shield':/incid|urgen|panne|accid/.test(n)?'alert':/charg|livr/.test(n)?'box':'file';
const categories=[],procedures=[];let urgence=null;
for(const d of fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name).sort()){
  const id=slug(d);categories.push({id,nom:joli(d),icone:icone(id)});
  for(const f of fs.readdirSync(path.join(root,d)).filter(f=>/\.pdf$/i.test(f)).sort()){
    const st=fs.statSync(path.join(root,d,f)),base=f.replace(/\.pdf$/i,''),pid=id+'-'+slug(base);
    procedures.push({id:pid,cat:id,titre:joli(base),fichier:d+'/'+f,maj:st.size+'-'+Math.floor(st.mtimeMs/1000)});
    if(/^urgence/i.test(base)&&!urgence)urgence=pid;
  }
}
fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify({categories,procedures,urgence},null,1));
console.log(procedures.length+' procédure(s), '+categories.length+' thème(s) -> www/contenu/manifest.json');
