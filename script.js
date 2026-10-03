const levels=[
 {id:"sakupenhell",rank:1,name:"Sakupen Hell",difficulty:"Extreme Demon",creator:"LordVaderCraft",points:100},
 {id:"bloodbath",rank:2,name:"Bloodbath",difficulty:"Extreme Demon",creator:"Riot",points:95},
 {id:"cataclysm",rank:3,name:"Cataclysm",difficulty:"Extreme Demon",creator:"Ggb0y",points:90},
 {id:"mizureta",rank:4,name:"Mizureta",difficulty:"Extreme Demon",creator:"Rustam",points:85}
];

const players=[
 {name:"Pauly",beaten:1,hardest:"Mizureta"},
 {name:"Jacob",beaten:2,hardest:"Sakupen Hell"}
];

const records=[
 {player:"Jacob",level:"Sakupen Hell",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Jacob",level:"Cataclysm",progress:"100%",type:"completion",run:"0–100%",attempts:"—"},
 {player:"Pauly",level:"Mizureta",progress:"100%",type:"completion",run:"0–100%",attempts:"—"}
];

function renderLevels(list=levels){
 const el=document.getElementById("levelList");
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
 const el=document.getElementById("playerList");
 el.innerHTML=players.map(p=>{
   const completed=records.filter(r=>r.player===p.name&&r.type==="completion");
   const hardest=completed.length?p.hardest: "No completions yet";
   return `<article class="card" onclick="showPlayer('${p.name}')">
    <div class="player-name">${p.name}</div>
    <div class="player-meta">${completed.length} level${completed.length===1?"":"s"} beaten</div>
    <div class="hardest"><div class="player-meta">Hardest beaten</div><strong>${hardest}</strong></div>
   </article>`;
 }).join("");
}

function renderRecords(filter="all"){
 let data=filter==="all"?records:records.filter(r=>r.type===filter);
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
 const l=levels.find(x=>x.id===id);
 const rs=records.filter(r=>r.level.toLowerCase()===l.name.toLowerCase());
 document.getElementById("modalContent").innerHTML=`
 <p class="eyebrow">LEVEL #${l.rank}</p><h2>${l.name}</h2>
 <p>${l.difficulty} • ${l.points} points</p>
 <h3>Records</h3>
 ${rs.length?rs.map(r=>`<div class="run-line"><span><strong>${r.player}</strong> — ${r.type}</span><span>${r.run} • ${r.attempts}</span></div>`).join(""):"<p>No records submitted yet.</p>"}`;
 document.getElementById("modal").classList.remove("hidden");
}

function showPlayer(name){
 const rs=records.filter(r=>r.player===name);
 document.getElementById("modalContent").innerHTML=`
 <p class="eyebrow">PLAYER PROFILE</p><h2>${name}</h2>
 <p>${rs.filter(r=>r.type==="completion").length} completions • ${rs.length} submitted records</p>
 <h3>Records</h3>
 ${rs.length?rs.map(r=>`<div class="run-line"><span><strong>${r.level}</strong> — ${r.type}</span><span>${r.run} • ${r.attempts}</span></div>`).join(""):"<p>No records submitted yet.</p>"}`;
 document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("levelSearch").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 renderLevels(levels.filter(l=>l.name.toLowerCase().includes(q)||l.difficulty.toLowerCase().includes(q)));
});
document.getElementById("recordFilter").addEventListener("change",e=>renderRecords(e.target.value));
document.getElementById("closeModal").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")e.currentTarget.classList.add("hidden")});

renderLevels();renderPlayers();renderRecords();
