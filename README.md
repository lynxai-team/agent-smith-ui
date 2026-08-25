# Agent Smith UI

A **Vue 3 + TypeScript** web dashboard for managing AI agents, workflows, tasks, and model configurations. It provides a rich, interactive interface for configuring inference parameters, monitoring agent runs in real time, and managing backend connections. An optional Node.js server binary (`lmui`) serves the built frontend assets and bridges to the Agent Smith backend over HTTP and WebSocket.

Part of the [Agent Smith](https://github.com/lynxai-team/agent-smith) family of packages, published under the `@agent-smith/ui` npm scope.

---

## 🌟 Features

- 🤖 **Agent Management** — Configure agent parameters, browse agents by category, and view live agent runs
- 📋 **Task Monitoring** — Real-time task execution with streaming Markdown output and tool-call tracking
- 🔄 **Workflow Configuration** — Define and manage inference workflows with reusable sampling presets
- 🖥️ **Backend Management** — Register and switch inference backends (e.g. `llamacpp`, OpenAI-compatible endpoints)
- 🎨 **Theme System** — 12 runtime-switchable SCSS themes (`stone`, `black`, `navy`, `forest`, `slate`, `royal`, `teal`, `pearl`, `sandstone`, `cloud`, `graphite`, `airy-soft`)
- ⚙️ **Inference Tuning** — Configure sampling parameters (temperature, top_k, top_p, min_p, penalties) per run
- 🔌 **Plugin Architecture** — Dynamically extend routes and UI with server-side app imports (e.g. the debate app)
- 📡 **WebSocket Communication** — Real-time bidirectional sync with the backend via `@agent-smith/wscli`
- 🌓 **Dark/Light Mode** — Per-user theme preference persisted locally
- 💬 **Notifications** — Toast and confirmation dialogs built on PrimeVue

---

## 📚 Documentation

### For AI Agents
- [Codebase Summary](https://raw.githubusercontent.com/lynxai-team/agent-smith-ui/main/.agents/documentation/codebase-summary.md) — Structured technical summary of modules, architecture, and key files
- [Project Overview](https://raw.githubusercontent.com/lynxai-team/agent-smith-ui/main/.agents/documentation/project-overview.md) — Concise "what is this" (~1 page)
- [Project Navigation](https://raw.githubusercontent.com/lynxai-team/agent-smith-ui/main/.agents/documentation/project-nav.md) — Detailed navigation map with dependency graph
- [Decision Tree](https://raw.githubusercontent.com/lynxai-team/agent-smith-ui/main/.agents/documentation/decision-tree.md) — Quick guide: find the right doc for your task
- [Code Style Guidelines](https://raw.githubusercontent.com/lynxai-team/agent-smith-ui/main/.agents/documentation/code_style_guidelines.md) — UI code style conventions
- [CSS / Theming Guide](https://raw.githubusercontent.com/lynxai-team/agent-smith-ui/main/.agents/documentation/css-style-guide.md) — CSS/theming style guide

### For Humans
- [Quickstart](https://lynxai-team.github.io/agent-smith/frontend/quickstart) — Human-facing documentation start page

---

## 📦 Installation

`@agent-smith/ui` is a client + server package. Install it as a dependency and build the distributable assets:

```bash
# Install dependencies
npm install

# Build the frontend (Vite) and compile the Node.js server binary (tsc)
npm run build
```

> **Note:** This repository is marked `private` in `package.json`, so it is not published to the npm registry. Install it from the monorepo workspace or via a local path dependency (e.g. `file:../agent-smith-apps/...`).

---

## 🚀 Quick Start

Build once, then run either the development server or the compiled server binary.

```bash
# Development mode — Vite dev server
npm run dev

# Production server binary (dist/bin/index.js)
npm run build
npm run local
```

Once running, open the served URL and point the dashboard at an Agent Smith backend server (default API base is `http://localhost:5184/api`). On first launch with no configuration, the **Init** screen lets you create a `config.yml` file.

---

## 🧭 Usage

### Running the frontend

- **Development:** `npm run dev` starts Vite on the default port (`5173`).
- **Preview a build:** `npm run build && npm run preview`.
- **Local server:** `npm run local` runs the compiled `dist/bin/index.js` server.
- **Watch server in dev:** `npm run server` runs `src/bin/index.ts` through `ts-node`.

### Running the server binary (`lmui`)

The build produces a Node.js server binary (`lmui` → `dist/bin/index.js`). It serves the built static assets and registers the backend's base HTTP/WebSocket routes, so the dashboard can communicate with the Agent Smith backend.

### Adding a plugin app

Plugin apps live in `src/apps/` and dynamically extend the router via server-side import. Use the helper script to scaffold a new app, or create the file by hand:

```js
// src/apps/<app-name>.js
import { AppComponent, AppSidebar } from "@agent-smith/app-<app-name>";

export default { AppComponent, AppSidebar };
```

Then register the app in the configuration file under `apps` and add its `features` directory under `features` (see [Configuration](#configuration)).

---

## 🗂️ Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/main.ts` | Vue app bootstrap: PrimeVue Aura theme, router, toast/confirmation services, mounts `App` |
| `src/App.vue` | Root layout: header, collapsible sidebar dispatch, `router-view`, toast/confirmation dialogs |
| `src/router.ts` | Vue Router config — 9 routes (home, config, init, workflow, app, task run/view, agent run/view) |
| `src/state.ts` | Central reactive state: agent state, models, backends, workspaces, UI preferences (persisted via `useStorage`) |
| `src/conf.ts` | Default inference params, available plugins list, theme definitions |
| `src/interfaces.ts` | Shared type definitions (`SidebarType`, `UiTaskView`, `NotificationMsg`) |
| `src/utils.ts` | Utilities: `createAwaiter`, `transformTasksData` |
| `src/views/*.vue` | Page components: `HomeView`, `ConfigView`, `ConfigInitView`, `AppView`, `WorkflowView`, `TaskRunView`, `TaskViewView` |
| `src/components/sidebars/*.vue` | Sidebar navigation: tasks, agents, workflows, inference params, right dispatch |
| `src/components/navbars/*.vue` | Prompt-input toolbars (`PromptNavbarLeft`, `NavbarTask`) |
| `src/components/*.vue` | Core UI: `TheHeader`, tool-call rendering, thinking nodes, settings, backend management |
| `src/widgets/icons/*.vue` | 32 icon components (PascalCase + `Icon` suffix) |
| `src/widgets/*.vue` | Reusable widgets: `ToolCallDetails`, `AutoTextarea`, `LoadingSpinner`, `HistoryTurnStatsBar`, `TurnTitle` |
| `src/services/*.ts` | Service layer: `api`, `history`, `task_events`, `notify`, `perf`, `str`, `template` |
| `src/scss/*.scss` | 12 SCSS themes with CSS custom properties for runtime switching |
| `src/apps/*.js` | Plugin apps — dynamically extend routes via server-side import |
| `src/bin/index.ts` | Node.js server entry point (`lmui`): HTTP server with static asset serving |
| `scripts/installapp.js` | Scaffolds a new plugin app, config, and feature directory |

---

## ⚙️ Configuration

Configuration is stored in a YAML file (default `config.yml`), created on first launch by the **Init** flow.

### Backend configuration

```yaml
backends:
  default: "llamacpp"
  local: ["llamacpp"]
  llamacpp_oai:
    type: "openai"
    url: "http://localhost:8080/v1"
promptfile: ""
```

- **`default`** — name of the backend used by default.
- **`local`** — list of backend names to load.
- Backends of type `openai` are **not** auto-loaded; other types are loaded from the server.

### Apps and features

```yaml
apps:
  debate: "@agent-smith/app-debate"
features:
  - /path/to/features
```

- **`apps`** — maps app name → plugin package (e.g. `@agent-smith/app-debate`).
- **`features`** — list of feature directories registered with the backend.

### Available plugins

`src/conf.ts` lists the plugin features the dashboard can enable:

| Plugin | Description |
|--------|-------------|
| `@agent-smith/feat-agents` | Agents and skills |
| `@agent-smith/feat-fs` | Filesystem tools and agents |
| `@agent-smith/feat-shell` | Sandboxed shell |
| `@agent-smith/feat-search` | Web search features |
| `@agent-smith/lynx-coder` | Lynx AI coding agents |

### Themes

`src/conf.ts` defines the 12 available themes: `stone`, `black`, `navy`, `forest`, `slate`, `royal`, `teal`, `pearl`, `sandstone`, `cloud`, `graphite`, `airy-soft`. The active theme is stored in `uistate.theme` and applied by toggling a `theme-<name>` class on the `<html>` element.

### Default inference parameters

`src/conf.ts` exports `defaultInferenceParams` (temperature, top_k, top_p, min_p, repeat_penalty, presence_penalty, frequency_penalty). These are merged into `inferOptions` and sent to the backend for each run.

---

## 🔌 API Reference

### Global state — `src/state.ts`

Central reactive state exported for use across components.

| Export | Type | Description |
|--------|------|-------------|
| `state` | `reactive<AgentState>` | Agent state (models, backends, workspaces, history, prompts, progress). Shape defined in `@agent-smith/types`. |
| `uistate` | `useStorage<UiState>` | Persisted UI preferences (sidebar, task view, theme, backend, last prompt, etc.). |
| `user` | `User` (`@snowind/state`) | Current user; exposes `toggleDarkMode()` and `isDarkMode`. |
| `conf` | `ref<ConfigFile>` | Resolved configuration file loaded from the backend. |
| `inferOptions` | `reactive<{ params, model, backend, ... }>` | Per-run inference options. |
| `srv` | `ClientFeaturesService` | WebSocket client features (`useClientFeatures`). |
| `initState()` | `Promise<void>` | Initializes config, loads backends/models, workspaces, and settings. |
| `setTheme(t?)` | `(t?: string) => void` | Switches the runtime theme by toggling the `theme-<name>` class on `<html>`. |
| `setCurrentFeature(name, type)` | `(name: string, type: string) => void` | Sets the currently active feature (agent/workflow). |
| `resetCurrentFeature()` | `() => void` | Clears the active feature and history. |
| `appSidebar` | `shallowRef` | Sidebar component bound by plugin apps. |

> The `AgentState`, `ConfigFile`, and other domain types are imported from `@agent-smith/types` and are not defined in this repository.

### Configuration constants — `src/conf.ts`

| Export | Description |
|--------|-------------|
| `defaultInferenceParams` | Default sampling/inference parameters for runs. |
| `availablePlugins` | List of plugin features the dashboard can enable. |
| `themes` | Array of the 12 available theme names. |

### Public types — `src/interfaces.ts`

| Export | Description |
|--------|-------------|
| `SidebarType` | `"tasks" \| "agents" \| "workflows" \| "tools" \| "mcp"` |
| `UiTaskView` | `"view" \| "run"` |
| `NotificationMsg` | `{ info, success, warn, error }` notification API |

### Utilities — `src/utils.ts`

| Export | Description |
|--------|-------------|
| `createAwaiter<T>()` | Creates a `{ awaiter, unblock, reject }` promise helper. |
| `transformTasksData(data)` | Builds a nested tree structure from a flat `Record<string, string>` map. |

### REST API client — `src/services/api.ts`

| Export | Description |
|--------|-------------|
| `api` | `useApi` instance from `restmix`, base URL `http://localhost:5184/api`. |

### Notification service — `src/services/notify.ts`

| Export | Description |
|--------|-------------|
| `msg` | `{ info, success, warn, error }` — PrimeVue toast notifications. |
| `initNotifyService()` | Initializes the toast and confirmation services. |
| `confirmSuccess(...)` / `confirmDanger(...)` | Confirmation dialogs with accept/reject handlers. |

### String / performance helpers

| Export | Description |
|--------|-------------|
| `humanize(name)` | Title-cases a kebab/snake name. |
| `humanizeNumber(num, trunc?)` | Formats numbers with `k`/`M`/`B`/`T` suffixes. |
| `formatDuration(ms)` | Formats milliseconds into `ms`/`s`/`mn`. |
| `useInferencePerfTimer()` | Composable returning `{ start, time, onToken, tps }` for token/sec tracking. |

### Routes — `src/router.ts`

| Path | View |
|------|------|
| `/` | `HomeView` |
| `/config` | `ConfigView` (config file editor + settings) |
| `/init` | `ConfigInitView` (first-run configuration) |
| `/workflow/:name` | `WorkflowView` |
| `/app/:name` | `AppView` (plugin app host) |
| `/task/:name` | `TaskRunView` (run a task) |
| `/task/view/:name` | `TaskViewView` (view a task) |
| `/agent/:name` | `TaskRunView` (run an agent) |
| `/agent/view/:name` | `TaskViewView` (view an agent) |

---

## ⚠️ Important Notes

- **Backend required** — The dashboard talks to an Agent Smith backend server. The REST client is configured against `http://localhost:5184/api`; without a reachable backend the app cannot load agents, models, or run tasks.
- **Two runtimes** — `@agent-smith/ui` is a browser frontend **and** a Node.js server (`lmui`). The frontend is built with Vite; the server binary is compiled with `tsc -p tsconfig_bin.json`.
- **Browser-only runtime** — Components run in the browser and rely on DOM APIs (`document`, `window`, `performance`). The server binary runs under Node.
- **Config-free styling** — Uses Tailwind 4 utility classes applied via CSS `@import`/`@reference`; there is no `tailwind.config` file.
- **Import conventions** — Vue SFCs use `<script setup>`, PascalCase component names, and relative TS imports must use the `.js` extension. Use the `@/` alias for `src/`.
- **Related packages** — Depends on `@agent-smith/server` (backend + base routes), `@agent-smith/wscli` (WebSocket features), and `@agent-smith/types` (shared types). See `@agent-smith/app-debate` for the plugin pattern.

---

## 📄 License

[MIT](LICENSE)
