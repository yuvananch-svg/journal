# Local workspace app

Run from the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:3000/dashboard. Root redirects to Dashboard. The earlier buildless prototype remains in dashboard/ and can still run on4173; it is not the Next.js app.

Checks:

```sh
npm test
npm run typecheck
npm run build
```

Production preview: npm run start after a successful build.

## Routes

/dashboard, /journal, /playbook, /master, /analytics, /account, /ai, /community.

## Structure

- src/app/: routes, metadata, shared layout and global theme tokens
- src/components/shell/: navigation, sidebars, providers and workspace composition
- src/lib/navigation.mjs: ordered route definitions and route validation
- src/lib/ui-store.ts: transient UI state; never stores credentials or trades
- src/features/dashboard/: synthetic demo and charts
- src/features/workspace/: foundation pages, including connection status

This is a local app foundation. Authentication, data persistence, account connection, AI and community features have not been implemented. All visible trade values are synthetic. Theme/sidebar/checklist state is session-only. UI and unused server-cache setup are kept separate; no credentials or remote data services are required to run.

## Sidebar interaction

Desktop sidebars collapse from their own header chevrons. A32px vertical DESK / THE SESSION rail remains and opens the corresponding panel. Header no longer duplicates these controls. The three grid tracks remain mounted and transition over420ms; charts observe the actual container width and disable entry redraw on sidebar changes. Hidden panel content is inert, so its controls cannot receive keyboard focus. Checklist stays mounted and preserves session selections. Reduced motion removes the layout transition. Below1250px the plan rail is hidden; below741px both rails are hidden, matching the existing responsive layout.

## Formatting

Use `npm run format` to format application code, tests, the earlier prototype and project configuration. Use `npm run format:check` before committing. Prettier settings are tracked in `.prettierrc.json` so manual and AI-generated changes follow the same format.

## Animation settings

- `src/features/dashboard/animation-settings.ts`: chart and number durations in milliseconds.
- `src/features/dashboard/profit-motion.mjs`: Total P&L fast stage2150ms and tail3500ms; total5650ms. This is presentation only, never the stored trade value.
- `src/app/globals.css`: menu hover letter roll740ms, per-letter stagger18ms, button lift340ms, light/shadow420ms; sidebar transition420ms. Calendar cells use5:4 aspect ratio and the main panel owns scrolling.

## Repository boundaries

`src/` is the current Next.js application. `dashboard/` preserves the earlier buildless prototype for comparison and the existing4173 preview. `docs/` contains the engineering study, roadmap and development notes. `tests/` covers navigation, layout states and profit timing; the prototype's metric/curve tests remain beside it.

Ignored: dependencies, build outputs, environment files, working captures, public-site downloaded bundles and temporary screenshots. Do not add broker credentials, user trade exports or private reference media to the repository.
