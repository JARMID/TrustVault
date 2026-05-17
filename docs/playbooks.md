# Playbooks et Procédures (TrustDesk)

## Scénario A : Activation PANIC (Bouton Rouge)
**Niveau** : Critique (SLA réponse : < 2 min)
1. L'événement est déclenché par un Device enregistré (ex: Tablette_Maison).
2. Le système gèle automatiquement les transactions du wallet (statut `FROZEN`).
3. Le dashboard Support joue une alarme sonore (Push web).
4. Création d'un ticket prioritaire "PANIC" assigné à l'équipe de Sécurité (L2/L3).
5. L'agent Sécurité vérifie si l'activation vient du périmètre GPS connu de l'utilisateur.
6. Procédure de levée de gel : Obligation d'un appel Visio de vérification (KYC) pour initier un `/wallet/unfreeze`.

## Scénario B : Vol de Téléphone Confirmé
**Niveau** : Très Élevé (SLA réponse : < 2h)
1. Le client déclare la perte de son téléphone principal via le Device d'urgence ou le portail public.
2. Le ticket est catégorisé : `device_theft`.
3. L'agent demande des justificatifs (Dépôt de plainte PDF, numéro IMEI).
4. L'agent place le compte du client sous "Surveillance Renforcée" et suspend les modifications de paramètres de sécurité (email, 2FA, devices liés).
5. Exécution d'un transfert sécurisé temporaire des fonds (facultatif si la plateforme est custodiale).

## Scénario C : Faux Signalement / Troll
**Niveau** : Modéré (SLA réponse : 48h)
1. Une dizaine de "Bugs imaginaires" est reportée par un utilisateur spécifique en moins d'une heure.
2. Le système flag automatiquement le compte pour suspicion d'Abus.
3. L'agent examine 2 des tickets générés. Aucune preuve valide attachée (ex: images noires).
4. L'agent applique le Modificateur de Réputation (Score Confiance : -50).
5. Les prochains tickets de cet utilisateur seront cachés dans la file "Low Priority / Junk" du Dashboard Triage.

## Scénario D : Exigence Légale ou Judiciaire
**Niveau** : Administration & Conformité
1. L'application TrustDesk (au Maroc ou UE) reçoit une réquisition des officiers de police (OPJ).
2. L'administrateur de conformité accède à `/audit`.
3. L'admin génère un extract immuable des interactions du compte visé (date d'inscription, IP, localisation liée aux signalements, log de tous les tickets et leurs statuts).
4. Export PDF signé et hashé cryptographiquement remis à l'autorité requérante.
