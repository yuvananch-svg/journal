# Workspace Shell — design and implementation record

User direction: establish app structure before connecting data. Eight primary routes: Dashboard, Journal, Playbook, Master, Analytics, Account, AI, Community. Reserve the brand position in the center of the desktop navigation without inventing a name. Target personal CFD first; Exness MT5 Demo is planned, not connected.

Architecture: one Next.js App Router app, shared workspace layout with two collapsible sidebars. Keep URL navigation and refresh working. Marketing and authentication are separate future scopes; this build is an explicitly labeled unauthenticated local preview of the future signed-in shell. Unknown routes return404. Mobile uses a menu exposing all eight destinations. Do not collect credentials.

Stack: React/TypeScript, CSS tokens with Tailwind4 integration, Motion for entry transitions, Recharts for demo charts, TanStack Query provider reserved for server data, Zustand only for UI toggles. No Supabase or external API initialized because this scope has no data connection. No purchased assets or copied original media.

Implemented boundaries: account and plan rails, theme and amount visibility, session-only checklist, independent feature pages with truthful foundation states. Dashboard is a synthetic fixture with curved P&L, metric cards, weekly bars, illustrative score/targets and navigable calendar. Journal/Playbook/Analytics/Account/AI/Community describe reserved areas, not functioning products. Master is intentionally undefined. No fake posts or successful connections.

Validation: node tests navigation resolution and existing metrics/curve contracts; TypeScript; production build; browser navigation, rail toggle, responsive layout and console check. No claim of production auth, persistence, performance benchmark or complete trading domain.
