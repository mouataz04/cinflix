# Manuel d’utilisation – SUBSTREAM

## 1. Présentation
SUBSTREAM est une application web permettant de rechercher, explorer et recommander des séries TV à partir de leurs sous-titres. L’interface propose :

- un moteur de recherche par mots-clés,
- des recommandations personnalisées selon les notes et la liste de l’utilisateur,
- la gestion d’un compte (inscription, connexion, mot de passe oublié),
- l’ajout de séries à “Ma liste” et la notation sur 5 étoiles.

Ce guide s’adresse à un utilisateur non technicien utilisant la machine virtuelle fournie. Il détaille la procédure de lancement et le parcours fonctionnel.

---

## 2. Pré-requis
Sur la machine virtuelle, les éléments suivants sont déjà installés :

- Python 3.11,
- les dépendances Python du projet (`Flask`, `sqlite3`, `scikit-learn`, etc.),
- la base de données `database/tvshow.db` contenant les séries.

Aucune installation supplémentaire n’est requise.

---

## 3. Démarrage de l’application
1. Ouvrir un terminal (PowerShell ou invite de commande) dans le dossier du projet `S5C01`.
2. Lancer le serveur Flask :
   ```bash
   python app.py
   ```
3. Attendre le message :
   ```
   * Running on http://127.0.0.1:5000
   ```
4. Ouvrir un navigateur et saisir l’URL suivante : `http://127.0.0.1:5000`

> **Astuce :** Le chargement initial peut prendre quelques secondes (construction du moteur de recherche). Laisser la console tourner jusqu’à ce que la page d’accueil s’affiche.

Pour arrêter l’application, revenir dans le terminal et presser `Ctrl + C`.

---

## 4. Parcours fonctionnel
### 4.1 Page d’accueil
- Présente un carrousel de séries “tendance” et un champ de recherche.
- Un bandeau “Recommandées pour toi” apparaît si l’utilisateur est connecté et a noté des séries.

### 4.2 Recherche par mots-clés
1. Saisir un ou plusieurs mots (`crash avion île`, `vampire lycée`, etc.).
2. Cliquer sur **Rechercher** ou presser **Entrée**.
3. Les résultats s’affichent sous forme de cartes (image, titre, synopsis). Cliquer sur une carte pour ouvrir la fiche détaillée.

### 4.3 Créer un compte
1. Depuis **Connexion**, cliquer sur **Créer un compte**.
2. Renseigner nom d’utilisateur, email, mot de passe et confirmation.
3. Un message confirme la création ; revenir à la page de connexion pour se connecter.

### 4.4 Connexion / déconnexion
1. Saisir identifiant et mot de passe.
2. Une fois connecté, un bandeau de bienvenue apparaît et la navigation “Ma liste” devient accessible.
3. Utiliser **Déconnexion** (en haut à droite) pour terminer la session.

### 4.5 Mot de passe oublié
1. Sur la page de connexion, cliquer sur **Mot de passe oublié ?**.
2. Indiquer l’email du compte ; si l’email existe, un lien interne permet de définir un nouveau mot de passe.
3. Saisir deux fois le nouveau mot de passe puis valider. Un message confirme la mise à jour.

### 4.6 Fiche série
La page détail affiche :
- synopsis complet,
- image pleine largeur,
- notes moyennes utilisateurs,
- boutons : **Ajouter à ma liste** / **Retirer** et **Noter la série**.

#### Noter une série
1. Cliquer sur les étoiles ou saisir une valeur (1 à 5).
2. Valider ; un message confirme l’enregistrement.
3. Modifier la note répète l’opération (la note précédente est remplacée).

#### Ajouter / retirer de “Ma Liste”
1. Cliquer sur **Ajouter à ma liste** ; le bouton passe à **Retirer**.
2. Cliquer à nouveau pour retirer la série.
3. La section “Ma liste” affiche en temps réel les séries conservées.

### 4.7 Ma liste
- Accessible depuis la barre de navigation.
- Répertorie toutes les séries enregistrées par l’utilisateur connecté (affiche + lien vers la fiche).

### 4.8 Recommandations personnalisées
- Sur la page d’accueil, la zone **Recommandées pour toi** suggère jusqu’à 10 séries proches des goûts de l’utilisateur (d’après notes + liste).
- Si aucune recommandation n’est disponible, un message invite à noter des séries.

---

## 5. Tests rapides des API (optionnel)
Pour vérifier les API en direct (via navigateur ou curl) :
- `GET http://127.0.0.1:5000/api/search?q=lost` → liste JSON de séries correspondantes.
- `GET http://127.0.0.1:5000/api/recommend/Breaking%20Bad` → recommandations “à partir de”.
- `GET http://127.0.0.1:5000/api/recommend_user` → nécessite d’être connecté (session). Retourne `{"error": ...}` sinon.
- `POST http://127.0.0.1:5000/api/rate` → envoie `{ "serie_name": "...", "rating": 4 }` (cookie de session requis).

Ces endpoints ne requièrent pas de configuration supplémentaire si l’utilisateur reste sur l’interface web.

---

## 6. Problèmes courants & solutions
| Problème | Solution |
|----------|----------|
| Le serveur indique qu’il ne peut pas écrire dans `database/tvshow.db` | Vérifier qu’aucune autre application (SQLite Browser, etc.) n’utilise la base. Fermer puis relancer `python app.py`. |
| La recherche ne renvoie rien | Vérifier l’orthographe des mots ; les requêtes sont strictes (tous les mots doivent apparaître dans les sous-titres). |
| Les recommandations sont vides | Noter quelques séries ou ajouter des titres à “Ma liste”. |
| Erreur “Utilisateur inconnu” lors de la réinitialisation | Normal : pour des raisons de confidentialité, le message générique apparaît ; vérifier que l’email utilisé correspond à un compte créé. |
| Page blanche après modification du code | Relancer `python app.py`; le moteur TF-IDF se recharge en environ 10 secondes au premier démarrage. |

---

## 7. Arrêt de l’application
1. Dans le terminal où tourne Flask, presser `Ctrl + C`.
2. Fermer la fenêtre du navigateur.
3. Les données (notes, liste, etc.) restent enregistrées dans `database/tvshow.db`.

---

## 8. Support
En cas de difficulté :
- redémarrer le serveur (`python app.py`),
- vérifier les messages d’erreur dans le terminal,
- consulter le README pour les détails techniques supplémentaires.
