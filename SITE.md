# Site Vision & Roadmap (TrustDesk)

## 1. Vision
TrustDesk est une plateforme modulaire de cybersécurité pour les campus universitaires. C'est à la fois le bouclier (mobile) et la salle de contrôle (dashboard desktop/web) contre les menaces physiques et numériques. L'interface doit être épurée, sérieuse, réactive et en mode sombre natif.

## 2. Infrastructure
- **Stitch Project ID**: (À définir une fois le service rétabli)
- **Design System**: Défini dans `DESIGN.md`

## 3. Screens Roadmap (Stitch Generation Queue)
Ces écrans seront générés dès que l'intégration Stitch MCP sera de retour en ligne.
- [ ] Mobile: Login & Biométrie
- [ ] Mobile: Dashboard Accueil (Vue ID Campus + Status)
- [ ] Mobile: Formulaire Signalement Multi-étape
- [ ] Mobile: Bouton PANIC Urgence
- [ ] Mobile: Radar Communauté Proximité
- [ ] Web/Desktop: Support Triage Liste Tickets
- [ ] Web/Desktop: Heatmap Géolocalisation
- [ ] Web/Desktop: Détail/Timeline d'un Incident

## 4. Tech Stack Intégrée
- **API** : Laravel backend `trustdesk-api/`
- **Dashboard** : React frontend `trustdesk-web/`
- **Mobile** : Flutter app `trustdesk-mobile/`
