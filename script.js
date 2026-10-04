function renderPlayers(players) {
  const container = document.getElementById("playerList");
  container.innerHTML = "";

  const sorted = [...players].sort((a, b) => b.points - a.points);

  sorted.forEach((player, index) => {
    const div = document.createElement("div");
    div.className = "player-card";

    div.innerHTML = `
      <div class="player-rank">#${index + 1}</div>
      <h3>${player.name}</h3>
      <div class="player-points">${player.points} pts</div>
      <p>${player.completions || 0} completions • ${player.runs || 0} runs</p>
      <hr>
      <small>Hardest beaten</small><br>
      <strong>${player.hardest || "None"}</strong>
    `;

    container.appendChild(div);
  });
}
