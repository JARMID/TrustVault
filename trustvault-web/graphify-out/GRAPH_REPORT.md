# Graph Report - trustvault-web  (2026-06-05)

## Corpus Check
- 97 files · ~393,233 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 535 nodes · 722 edges · 43 communities (31 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dffdd67d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]

## God Nodes (most connected - your core abstractions)
1. `useToast()` - 27 edges
2. `compilerOptions` - 22 edges
3. `compilerOptions` - 18 edges
4. `useWallet()` - 15 edges
5. `useAuthStore` - 14 edges
6. `useTriage()` - 13 edges
7. `TiltCard()` - 9 edges
8. `useAuditLogs()` - 9 edges
9. `scripts` - 7 edges
10. `isSupabaseReady()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `LandingHeader()` --calls--> `useTheme()`  [INFERRED]
  src/components/layout/LandingHeader.tsx → src/pages/Landing.tsx
- `CommandPalette()` --calls--> `useToast()`  [EXTRACTED]
  src/components/ui/CommandPalette.tsx → src/components/ui/Toast.tsx
- `Labels()` --calls--> `useToast()`  [EXTRACTED]
  src/pages/Labels.tsx → src/components/ui/Toast.tsx
- `ProtectedRoute()` --calls--> `useAuthStore`  [EXTRACTED]
  src/App.tsx → src/stores/authStore.ts
- `App()` --calls--> `useAuthStore`  [EXTRACTED]
  src/App.tsx → src/stores/authStore.ts

## Communities (43 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (30): TransactionFilters, useWallet(), WalletHookReturn, AnalyticsPage(), catColor, catIcon, containerVariants, CustomTooltipProps (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): LandingHeader(), AmbientHeroBackground(), features, LandingInner(), stats, Theme, ThemeContext, ThemeToggle() (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (17): BugReports(), EKYC(), GeoLocal(), SOCDashboard(), initialTags, TagsManagement(), useAuditLogs(), useTriage() (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (19): useBehavioralBiometrics(), CommunitySignal, useCommunitySignals(), useDeviceFingerprint(), api, token, Community(), itemVariants (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (29): ContactsHookReturn, useContacts(), NotificationsHookReturn, useNotifications(), SendMoneyPage(), Step, AlertActionType, DbAlertAction (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (34): dependencies, axios, class-variance-authority, clsx, date-fns, firebase, framer-motion, gsap (+26 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (30): devDependencies, concurrently, cross-env, electron, electron-builder, eslint, @eslint/js, eslint-plugin-react-hooks (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (24): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (16): TopNav(), TopNavProps, Settings(), initialTheme, Theme, UIState, useUIStore, Avatar() (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (9): useFCM(), usePrivacyShield(), Layout(), app, firebaseConfig, onMessageListener(), requestForToken(), AISupportWidget() (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (3): Dashboard(), ContainerScroll(), Skeleton()

### Community 14 - "Community 14"
Cohesion: 0.27
Nodes (6): Login(), AUDIT_ID, App(), ProtectedRoute(), useAuthStore, SmoothScrollProvider()

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (8): auditLog, categoryBreakdown, containerVariants, hourlyPattern, itemVariants, kpis, monthlyTrend, radarMetrics

### Community 16 - "Community 16"
Cohesion: 0.36
Nodes (5): VaultDocument, isSupabaseReady(), AuthState, fetchProfile(), UserProfile

### Community 17 - "Community 17"
Cohesion: 0.39
Nodes (5): useVault(), CATEGORIES, DocumentVault(), Ekyc(), useToast()

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (7): colors, icons, Toast, ToastContext, ToastContextType, ToastProvider(), ToastType

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (6): cn(), AceternitySpotlight(), AceternitySpotlightProps, Spotlight(), SpotlightProps, SpringConfig

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): containerVariants, INITIAL_LABELS, itemVariants, Label, Labels()

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (5): DEFAULT_PROFILE, PRESET_AVATARS, Profile(), ProfileData, ROLE_COLORS

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (4): CommandItem, CommandPalette(), CommandPaletteProps, NNPResult

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (5): code:js (export default defineConfig([), code:js (// eslint.config.js), Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 26 - "Community 26"
Cohesion: 0.40
Nodes (4): adminNavItems, clientNavItems, MotionLink, Sidebar()

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (3): BadgeProps, BadgeVariant, variantStyles

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (4): Transaction, useWalletStore, VirtualCard, WalletState

## Knowledge Gaps
- **265 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+260 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useToast()` connect `Community 17` to `Community 0`, `Community 2`, `Community 3`, `Community 11`, `Community 13`, `Community 16`, `Community 18`, `Community 21`, `Community 22`, `Community 23`, `Community 26`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 5` to `Community 6`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `useAuthStore` connect `Community 14` to `Community 9`, `Community 16`, `Community 17`, `Community 22`, `Community 26`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _265 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.055272108843537414 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0595959595959596 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._