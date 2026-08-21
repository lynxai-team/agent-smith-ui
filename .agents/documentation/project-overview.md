# Agent Smith UI — Project Overview

> **Role**: Concise "what is this" for context loading (~1 page overview).
> **See also**: `.agents/documentation/decision-tree.md` to find the right doc for your task.
> **See also**: `.agents/documentation/project-nav.md` for detailed navigation and task references.

---

## What is Agent Smith UI?

Agent Smith UI is a Vue 3 web dashboard for managing AI agents, workflows, tasks, and model configurations. It provides a rich interactive interface for configuring inference parameters, monitoring agent runs in real-time, and managing backend connections. An optional Node.js server binary (`lmui`) serves the frontend assets and bridges to the Agent Smith backend via HTTP and WebSocket protocols.

---

## Core Capabilities

- **Agent Management** — Configure agent parameters, view agent runs, manage backends
- **Task Monitoring** — Real-time task execution with streaming markdown output and tool call tracking
- **Workflow Configuration** — Define and manage inference workflows with sampling presets
- **Theme System** — 14 runtime-switchable SCSS themes with CSS custom properties
- **Plugin Architecture** — Dynamic route extension via server-side app imports (e.g., debate app)
- **WebSocket Communication** — Real-time bidirectional communication with backend via `@agent-smith/wscli`

---

## Repository Structure

| Directory | Purpose |
|-----------|---------|
| `src/main.ts` | Vue app bootstrap: PrimeVue Aura theme, router, toast/confirmation services |
| `src/App.vue` | Root layout: header, sidebar dispatch, router-view, toast/confirmation dialogs |
| `src/router.ts` | Vue Router config — 9 routes (home, config, init, workflow, app, task run/view, agent run/view) |
| `src/state.ts` | Central reactive state: agent state, models, backends, workspaces, UI preferences |
| `src/views/` | Page components: HomeView, ConfigView, ConfigInitView, AppView, WorkflowView, TaskRunView, TaskViewView |
| `src/components/` | Core UI components (TheHeader, AgentParamsPicker, InferenceParamsForm, SamplingPresets, TaskTools, ViewAgent, etc.) |
| `src/components/sidebars/` | 7 sidebar components: tasks, agents, history, workflows, inference params, right dispatch |
| `src/components/navbars/` | 2 prompt input toolbars (PromptNavbarLeft, NavbarTask) |
| `src/widgets/icons/` | 32 icon components (PascalCase + Icon suffix) |
| `src/widgets/` | Reusable widgets: ToolCallDetails, AutoTextarea, LoadingSpinner, HistoryTurnStatsBar, TurnTitle |
| `src/services/` | Service layer: api, history, task_events, notify, stats, perf, str, template |
| `src/scss/` | 14 SCSS theme files (default: bluestar) with CSS custom properties |
| `src/bin/` | Node.js server binary entry point: HTTP server with static asset serving |
| `src/apps/` | Plugin apps (e.g., debate) — dynamically extend routes via server-side import |
| `src/styles/` | Global CSS files (global.css, snowind.css) |

---

## Key Architecture Patterns

- **Component-Based Layout**: App.vue orchestrates TheHeader, SidebarsDispatch (collapsible sidebar system), and router-view with responsive fixed positioning
- **Centralized Reactive State**: Single state object managed via Vue `reactive()` + `@snowind/state` User class; UI preferences persisted separately via `useStorage()`
- **Service Layer**: Modular services provide isolated concerns; task_events handles real-time streaming with markdown parsing at ~20 parses/sec
- **Theme System**: 14 SCSS themes switchable at runtime via CSS class toggling on `<html>` element
- **Plugin System**: Apps in `src/apps/` dynamically extend routes via server-side import

---

## Quick Reference: Common Tasks

| Task | Go To |
|------|-------|
| Add a new page | `src/views/` + update `src/router.ts` |
| Modify agent config UI | `src/components/AgentParamsPicker.vue` + `src/state.ts` |
| Change theme | `src/scss/<theme>.scss` files |
| Add WebSocket communication | `@agent-smith/wscli` → `useClientFeatures()` |
| Create sidebar component | `src/components/sidebars/` + `SidebarsDispatch.vue` |
| Build and run locally | `npm run dev` or `npm run build && npm run local` |

---

## Code Snippets

### Adding a new route with sidebar integration
```typescript
// src/router.ts
{
  path: 'task/:id',
  name: 'TaskView',
  component: TaskViewView,
  meta: { sidebar: 'tasks' }
}
```

### Accessing central state
```typescript
// Any component
import { useStore } from '@/state'
const store = useStore()
store.agentState = newState // reactive update triggers UI re-render
```

### Theme switching at runtime
```vue
<!-- Toggle theme class on <html> element -->
<button @click="$el.classList.toggle('theme-navy')">Navy</button>
```

---

## Documentation Links

| Resource | Path |
|----------|------|
| Decision Tree | `.agents/documentation/decision-tree.md` |
| Project Nav | `.agents/documentation/project-nav.md` |
| Codebase Summary | `.agents/documentation/codebase-summary.md` |
| Code Style Guidelines | `.agents/documentation/code_style_guidelines.md` |
| CSS/Theming Guide | `.agents/documentation/css-style-guide.md` |
