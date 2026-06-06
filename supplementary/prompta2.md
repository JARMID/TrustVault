You are a senior product strategist and solutions architect. I need you to help me design and develop a modular incident management and anti-theft platform for crypto wallets.
Here is the full project specification document:

PROJECT OVERVIEW
The platform combines:

Incident management (reporting, triage, evidence collection, prioritization)
Collaborative anti-theft mechanisms (PANIC mode, temporary wallet freeze, opt-in geolocation, community reporting)

The approach is progressive: a reporting foundation first, then security modules added incrementally to reduce operational and regulatory risk.
EXPECTED BENEFITS: Reduced incident response time, better coordination between professional support and community, complete audit trail for legal actions and investigations.

CORE OBJECTIVES

Validate user need and launch a functional MVP for reporting and triage
Enable rapid intervention for loss/theft (PANIC / temporary freeze) without exposing the platform to automatic fund management
Provide investigation, audit, and escalation tools compliant with regulatory and judicial requirements
Build a modular, extensible foundation for advanced future features (forensics, custodial integrations)


USER JOURNEYS

Simple reporting: User opens app → selects incident type (theft, loss, fraud, bug) → describes situation and attaches evidence → ticket created with confirmation
PANIC from secondary device: User activates PANIC from a registered backup device → system runs pre-registered confirmation → wallet temporarily locked → support and security ops auto-alerted with high-priority ticket
Support → triage → action flow: Incoming tickets sorted by priority → agents apply playbooks → actions taken (temporary freeze, legal escalation, access restoration) → all actions logged
Community reporting: Opt-in users send/receive anonymized signals within a configurable radius → signals filtered by confidence score → presented to agents and community for confirmation


KEY FEATURES

Multi-type incident report form with evidence and opt-in location
Ticket tracking for users (status, history, support messages)
Automatic prioritization by configurable criteria
PANIC activation from secondary device or via support
Configurable temporary freeze (duration, lift conditions)
Pre-defined authentication/recovery process to lift freeze
Opt-in community network with anonymization and reputation system
Prioritized support dashboard with filters, ticket timeline, controlled actions
Geographic incident visualization (heatmap, clusters)
Detailed immutable action logging for audits
Controlled exports for official requests with defined procedure


NON-FUNCTIONAL REQUIREMENTS

Explicit consent for all geolocation or image capture
Defined evidence retention and deletion rules
Verification steps and separation of powers for sensitive functions
High availability for reporting, alerts, and critical actions (auth, PANIC)
Reactive triage operations to meet defined SLAs
Modular architecture to add/remove modules (ML, custodian integration)
Compliance with user rights (access, deletion) and applicable regional directives


OPERATIONAL PROCESSES

User onboarding: Register primary and backup devices, explain and accept consents, in-app education on PANIC flow and recovery
Triage & SLA: Priority levels (critical → 2h, high → 24h, normal → 72h, low), auto-escalation rules
Abuse management: Automatic detection of abnormal patterns, progressive sanctions, mandatory human review for major sanctions
Incident playbooks: Defined scenarios for device theft, confirmed fraud, mass false reporting, judicial requests


PHASED ROADMAP
PhaseGoalKey DeliverablesPhase 1 — MVPValidate reporting use caseReporting interface, ticket tracking, basic dashboard, initial playbooksPhase 2 — PANIC & CoordinationEnable immediate protectionPANIC activation, community reporting (read-only), recovery proceduresPhase 3 — Full Anti-theft & ForensicsComplete investigation workflowsAdvanced escalation, legal procedures, third-party integrations

KEY RISKS

Mass abuse of community reporting → reputation system, quotas, human review
Privacy violations (images/geo) → strict consent, data minimization, auto-deletion
Legal risk from fund manipulation → defer fund management until contractualized compliance
Loss of user trust from false positives → transparency, fast appeals process
Support overload → triage automation and playbooks


YOUR TASKS
Based on this specification, please help me with the following (specify which you want):

Validate and critique the specification — identify gaps, contradictions, or risks I may have missed
Generate user stories in standard format (As a [role], I want [feature], so that [benefit]) for each module
Design a wireframe description for the key screens (mobile reporting flow, PANIC screen, support dashboard)
Draft the technical architecture (services, APIs, data flows) — modular and cloud-native
Create a detailed project plan with milestones, dependencies, and resource assignments
Write acceptance criteria for each phase's exit conditions
Draft playbook templates for the defined incident scenarios
Propose KPI dashboards with measurement methodology

