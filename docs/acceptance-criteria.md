# Critères d'Acceptation par Phase (Exit Conditions)

## Phase 1 : Socle Signalement (MVP)
*Objectif : Mettre en place la base du système de ticketing et le dashboard.*

- [ ] L'application mobile permet à un utilisateur enregistré de soumettre un ticket avec texte et une pièce jointe (image).
- [ ] Le ticket apparaît en temps réel (< 2 secondes) dans le tableau de bord web du support.
- [ ] Un agent de triage peut modifier le statut du ticket (Ouvert -> En cours -> Fermé) et l'utilisateur voit ce changement sur son mobile de façon asynchrone (refresh) ou en temps réel.
- [ ] Le dashboard web permet de filtrer la liste par statut et priorité.
- [ ] *SLA de test* : Le système supporte la création de 100 tickets simultanés sans dégradation de la base.

## Phase 2 : PANIC & Coordination
*Objectif : Activer les fonctionnalités d'intervention critique et de géolocalisation.*

- [ ] L'utilisateur peut lier au moins 2 "Devices" à son compte.
- [ ] L'appui long (3s) sur le bouton PANIC déclenche la création d'un événement `panic_events` en base.
- [ ] Le déclenchement de PANIC notifie l'interface web (toast rouge push) et passe le statut du wallet interne (mock) à "FROZEN".
- [ ] La carte thermique (Heatmap) du dashboard web affiche correctement les marqueurs (clusters) correspondant aux coordonnées GPS des incidents.
- [ ] Le bouton de "Rafraîchissement" manuel du dashboard web met à jour les données API sans rechargement complet de la fenêtre du navigateur (SPA complet).

## Phase 3 : Anti-vol Complet & Audit
*Objectif : Livrer la traçabilité robuste et l'aspect communautaire.*

- [ ] Un simple utilisateur peut émettre un "Signal de danger" anonyme avec ses coordonnées GPS.
- [ ] Une règle de quorum (ex: "si 3 signaux dans un rayon de 1km") génère un ticket de type "Alerte de zone" pour le support.
- [ ] Toutes les actions des agents (gel de wallet, clôture de ticket) sont sauvegardées dans une table immuable `audit_logs`.
- [ ] L'administrateur peut générer un export PDF ou CSV de l'historique complet d'un incident donné pour des besoins juridiques.
- [ ] L'application supporte le changement de langue à la volée (FR, EN) et inverse le sens de lecture pour l'Arabe (RTL).
