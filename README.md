# Le QG Every1.ate

Le QG est la vue « compagnon de travail » d'Every1.ate, inspirée de Habbo Hotel.
L'agence n'a pas de locaux : chacun des trois associés (Johan, Charles, Pierre) travaille depuis sa
chambre. Le QG montre donc **trois chambres-studios reliées par des espaces communs virtuels** :
une salle commune, un hall clients (le CRM) et une salle par projet.

Il sert à :

- **finir ce qu'on commence** : un bureau de 3 places, des tâches bloquées visibles, un rituel de ménage ;
- **suivre les projets** : une salle par projet, chaque tâche finie devient un meuble ;
- **tenir le CRM** : les clients sont des visiteurs, une relance en retard vient sonner à la porte ;
- **fluidifier la communication** : post-it rattachés aux tâches, stand-up pré-rempli, statut de focus ;
- **se répartir le travail** : charge visible, cartons sans responsable, passations acceptées.

Il est gratuit, sans IA, et sans classement entre associés.

## Statut

**Maquette interactive, données fictives.** Rien n'est encore branché dans l'application
Every1.ate OS (dépôt `every1ate-os`). L'intégration est prévue comme lot V1.2 après validation
(voir `docs/INTEGRATION.md`).

- Aperçu en ligne (privé) : https://claude.ai/artifact/WBGyb9LeTLbrT4Diir5HQ7
- En local : ouvrir `maquette/index.html` dans un navigateur, sans installation.

## Contenu du dépôt

| Chemin | Contenu |
|---|---|
| `maquette/index.html` | La maquette complète, en un seul fichier : moteur isométrique pixel art, pièces, fenêtres, missions de démo |
| `docs/CONCEPT.md` | Le concept : pourquoi des chambres, les pièces, les mécaniques retenues, les garde-fous |
| `docs/MECANIQUES.md` | La recherche des trois agents (finir / CRM / équipe) : toutes les mécaniques proposées et les erreurs à éviter |
| `docs/INTEGRATION.md` | Le plan d'intégration dans Every1.ate OS : données existantes, ajouts minimaux, étapes |
| `docs/HISTORIQUE.md` | Les décisions prises, dans l'ordre |
| `tests/parcours.mjs` | Parcours automatisé des 10 missions de la maquette (Playwright) |

## Tester le parcours automatiquement

```bash
npm install
npm test            # parcourt les 10 missions, vérifie l'absence d'erreur et de débordement
```

Si Chromium est déjà installé ailleurs : `CHROMIUM_PATH=/chemin/vers/chrome npm test`.

## Essayer la maquette (5 minutes)

Le cadre « À essayer » liste 10 missions qui se cochent toutes seules :

1. poser une 4e tâche sur un bureau plein ;
2. terminer une tâche ;
3. passer une tâche à Pierre ;
4. répondre au post-it de Charles ;
5. relancer un client en retard ;
6. faire entrer un client qui sonne ;
7. poster son stand-up ;
8. reprendre une tâche à Charles, débordé ;
9. prendre un carton sans responsable ;
10. voir une tâche finie devenir un meuble.

« Rejouer » remet tout à zéro. Les réponses de Charles et Pierre sont simulées.
