# Agent Smith UI — Project Navigation Map

> **Purpose**: Single-reference map for AI coding agents to understand, navigate, and modify the Agent Smith UI codebase.
> **See also**: `.agents/documentation/decision-tree.md` to find the right doc for your task.
> **See also**: `.agents/documentation/project-overview.md` for concise project overview.

---

## 1. Project Overview

| Module | Path | Purpose |
|--------|------|---------|
| `@agent-smith/ui` | `/workspace/` | Vue 3 dashboard for AI agent management with optional Node.js server binary |

---

## 2. Architecture Principles

| Principle | Detail | Key Files |
|-----------|--------|-----------|
| Component-Based Layout | App.vue orchestrates header, sidebar dispatch, and router-view | `src/App.vue`, `src/components/sidebars/SidebarsDispatch.vue` |
| Centralized Reactive State | Single state object via Vue `reactive()` + `@snowind/state` User class | `src/state.ts` |
| Service Layer Isolation | Modular services for API, history, notifications, streaming events | `src/services/*.ts` |
| Runtime Theme Switching | 14 SCSS themes switchable via CSS class on `<html>` element | `src/scss/*.scss` |
| Plugin Route Extension | Apps dynamically extend routes via server-side import | `src/apps/debate.js`, `src/bin/index.ts` |

---

## 3. Dependency Graph

```
@agent-smith/ui (Vue 3 + TypeScript)
├── @agent-smith/server — Backend HTTP/WebSocket server
├── @agent-smith/wscli — WebSocket client features
├── @agent-smith/types — Shared TypeScript types
├── primevue (4.5) — UI component library
├── vue-router (5.0) — Application routing
├── @snowind/state — Reactive state management
├── @vueuse/core — Vue utilities (useStorage)
├── restmix — REST API client
├── markstream-vue — Streaming markdown renderer
├── stream-monaco — Streaming code editor
└── @agent-smith/app-debate — Example plugin app
```

**Prose**: The UI layer depends on `@agent-smith/server` for backend communication and `@agent-smith/wscli` for real-time WebSocket features. State management uses a centralized reactive store with optional persistence via `useStorage()`. Plugins extend the application dynamically through server-side imports.

---

## 4. Packages/Modules

### src/main.ts — Vue App Bootstrap
- **Purpose**: Initialize PrimeVue Aura theme, router, toast/confirmation services
- **Key imports**: `App.vue`, `src/router.ts`, PrimeVue, CSS themes

### src/App.vue — Root Layout
- **Purpose**: Orchestrate header, sidebar dispatch, router-view, toast/confirmation dialogs
- **Key components**: `TheHeader`, `SidebarsDispatch`, `<router-view>`

### src/router.ts — Application Routing
- **Purpose**: Define 9 routes for home, config, init, workflow, app, task run/view, agent run/view
- **Key patterns**: Route meta with sidebar association

### src/state.ts — Central Reactive State
- **Purpose**: Manage agent state, models, backends, workspaces, UI preferences
- **Key types**: `AgentState`, `User` (from `@snowind/state`)
- **Persistence**: UI preferences via `useStorage()` from `@vueuse/core`

### src/views/ — Page Components
- **Purpose**: Top-level page components for each route
- **Components**: HomeView, ConfigView, ConfigInitView, AppView, WorkflowView, TaskRunView, TaskViewView

### src/components/ — Core UI Components
- **Purpose**: Reusable UI components (16 components total)
- **Key components**: AgentParamsPicker, InferenceParamsForm, SamplingPresets, TaskTools, ViewAgent, TheHeader
- **Subdirectories**: `sidebars/` (7 sidebars), `navbars/` (2 toolbars), `vibe/toast/` (toast system)

### src/widgets/ — Reusable Widgets
- **Purpose**: Small reusable UI elements
- **Components**: ToolCallDetails, AutoTextarea, LoadingSpinner, HistoryTurnStatsBar, TurnTitle
- **Subdirectory**: `icons/` (32 icon components with `*Icon.vue` suffix)

### src/services/ — Service Layer
- **Purpose**: Isolated concerns for API, history, notifications, streaming
- **Services**: api, history, notify, task_events, perf, stats, str, template
- **Key patterns**: task_events handles real-time streaming with markdown parsing (~20 parses/sec)

### src/scss/ — Theme System
- **Purpose**: 14 SCSS themes with CSS custom properties for runtime switching
- **Themes**: airy-soft, black, cloud, default, forest, graphite, navy, pearl, royal, sandstone, slate, stone, teal, main
- **Default**: bluestar (referenced in conf.ts)

