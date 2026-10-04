const mainLevels=[
 {id:"sakupenhell",rank:1,name:"Sakupen Hell",difficulty:"Extreme Demon",creator:"LordVaderCraft",points:100},
 {id:"bloodbath",rank:2,name:"Bloodbath",difficulty:"Extreme Demon",creator:"Riot",points:95},
 {id:"cataclysm",rank:3,name:"Cataclysm",difficulty:"Extreme Demon",creator:"Ggb0y",points:90},
 {id:"mizureta",rank:4,name:"Mizureta",difficulty:"Extreme Demon",creator:"Rustam",points:85}
];

const extendedLevels=[
 {id:"clubstep",rank:1,name:"Clubstep",difficulty:"Easy Demon",creator:"RobTop",points:50}
];

const players=[
 {name:"Pauly"},
 {name:"Jacob"},
 {name:"London"},
 {name:"Ethan.p"},
 {name:"Ethan.t"}
];

const records=[
 {player:"Jacob",level:"Sakupen Hell",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"Cataclysm",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"London",level:"Cataclysm",progress:"62%",type:"run",run:"0–62%",attempts:"—"},
 {player:"Pauly",level:"Mizureta",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Pauly",level:"Wasureta",progress:"58%",type:"run",run:"32–58%",attempts:"—"},
 {player:"Ethan.p",level:"Bloodbath",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Ethan.t",level:"Clubstep",progress:"100%",type:"completion",run:"0–100%",attempts:"—"}
];

function allLevels(){return [...mainLevels,...extendedLevels];}
function completedBy(name){return records.filter(r=>r.player===name&&r.type==="completion");}
function bestHardest(name){
 const rs=completedBy(name);
 if(!rs.length)return "No completions yet";
 const order=[...mainLevels,...extendedLevels];
 return rs.sort((a,b)=>order.findIndex(l=>l.name===a.level)-order.findIndex(l=>l.name===b.level))[0].level;
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
 document.getElementById("playerList").innerHTML=players.map(p=>{
   const completed=completedBy(p.name);
   const runs=records.filter(r=>r.player===p.name&&r.type==="run");
   return `<article class="card" onclick="showPlayer('${p.name}')">
    <div class="player-name">${p.name}</div>
    <div class="player-meta">${completed.length} completion${completed.length===1?"":"s"} • ${runs.length} run${runs.length===1?"":"s"}</div>
    <div class="hardest"><div class="player-meta">Hardest beaten</div><strong>${bestHardest(p.name)}</strong></div>
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
 document.getElementById("modalContent").innerHTML=`
 <p class="eyebrow">PLAYER PROFILE</p><h2>${name}</h2>
 <p>${completedBy(name).length} completions • ${rs.filter(r=>r.type==="run").length} partial runs</p>
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
