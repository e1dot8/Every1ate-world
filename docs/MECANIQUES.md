# Mécaniques étudiées

Recherche menée par trois agents indépendants, un par angle, à partir du modèle de données réel d'Every1.ate OS (dépôt `every1ate-os`). Chaque mécanique indique l'élément Habbo emprunté, la scène vécue, ce qu'elle change dans nos habitudes, les données utilisées et sa priorité.

> Statut : propositions. Ce qui est déjà dans la maquette est signalé dans `docs/CONCEPT.md`.

## Finir ce qu'on commence et suivi projet

### La Main (limite d'encours) (MVP)

- **Élément Habbo** : Inventaire / main du joueur : on ne pose que ce qu'on a en main, avec un nombre de cases limité.
- **Scène** : Johan est dans sa chambre-studio. En bas d'écran, sa main a 3 cases, occupées par ses 3 tâches EN_COURS posées sur son bureau. Il veut prendre « Montage teaser » sur l'étagère À faire : la 4e case est grisée et une bulle dit « Main pleine : termine une carte, pose-la (En attente + raison) ou propose-la à un associé ». Il peut forcer avec un motif, qui s'affiche alors en salle commune.
- **Ce que ça change** : On arrête de tout commencer en même temps : pour prendre une nouvelle tâche, il faut d'abord en finir une, ou dire clairement qu'on la met de côté. Les dépassements deviennent visibles et se discutent au lieu de passer en silence.
- **Données** : Lit Task(ownerId, status=EN_COURS). Écrit Task.status via checkTaskTransition (src/features/projects/rules.ts), étendu avec wipCount et wipLimit : le serveur refuse le passage en EN_COURS sauf si un overrideReason est donné, puis écrit un AuditEvent « task.wip_override ». NOUVEAU : AgencySetting.wipLimit Int @default(3), une règle collective commune aux trois.

### La salle projet qui se meuble (MVP)

- **Élément Habbo** : Construction de salle avec des meubles livrés en paquet cadeau, plus le Navigator qui liste les salles.
- **Scène** : Charles ouvre le Navigator et lit « Campagne X · 62 % · 1 bloqué · J-9 ». Il entre : le lot « Tournage » est un plateau entièrement monté, « Post-prod » est encore une caisse à moitié ouverte. Les jalons sont des fanions au mur, allumés une fois atteints. Une horloge murale passe du vert au rouge selon la fin prévue comparée à la fin de référence. Un clic sur la caisse montre les tâches restantes du lot, avec l'avatar de chaque responsable.
- **Ce que ça change** : Tout le monde voit l'avancement sans réunion ni rapport. Le reste à faire devient concret (une caisse à ouvrir), ce qui pousse à finir un lot entier plutôt qu'à en entamer plusieurs. Le retard sur la référence se voit avant qu'il devienne un retard majeur.
- **Données** : Tout est calculé, aucune écriture. Lit Project(status, plannedEndDate, baselineEndDate), WorkPackage(position, actualEnd), Task(status, estimatedMinutes, ownerId), TimeEntry pour le temps passé, Milestone(date, reachedAt). Avancement d'un lot = minutes estimées des tâches TERMINE / total, sans les ANNULE ; à défaut d'estimations, on compte les tâches. Les meubles sont placés selon WorkPackage.position, donc aucun nouveau modèle de disposition au MVP.

### Le cordon de velours (tâche bloquée) (MVP)

- **Élément Habbo** : Le meuble cordon de velours qui interdit un passage, la sonnette et les post-it au mur.
- **Scène** : Pierre passe dans la salle « Clip » : le meuble « Étalonnage » est entouré d'un cordon rouge, avec un post-it « Attente rushes client · Prochaine action : relancer la prod · revue jeudi ». Il clique « Je m'en occupe » et écrit « j'appelle la prod à 14h ». La bulle apparaît dans la salle et Johan, responsable de la tâche, est prévenu. Une fois la date de revue passée, le post-it devient jaune et part au mur de la salle commune.
- **Ce que ça change** : Une tâche bloquée a toujours une raison, une prochaine action, une date et quelqu'un qui s'en charge. Proposer son aide se fait en un clic, au lieu d'un message qui se perd. Un blocage ne peut plus rester oublié dans un coin.
- **Données** : Lit Task(status=BLOQUE, blockedReason, blockedNextAction, blockedReviewDate) ; la raison est déjà exigée par checkTaskTransition. Écrit TaskContributor (celui qui aide), TaskComment, Notification (avec dedupeKey) et AuditEvent. NOUVEAU, optionnel : Task.unblockerId String? pour afficher l'avatar qui tient le cordon. Sinon, aucun nouveau champ.

