# ZIAPOPO FC — Manager

Application autonome en **un seul fichier** (`index.html`), sans dépendance à installer, sans service worker. Les données sont sauvegardées dans le navigateur (localStorage).

## Déployer / redéployer sur GitHub Pages

1. Remplace le fichier `index.html` à la racine de ton dépôt par celui-ci (c'est **le seul fichier nécessaire** — tu peux supprimer `app.js`, `sw.js` et `manifest.json` s'ils existent encore dans le dépôt).
2. Vérifie que GitHub Pages est activé : **Settings → Pages → Source → Deploy from a branch → main → / (root)**.
3. Ouvre `https://<ton-nom-utilisateur>.github.io/ziapopo-fc/`.

Comme il n'y a plus de service worker, chaque redéploiement s'affiche immédiatement — pas besoin de vider le cache.

## Fonctionnalités

- **Tableau de bord** : effectif, disponibilités, prochain match, forme sur 5 matchs, bilan V/N/D
- **Effectif** : fiches joueurs complètes (poste, niveau, statut, disponibilité, date d'arrivée, commentaires), recherche et filtres, ajout via le bouton **+**
- **Compositions** : terrain tactile, 4 formations, assignation des joueurs par poste, sauvegarde multiple, export visuel PNG pour Discord
- **Matchs** : historique complet, score, homme du match, commentaires
- **Statistiques** (onglet Plus) : championnats avec éditions/saisons multiples, saisie des buts / passes décisives / inviolabilité (gardiens), classements et **graphiques** (buteurs, passeurs, gardiens)
- **Calendrier** (onglet Plus) : entraînements, matchs, réunions, événements, triés par date
- **Présences** (onglet Plus) : suivi présent/absent/retard par session, taux de présence automatique par joueur
- **Recrutement** (onglet Plus) : base des joueurs à l'essai avec décision (accepté/refusé/à revoir)
- **Administration** (onglet Plus) : journal du club (sanctions, avertissements, promotions, décisions)
- **Paramètres** (onglet Plus) : nom du club, liste des responsables

## Limites connues

Les fonctionnalités suivantes du cahier des charges nécessiteraient un vrai backend (base de données, authentification, serveur) et ne sont pas réalisables dans un site statique GitHub Pages : authentification par rôles, synchronisation Discord automatique, génération de communiqués par IA. Tout le reste du cahier des charges est implémenté.
