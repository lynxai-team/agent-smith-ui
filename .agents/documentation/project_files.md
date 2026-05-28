# Agent Smith - Project Files

## Directory Structure

```
/app/src
├── App.vue
├── apps
│   ├── debate.ORI.js
│   └── debate.js -> ../../../agent-smith-apps/debate/src/main.ts
├── assets
│   ├── index.css
│   ├── logo.png
│   └── markstream.css
├── bin
│   └── index.ts
├── components
│   ├── ManageBackends.vue
│   ├── ModelsPicker.vue
│   ├── TaskTools.vue
│   ├── TheHeader.vue
│   ├── ThinkingContent.vue
│   ├── ThinkingNode.vue
│   ├── ToolCallNode.vue
│   ├── ViewConf.vue
│   ├── navbars
│   │   ├── NavbarTask.vue
│   │   └── PromptNavbarLeft.vue
│   ├── sidebars
│   │   ├── SidebarAgents.vue
│   │   ├── SidebarInferParams.vue
│   │   ├── SidebarTasks.vue
│   │   ├── SidebarWorkflows.vue
│   │   └── SidebarsDispatch.vue
│   └── vibe
│       └── toast
│           ├── SwToast.vue
│           ├── SwToastItem.vue
│           └── composable.ts
├── conf.ts
├── env.d.ts
├── interfaces.ts
├── main.ts
├── router.ts
├── scss
│   ├── black.scss
│   ├── bluestar.scss
│   ├── brown.scss
│   ├── default.scss
│   ├── lime-black.scss
│   ├── main.scss
│   └── pink-black.scss
├── services
│   ├── api.ts
│   ├── notify.ts
│   ├── perf.ts
│   ├── str.ts
│   └── task_events.ts
├── state.ts
├── utils.ts
├── views
│   ├── AppView.vue
│   ├── ConfigInitView.vue
│   ├── ConfigView.vue
│   ├── HomeView.vue
│   ├── TaskRunView.vue
│   ├── TaskViewView.vue
│   └── WorkflowView.vue
└── widgets
    ├── AutoTextarea.vue
    ├── FormatedToolCall.vue
    └── icons
        ├── AgentIcon.vue
        ├── AppsIcon.vue
        ├── ArgumentIcon.vue
        ├── BackendIcon.vue
        ├── MarkdownIcon.vue
        ├── McpIcon.vue
        ├── NoScrollIcon.vue
        ├── ScrollIcon.vue
        ├── TaskIcon.vue
        ├── TextFormatIcon.vue
        ├── TextIcon.vue
        ├── ToolsIcon.vue
        ├── UserEditIcon.vue
        └── WorkflowIcon.vue
```

## File Descriptions

### Root Files

| File | Description |
|------|-------------|
| `App.vue` | Root Vue component; wraps the entire app with theme provider, header, sidebars, and view router |
| `conf.ts` | Default inference parameters (temperature, top_k, top_p, etc.) |
| `env.d.ts` | TypeScript declarations for Vite client and `.vue` file imports |
| `interfaces.ts` | Shared TypeScript interfaces and types (SidebarType, UiTaskView, NotificationMsg, etc.) |
| `main.ts` | Application entry point; creates Vue app, registers PrimeVue, and mounts to DOM |
| `router.ts` | Vue Router configuration with route definitions for Home, App, Workflow, Task views |
| `state.ts` | Global reactive state management using `@snowind/state` and Vue `reactive`/`ref` |
| `utils.ts` | Utility functions including `createAwaiter` promise helper |

### `apps/`

| File | Description |
|------|-------------|
| `debate.ORI.js` | Original debate app module; exports AppComponent and AppSidebar from `@agent-smith/app-debate` |
| `debate.js` | Symlink pointing to `../../../agent-smith-apps/debate/src/main.ts` |

### `assets/`

| File | Description |
|------|-------------|
| `index.css` | Tailwind CSS base, components, and utilities imports |
| `logo.png` | Application logo image |
| `markstream.css` | Custom CSS for markstream-vue markdown rendering component |

### `bin/`

| File | Description |
|------|-------------|
| `index.ts` | CLI entry point; runs the Node.js server and sets up app routes |

### `components/`

