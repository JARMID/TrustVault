# Proposition de Tableaux de Bord et KPI (TrustDesk)

Ce document décrit les mesures clés à mettre en place sur le Dashboard d'administration (React/Vite) de TrustDesk.

## Dashboard 1 : Triage "Temps Réel" (Support de N1 & N2)

Ce dashboard est l'entrée principale des agents de support, conçu pour la rapidité d'exécution.
- **File de traitement des tickets** : Trié par Score d'Urgence calculé (PANIC = Infini, Vol+Preuves = 100, etc.).
- **Indicateur de Charge** : Nombre de tickets Ouverts vs. Agents en ligne (Charge de travail).
- **Carte Thermique (Heatmap) en temps réel** : Affichage des clusters de points d'incidents signalés récemment (géolocalisation). Permet d'anticiper si un problème global (fraude massive dans un pays, problème de connexion opérateur) est en cours.
- **Alertes Clignotantes** : Pour tout déclenchement du webhook événement PANIC.

## Dashboard 2 : Pilotage & KPI (Manager / Admin N3)

Des indicateurs synthétiques pour suivre les performances SLA (Service Level Agreement).

### KPI Opérationnels
- **TimeToFirstResponse (TTFR) / Délai de première réponse** : Temps moyen s'écoulant entre la création d'un ticket et la première action d'un agent.
  - *Objectif* : < 2 min pour PANIC, < 15min pour fraude avérée.
- **Taux de tickets résolus dans le SLA** : Pourcentage de tickets fermés avant échéance (ex: 24h).
- **Time to Resolution (TTR) / Temps de Résolution** : Temps moyen global de résolution.

### KPI Sécurité & Qualité
- **Volume d'événements PANIC par semaine**.
- **Taux de Faux Positifs PANIC** : Sur le volume global d'urgences, combien étaient de fausses manipulations.
- **Taux d'adoption des Devices Secondaires** : Métrique d'éducation des utilisateurs de l'app Mobile. (Combien d'utilisateurs ont correctement relié une tablette ou un second téléphone au compte ?).
- **Taux d'Intégrité Communautaire** : Ratio (Signalements communautaires validés / Total de signalements communautaires). Indique si la communauté est saine.