### Le mur des échéances (MVP)

- **Élément Habbo** : Les post-it collés au mur d'une salle.
- **Scène** : Lundi matin, en salle commune, un mur en 6 colonnes : « En retard », puis du lundi au vendredi. Chaque post-it est une tâche à rendre sous 7 jours, avec le mini-avatar du responsable et l'estimation. Johan voit 2 post-its rouges dans « En retard » et fait glisser « Devis » de lundi à mercredi. Une bulle dit « Décale aussi Envoi devis (dépendance) ? » et il valide les deux. Un tampon « décalé 3 fois » apparaît sur les post-its qui glissent souvent.
- **Ce que ça change** : On replanifie franchement et à la vue de tous, au lieu de laisser des retards silencieux. Les dates restent crédibles. Une tâche qui glisse sans cesse se repère et se traite (découper, réattribuer, annuler).
- **Données** : Lit Task(dueDate, status, ownerId, estimatedMinutes) avec overdueLevel/isDueSoon, et TaskDependency. Écrit Task.dueDate via planMove (src/features/planning/rules.ts), qui gère déjà les dépendances et les conflits, plus un AuditEvent avant/après. Le compteur de décalages vient de l'audit. Le bouton « Fini » réutilise la transition existante. Aucun nouveau champ.

### Le carton de clôture et la vitrine (MVP)

- **Élément Habbo** : Événement de salle et trophées : un meuble trophée gravé, posé dans une salle.
- **Scène** : Toutes les tâches de « Lancement Maison X » sont finies depuis 6 jours, mais le projet est toujours ACTIF. Dans le hall, un carton à moitié scotché indique « Clôture 3/6 : 1 échéance non encaissée, bilan à rédiger, archives à confirmer ». Chaque rabat ouvre directement le bon onglet. Quand le responsable coche le dernier point et confirme TERMINE, une animation de clôture se joue en salle commune. Un trophée rejoint alors la vitrine, avec les étoiles de satisfaction client, une phrase du bilan et l'écart entre la fin réelle et la fin de référence. L'étagère se remplit vers l'objectif annuel de projets.
- **Ce que ça change** : S'attaque au projet fini à 90 % qu'on ne clôture jamais (facture non encaissée, pas de bilan) : finir devient un moment visible, collectif et gratifiant. Cela fait aussi rentrer l'argent et produit un bilan pour les projets suivants.
- **Données** : Lit ClosureItem, les faits de closureHints (src/features/projects/closure-auto.ts : tâches ouvertes, CostItem, BillingMilestone, PaymentRecord, FileReference) et Project(closedAt, actualEndDate, baselineEndDate, clientSatisfaction, closingReview). Lit aussi AnnualObjective.projectCount. Écrit ClosureItem.checked et Project.status=TERMINE via checkProjectTransition, qui exige déjà la checklist complète et le responsable. « Presque fini » est une règle pure : projet ACTIF, aucune tâche ouverte, dernier Task.completedAt il y a 5 jours ou plus. Aucun nouveau champ.

### Le grand ménage du vendredi (poussière) (MVP)

- **Élément Habbo** : Événement de salle annoncé dans le Navigator, plus un badge.
- **Scène** : Les cartes sans aucune activité depuis 10 jours (ni temps, ni commentaire, ni changement de statut) se couvrent de toiles d'araignée. Même chose pour les tâches À faire en retard de plus de 14 jours. Le vendredi à 16h, l'événement « Grand ménage » (20 min) s'ouvre en salle commune et les cartes poussiéreuses défilent sur un tapis roulant. Pour chacune, son responsable choisit : Finir cette semaine (nouvelle date), En attente (raison), Annuler (raison) ou Découper (2 ou 3 tâches plus petites). On regarde ensuite ce qu'on a fini ensemble cette semaine, sous forme de cartons scellés et sans détail par personne.
- **Ce que ça change** : Plus de tâches zombies : la liste des tâches reste honnête et la main ne se remplit pas de faux encours. Un rituel court et régulier installe l'habitude de trancher et de clore. Les décisions sont notées sans effort.
- **Données** : Lit Task(status, updatedAt, dueDate), le dernier TimeEntry.startedAt, TaskComment.createdAt et AuditEvent. Écrit statut, date et raison via les règles existantes, plus un AuditEvent. Écrit un MeetingNote généré automatiquement avec les verdicts et un CalendarEvent PARTAGE récurrent. NOUVEAU : QgBadge { id, key, periodKey, earnedAt, @@unique([key, periodKey]) }, un badge collectif sans userId (ex. « Semaine sans poussière »). Optionnel : Task.lastActivityAt dénormalisé, pour les performances.

