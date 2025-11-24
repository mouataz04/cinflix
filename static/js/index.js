document.addEventListener("DOMContentLoaded", () => {
  // Hero slideshow
  const heroSection = document.getElementById("hero");
  const heroBg = document.getElementById("heroBg");
  const heroImages = heroSection
    ? JSON.parse(heroSection.dataset.heroImages || "[]")
    : [];

  if (heroBg && heroImages.length) {
    let idx = 0;
    const updateHero = () => {
      heroBg.style.backgroundImage = `url("${heroImages[idx]}")`;
      idx = (idx + 1) % heroImages.length;
    };
    updateHero();
    if (heroImages.length > 1) {
      setInterval(updateHero, 5000);
    }
  }

  const input = document.getElementById("search");
  const button = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("resultsContainer");
  const searchIcon = document.querySelector(".search-icon");
  const personalSection = document.getElementById("personalRecommendations");
  const personalList = document.getElementById("personalList");

  if (!input || !button || !resultsContainer) {
    return;
  }

  const defaultButtonText = button.textContent.trim() || "Rechercher";
  const loadingText = "Recherche...";
  let isSearching = false;

  const resetButton = () => {
    button.disabled = false;
    button.textContent = defaultButtonText;
    isSearching = false;
  };

  const truncate = (text, max = 120) =>
    !text ? "Synopsis non disponible." : text.length > max ? `${text.slice(0, max)}...` : text;

  const buildResultsMarkup = (data) => {
    const safeQuery = data.query || "";
    const title =
      data.count > 0
        ? `Résultats pour « ${safeQuery} » (${data.count})`
        : `Aucun résultat pour « ${safeQuery} »`;

    if (data.count === 0) {
      return `
        <h2 id="seriesTitle">${title}</h2>
        <div class="search-results-grid empty">
          <p>Aucun résultat trouvé pour « ${safeQuery} ».</p>
        </div>
      `;
    }

    const cards = data.results
      .map(
        ({ id, name, image_url: imageUrl, synopsis }) => `
        <a href="/series/${id}" class="series-card">
          <div class="card-img-wrapper">
            <img src="${imageUrl}" alt="Affiche de ${name}">
          </div>
          <div class="series-overlay">
            <h3 class="series-name">${name}</h3>
            <p class="synopsis">${truncate(synopsis)}</p>
          </div>
        </a>
      `
      )
      .join("");

    return `
      <h2 id="seriesTitle">${title}</h2>
      <div class="search-results-grid">
        ${cards}
      </div>
    `;
  };

  const renderResults = (data) => {
    resultsContainer.innerHTML = buildResultsMarkup(data);
  };

  const clearResults = () => {
    resultsContainer.innerHTML = "";
  };

  const performSearch = () => {
    if (isSearching) return;
    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }

    button.disabled = true;
    button.textContent = loadingText;
    isSearching = true;
    clearResults();

    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(renderResults)
      .catch((error) => {
        console.error("Erreur recherche:", error);
        renderResults({ query, count: 0, results: [] });
      })
      .finally(resetButton);
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  button.addEventListener("click", performSearch);
  searchIcon?.addEventListener("click", () => input.focus());

  const renderPersonalRecommendations = () => {
    if (!personalSection || !personalList) {
      return;
    }

    fetch("/api/recommend_user")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const items = Array.isArray(data.recommendations) ? data.recommendations : [];

        if (!items.length) {
          personalList.innerHTML =
            '<p class="empty-reco">Pas encore de recommandations. Note quelques séries pour en débloquer !</p>';
        } else {
          personalList.innerHTML = items
            .map(
              (item) => `
            <a href="/series/${item.id}" class="series-card">
              <div class="card-img-wrapper">
                <img src="${item.image_url}" alt="Affiche de ${item.name}">
              </div>
              <div class="series-overlay">
                <h3 class="series-name">${item.name}</h3>
                <p class="synopsis">${truncate(item.synopsis, 110)}</p>
              </div>
            </a>
          `
            )
            .join("");
        }

        personalSection.hidden = false;
      })
      .catch((error) => {
        console.error("Erreur recommandations:", error);
        personalList.innerHTML =
          '<p class="empty-reco">Impossible de charger tes recommandations pour le moment.</p>';
        personalSection.hidden = false;
      });
  };

  if (personalSection && personalList) {
    renderPersonalRecommendations();
  }

  document.querySelectorAll(".series-row").forEach((row) => {
    const list = row.querySelector(".series-list");
    const previous = row.querySelector(".arrow.left");
    const next = row.querySelector(".arrow.right");

    previous?.addEventListener("click", () => {
      list?.scrollBy({ left: -300, behavior: "smooth" });
    });

    next?.addEventListener("click", () => {
      list?.scrollBy({ left: 300, behavior: "smooth" });
    });

    if (list) {
      list.addEventListener("wheel", (event) => {
        event.preventDefault();
        list.scrollLeft += event.deltaY;
      });

      let isDragging = false;
      let startX = 0;
      let scrollStart = 0;

      list.addEventListener("mousedown", (event) => {
        isDragging = true;
        startX = event.pageX - list.offsetLeft;
        scrollStart = list.scrollLeft;
        list.classList.add("dragging");
        event.preventDefault();
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        list.classList.remove("dragging");
      });

      list.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        const x = event.pageX - list.offsetLeft;
        const walk = (x - startX) * 2;
        list.scrollLeft = scrollStart - walk;
      });
    }
  });
});
