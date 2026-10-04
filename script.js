let DATA = {};

async function loadData() {
  const res = await fetch("data/data.json");
  DATA = await res.json();

  processData();
}

const mainLevels=[
 {id:"sakupenhell",rank:1,name:"Sakupen Hell",difficulty:"Extreme Demon",creator:"Noobas",points:100},
 {id:"bloodbath",rank:2,name:"Bloodbath",difficulty:"Extreme Demon",creator:"Riot",points:95},
 {id:"cataclysm",rank:3,name:"Cataclysm",difficulty:"Extreme Demon",creator:"Ggb0y",points:90},
 {id:"mizureta",rank:4,name:"Mizureta",difficulty:"Extreme Demon",creator:"Dutchie",points:85}
];

const extendedLevels=[
 {id:"hakaitsu",rank:1,name:"Hakaitsu",difficulty:"Insane Demon",creator:"ImNotCriko",points:50},
 {id:"magmabound",rank:2,name:"Magma Bound",difficulty:"Insane Demon",creator:"ScorchVx",points:45},
 {id:"crazyii",rank:3,name:"Crazy II",difficulty:"Insane Demon",creator:"DavJT",points:40},
 {id:"thermodynamix",rank:4,name:"ThermoDynamix",difficulty:"Hard Demon",creator:"Flash",points:35},
 {id:"crazy",rank:5,name:"Crazy",difficulty:"Hard Demon",creator:"DavJT",points:30},
 {id:"clubstep",rank:6,name:"Clubstep",difficulty:"Easy Demon",creator:"RobTop",points:25}
];

const players=[
 {name:"Pauly"},
 {name:"Jacob"},
 {name:"London"},
 {name:"Ethan.p"},
 {name:"Ethan.t"}
];

