# @agent-smith/ui

## Summary
A Vue 3 web dashboard for managing AI agents, workflows, tasks, and model configurations, with an optional Node.js server binary (`lmui`) that serves the frontend and bridges to the Agent Smith backend.

## Dependencies
- `@agent-smith/server` — Backend server integration and base routes
- `@agent-smith/wscli` — WebSocket client features for server communication
- `@agent-smith/types` — Shared TypeScript types (AgentState, HistoryTurn, etc.)
- `primevue` (4.5) — UI component library with Aura theme
- `vue-router` (5.0) — Application routing
- `@snowind/state` — Reactive state management (User class)
- `@vueuse/core` — Vue utilities (useStorage for persisted UI preferences)
- `restmix` — REST API client for server communication
- `markstream-vue` — Streaming markdown renderer for agent output
- `stream-monaco` — Streaming code editor integration
- `mermaid` — Diagram/chart rendering in agent responses
- `highlight.js` — Syntax highlighting for code blocks
- `yaml` — YAML parsing for config files
- `modprompt` — Prompt processing utilities
- `vuecodit` — Code editor component
- `@snowind/header` — Header component
- `@snowind/plugin` — Plugin system integration
- `@snowind/switch` — Theme switch component
- `tailwindcss-primeui` — PrimeUI Tailwind CSS integration
- `primeicons` — Icon font library
- `@primeuix/themes` — PrimeVue theme system
- `@fontsource/roboto` — Roboto font
- External: `tailwindcss` (4.3), `sass`, `vite` (8), `unplugin-icons`

## Used By
- End users — Primary interface for Agent Smith AI framework
- `@agent-smith/server` — Serves built frontend assets via `lmui` binary
- App plugins (e.g., `@agent-smith/app-debate`) — Extend routes and components dynamically

## Entry Point
- `src/main.ts` — Vue app bootstrap: PrimeVue Aura theme, router, toast/confirmation services, mounts App component
- `src/bin/index.ts` — Node.js server entry (`lmui`): launches HTTP server with base routes, serves static frontend assets

## Key Files
| File | Purpose |
|------|---------|
| `src/main.ts` | Vue app initialization with PrimeVue Aura theme and services |
| `src/App.vue` | Root layout: header, sidebar dispatch, router-view, toast/confirmation dialogs |
| `src/state.ts` | Central reactive state: agent state, models, backends, workspaces, UI preferences (persisted via useStorage) |
| `src/router.ts` | 9 routes: home, config, init, workflow, app, task run/view, agent run/view |
| `src/bin/index.ts` | Server binary with static asset serving and dynamic route loading |
| `src/conf.ts` | Default inference params, available plugins list, theme definitions |
| `src/utils.ts` | Utility functions: createAwaiter, transformTasksData |
| `src/interfaces.ts` | Type definitions: SidebarType, UiTaskView, NotificationMsg |
| `src/views/*.vue` | Page components: HomeView, ConfigView, ConfigInitView, AppView, WorkflowView, TaskRunView, TaskViewView |
| `src/components/sidebars/*.vue` | Sidebar navigation: tasks, agents, workflows, inference params, dispatch |
| `src/components/navbars/*.vue` | Prompt input toolbars (PromptNavbarLeft, NavbarTask) |
| `src/components/*.vue` | Core UI: TheHeader, tool call rendering, thinking nodes, settings, backend management |
| `src/components/vibe/toast/*` | Toast notification system (SwToast, SwToastItem, composable) |
| `src/widgets/icons/*.vue` | 30+ icon components (PascalCase + Icon suffix) |
| `src/widgets/*.vue` | Reusable widgets: ToolCallDetails, AutoTextarea, LoadingSpinner, HistoryTurnStatsBar, TurnTitle |
| `src/services/api.ts` | REST API client via restmix library |
| `src/services/history.ts` | Conversation turn management and tool call tracking |
| `src/services/task_events.ts` | Real-time task event handling with streaming markdown parsing |
| `src/services/notify.ts` | Toast/confirmation notification service |
| `src/services/template.ts` | Prompt template application via server API |
| `src/services/str.ts` | String utilities: humanize, humanizeNumber, formatDuration |
| `src/services/perf.ts` | Inference performance timer (tokens/sec tracking) |
| `src/scss/*.scss` | 12+ SCSS themes (default: bluestar) with CSS custom properties for runtime switching |
| `src/apps/debate.js` | Debate app plugin demonstrating route extension pattern |

## Architecture
- **Component-Based Layout**: App.vue orchestrates TheHeader, SidebarsDispatch (collapsible sidebar system), and router-view with responsive fixed positioning
- **Centralized Reactive State**: Single `state` object (AgentState) managed via Vue `reactive()` + `@snowind/state` `User` class; UI preferences persisted separately via `@vueuse/core` `useStorage()`
- **Service Layer**: Modular services (api, history, notify, task_events, perf, stats, str, template) provide isolated concerns; task_events handles real-time streaming with markdown parsing at ~20 parses/sec
- **Theme System**: 12+ SCSS themes switchable at runtime via CSS class toggling on `<html>` element
- **Plugin System**: Apps in `src/apps/` dynamically extend routes via server-side import; debate app demonstrates the pattern

## Related
- See `@agent-smith/server` — Provides backend HTTP/WebSocket server with base routes
- See `@agent-smith/wscli` — Supplies client-side WebSocket features for real-time communication
- See `@agent-smith/app-debate` — Example plugin demonstrating route extension pattern
- See `@agent-smith/types` — Shared TypeScript type definitions used throughout the UI
