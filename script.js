let DATA = {};

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  try {
    const res = await fetch("./data/data.json");
    DATA = await res.json();
    processData();
  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

/* =========================
   POINT SYSTEM
========================= */
function calculatePoints(rank) {
  if (rank === 1) return 100;
  return Math.max(5, 100 - rank * 5);
}

/* =========================
   MAIN PROCESSING
========================= */
function processData() {
  const levels = DATA.levels || [];
  const records = DATA.records || [];

  // Assign rank + points
  levels.forEach((level, index) => {
    level.rank = index + 1;
    level.points = calculatePoints(level.rank);
  });

  // Split lists
  const mainLevels = levels.filter(l => l.difficulty === "Extreme Demon");
  const extendedLevels = levels.filter(l => l.difficulty !== "Extreme Demon");

  // Build players
  const players = {};

  records.forEach(record => {
    if (!players[record.player]) {
      players[record.player] = {
        name: record.player,
        points: 0,
        completions: 0,
        runs: 0,
        hardest: null
      };
    }

    const player = players[record.player];
    const level = levels.find(l => l.name === record.level);
    if (!level) return;

    if (record.type === "completion") {
      player.points += level.points;
      player.completions++;

      if (!player.hardest || level.rank < player.hardest.rank) {
        player.hardest = level;
      }
    } else {
      player.runs++;
    }
  });

  const playerList = Object.values(players).sort((a, b) => b.points - a.points);

  renderLevels(mainLevels, "mainLevelList");
  renderLevels(extendedLevels, "extendedLevelList");
  renderPlayers(playerList);
  renderRecords(records);
}

/* =========================
   RENDER LEVELS (WITH THUMBNAILS)
========================= */
function renderLevels(list, elementId) {
  const el = document.getElementById(elementId);

  if (!el) return;

  el.innerHTML = list.map(l => `
    <article class="card">
      <div class="level-rank">#${l.rank}</div>

      ${l.thumbnail ? `<img class="thumb" src="${l.thumbnail}" alt="${l.name}">` : ""}

      <div class="level-name">${l.name}</div>
      <span class="tag">${l.difficulty}</span>
      <span class="tag">${l.points} pts</span>

      <div class="stat">
        <span>Creator</span>
        <strong>${l.creator}</strong>
      </div>
    </article>
  `).join("");
}

/* =========================
   RENDER PLAYERS
========================= */
function renderPlayers(players) {
  const el = document.getElementById("playerList");
  if (!el) return;

  el.innerHTML = players.map((p, i) => `
    <article class="card">
      <div class="level-rank">#${i + 1}</div>
      <div class="player-name">${p.name}</div>
      <div class="player-score">${p.points} pts</div>

      <div class="player-meta">
        ${p.completions} completions • ${p.runs} runs
      </div>

      <div class="hardest">
        <div class="player-meta">Hardest beaten</div>
        <strong>${p.hardest ? p.hardest.name : "None"}</strong>
      </div>
    </article>
  `).join("");
}

/* =========================
   RENDER RECORDS
========================= */
function renderRecords(records) {
  const el = document.getElementById("recordList");
  if (!el) return;

  el.innerHTML = records.map(r => `
    <article class="record">
      <div class="player">${r.player}</div>
      <div class="level">${r.level}</div>

      <div>
        <div class="type">${r.type}</div>
        <div>${r.percent}%</div>
      </div>

      <div class="attempts">
        ${r.attempts || "-"} attempts
      </div>

      <strong>${r.percent}%</strong>
    </article>
  `).join("");
}

/* =========================
   SEARCH
========================= */
document.getElementById("mainSearch")?.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();

  const levels = DATA.levels || [];

  const mainLevels = levels
    .filter(l => l.difficulty === "Extreme Demon")
    .filter(l => l.name.toLowerCase().includes(q));

  const extendedLevels = levels
    .filter(l => l.difficulty !== "Extreme Demon")
    .filter(l => l.name.toLowerCase().includes(q));

  renderLevels(mainLevels, "mainLevelList");
  renderLevels(extendedLevels, "extendedLevelList");
});

/* =========================
   SUBMIT SYSTEM
========================= */
document.getElementById("submitForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const isNewLevel = document.getElementById("isNewLevel")?.checked;

  const record = {
    player: document.getElementById("player").value,
    level: document.getElementById("level").value,
    type: document.getElementById("type").value,
    percent: Number(document.getElementById("percent").value) || 0,
    attempts: Number(document.getElementById("attempts").value) || 0
  };

  const output = document.getElementById("submitOutput");

  if (!output) return;

  if (isNewLevel) {
    const newLevel = {
      name: document.getElementById("level").value,
      creator: document.getElementById("creator").value,
      difficulty: document.getElementById("difficulty").value,
      thumbnail: "images/levels/default.png"
    };

    output.innerHTML = `
      <p><strong>NEW LEVEL (add to levels):</strong></p>
      <pre>${JSON.stringify(newLevel, null, 2)}</pre>

      <p><strong>RECORD (add to records):</strong></p>
      <pre>${JSON.stringify(record, null, 2)}</pre>
    `;
  } else {
    output.innerHTML = `
      <p><strong>RECORD (add to records):</strong></p>
      <pre>${JSON.stringify(record, null, 2)}</pre>
    `;
  }
});

/* =========================
   START
========================= */
loadData();
