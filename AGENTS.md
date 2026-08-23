# Agent Smith UI

## Mission

A Vue 3 web dashboard for managing AI agents, workflows, tasks, and model configurations, with an optional Node.js server binary (`lmui`) that serves the frontend and bridges to the Agent Smith backend.

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
- **Tailwind 4 styling**: Config-free utility classes applied via CSS `@import`/`@reference` inside `<style lang="css">`; there is no `tailwind.config` file (config was removed during the Tailwind 4 migration)

## Quick Start for AI Agents

1. Read `.agents/documentation/decision-tree.md` to find the right doc for your task
2. Read `.agents/documentation/project-overview.md` for high-level context
3. Read `.agents/documentation/project-nav.md` for detailed navigation and dependency graph
4. Read `.agents/documentation/codebase-summary.md` for technical module details

## Documentation

- `.agents/documentation/decision-tree.md` — Quick guide: find the right doc for your task
- `.agents/documentation/project-overview.md` — Concise project overview (~1 page)
- `.agents/documentation/project-nav.md` — Detailed navigation map with dependency graph
- `.agents/documentation/codebase-summary.md` — Structured technical summary (7-section format)
- `.agents/documentation/code_style_guidelines.md` — UI code style guidelines
- `.agents/documentation/css-style-guide.md` — CSS/theming style guide
