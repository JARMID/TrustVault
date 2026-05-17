# Design System: TrustDesk
**Project:** TrustDesk — Campus Security Platform

## 1. Visual Theme & Atmosphere

**Mood:** Authoritative, secure, premium — like a mission-control center for campus safety. Deep, immersive dark surfaces create a sense of focused intensity. Strategic use of electric accents provides visual urgency hierarchy.

**Aesthetic Philosophy:** "Security Operations Center meets Modern Campus." Dense data presented with clarity. Trust through transparency. Urgency through color, not clutter.

**Density:** Medium-high for desktop dashboards (data-rich but organized), airy and focused for mobile (one primary action per screen).

## 2. Color Palette & Roles

### Core Surfaces
- **Obsidian Void** (#0F172A) — Primary background. Deep navy-charcoal evoking a secure vault.
- **Midnight Slate** (#1E293B) — Card and container surfaces. Slight elevation from background.
- **Steel Shadow** (#334155) — Elevated elements, hover states, secondary containers.
- **Frosted Edge** (#475569) — Borders, dividers, subtle delineation.

### Primary Accents
- **Trust Blue** (#3B82F6) — Primary actions, links, active states. Conveys reliability and authority.
- **Electric Cyan** (#06B6D4) — Secondary accent, data visualizations, real-time indicators.

### Semantic Colors
- **Crisis Red** (#EF4444) — PANIC button, critical alerts, destructive actions. Maximum urgency.
- **Alert Amber** (#F59E0B) — Warnings, escalation indicators, medium-priority items.
- **Resolve Green** (#10B981) — Success states, resolved tickets, campus access restored.
- **Muted Violet** (#8B5CF6) — Community features, social signals, secondary data.

### Text Hierarchy
- **Pure White** (#F8FAFC) — Headings, primary text. Maximum readability on dark surfaces.
- **Silver Mist** (#CBD5E1) — Body text, descriptions. Comfortable extended reading.
- **Dim Pewter** (#64748B) — Labels, timestamps, tertiary information.
- **Ghost Gray** (#334155) — Disabled text, placeholder content.

## 3. Typography Rules

- **Font Family:** Inter (Google Fonts) for web. System default for mobile (SF Pro on iOS, Roboto on Android).
- **Headings:** Semibold (600), tight letter-spacing (-0.02em). Sizes: H1 32px, H2 24px, H3 20px, H4 16px.
- **Body:** Regular (400), relaxed line-height (1.6). Size: 14–16px.
- **Mono:** JetBrains Mono for audit logs, transaction IDs, technical data.
- **Arabic:** Noto Sans Arabic — proper RTL kerning and diacritics support.
- **Direction:** LTR default, full RTL support for Arabic locale.

## 4. Component Stylings

### Buttons
- **Primary (CTA):** Pill-shaped (rounded-full), gradient from Trust Blue (#3B82F6) to Electric Cyan (#06B6D4). White text, subtle glow shadow on hover. 48px height mobile, 40px desktop.
- **PANIC Button:** Large circular button, solid Crisis Red (#EF4444), pulsing glow animation. 120px diameter on mobile. Press-and-hold confirmation (3 seconds).
- **Secondary:** Ghost style with Trust Blue border, transparent background. Blue text.
- **Destructive:** Crisis Red background, white text. Requires confirmation dialog.
- **Disabled:** Ghost Gray background, Dim Pewter text.

### Cards / Containers
- **Standard Card:** Midnight Slate (#1E293B) background, generously rounded corners (16px), whisper-soft border (1px Frosted Edge #475569 at 30% opacity). No drop shadow — depth through color contrast.
- **Glass Card:** Semi-transparent background (rgba(30, 41, 59, 0.7)), backdrop-blur (16px). Used for overlays and floating panels.
- **Alert Card:** Left-border accent (4px) in semantic color (red/amber/green). Used for notifications and status banners.

### Inputs / Forms
- **Text Input:** Midnight Slate background, Frosted Edge border, gently rounded (8px). Focus state: Trust Blue border with subtle glow. 44px height.
- **Select/Dropdown:** Same as text input. Chevron icon in Silver Mist.
- **File Upload:** Dashed border in Frosted Edge, drag-and-drop zone. Icon + text centered.
- **Toggle:** Pill-shaped, Resolve Green when active, Steel Shadow when inactive.

### Status Badges
- **Priority badges:** Pill-shaped, small (24px height). Background tinted with semantic color at 15% opacity, text in full semantic color.
  - Critique: Crisis Red
  - Élevé: Alert Amber
  - Normal: Trust Blue
  - Faible: Dim Pewter
- **Status badges:** Same style.
  - Ouvert: Trust Blue
  - En cours: Alert Amber
  - Résolu: Resolve Green
  - Fermé: Dim Pewter

### Tables
- **Header row:** Steel Shadow background, uppercase Silver Mist text, 12px font, wide letter-spacing.
- **Data rows:** Alternating transparent / very subtle Midnight Slate. Hover: Steel Shadow.
- **Borders:** Horizontal only, Frosted Edge at 20% opacity.

### Navigation
- **Sidebar (Desktop):** Fixed, 260px width. Obsidian Void background. Active item: Trust Blue left-border accent (3px) + subtle blue text highlight.
- **Bottom Nav (Mobile):** Frosted glass effect, 5 items max. Active: Trust Blue icon + label.

## 5. Layout Principles

- **Grid:** 12-column on desktop (1280px max), single column on mobile.
- **Spacing Scale:** 4px base unit. Margins: 16/24/32px. Padding: 12/16/24px.
- **Whitespace:** Generous between sections (32–48px). Tight within card groups (12–16px).
- **RTL Mirroring:** All horizontal layouts flip for Arabic. Icons that indicate direction (arrows) also flip. Non-directional icons stay the same.

## 6. Motion & Animation

- **Transitions:** 200ms ease-out for hover, 300ms ease-in-out for page transitions.
- **PANIC pulse:** CSS keyframe — 1.5s infinite pulse with Crisis Red glow expanding and contracting.
- **Ticket status changes:** Smooth color morph (500ms) when badge updates.
- **Skeleton loading:** Shimmer animation on Midnight Slate → Steel Shadow gradient.
- **Entry animations:** Cards fade-up (translateY 16px → 0, opacity 0 → 1) staggered at 50ms intervals.
- **Heatmap:** Points radiate from center (subtle sine wave pulse).

## 7. Design System Notes for Stitch Generation

When generating new screens with Stitch, always include this block:

```
DESIGN SYSTEM (REQUIRED):
- Platform: [Web/Mobile], dark theme
- Background: Obsidian Void (#0F172A)
- Surface: Midnight Slate (#1E293B)
- Accent: Trust Blue (#3B82F6) for primary actions
- Danger: Crisis Red (#EF4444) for PANIC and alerts
- Warning: Alert Amber (#F59E0B) for escalation
- Success: Resolve Green (#10B981) for resolved states
- Text Primary: Pure White (#F8FAFC)
- Text Secondary: Silver Mist (#CBD5E1)
- Font: Inter, semibold headings, regular body
- Cards: 16px rounded corners, 1px subtle border
- Buttons: Pill-shaped, gradient blue for primary, red for PANIC
- Style: Premium campus security operations center aesthetic
```
