# Agent Smith UI

## Mission

A Vue 3 web dashboard for managing AI agents, workflows, tasks, and model configurations, with an optional Node.js server binary (`lmui`) that serves the frontend and bridges to the Agent Smith backend.

## Structure

| Directory | Purpose |
|-----------|---------|
| `src/main.ts` | Vue app bootstrap: PrimeVue Aura theme, router, toast/confirmation services |
| `src/App.vue` | Root layout: header, sidebar dispatch, router-view, toast/confirmation dialogs |
| `src/router.ts` | Vue Router config — 9 routes (home, config, init, workflow, app, task run/view, agent run/view) |
| `src/state.ts` | Central reactive state: agent state, models, backends, workspaces, UI preferences (persisted via `useStorage`) |
| `src/views/` | Page components: HomeView, ConfigView, ConfigInitView, AppView, WorkflowView, TaskRunView, TaskViewView |
| `src/components/` | 16 core UI components (TheHeader, AgentParamsPicker, InferenceParamsForm, SamplingPresets, TaskTools, ViewAgent, toast, tool call rendering, thinking nodes) |
| `src/components/sidebars/` | 7 sidebar components: tasks, agents, history, workflows, inference params, right dispatch, SidebarsDispatch |
| `src/components/navbars/` | 2 prompt input toolbars (PromptNavbarLeft, NavbarTask) |
| `src/widgets/icons/` | 32 icon components (PascalCase + Icon suffix) |
| `src/widgets/` | Reusable widgets: ToolCallDetails, AutoTextarea, LoadingSpinner, HistoryTurnStatsBar, TurnTitle |
| `src/services/` | Service layer: api (REST via restmix), history, task_events, notify, stats, perf, str, template |
| `src/scss/` | 14 SCSS theme files (default: bluestar) with CSS custom properties for runtime switching |
| `src/bin/` | Node.js server binary entry point: HTTP server with static asset serving and dynamic route loading |
| `src/apps/` | Plugin apps (e.g., debate) — dynamically extend routes via server-side import |
| `public/img/` | Static assets served by the dev/prod server |

## Conventions (for AI Agents)

- **Vue 3 + TypeScript**: Use Composition API with `<script setup>` where possible; all relative TS imports must use `.js` extension (even though source files are `.ts`)
- **Path alias**: Use `@/` alias for `src/` directory imports throughout the UI
- **Component naming**: Vue SFCs use PascalCase (`TheHeader.vue`, `SidebarAgents.vue`); icon components use `*Icon.vue` suffix
- **State management**: Central reactive state in `src/state.ts` using Vue `reactive()` + `@snowind/state` `User` class; UI preferences persisted separately via `@vueuse/core` `useStorage()`
- **WebSocket communication**: `@agent-smith/wscli` provides `useClientFeatures()` composable for server communication via reconnecting WebSocket
- **Theme switching**: Runtime theme switching via CSS class toggling on `<html>` element (`theme-<name>`); themes defined in `src/scss/` with SCSS custom properties
- **Import order**: third-party → relative (grouped by directory) → global; always use `.js` extension for relative TS imports
- **Build**: Vue app built with `vite build`; server binary compiled with `tsc -p tsconfig_bin.json`; output to `dist/`
- **Plugin pattern**: Apps in `src/apps/` can dynamically extend routes via server-side import; the debate app demonstrates this pattern

## Quick Start for AI Agents

1. Read `.agents/documentation/codebase-summary.md` for technical module details
2. Read `.agents/documentation/code_style_guidelines.md` for UI coding standards
3. Read `.agents/documentation/css-style-guide.md` for CSS/theming conventions
4. Read `../../AGENTS.md` for project-wide context and conventions

## Documentation

- `.agents/documentation/codebase-summary.md` — Structured technical summary (7-section format)
- `.agents/documentation/code_style_guidelines.md` — UI code style guidelines (17.7KB)
- `.agents/documentation/css-style-guide.md` — CSS/theming style guide (27KB)
- `../../AGENTS.md` — Project-wide context, conventions, and documentation map (workspace root)