### Les plantes rituelles (tâches récurrentes) (plus tard)

- **Élément Habbo** : Les Monsterplants (plantes-animaux) à arroser régulièrement, qui fanent si on les néglige.
- **Scène** : Mardi, dans la salle du client CM, la plante « Posts Insta hebdo » penche : l'occurrence due lundi n'est pas faite. Charles clique sur la plante, ce qui ouvre la tâche et lance le chrono. Il termine, la plante se redresse et l'occurrence suivante se crée. Les rituels de l'agence (compta mensuelle, veille) poussent dans un jardin en salle commune. Une plante fane mais ne meurt jamais.
- **Ce que ça change** : Les livrables récurrents (community management, reporting, factures mensuelles) sont tenus dans la durée. On voit une dérive avant que le client la remarque, et soigner une plante est un geste simple et positif.
- **Données** : Calculé : Task(recurrence, recurrenceUntil, dueDate, completedAt), en remontant la chaîne nextOccurrenceId. La santé de la plante = part des 6 dernières occurrences finies à l'heure. L'écriture passe par la complétion existante et buildNextOccurrence (src/features/projects/recurrence.ts). Aucun nouveau champ.

### À éviter

- Récompenser l'activité au lieu de la complétion : des points pour les tâches créées, le temps chronométré, la présence ou les clics poussent à découper artificiellement et à gonfler l'activité. On ne récompense que ce qui est vraiment fini (un lot monté, un projet clôturé avec le bilan et l'encaissement, une semaine sans poussière), toujours en collectif, sans aucun compteur par associé.
- Un décor qui ment ou qui fait honte : une salle jolie qui cache un retard ou un blocage, un second état « jeu » qui s'écarte des données, ou des signaux négatifs attachés à la personne (la chambre en désordre de Pierre visible de tous). L'état du QG doit être calculé uniquement à partir des données serveur. Chaque geste doit passer par les règles existantes et l'audit. Les signaux négatifs portent sur l'objet (tâche, projet) et proposent toujours une sortie en un clic. Une limite d'encours trop dure, qui pousserait à ne plus mettre à jour les statuts, est aussi à éviter : il faut toujours pouvoir la dépasser en donnant un motif.

## CRM et suivi commercial

### Hall clients : le pipeline devient une salle (MVP)

- **Élément Habbo** : Salle publique avec furni placés et zones de sol, accessible par le Navigator (Hall clients)
- **Scène** : Johan ouvre le Hall clients sur son téléphone. Chaque opportunité ouverte y est un visiteur pixel, et les 9 visiteurs sont répartis entre le tapis d'entrée (À contacter) et le bureau de négociation au fond. Chacun porte la pastille couleur de son responsable (J/C/P) et une valise dont la taille suit le montant. 'Brasserie Lumen' est couverte d'une toile d'araignée (aucun échange depuis 24 j) et 'Studio Nord' a une bulle '?' (pas de prochaine action). Un tap sur un visiteur ouvre une bulle avec la prochaine action et sa date, le dernier échange, et 3 boutons : Logger un échange, Avancer d'étape, Replanifier.
- **Ce que ça change** : On ne regarde plus le pipeline comme une liste qu'on oublie d'ouvrir : c'est un lieu qu'on traverse chaque jour. Les anomalies (sans prochaine action, relance en retard, opportunité endormie) se voient à un endroit précis et se corrigent en 2 taps. On voit qui porte quel lead sans avoir besoin d'une réunion.
- **Données** : Lit Opportunity (stage, ownerId, amount, nextAction, nextActionDate, updatedAt, archivedAt), la dernière OpportunityActivity.occurredAt et forecast() (lateIds, withoutNextIds). Écrit uniquement via les services existants changeStage / addActivity / setNextAction, donc avec validation serveur et recordAudit. La position d'un visiteur découle de son étape : le QG ne stocke aucun état. NOUVEAU : rien, sauf le seuil 'endormi' (ex. 21 j) en constante ou dans AgencySetting.

### Sonnette de relance : le client sonne à ta porte (MVP)

- **Élément Habbo** : Sonnette (doorbell) d'une chambre verrouillée : quelqu'un attend et le propriétaire doit ouvrir
- **Scène** : Le matin, quand nextActionDate ≤ aujourd'hui, le visiteur quitte le Hall et sonne à la porte de la chambre-studio de Charles : 'Ding ! Agence Kéra attend : Envoyer le devis v2 (prévu hier)'. Charles ouvre et doit choisir l'une de 3 sorties : 'C'est fait' (échange RELANCE/ECHANGE enregistré + nouvelle prochaine action datée), 'Reporter' (nouvelle date + motif court) ou 'Passer la main' (voir la mécanique Échange de lead). On ne peut pas fermer sans choisir. Si rien n'est traité après 2 jours ouvrés, le visiteur va s'asseoir dans la Salle commune avec la bulle 'J'attends Charles depuis 2 j'. Les 3 associés la voient, sans compteur ni reproche.
- **Ce que ça change** : Plus aucune relance oubliée : la notification existante devient un geste qui exige une suite datée, si bien que chaque opportunité garde en permanence une prochaine action. L'escalade douce en Salle commune remplace le 'tu as relancé X ?' sur WhatsApp.
- **Données** : Lit dueFollowUps(today), déjà utilisé par runScheduledScan et par Notification kind 'relance'. Écrit avec addActivity (kind RELANCE/ECHANGE) et setNextAction, qui valide déjà la date obligatoire et l'audit. NOUVEAU minimal : Opportunity.snoozeCount Int @default(0) et Opportunity.lastSnoozeReason String?, pour repérer les reports chroniques. Le compteur est incrémenté côté serveur quand l'appel vient de 'Reporter'.

### Post-its de signaux sur le mur du Hall (MVP)

- **Élément Habbo** : Post-it (sticky notes) collés au mur d'une chambre, lisibles par tous les visiteurs
- **Scène** : Sur le mur du Hall, trois post-its : un jaune 'Renouvellement : CM Maison Ora, préavis avant le 12 nov.', un vert 'Proposer une suite à Fondation Arpège (satisfaction 5/5)' et un gris poussiéreux 'Relancer Café Doré, 7 mois sans activité'. Pierre tape 'Je prends' sur l'un d'eux. Le post-it passe dans sa main (inventaire) et une opportunité préremplie s'ouvre : l'entreprise est renseignée, Pierre est responsable, et la prochaine action et sa date sont obligatoires. Un nouveau visiteur apparaît alors à l'entrée du Hall. L'autre choix est 'Écarter' avec un motif (ex. 'client en pause jusqu'en mars') : le post-it disparaît jusqu'à la date choisie.
- **Ce que ça change** : Les signaux (renouvellements, suites après un projet réussi, clients dormants) ne restent plus une carte qu'on regarde sans agir. Chacun devient soit une opportunité avec un responsable, soit une décision explicite de ne rien faire. Le mur est partagé, donc deux associés ne contactent pas le même client.
- **Données** : Lit loadCommercialSignals() : signaux calculés à chaque affichage, sans état, avec une clé stable `kind:href`. 'Je prends' appelle saveOpportunity (createHref ?client=…). Les signaux dormant et suite disparaissent seuls dès qu'une opportunité est ouverte (règle existante). NOUVEAU : modèle SignalDismissal {key, clientId?, userId, reason, until Date, createdAt} avec l'audit 'signal.dismissed'. Il est nécessaire parce que les signaux sont recalculés et qu'un renouvellement de contrat ne disparaît pas quand une opportunité est ouverte. Option : Opportunity.signalKey String? pour masquer un post-it 'renouvellement' déjà pris.

### Échange de lead : fenêtre de troc à double confirmation (MVP)

- **Élément Habbo** : Fenêtre d'échange (trading) : deux panneaux, chaque joueur coche 'Accepter' puis confirme
- **Scène** : Cette semaine, la charge de Johan dépasse sa capacité. Il glisse le visiteur 'Startup Halo' sur l'avatar de Pierre et une fenêtre de troc s'ouvre. À gauche, ce que Johan passe : l'opportunité, le contact, les 3 derniers échanges, la prochaine action et une note ('ils préfèrent le téléphone'). À droite, Pierre doit fixer SA prochaine action datée avant de pouvoir cocher 'Accepter'. Après la double confirmation, la pastille du visiteur prend le bleu de Pierre. Si Pierre est hors ligne, l'offre l'attend comme un colis devant sa porte.
- **Ce que ça change** : La propriété d'un lead est explicite et se transmet avec son contexte : fini les 'je croyais que tu t'en occupais'. Il devient naturel de rééquilibrer le commercial selon la charge réelle, au lieu de laisser un lead mourir chez quelqu'un de débordé. C'est la répartition du travail appliquée au CRM.
- **Données** : Lit Opportunity, les 3 dernières OpportunityActivity, et la charge comparée à User.weeklyCapacityHours (affichage indicatif seulement). À l'acceptation, écrit dans une transaction : Opportunity.ownerId (même contrôle de rôle 'associe' que saveOpportunity), nextAction/nextActionDate du receveur, une OpportunityActivity NOTE 'Passée de Johan à Pierre : motif' et recordAudit 'opportunity.handover'. NOUVEAU : modèle OpportunityHandover {id, opportunityId, fromId, toId, note, status PROPOSEE|ACCEPTEE|REFUSEE|ANNULEE, createdAt, decidedAt}, avec une seule offre ouverte par opportunité, garantie par un verrou FOR UPDATE comme pour la conversion en projet.

### Gagné : la clé de la nouvelle chambre projet (MVP)

- **Élément Habbo** : Création de chambre, événement de chambre (feux d'artifice) et objet remis dans l'inventaire
- **Scène** : Charles passe 'Festival Ondes' en Gagné. Des confettis tombent dans la Salle commune pour les 3 ('Festival Ondes signé !') et une clé dorée arrive dans la main de Charles : 'Ouvrir la chambre projet'. Un tap lance l'assistant de conversion existant (modèle, lots, responsable global, échéances). Tant que la conversion n'est pas faite, le visiteur reste au guichet avec un trophée et la bulle 'Gagné il y a 4 j, pas encore de chambre'. Une fois le projet créé, sa chambre apparaît dans le Navigator et le visiteur y entre.
- **Ce que ça change** : La boucle vente → production se ferme : plus de deal gagné qui reste sans projet, sans lots ni responsable. La célébration est collective et non individuelle : elle marque le moment et ancre le passage de relais vers la production.
- **Données** : Lit Opportunity.stage, closedAt et projectId ; changeStage renvoie déjà suggestConversion. Écrit via le createProject({opportunityId}) existant, qui est idempotent, protégé par un verrou FOR UPDATE, et ajoute l'activité 'Converti en projet' et l'audit. Le délai 'gagné non converti' vaut aujourd'hui − closedAt. NOUVEAU : rien.

### Salle visio : du compte rendu aux bulles d'action (MVP)

- **Élément Habbo** : Bulles de discussion au-dessus des avatars et historique du chat de la chambre
- **Scène** : La visio 'Kick-off Maison Ora' (CalendarEvent PARTAGE lié à l'opportunité) vient de finir, et un carnet clignote sur la table de la Salle visio : 'CR à écrire'. Pierre tape ses lignes, dont '→ @Charles moodboard pour vendredi' et '→ @Pierre envoyer devis révisé le 28/10'. Chaque action apparaît en bulle au-dessus de l'avatar concerné, qui la valide d'un tap. Si l'opportunité n'a pas encore de projet, l'action datée de son responsable devient la prochaine action de l'opportunité. Le CR rejoint la frise de l'opportunité en tant que REUNION.
- **Ce que ça change** : Personne ne sort d'un rendez-vous client sans une suite datée qui a un responsable. Les décisions prises à l'oral deviennent des tâches ou des relances en quelques minutes, sans ressaisie, ce qui fluidifie la communication et la répartition du travail.
- **Données** : Lit les CalendarEvent liés (opportunityId, clientId ou projectId) dont endsAt est passé, cancelledAt null et sans MeetingNote.eventId : c'est le signal 'CR manquant', calculé et non stocké. Écrit la MeetingNote via saveNote, et les tâches via createTasksFromNote (confirmation et verrou existants) quand il y a un projet. Sans projet, écrit avec setNextAction et addActivity REUNION. Point d'attention : Task.projectId est obligatoire et createTasksFromNote échoue sans projet, donc en avant-vente les actions ne peuvent pas devenir des tâches. NOUVEAU : rien pour le MVP ; plus tard, éventuellement OpportunityActivity.meetingNoteId pour relier le CR à la frise.

### Rituel pipeline du lundi et plaques d'équipe (plus tard)

- **Élément Habbo** : Événement de chambre listé dans le Navigator, badges et plaques (achievements)
- **Scène** : Lundi 9h30, le Navigator affiche l'événement 'Revue pipeline (15 min)' dans le Hall. Les trois avatars s'assoient autour de la table. Le Hall n'affiche plus que les visiteurs à traiter (en retard, sans prochaine action, endormis, gagnés non convertis) et on les traite un par un. Quand le Hall est propre, une plaque d'équipe est vissée au mur : 'Pipeline propre : 4 semaines', 'Zéro relance oubliée', 'Chaque gagné ouvert en moins de 7 j', 'Renouvellement anticipé'. Il n'y a ni badge individuel ni classement.
- **Ce que ça change** : Une habitude d'hygiène commerciale courte et partagée s'installe. La récompense est collective, ce qui pousse à s'entraider sur les leads plutôt qu'à se comparer.
- **Données** : Lit forecast() (lateIds, withoutNextIds), dueFollowUps, les Opportunity GAGNE sans projectId et un CalendarEvent PARTAGE récurrent (fonction déjà disponible). NOUVEAU : modèle TeamBadge {key, period (ex. '2026-W43'), earnedAt} avec @@unique([key, period]). Les badges sont calculés par runScheduledScan, jamais saisis à la main, et chaque attribution laisse un audit 'badge.earned'.

### À éviter

- Un classement déguisé : grossir ou couronner un avatar selon le CA signé, afficher un compteur de deals gagnés par associé, ou désigner nommément et de façon culpabilisante celui qui n'a pas relancé. La couleur d'un responsable sert à savoir qui porte quoi, jamais à comparer, et les célébrations comme les plaques restent celles de l'équipe.
- Une alerte qu'on fait taire sans suite : fermer la sonnette, écarter un post-it ou enregistrer un échange vide juste pour faire disparaître le signal. Chaque sortie doit produire une prochaine action datée, un report motivé ou une passation acceptée, et passer par les services serveur existants (changeStage, setNextAction, addActivity, createProject), avec leur audit. Le QG ne doit jamais dupliquer l'état du CRM côté client.

## Communication et répartition des tâches

### La porte de la chambre (Dispo / Sonnette / Fermée) (MVP)

- **Élément Habbo** : Modes de porte d'une room (ouverte, sonnette, verrouillée) et la sonnette quand on veut entrer
- **Scène** : Pierre clique sur la porte de sa chambre : « Sonnette, montage teaser jusqu'à 16h ». Son avatar porte un casque dans la salle commune. Johan lui écrit sur une tâche ; le QG affiche « Pierre est en focus jusqu'à 16h, ton message lui sera remis à 16h » avec un bouton « Sonner quand même », qui demande un motif d'urgence. À 16h, Pierre reçoit une seule notification groupée. Un rendez-vous OCCUPE affiche juste « en rendez-vous », sans titre.
- **Ce que ça change** : Protège le travail profond (montage, écriture, stratégie) sans couper Pierre des autres. Celui qui demande sait quand il aura sa réponse, donc il ne relance plus sur WhatsApp. Moins d'interruptions, plus de tâches finies dans la journée.
- **Données** : Lit CalendarEvent (visibility OCCUPE/PARTAGE, startsAt/endsAt) et, seulement si l'associé l'a activé, le timer en cours (TimeEntry avec startedAt renseigné et endedAt null), qui sert à proposer le mode focus, jamais à l'imposer. NOUVEAU sur User : qgDoorMode enum OUVERTE|SONNETTE|FERMEE nullable (null = rien n'est affiché, c'est l'opt-in), qgDoorNote String? (60 caractères max), qgDoorUntil DateTime? (le mode expire tout seul), qgShareTimer Boolean false par défaut. NOUVEAU sur Notification : deliverAfter DateTime? (+ index) ; notify() met en attente les pings non urgents. Un « Sonner quand même » crée une notification de kind « sonnette » avec son motif, plus un AuditEvent.

### Le mur à post-it du matin (stand-up asynchrone) (MVP)

- **Élément Habbo** : Post-it collés aux murs des rooms
- **Scène** : À 9h, Charles ouvre le QG sur son téléphone. Sur le mur de la salle commune, son post-it jaune est déjà pré-rempli : « Hier : 3 tâches terminées, 2h40 sur Clip Nova. Aujourd'hui : 2 échéances. Bloqué : validation logo (BLOQUE depuis 2 j) ». Il corrige une ligne, ajoute « besoin de Johan 15 min sur le devis » et colle le post-it en 30 secondes. Les trois post-its sont côte à côte ; chaque ligne ouvre sa tâche. À minuit, les post-its sont archivés.
- **Ce que ça change** : Remplace le fil WhatsApp « vous en êtes où ? » et l'appel de synchro. Les blocages et les besoins d'aide deviennent visibles chaque jour, donc ils se règlent plus tôt. Comme le post-it est pré-rempli à partir des vraies données, le rituel ne coûte presque rien et tient dans le temps.
- **Données** : Lit Task.completedAt (hier, par responsable), TimeEntry (somme de la veille par projet), Task.dueDate = aujourd'hui, Task.status BLOQUE avec blockedReason. Alimente aussi le brief quotidien existant. NOUVEAU modèle StandupNote {id, userId, date @db.Date, yesterday Text, today Text, blockers Text?, needsUserId String?, createdAt, updatedAt, @@unique([userId, date])}. needsUserId déclenche une notification de kind « action » ; AuditEvent « qg.standup.posted ».

### Le tas de cartons + la pile sur le bureau (répartition selon la capacité) (MVP)

- **Élément Habbo** : Furni livré en carton, la « main » (inventaire), et le fait de poser du mobilier dans une room
- **Scène** : Dans la salle commune, une pile de cartons représente les tâches sans responsable, chacune étiquetée projet / estimation / échéance. Dans chaque chambre, la hauteur de la pile sur le bureau suit la charge de la semaine : celle de Johan penche à 115 %, celle de Pierre est à 60 %. Pierre prend le carton « Sous-titrage teaser » et, avant de le poser, voit « Tu passerais à 72 % cette semaine ». Un carton sans estimation affiche « ? » et demande une estimation avant d'être pris. Objectif collectif de la semaine : « Tas vide avant lundi midi ».
- **Ce que ça change** : La répartition devient un geste visible et équitable, fondé sur la capacité réelle, et non plus sur qui répond le premier sur WhatsApp. Les tâches orphelines ne pourrissent plus, et les estimations finissent par être remplies, ce qui fiabilise la charge et donc les délais.
- **Données** : Lit Task (ownerId null, estimatedMinutes, dueDate, projectId), weeklyLoad()/loadPercent() de src/features/planning/workload.ts, User.weeklyCapacityHours (repli sur AgencySetting.defaultWeeklyHours) et unplannedMinutes. Écrit Task.ownerId (et estimatedMinutes) via le service de tâche existant, avec validation serveur et AuditEvent « task.assigned », plus une notification « assignation ». Rien de NOUVEAU dans le schéma : le badge collectif se calcule à la volée. Prendre un carton pour soi est direct ; le donner à un autre passe par la fenêtre d'échange.

### La fenêtre d'échange (passation avec double acceptation) (MVP)

- **Élément Habbo** : Fenêtre de trading : chacun pose ses objets, coche « Accepter », puis « Confirmer »
- **Scène** : Charles, débordé, glisse sa tâche « Montage v2 Clip Nova » sur l'avatar de Pierre. La fenêtre d'échange s'ouvre. À gauche : la tâche et une note de contexte obligatoire (« où j'en suis, fichiers, prochaine étape »), le temps déjà passé, et éventuellement une tâche de Pierre qu'il reprend en échange. À droite : Pierre voit sa charge après l'échange (72 % → 88 %) et l'échéance. Il accepte, ou refuse avec un motif ou une contre-date. Le changement de responsable n'a lieu qu'après la confirmation des deux.
- **Ce que ça change** : Une passation arrive avec son contexte (plus de « tu peux reprendre ça ? » perdu dans WhatsApp). Personne ne se débarrasse d'une tâche en silence, et celui qui la reçoit accepte en voyant sa capacité. Les tâches ne tombent plus entre deux chaises et finissent par être terminées.
- **Données** : Lit Task, la somme TimeEntry.durationMinutes, weeklyLoad, FileReference du task. Écrit Task.ownerId, garde l'ancien responsable en TaskContributor, publie la note de contexte comme premier TaskComment « Passation », et crée un AuditEvent « task.handoff.accepted/refused ». NOUVEAU modèle TaskHandoff {id, taskId, fromId, toId, swapTaskId?, contextNote (min. 20 caractères), status PROPOSEE|ACCEPTEE|REFUSEE|ANNULEE, responseNote?, createdAt, respondedAt?} ; nouveau kind de notification « passation ».

### Bulles sur les meubles + chuchoter / crier (mentions contextuelles) (MVP)

- **Élément Habbo** : Bulles de dialogue au-dessus des avatars, chuchotement (message privé dans la room) contre cri
- **Scène** : Chaque projet ou opportunité est un meuble (dans la room projet ou le hall clients). Pierre clique sur le meuble « Devis Maison Lune » et écrit « @Johan tu peux relire le prix avant 17h ? ». La bulle apparaît au-dessus du meuble, pas dans un fil de chat ; Johan reçoit un chuchotement (notification ciblée, retardée s'il est en Sonnette). Une bulle avec « ? » reste affichée au-dessus du meuble tant que personne n'a cliqué « Répondu ». « Crier » à tout le monde est un choix explicite.
- **Ce que ça change** : Chaque message garde son contexte et reste attaché à l'objet de travail, donc on le retrouve plus tard, contrairement à WhatsApp. Une mention ne dérange que la personne concernée : moins de bruit. Une question restée sans réponse ne disparaît pas dans le défilement.
- **Données** : Écrit TaskComment (existant) et, pour le CRM, OpportunityActivity kind NOTE (existant). NOUVEAU : TaskComment.mentionIds String[] (extrait côté serveur, limité aux utilisateurs actifs) et resolvedAt DateTime? (question ouverte ou close) ; mêmes champs sur OpportunityActivity ; nouveau kind de notification « mention », dedupeKey mention:<commentId>:<userId>. Respecte Notification.deliverAfter du mode porte.

### L'appel au Guide (coup de main sur une tâche bloquée) (plus tard)

- **Élément Habbo** : Outil Guide / Habbo Helpers et appel à l'aide
- **Scène** : Pierre passe une tâche en BLOQUE (motif et prochaine action, déjà obligatoires). Le meuble devient rouge et fume. Le QG propose « Demander un coup de main ». Pierre sonne chez Charles avec une demande cadrée : question, 15 min estimées, avant jeudi. Un carton rouge apparaît sur le paillasson de Charles ; il clique « J'aide » et devient contributeur. Une fois le blocage levé, la tâche repasse EN_COURS et le compteur collectif « blocages levés ce mois » monte.
- **Ce que ça change** : Les tâches bloquées ne dorment plus en silence, alors que c'est le premier frein à « finir ce qu'on fait ». Une demande petite et limitée dans le temps est facile à accepter. Une tâche qui dépasse blockedReviewDate sans demande d'aide remonte dans le brief.
- **Données** : Lit Task.status BLOQUE, blockedReason, blockedNextAction, blockedReviewDate. Écrit TaskContributor et Task.status via le changement de statut existant (src/features/projects/service.ts), une notification de kind « blocage » (existant) et un AuditEvent. NOUVEAU modèle HelpRequest {id, taskId, requesterId, helperId?, question, minutes Int, neededBy Date?, status OUVERTE|PRISE|RESOLUE|ANNULEE, createdAt, resolvedAt?}. En attendant, l'équivalent MVP est une @mention sur une tâche BLOQUE (bulles sur les meubles).

### L'Infobus (votes et décisions qui aboutissent) (plus tard)

- **Élément Habbo** : L'Infobus, la room de sondage de Habbo, et les votes en room
- **Scène** : Un bus garé dans la salle commune affiche « 2 décisions en attente ». À l'intérieur : la question, avant/après, les conséquences. Chaque associé place son avatar sur la case POUR, CONTRE ou ABSTENTION, avec un commentaire facultatif. Un siège vide signale un vote manquant (visible seulement à l'intérieur). Un compte à rebours montre l'échéance. Quand le quorum est atteint, le bus part : le résultat est collé au mur et les actions qui en découlent deviennent des tâches. Une « décision express » couvre les petites décisions d'agence (acheter un micro, accepter un client).
- **Ce que ça change** : Les décisions sont tranchées avec une trace, au lieu de traîner puis d'être oubliées dans le chat. Celui qui attend une décision voit où elle en est. Une décision se transforme tout de suite en tâches attribuées.
- **Données** : Lit et écrit DecisionRequest, DecisionVote (unique par associé), GovernanceSetting.requiredApprovals, avec AuditEvent (existant). NOUVEAU : DecisionRequest.projectId rendu optionnel et DecisionKind AGENCE (décisions hors projet), DecisionRequest.dueAt DateTime?, nouveau kind de notification « vote ». Les tâches qui en découlent passent par la création de tâches existante (même logique que MeetingNote → tâches). En MVP, il suffit d'un meuble bus qui affiche le nombre de décisions OUVERTE et renvoie vers /gouvernance.

### À éviter

- Refaire WhatsApp en pixel art : un chat libre dans la room, avec « en train d'écrire », accusés « vu » et compteurs rouges partout. Le bruit et les interruptions reviennent, et les décisions se perdent dans le défilement. Règle à tenir : chaque bulle est attachée à un objet (tâche, opportunité, décision) et enregistrée ; aucune décision n'existe seulement dans un message ; les pings non urgents attendent la fin du focus.
- La présence qui devient de la surveillance, ou une compétition déguisée. À proscrire : un statut « en ligne / inactif depuis X min » automatique, un « vu à 23h12 », le titre du timer exposé par défaut, un classement de qui poste le plus de post-its ou prend le plus de cartons, une passation imposée sans acceptation. Ce qui reste : des modes manuels, grossiers et qui expirent seuls (porte), l'opt-in pour le timer, seulement des badges collectifs (« tas vide », « blocages levés »), et la double acceptation pour toute passation.
