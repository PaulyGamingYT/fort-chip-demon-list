const levels=[
 {id:"society",rank:1,name:"Society",difficulty:"Extreme Demon",creator:"Unknown",points:100},
 {id:"vehemence",rank:2,name:"Vehemence",difficulty:"Extreme Demon",creator:"Unknown",points:95},
 {id:"wasureta",rank:3,name:"Wasureta",difficulty:"Extreme Demon",creator:"Unknown",points:90},
 {id:"slaughterhouse",rank:4,name:"Slaughterhouse",difficulty:"Extreme Demon",creator:"Unknown",points:85},
 {id:"kowareta",rank:5,name:"Kowareta",difficulty:"Extreme Demon",creator:"Unknown",points:80},
 {id:"hakaitsu",rank:6,name:"Hakaitsu",difficulty:"Insane Demon",creator:"Unknown",points:70}
];

const players=[
 {name:"Pauly",beaten:0,hardest:"—"},
 {name:"Friend 1",beaten:0,hardest:"—"},
 {name:"Friend 2",beaten:0,hardest:"—"}
];

const records=[
 {player:"Pauly",level:"Society",progress:"67%",type:"run",run:"30–67%",attempts:"8,421"},
 {player:"Pauly",level:"Wasureta",progress:"57%",type:"run",run:"32–57%",attempts:"5,000+"},
 {player:"Pauly",level:"Slaughterhouse",progress:"43%",type:"run",run:"25–43%",attempts:"10,000+"},
 {player:"Friend 1",level:"Kowareta",progress:"100%",type:"completion",run:"0–100%",attempts:"7,231"},
 {player:"Friend 2",level:"Hakaitsu",progress:"100%",type:"completion",run:"0–100%",attempts:"2,843"}
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
