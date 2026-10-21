# Intégration dans Every1.ate OS (lot V1.2 proposé)

Le QG devient une entrée de menu de l'application, à côté de Tâches, Projets, CRM et Finance, qui
restent inchangés. Il lit et écrit les mêmes données, par les mêmes services serveur (validation et
journal d'audit compris).

## Déjà disponible dans l'application

| Besoin du QG | Existant dans `every1ate-os` |
|---|---|
| Tâches, statuts, bloqué avec raison | `Task`, `checkTaskTransition` (`src/features/projects/rules.ts`) |
| Tâches récurrentes | `Task.recurrence`, `nextOccurrence` |
| Charge et capacité | `weeklyLoad`, `loadPercent`, `User.weeklyCapacityHours` |
| Brief du jour | `getBrief` (`src/features/brief`) |
| CRM, étapes, prochaine action, relances | `Opportunity`, `changeStage`, `setNextAction`, `addActivity`, `dueFollowUps` |
| Opportunités détectées | `loadCommercialSignals` |
| Comptes rendus → tâches | `MeetingNote`, `createTasksFromNote` |
| Clôture, satisfaction | `ClosureItem`, `closureHints`, `Project.clientSatisfaction` |
| Objectifs annuels | `AnnualObjective`, `objectiveProgress` |
| Calendrier, focus | `CalendarEvent`, minuteur (`TimeEntry` en cours) |

## Ajouts minimaux (migrations additives)

| Ajout | Pourquoi |
|---|---|
| `AgencySetting.wipLimit Int @default(3)` | Limite de tâches en cours, commune aux trois |
| Motif de dépassement (journal `task.wip_override`) | Dépasser la limite en le justifiant |
| `Handoff` (tâche ou opportunité, de, pour, mot, statut, réponse) | Post-it et passations avec acceptation |
| `StandupEntry` (associé, jour, aujourd'hui, bloqué) | Stand-up asynchrone pré-rempli |
| `User.presence` (statut, jusqu'à, partage oui/non) | Statut manuel et facultatif |
| `TeamBadge` (clé, période) | Badges collectifs, sans associé |
| `TaskComment.mentionIds` | Mentions rattachées aux tâches |

## Étapes proposées

1. **Lecture seule** : les pièces dessinées à partir des vraies données ; un clic ouvre les fiches
   existantes.
2. **Gestes** :
   - poser une tâche sur le bureau et terminer ;
   - post-it de passation ;
   - relance depuis le hall ;
   - faire entrer un signal ;
   - stand-up.
3. **Rituels** :
   - quêtes et badges d'équipe ;
   - grand ménage du vendredi ;
   - revue pipeline du lundi.

Chaque étape passe par une maquette écran par écran (mobile + ordinateur), validée avant mise en
ligne. Tout reste sur les offres gratuites (rendu dans le navigateur, aucune requête supplémentaire
coûteuse).

## Ce qui est simulé dans la maquette

- Les réponses de Charles et Pierre (acceptations, aides).
- Les montants et dates (données de démonstration fictives).
- L'ouverture de la visio et du compte rendu (dans l'app : lien Meet de l'événement et
  « Nouveau compte rendu » prérempli).
