# Concept du QG

## Pourquoi des chambres

La carte doit montrer **notre activité réelle**, pas notre identité visuelle. Une métaphore de cuisine
(nos phases « recette, cuisson, service ») obligeait à tout traduire. Nos pièces réelles sont nos
chambres : chacun y travaille. Le QG montre donc trois chambres-studios et des espaces communs
virtuels, à la manière de Habbo Hotel (pièces isométriques en pixel art, avatars, bulles, mobilier,
navigateur entre les pièces, post-it, sonnette, badges).

Analogie : une coloc d'artistes. Chacun dans sa chambre, un couloir et une salle commune où l'on se
croise, une porte d'entrée où sonnent les clients.

## Les pièces

| Pièce | Ce qu'on y voit | Données d'Every1.ate OS |
|---|---|---|
| **Ma chambre** (une par associé) | Bureau à 3 places (tâches en cours), écran qui reflète le statut, lampe de présence, pile de dossiers (charge), mur à post-it, étagère à trophées | Tâches, charge et capacité, satisfaction des projets clôturés |
| **Salle commune** | Tableau « Aujourd'hui » (brief du jour), quêtes de la semaine, stand-up, table visio (ordre du jour auto), plante (objectif annuel), projets livrés, cartons sans responsable | Brief, objectifs annuels, comptes rendus, calendrier, décisions |
| **Hall clients** | Un visiteur par opportunité, placé à son étape ; « ! » = relance en retard ; les opportunités détectées sonnent à la porte | CRM : opportunités, étapes, prochaines actions, signaux commerciaux |
| **Salle projet** (une par projet) | Une zone par lot ; une caisse par tâche, qui devient un meuble une fois terminée ; fumée si bloquée ; toile d'araignée si oubliée | Projets, lots, tâches, statuts |

## Mécaniques présentes dans la maquette

| Objectif | Mécanique | Règle |
|---|---|---|
| Finir | **Bureau à 3 places** | Une tâche bloquée occupe une place. Une 4e tâche n'est possible qu'avec un motif, visible de tous. |
| Finir | **Clap de fin** | Un lot terminé est célébré ; la tâche finie devient un meuble dans la salle projet. |
| Finir | **Poussière** | Une tâche sans activité depuis 10 jours prend la poussière ; elle est tranchée au grand ménage du vendredi (finir, attendre, découper, annuler). |
| Suivi projet | **Salle projet** | Avancement par lot visible sans réunion ; bloqués et oubliés repérables d'un coup d'œil. |
| CRM | **Hall clients** | Chaque client est à son étape ; « Relancer » note l'échange et fixe la prochaine action. |
| CRM | **Sonnette** | Une relance en retard vient sonner à la porte de la chambre de son responsable. |
| CRM | **On sonne à la porte** | Renouvellements, suites possibles et clients dormants attendent à l'entrée ; « Faire entrer » crée l'opportunité. |
| CRM | **Passer un client** | Le client ne change de responsable que si l'autre accepte et fixe sa prochaine action. |
| Communication | **Post-it** | Une tâche proposée avec un mot ; elle ne change de main qu'après acceptation. |
| Communication | **Notes rattachées** | Toute note s'attache à une tâche ou un client (avec @mention) : pas de discussion libre. |
| Communication | **Stand-up asynchrone** | Pré-rempli à partir des tâches ; un « bloqué » devient une demande d'aide visible de tous. |
| Communication | **Focus** | Statut manuel (disponible, focus, réunion) ; en focus, les demandes attendent la fin de la session. |
| Répartition | **Pile qui déborde** | Au-delà de 100 % de capacité, on peut reprendre une tâche non commencée. |
| Répartition | **Cartons sans responsable** | Les tâches sans responsable sont posées dans la salle commune, avec la charge de chacun. |
| Motivation | **Quêtes et badges d'équipe** | Collectifs uniquement : finir 8 tâches, zéro relance en retard, rien de bloqué, post-its traités. |
| Motivation | **Plante et trophées** | La plante grandit avec l'objectif annuel ; chaque projet clôturé ajoute un trophée. |

Les mécaniques proposées mais pas encore dans la maquette sont décrites dans `MECANIQUES.md`
(mur des échéances, carton de clôture, plantes rituelles pour les tâches récurrentes, Infobus pour
les votes, revue pipeline du lundi…).

## Discussions

Le bouton « Discussions » ouvre une messagerie aux fonctionnalités de Slack : salons (un par pièce
et par projet), messages directs, fils, réactions, mentions, fichiers, recherche, épinglés,
« Plus tard », rappels, messages programmés, commandes (`/tache`, `/relance`, `/focus`, `/huddle`…)
et huddles. Un message écrit dans le salon d'une pièce s'affiche aussi en bulle au-dessus de son
auteur. Détail et correspondance complète : `DISCUSSIONS.md`.

## Garde-fous

1. **Pas de surveillance** : statut choisi par chacun, partagé seulement s'il le veut, et grossier.
   Jamais d'heures, de « vu à 23 h » ni d'historique d'activité.
2. **Pas de classement** : récompenses collectives, uniquement sur ce qui est fini (jamais sur
   l'activité, les clics ou le temps chronométré).
3. **Pas de second état** : le QG affiche les données de l'application et passe par ses règles
   (validation serveur, journal d'audit). Il ne crée aucun état « de jeu » séparé.
4. **Une messagerie qui sert le travail** : la discussion libre existe (décision du 2 nov. 2026, voir
   `DISCUSSIONS.md`), mais les salons suivent les pièces et les projets, tout message peut devenir
   une tâche ou une relance, le focus coupe les notifications, et il n'y a ni accusé de lecture ni
   « en ligne depuis ».
5. **Signaux négatifs sur les objets** : on montre une tâche bloquée ou un client en retard, jamais une
   personne fautive, et chaque signal propose une sortie en un clic.
6. **Une limite qui se dépasse** : le bureau à 3 places se dépasse avec un motif, sinon on
   arrêterait de mettre à jour les statuts.

## Choix techniques de la maquette

- Un seul fichier HTML, sans bibliothèque : rendu isométrique sur canvas en basse résolution agrandi
  sans lissage (pixel art), mobilier et avatars dessinés en code, déplacement par recherche de chemin.
- Polices : Pixelify Sans (titres), Ubuntu (texte).
- Mobile : la pièce s'adapte à la largeur ; la liste « Dans cette pièce » sert aussi au clavier et
  aux lecteurs d'écran ; animations coupées si le système demande moins de mouvement.