| File | Description |
|------|-------------|
| `ManageBackends.vue` | UI for managing and switching between AI backends |
| `ModelsPicker.vue` | Model selection picker component with listbox and confirmation view |
| `TaskTools.vue` | Displays available tools for a task |
| `TheHeader.vue` | Top header bar with branding, navigation, and responsive breakpoints |
| `ThinkingContent.vue` | Renders thinking/reasoning content blocks with toggle visibility |
| `ThinkingNode.vue` | Renders a thinking step node with expand/collapse functionality |
| `ToolCallNode.vue` | Renders a tool call execution node with markdown rendering |
| `ViewConf.vue` | Configuration viewer showing features and folder settings |

#### `components/navbars/`

| File | Description |
|------|-------------|
| `NavbarTask.vue` | Task navbar with View/Run toggle buttons |
| `PromptNavbarLeft.vue` | Left-side prompt navbar with scroll toggle buttons |

#### `components/sidebars/`

| File | Description |
|------|-------------|
| `SidebarAgents.vue` | Sidebar displaying agents in a filterable tree view |
| `SidebarInferParams.vue` | Sidebar for configuring inference parameters (temperature, top_k, etc.) |
| `SidebarTasks.vue` | Sidebar displaying tasks in a filterable tree view |
| `SidebarWorkflows.vue` | Sidebar listing workflows as clickable buttons |
| `SidebarsDispatch.vue` | Sidebar dispatch component that switches between agents, tasks, workflows, tools, and MCP |

#### `components/vibe/toast/`

| File | Description |
|------|-------------|
| `SwToast.vue` | Toast notification container positioned at bottom-center |
| `SwToastItem.vue` | Individual toast notification item with animation |
| `composable.ts` | Toast composable (`useToast`) for adding success/error/warning/info messages |

### `scss/`

| File | Description |
|------|-------------|
| `black.scss` | Black theme CSS variables |
| `bluestar.scss` | Blue Star theme CSS variables |
| `brown.scss` | Brown theme CSS variables |
| `default.scss` | Default theme CSS variables (cyan/teal primary colors) |
| `lime-black.scss` | Lime Black theme CSS variables |
| `main.scss` | Main SCSS file that imports all theme stylesheets |
| `pink-black.scss` | Pink Black theme CSS variables |

### `services/`

| File | Description |
|------|-------------|
| `api.ts` | API client setup using `restmix` with server URL configuration |
| `notify.ts` | Notification helpers wrapping PrimeVue Toast and Confirm services |
| `perf.ts` | Inference performance timer tracking tokens/second (TPS) |
| `str.ts` | String utility functions (`humanize`, `humanizeNumber`) |
| `task_events.ts` | Task event processing including markdown parsing and history turn handling |

### `views/`

| File | Description |
|------|-------------|
| `AppView.vue` | Main app view; dynamically renders sidebar components based on current sidebar state |
| `ConfigInitView.vue` | Initial setup wizard; create config or load existing config |
| `ConfigView.vue` | Configuration management view for app settings |
| `HomeView.vue` | Home page; handles URL query params and redirects |
| `TaskRunView.vue` | Task execution view showing live inference output and history |
| `TaskViewView.vue` | Task detail view with file/tab-based interface |
| `WorkflowView.vue` | Workflow view displaying workflow information |

### `widgets/`

| File | Description |
|------|-------------|
| `AutoTextarea.vue` | Auto-resizing textarea component |
| `FormatedToolCall.vue` | Formatted display of tool calls with icon, source, and result |

#### `widgets/icons/`

| File | Description |
|------|-------------|
| `AgentIcon.vue` | SVG icon for agents |
| `AppsIcon.vue` | SVG icon for apps |
| `ArgumentIcon.vue` | SVG icon for arguments |
| `BackendIcon.vue` | SVG icon for backends |
| `MarkdownIcon.vue` | SVG icon for markdown |
| `McpIcon.vue` | SVG icon for MCP (Model Context Protocol) |
| `NoScrollIcon.vue` | SVG icon indicating no-scroll mode |
| `ScrollIcon.vue` | SVG icon for scroll mode |
| `TaskIcon.vue` | SVG icon for tasks |
| `TextFormatIcon.vue` | SVG icon for text formatting |
| `TextIcon.vue` | SVG icon for text |
| `ToolsIcon.vue` | SVG icon for tools |
| `UserEditIcon.vue` | SVG icon for user edit |
| `WorkflowIcon.vue` | SVG icon for workflows |
