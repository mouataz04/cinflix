document.addEventListener("DOMContentLoaded", () => {
  const serieName = document.querySelector(".rating-container")?.dataset.serie;
  if (!serieName) return;

  fetch(`/api/recommend/${serieName}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recommend-list");

      if (!data.recommendations || data.recommendations.length === 0) {
        container.innerHTML = "<p>Aucune recommandation disponible.</p>";
        return;
      }

      data.recommendations.forEach(([name, score]) => {
        const card = document.createElement("div");
        card.className = "recommend-card";
        card.innerHTML = `
          <div class="recommend-title">${name}</div>
          <small class="recommend-score">Similarité : ${(score*100).toFixed(1)}%</small>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erreur chargement recommandations :", err);
    });
});