const records=[
 {player:"Jacob",level:"Sakupen Hell",progress:"100%",type:"completion",run:"0–100%",attempts:"100000"},
 {player:"Jacob",level:"Cataclysm",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"Magma Bound",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"Crazy II",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"Crazy",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"Clubstep",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"ThermoDynamix",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"London",level:"Cataclysm",progress:"62%",type:"run",run:"0–62%",attempts:"—"},
 {player:"London",level:"Rauchkammer",progress:"60%",type:"run",run:"0–60%",attempts:"—"},
 {player:"London",level:"Magma Bound",progress:"100%",type:"completion",run:"0–100%",attempts:"2000"},
 {player:"London",level:"Crazy II",progress:"100%",type:"completion",run:"0–100%",attempts:"853"},
 {player:"London",level:"Crazy",progress:"100%",type:"completion",run:"0–100%",attempts:"651"},
 {player:"Pauly",level:"Mizureta",progress:"100%",type:"completion",run:"0–100%",attempts:"3000"},
 {player:"Pauly",level:"Hakaitsu",progress:"100%",type:"completion",run:"0–100%",attempts:"2500"},
 {player:"Pauly",level:"Crazy II",progress:"100%",type:"completion",run:"0–100%",attempts:"670"},
 {player:"Pauly",level:"Crazy",progress:"100%",type:"completion",run:"0–100%",attempts:"2500"},
 {player:"Pauly",level:"Wasureta",progress:"58%",type:"run",run:"32–58%",attempts:"5000"},
 {player:"Ethan.p",level:"Bloodbath",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Ethan.t",level:"None",progress:"0%",type:"run",run:"0–0%",attempts:"—"}
];

function allLevels(){return [...mainLevels,...extendedLevels];}
function findLevel(name){return allLevels().find(l=>l.name.toLowerCase()===name.toLowerCase());}
function completedBy(name){return records.filter(r=>r.player===name&&r.type==="completion");}
function runsBy(name){return records.filter(r=>r.player===name&&r.type==="run");}
function pointsForRecord(record){
 const level=findLevel(record.level);
 return record.type==="completion" && level ? level.points : 0;
}
function totalPoints(name){return completedBy(name).reduce((sum,r)=>sum+pointsForRecord(r),0);}
function hardestRecord(name){
 const completed=completedBy(name).filter(r=>findLevel(r.level));
 if(!completed.length)return null;
 return completed.reduce((hardest,current)=>{
   const a=findLevel(hardest.level), b=findLevel(current.level);
   if(b.points>a.points)return current;
   if(b.points===a.points && b.rank<a.rank)return current;
   return hardest;
 });
}
function bestHardest(name){
 const record=hardestRecord(name);
 return record ? record.level : "No completions yet";
}

function playerRanking(){
 return [...players].sort((a,b)=>{
   const pointsDiff=totalPoints(b.name)-totalPoints(a.name);
   if(pointsDiff!==0)return pointsDiff;
   return completedBy(b.name).length-completedBy(a.name).length;
 });
}

function renderList(list,elementId){
 const el=document.getElementById(elementId);
 el.innerHTML=list.map(l=>`
 <article class="card" onclick="showLevel('${l.id}')">
   <div class="level-rank">#${l.rank}</div>
   <div class="level-name">${l.name}</div>
   <span class="tag">${l.difficulty}</span>
   <span class="tag">${l.points} pts</span>
   <div class="stat"><span>Creator</span><strong>${l.creator}</strong></div>
 </article>`).join("");
}

function renderPlayers(){
 const ranked=playerRanking();
 document.getElementById("playerList").innerHTML=ranked.map((p,index)=>{
   const completed=completedBy(p.name);
   const runs=runsBy(p.name);
   const hardest=bestHardest(p.name);
   return `<article class="card" onclick="showPlayer('${p.name}')">
    <div class="level-rank">#${index+1}</div>
    <div class="player-name">${p.name}</div>
    <div class="player-score">${totalPoints(p.name)} pts</div>
    <div class="player-meta">${completed.length} completion${completed.length===1?"":"s"} • ${runs.length} run${runs.length===1?"":"s"}</div>
    <div class="hardest"><div class="player-meta">Hardest beaten</div><strong>${hardest}</strong></div>
   </article>`;
 }).join("");
}

function renderRecords(filter="all"){
 const data=filter==="all"?records:records.filter(r=>r.type===filter);
 document.getElementById("recordList").innerHTML=data.map(r=>`
 <article class="record">
  <div class="player">${r.player}</div>
  <div class="level">${r.level}</div>
  <div><div class="type">${r.type}</div><div class="progress">${r.run}</div></div>
  <div class="attempts">${r.attempts} attempts</div>
  <strong>${r.progress}</strong>
 </article>`).join("");
}

function showLevel(id){
 const l=allLevels().find(x=>x.id===id);
 const rs=records.filter(r=>r.level.toLowerCase()===l.name.toLowerCase());
 document.getElementById("modalContent").innerHTML=`
 <p class="eyebrow">${mainLevels.includes(l)?"MAIN LIST":"EXTENDED LIST"} #${l.rank}</p><h2>${l.name}</h2>
 <p>${l.difficulty} • ${l.points} points • Created by ${l.creator}</p>
 <h3>Records</h3>
 ${rs.length?rs.map(r=>`<div class="run-line"><span><strong>${r.player}</strong> — ${r.type}</span><span>${r.run} • ${r.attempts}</span></div>`).join(""):"<p>No records submitted yet.</p>"}`;
 document.getElementById("modal").classList.remove("hidden");
}

function showPlayer(name){
 const rs=records.filter(r=>r.player===name);
 const completed=completedBy(name);
 const runs=runsBy(name);
 const ranking=playerRanking().findIndex(p=>p.name===name)+1;
 document.getElementById("modalContent").innerHTML=`
 <p class="eyebrow">PLAYER PROFILE</p><h2>${name}</h2>
 <p><strong>#${ranking}</strong> • <strong>${totalPoints(name)} points</strong> • ${completed.length} completions • ${runs.length} partial runs</p>
 <h3>Records</h3>
 ${rs.length?rs.map(r=>`<div class="run-line"><span><strong>${r.level}</strong> — ${r.type}</span><span>${r.run} • ${r.attempts}</span></div>`).join(""):"<p>No records submitted yet.</p>"}`;
 document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("mainSearch").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 renderList(mainLevels.filter(l=>l.name.toLowerCase().includes(q)||l.difficulty.toLowerCase().includes(q)),"mainLevelList");
 renderList(extendedLevels.filter(l=>l.name.toLowerCase().includes(q)||l.difficulty.toLowerCase().includes(q)),"extendedLevelList");
});
document.getElementById("recordFilter").addEventListener("change",e=>renderRecords(e.target.value));
document.getElementById("closeModal").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")e.currentTarget.classList.add("hidden")});

renderList(mainLevels,"mainLevelList");
renderList(extendedLevels,"extendedLevelList");
renderPlayers();
renderRecords();