### src/bin/index.ts — Server Binary
- **Purpose**: Node.js HTTP server (`lmui`) with static asset serving and dynamic route loading
- **Key patterns**: Server-side import for plugin apps

### src/apps/ — Plugin Applications
- **Purpose**: Dynamically extend routes via server-side import
- **Example**: `debate.js` demonstrates the plugin pattern

---

## 5. UI/Frontend

### Component Architecture
- **Framework**: Vue 3 with Composition API and `<script setup>`
- **Component Style**: PascalCase naming (`TheHeader.vue`, `SidebarAgents.vue`)
- **Icon Style**: `*Icon.vue` suffix (32 icons in `src/widgets/icons/`)
- **Path Alias**: `@/` for `src/` directory imports

### State Management
- **Pattern**: Centralized reactive state with optional persistence
- **Implementation**: Vue `reactive()` + `@snowind/state` User class
- **Persistence**: `useStorage()` from `@vueuse/core` for UI preferences

### Theme System
- **Mechanism**: CSS class toggling on `<html>` element (`theme-<name>`)
- **Implementation**: SCSS files with CSS custom properties
- **Count**: 14 themes available at runtime

### Routing
- **Library**: vue-router (5.0)
- **Routes**: 9 total (home, config, init, workflow, app, task run/view, agent run/view)
- **Pattern**: Route meta with sidebar association for dynamic sidebar loading

---

## 6. Apps/Extensions

| App | Category | Purpose | Key File(s) |
|-----|----------|---------|-------------|
| `@agent-smith/app-debate` | Plugin | Debate application demonstrating route extension pattern | `src/apps/debate.js` |

---

## 7. Code Snippets

### Accessing central state
```typescript
import { useStore } from '@/state'
const store = useStore()
store.agentState = newState // reactive update triggers UI re-render
```

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

### Theme switching at runtime
```vue
<button @click="$el.classList.toggle('theme-navy')">Navy</button>
```

### WebSocket communication pattern
```typescript
import { useClientFeatures } from '@agent-smith/wscli'
const { send, onMessage } = useClientFeatures()
send({ type: 'task_run', id: taskId })
```

### Plugin app structure (debate example)
```javascript
// src/apps/debate.js
export default {
  name: 'debate',
  routes: [
    { path: '/debate', component: DebateView }
  ]
}
```

---

## 8. Navigation Quick Reference

| Task | Go To |
|------|-------|
| Add a new page/view | `src/views/` + update `src/router.ts` |
| Modify agent configuration UI | `src/components/AgentParamsPicker.vue` + `src/state.ts` |
| Change theme colors | `src/scss/<theme>.scss` files |
| Add WebSocket communication | `@agent-smith/wscli` → `useClientFeatures()` composable |
| Create a new sidebar component | `src/components/sidebars/` + update `SidebarsDispatch.vue` |
| Build and run locally | `npm run dev` (Vite) or `npm run build && npm run local` |
| Add a new plugin app | Follow pattern in `src/apps/debate.js` |
| Modify streaming task output | `src/services/task_events.ts` + `src/views/TaskRunView.vue` |
| Update inference parameters | `src/components/InferenceParamsForm.vue` + `src/conf.ts` |
| Manage backend connections | `src/components/ManageBackends.vue` + `src/services/api.ts` |

---

## 9. Documentation Links

| Resource | Path |
|----------|------|
| Decision Tree | `.agents/documentation/decision-tree.md` |
| Project Overview | `.agents/documentation/project-overview.md` |
| Codebase Summary | `.agents/documentation/codebase-summary.md` |
| Code Style Guidelines | `.agents/documentation/code_style_guidelines.md` |
| CSS/Theming Guide | `.agents/documentation/css-style-guide.md` |
| AGENTS.md (Root) | `AGENTS.md` |

---

## 10. Key Conventions & Patterns

| Convention | Detail |
|------------|--------|
| Vue 3 Composition API | Use `<script setup>` where possible |
| TypeScript Import Extension | Always use `.js` extension for relative TS imports |
| Path Alias | Use `@/` for `src/` directory imports |
| Component Naming | PascalCase for SFCs, `*Icon.vue` suffix for icons |
| State Management | Centralized reactive state in `src/state.ts` |
| Theme Switching | CSS class toggling on `<html>` element |
| Import Order | third-party → relative (grouped by directory) → global |
| Build Process | `vite build` for app, `tsc -p tsconfig_bin.json` for server binary |
| Plugin Pattern | Server-side import for dynamic route extension |
