# Cadrage du Projet : TrustDesk

## 1. Contexte & Problématique
Le projet **TrustDesk** répond à deux problématiques majeures dans l'écosystème fintech/crypto :
1. **L'exposition des wallets en cas de vol/perte** : Les délais d'intervention sont critiques avant qu'un compte ne soit siphonné.
2. **La gestion inefficace des incidents** : Les clients rencontrent des fraudes, bugs ou litiges, mais les services clients croulent sous des processus lents et mal outillés.

## 2. Solution Proposée
Une plateforme modulaire combinant :
- Une **application mobile (Flutter)** permettant aux utilisateurs de signaler des incidents en temps réel, d'activer un bouton PANIC depuis un appareil secondaire, et d'envoyer/recevoir des signaux communautaires.
- Un **dashboard d'administration web (React/Vite)** pour les équipes de support, permettant un triage intelligent, une modération de la communauté, et des actions de gel de compte.
- Un **backend robuste (Laravel + Supabase)** assurant le stockage sécurisé, le temps réel, et la journalisation immuable des actions.

## 3. Périmètre (In/Out)

### Inclus (MVP et évolutions proches)
- Interface de signalement multicanal avec preuves (photos, localisation)
- Dashboard de support priorisé avec géolocalisation des incidents
- Mode "PANIC" pour verrouillage temporaire contrôlé
- Signalement communautaire opt-in (rayon de proximité)
- Journalisation d'audit complète pour extraction légale

### Exclu (Sauf évolution ultérieure)
- Gestion automatique des transferts de fonds (se limite au gel informatif)
- Processus complet de KYC intégré
- Modules de Machine Learning complexes (scoring simple dans un premier temps)

## 4. Architecture Globale
- **Base de données & Auth** : Supabase (PostgreSQL, RLS policies, Storage)
- **Backend API** : Laravel 11 (PHP 8.3)
- **Application Web** : React 19 + Vite + TailwindCSS
- **Application Mobile** : Flutter 3 + Dart + Riverpod
- **Application Desktop** : Web app emballée avec Tauri

## 5. Phases du Projet
1. **Socle Signalement (MVP)** : Validation du tunnel de déclaration d'incident et du dashboard de base.
2. **PANIC & Coordination** : Intégration du bouton d'urgence et du read-only communautaire.
3. **Anti-vol Complet** : Outils de forensic, exports légaux, et intégration des playbooks complexes.

## 6. Gouvernance et Conformité
L'application traitant des données sensibles (localisation, informations financières indirectes), elle implémente :
- Un consentement explicite systématique (RGPD).
- Un chiffrement et une politique de minimisation des données.
- Des exports encadrés pour requêtes officielles (réquisition judiciaire).
