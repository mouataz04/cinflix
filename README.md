# CINFLIX – moteur de recherche de séries basé sur les sous-titres

Projet Flask permettant de rechercher, découvrir et gérer des séries TV à partir de leurs **sous‑titres indexés** (TF‑IDF).  
Fonctionnalités principales :
- Hero dynamique et recherche instantanée (`/api/search?q=...`)
- Détails par série (notes, liste personnelle, recommandations)
- Administration des recommandations et de la base SQLite

---

##  Prérequis

| Outil | Version conseillée |
|-------|--------------------|
| Python | 3.9+ |
| Git    | 2.4+ (avec `git lfs`) |
| Node (optionnel) | 18+ pour builder/packer le front si besoin |

> **Git LFS** est impératif : la base `database/tvshow.db` (≈111 Mo) est versionnée via LFS.  
> Après installation de Git, exécute **une seule fois** :
> ```bash
> git lfs install
> ```

---

##  Installation & lancement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/mouataz04/cinflix.git
   cd cinflix
   ```
2. **Activer Git LFS** (si ce n’est pas déjà fait sur la machine)
   ```bash
   git lfs install
   ```
3. **Installer les dépendances Python**
   ```bash
   python -m venv .venv          # optionnel mais recommandé
   .\.venv\Scripts\activate      # Windows
   # source .venv/bin/activate   # macOS / Linux
   pip install -r requirements.txt
   ```
4. **Configurer les variables d’environnement**  
   - Copier `.env.example` → `.env` (ou créer `.env`)  
   - Adapter la clé secrète, ports, etc. si nécessaire
5. **Lancer l’application**
   ```bash
   python app.py
   ```
   L’API écoute sur `http://127.0.0.1:5000/` (ou selon configuration).

---

##  Contenu important

- `app.py` : application Flask principale  
- `search.py` : moteur de recherche TF‑IDF  
- `recommend.py` : recommandations basées sur le contenu  
- `database/tvshow.db` : base SQLite fournie via Git LFS  
- `sous-titres/` : corpus (≈770 Mo) utilisé pour indexer TF‑IDF  
- `static/` & `templates/` : front Flask (HTML/CSS/JS)

---

##  Workflow collaboratif

Nous travaillons **exclusivement** via des branches pour garder `main` propre.

1. **Mettre à jour `main`**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Créer une branche pour ta tâche**
   ```bash
   git checkout -b feature/ma-tache
   ```
3. **Coder / tester**, puis valider :
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin feature/ma-tache
   ```
4. **Ouvrir une Pull Request** sur GitHub (`feature/ma-tache` → `main`)  
   - Mentionner les reviewers  
   - Résoudre les commentaires si nécessaire  
   - Merger une fois validé

5. **Supprimer la branche** (localement et sur GitHub) après merge.

>  Pour une nouvelle tâche, repars de `main` à jour et crée une nouvelle branche (ne réutilise pas une branche déjà mergée).

---

##  Tests & scripts utiles

- `python search.py` peut être utilisé pour tester le moteur TF‑IDF
- Scripts utilitaires :
  - `extract_subtitles.py`, `extract_SRT_3series.py` : extraction des sous-titres
  - `count_words_series.py`, `clean_word_frequency.py` : statistiques
- Pour rafraîchir l’index ou la base, voir `scripts/` et `database/`.

---




