# Documentation Decision Tree

> Quick guide: What to read based on your task

## I need to understand the project

- High-level overview → `.agents/documentation/project-overview.md`
- Full navigation map → `.agents/documentation/project-nav.md`
- Structured summary → `.agents/documentation/codebase-summary.md`

## I need to work on a specific area

- **Vue components** → `.agents/documentation/codebase-summary.md` → Key Files section
- **State management** → `src/state.ts` (central reactive state)
- **Routing** → `src/router.ts` (9 routes: home, config, init, workflow, app, task run/view, agent run/view)
- **Services layer** → `src/services/` (api, history, notify, task_events, perf, stats, str, template)
- **Theme system** → `src/scss/` (14 SCSS themes with CSS custom properties)
- **Server binary** → `src/bin/index.ts` (HTTP server with static asset serving)
- **Plugin apps** → `src/apps/` (dynamically extend routes via server-side import)

## I need UI coding standards

- Code style guidelines → `.agents/documentation/code_style_guidelines.md`
- CSS/theming conventions → `.agents/documentation/css-style-guide.md`

## Common Tasks (Quick Reference)

| Task | Go To |
|------|-------|
| Add a new page/view | `src/views/` + update `src/router.ts` |
| Modify agent configuration UI | `src/components/AgentParamsPicker.vue` + `src/state.ts` |
| Change theme colors | `src/scss/<theme>.scss` files |
| Add WebSocket communication | `@agent-smith/wscli` → `useClientFeatures()` composable |
| Create a new sidebar component | `src/components/sidebars/` + update `SidebarsDispatch.vue` |
| Build and run locally | `npm run dev` (Vite) or `npm run build && npm run local` |
| Add a new plugin app | Follow pattern in `src/apps/debate.js` |

## Conventions

- Vue 3 Composition API with `<script setup>`
- TypeScript with `.js` extension for relative imports
- Centralized reactive state via `@snowind/state`
- Runtime theme switching via CSS class toggling
- Plugin system for dynamic route extension

→ See `AGENTS.md` for full conventions summary.
