# Discussions : les fonctionnalités de Slack dans le QG

Le bouton **Discussions** (barre du bas) ouvre une messagerie complète, reliée aux pièces du QG.
Un message écrit dans le salon d'une pièce apparaît aussi en bulle au-dessus de son auteur, comme
dans Habbo.

## Correspondance avec Slack

| Slack | Dans le QG | Dans la maquette |
|---|---|---|
| Salons publics | `#général` (salle commune), `#clients` (hall), un salon par projet (salle projet) | Oui |
| Salons privés | « Créer un salon », case « privé » et choix des membres | Oui |
| Messages directs | Un par associé, plus « Moi (notes perso) » | Oui |
| Fils de discussion | « Répondre dans un fil », option « Envoyer aussi dans le salon » | Oui |
| Réactions emoji | 👍 ✅ 👀 🎉 🙏, au clic | Oui |
| Mentions | `@johan`, `@charles`, `@pierre`, `@ici`, avec suggestions au clavier | Oui |
| Non lus, badges | Par salon, par message direct, et sur le bouton Discussions | Oui |
| Activité | Mentions, réactions à tes messages, rappels | Oui |
| Fichiers | « Joindre » (dans l'app : liens Drive, stockage de fichiers plus tard) | Oui (nom et taille) |
| Recherche | Messages, fils et noms de fichiers, sans tenir compte des accents | Oui |
| Épingler | « Épingler », liste « Épinglés » en tête de salon | Oui |
| Enregistrer pour plus tard | « Plus tard » | Oui |
| Me rappeler | « Me rappeler » sur un message, ou `/rappel` | Oui (accéléré) |
| Programmer l'envoi | « Programmer » : demain 9 h, lundi 9 h, ou à la fin du focus du destinataire | Oui |
| Modifier, supprimer | Sur ses propres messages, avec confirmation | Oui |
| Mise en forme | `*gras*`, `_italique_`, `` `code` ``, liens cliquables | Oui |
| Commandes | `/tache`, `/relance`, `/focus`, `/dispo`, `/huddle`, `/rappel`, `/standup` | Oui |
| Huddles | Appel audio du salon : les avatars mettent un casque dans la pièce ; la visio passe par Meet ou Jitsi | Oui (simulé) |
| Statut et ne pas déranger | Disponible, focus, réunion, statut personnalisé ; en focus, aucune notification | Oui |
| Messages visibles par toi seul | Réponses du QG (« Pierre est en focus… ») | Oui |
| « En train d'écrire » | Affiché sous la conversation | Oui |
| Applis et workflows | Le QG publie lui-même : tâche terminée, relance, client signé, demande d'aide | Oui |

## Ce que le QG fait en plus de Slack

| Geste | Effet |
|---|---|
| **Transformer en tâche** (sur n'importe quel message) | Crée la tâche dans le bon projet, avec son responsable. Le message reste lié à la tâche. |
| `/tache Titre @qui` dans un salon de projet | Même chose en une ligne. |
| `/relance Brume` | Note la relance du client et fixe la prochaine action dans le CRM. |
| Salon de projet automatique | Chaque projet a son salon, archivé à la clôture. |
| Focus respecté | Écrire à quelqu'un en focus ne le dérange pas ; on peut programmer l'envoi à la fin de son focus. |
| Historique illimité | Slack gratuit n'affiche que les 90 derniers jours ; ici tout reste dans votre base. |

## Ce qui reste volontairement hors du QG

- **Résumés automatiques par IA** : exclus, comme dans tout le projet.
- **Accusés de lecture et « en ligne depuis »** : Slack ne les a pas non plus ; ce serait de la surveillance.
- **Salons partagés avec les clients** (Slack Connect) : prévus avec le portail client de la V2.
- **Vidéo intégrée** : le huddle ouvre Meet ou Jitsi, gratuits.

## Comment ça marche une fois branché (gratuit)

| Besoin | Solution | Coût |
|---|---|---|
| Stocker les messages | Tables dans la base existante : salons, membres, messages (avec fil), réactions, épinglés, lus, plus tard, rappels, programmés | 0 € : environ 50 Mo pour 100 000 messages |
| Temps réel (messages, « écrit… », huddle) | Service de diffusion Ably, offre gratuite : 6 millions de messages par mois, 200 connexions simultanées | 0 € pour 3 associés |
| Notifications sur téléphone | Notifications web (application installée sur l'écran d'accueil) | 0 € |
| Envoi d'un message | Une action serveur, avec validation et contrôle d'accès | Environ 2 crédits Netlify par mois |
| Recherche | Même moteur que la recherche globale (accents ignorés) | 0 € |

Pourquoi pas une interrogation régulière du serveur toutes les quelques secondes : à 3
associés, cela coûterait environ 130 crédits Netlify par mois (sur 300), avec le risque de
mettre en pause tous les sites du compte. Le service temps réel évite ce coût.
