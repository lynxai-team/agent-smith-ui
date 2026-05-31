# @agent-smith/ui

## Summary
A web-based dashboard for managing AI agents, workflows, tasks, and model configurations with a Vue 3 frontend and optional Node.js server binary.

## Dependencies
- `@agent-smith/server` — Backend server integration and base routes
- `@agent-smith/wscli` — WebSocket client features for server communication
- `@agent-smith/types` — Shared TypeScript types (AgentState, HistoryTurn, etc.)
- `primevue` (4.5) — UI component library with Aura theme
- `vue-router` (5.0) — Application routing
- `@snowind/state` — Reactive state management (User class)
- `@vueuse/core` — Vue utilities (useStorage for persisted UI preferences)
- External: `tailwindcss` (3.4), `sass`, `vite` (8), `unplugin-icons`, `markstream-vue`, `mermaid`, `highlight.js`, `stream-monaco`

## Used By
- End users — Interact with Agent Smith AI framework through the dashboard
- App plugins (e.g., `@agent-smith/app-debate`) — Extend routes and components dynamically

## Entry Point
- `src/main.ts` — Vue application bootstrap: initializes PrimeVue, router, toast/confirmation services, mounts App component
- `src/bin/index.ts` — Node.js server entry point: launches HTTP server with base routes and optional app routes, serves static frontend assets

## Key Files
| File | Purpose |
|------|---------|
| `src/main.ts` | Vue app initialization with PrimeVue Aura theme and services |
| `src/App.vue` | Root layout component: header, sidebar dispatch, router-view, toast/confirmation dialogs |
| `src/state.ts` | Central reactive state management: agent state, models, backends, workspaces, UI preferences (persisted via @vueuse/core) |
| `src/router.ts` | Route definitions: home, config, init, workflow, app, task run/view, agent run/view |
| `src/bin/index.ts` | Server binary launcher with static asset serving and dynamic route loading |
| `src/views/*.vue` | Page components: HomeView, ConfigView, ConfigInitView, AppView, WorkflowView, TaskRunView, TaskViewView |
| `src/components/sidebars/*.vue` | Sidebar navigation: tasks, agents, workflows, inference params, dispatch controller |
| `src/services/api.ts` | REST API client using restmix library |
| `src/services/history.ts` | Conversation turn management and tool call tracking |
| `src/services/task_events.ts` | Real-time task event handling |
| `src/scss/*.scss` | Six SCSS themes (default: bluestar) with CSS custom properties for runtime switching |

## Architecture
- **Component-Based Layout**: App.vue orchestrates TheHeader, SidebarsDispatch (collapsible sidebar system), and router-view with responsive fixed positioning
- **Centralized Reactive State**: Single `state` object (AgentState) managed via Vue reactive/@snowind/state User class; UI preferences persisted separately via useStorage
- **Service Layer**: Modular services (api, history, notify, task_events, perf, stats, str) provide isolated concerns for API calls, event handling, and utilities
- **Plugin System**: App modules in `src/apps/` can dynamically extend routes via server-side import; debate app demonstrates plugin pattern

## Related
- See `@agent-smith/server` — Provides backend HTTP/WebSocket server with base routes
- See `@agent-smith/wscli` — Supplies client-side WebSocket features for real-time communication
- See `@agent-smith/app-debate` — Example plugin demonstrating route extension pattern
