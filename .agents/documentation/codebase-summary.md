# Agent Smith UI - Codebase Summary

## Project Summary
Agent Smith UI is a web-based user interface for [Agent Smith](https://github.com/synw/agent-smith), an AI agent framework. It provides a comprehensive dashboard for managing AI agents, workflows, tasks, and model configurations. The application is built with Vue 3, TypeScript, and PrimeVue components, with a Vite build system.

## File Structure

```
/workspace
├── index.html                    # Main HTML entry point
├── package.json                  # Project dependencies and scripts
├── README.md                     # Installation and usage documentation
├── vite.config.mts               # Vite configuration with Vue and icon plugins
├── tsconfig.json                 # TypeScript configuration
├── tsconfig_bin.json             # TypeScript config for binary/server build
├── tailwind.config.cjs           # Tailwind CSS configuration
├── postcss.config.cjs            # PostCSS configuration
├── LICENSE                       # License file
├── public/                       # Static assets
│   ├── img/                      # Logo images (various sizes)
│   └── favicon.ico
├── src/
│   ├── main.ts                   # Application entry point
│   ├── App.vue                   # Root Vue component
│   ├── router.ts                 # Vue Router configuration
│   ├── state.ts                  # Global reactive state management
│   ├── conf.ts                   # Configuration defaults (inference params)
│   ├── interfaces.ts             # TypeScript interfaces and types
│   ├── utils.ts                  # Utility functions
│   ├── assets/                   # Static assets (CSS, images)
│   │   ├── index.css
│   │   ├── markstream.css
│   │   └── logo.png
│   ├── scss/                     # SCSS theme files
│   │   ├── main.scss
│   │   ├── default.scss
│   │   ├── bluestar.scss
│   │   ├── brown.scss
│   │   ├── pink-black.scss
│   │   ├── lime-black.scss
│   │   └── black.scss
│   ├── views/                    # Main page components
│   │   ├── HomeView.vue          # Landing/home page
│   │   ├── ConfigView.vue        # Configuration management
│   │   ├── ConfigInitView.vue    # Initial setup wizard
│   │   ├── AppView.vue           # Application runner view
│   │   ├── WorkflowView.vue      # Workflow execution view
│   │   ├── TaskRunView.vue       # Task execution view
│   │   └── TaskViewView.vue      # Task history/view page
│   ├── components/               # Reusable UI components
│   │   ├── TheHeader.vue         # Application header
│   │   ├── AgentParamsPicker.vue # Agent parameter selection
│   │   ├── InferenceParamsForm.vue # Model inference settings form
│   │   ├── ManageBackends.vue    # Backend server management
│   │   ├── SamplingPresets.vue   # Sampling preset management
│   │   ├── WorkspacePicker.vue   # Workspace selector
│   │   ├── TaskTools.vue         # Task tools panel
│   │   ├── ViewConf.vue          # Configuration viewer
│   │   ├── PromptProcessingProgress.vue # Progress indicator
│   │   ├── ThinkingNode.vue      # AI thinking process display
│   │   ├── ThinkingContent.vue   # Thinking content renderer
│   │   ├── ToolCallNode.vue      # Tool call visualization
│   │   ├── FormatedToolCallInProgress.vue # In-progress tool calls
│   │   ├── navbars/              # Navigation bar components
│   │   │   ├── PromptNavbarLeft.vue
│   │   │   └── NavbarTask.vue
│   │   ├── sidebars/             # Sidebar components
│   │   │   ├── SidebarTasks.vue
│   │   │   ├── SidebarAgents.vue
│   │   │   ├── SidebarWorkflows.vue
│   │   │   ├── SidebarInferParams.vue
│   │   │   └── SidebarsDispatch.vue
│   │   └── vibe/toast/           # Toast notification system
│   │       ├── SwToast.vue
│   │       ├── SwToastItem.vue
│   │       └── composable.ts
│   ├── widgets/                  # Small reusable widgets
│   │   ├── AutoTextarea.vue
│   │   ├── FormatedToolCall.vue
│   │   ├── HistoryTurnStatsBar.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── ToolCallDetails.vue
│   │   ├── TurnTitle.vue
│   │   └── icons/                # Icon components
│   ├── services/                 # Service modules
│   │   ├── api.ts                # REST API client (restmix)
│   │   ├── history.ts            # UI history management
│   │   ├── notify.ts             # Notification service
│   │   ├── perf.ts               # Performance monitoring
│   │   ├── stats.ts              # Statistics tracking
│   │   ├── str.ts                # String utilities
│   │   └── task_events.ts        # Task event handling
│   ├── bin/                      # Server binary entry point
│   │   └── index.ts              # Node.js server launcher
│   └── apps/                     # Plugin applications
│       ├── debate.ORI.js         # Debate app routes (original)
│       └── debate.js             # Debate app routes
├── dist/                         # Build output directory
│   ├── index.html
│   ├── assets/                   # Bundled JS/CSS assets
│   ├── img/                      # Optimized images
│   ├── favicon.ico
│   └── apps/                     # Built app modules
├── scripts/
│   └── installapp.js             # App installation script
└── components.d.ts               # Auto-generated component declarations
```

## Key File Descriptions

### Core Files
- **src/main.ts**: Vue application bootstrap, initializes PrimeVue with Aura theme, router, and toast services
- **src/App.vue**: Root component managing layout with header, sidebars, router-view, and theme switching
- **src/router.ts**: Defines all application routes including home, config, workflows, apps, tasks, and agents
- **src/state.ts**: Central reactive state management using Vue's reactive/ref and @snowind/state User class. Manages agent state, models, backends, workspaces, settings, and UI preferences

### Views
- **HomeView.vue**: Landing page displayed when no configuration exists
- **ConfigView.vue**: Configuration management interface
- **ConfigInitView.vue**: Initial setup wizard for fresh installations
- **AppView.vue**: Runs configured AI applications
- **WorkflowView.vue**: Executes and monitors workflows
- **TaskRunView.vue**: Runs individual tasks or agents
- **TaskViewView.vue**: Views task history and results

### State Management
The application uses a centralized state pattern with:
- `state`: Reactive AgentState object holding all runtime data
- `uistate`: Persisted UI preferences using @vueuse/core useStorage
- `history`: UI history management via custom composable
- `srv`: Client features from @agent-smith/wscli for server communication

### Services
- **api.ts**: REST API client configured with restmix library
- **history.ts**: Manages conversation turns, tool calls, and inference statistics
- **notify.ts**: Toast notification system
- **task_events.ts**: Handles real-time task events

## Architecture & Patterns

### CSS & Styling

The project uses Tailwind CSS 3.4 with semantic color utilities via `tailwindcss-semantic-colors` plugin. Six SCSS themes define CSS custom properties for runtime theme switching (default: `bluestar`).

**Semantic Color Classes** - Each supports light/dark mode automatically:

| Utility | Background | Text | Border |
|---------|-----------|------|--------|
| **primary** | `block-primary` | `txt-primary` | `bord-primary` |
| **secondary** | `block-secondary` | `txt-secondary` | `bord-secondary` |
| **background** | `block-background` | `txt-background` | `bord-background` |
| **foreground** | `block-foreground` | `txt-foreground` | `bord-foreground` |
| **light** | `block-light` | `txt-light` | `bord-light` |
| **lighter** | `block-lighter` | `txt-lighter` | `bord-lighter` |
| **semilight** | `block-semilight` | `txt-semilight` | `bord-semilight` |
| **secondary-strong** | `block-secondary-strong` | `txt-secondary-strong` | `bord-secondary-strong` |
| **accent** | `block-accent` | `txt-accent` | `bord-accent` |

**Usage:** Full color class applies both bg and text (e.g., `class="primary"` = `bg-[var(--primary-light-bg)] dark:bg-[var(--primary-dark-bg)] text-[var(--primary-light-txt)] dark:text-[var(--primary-dark-txt)]`). Variants enabled: hover, focus.

**Snowind Components:** `sw-topbar` (header), `sw-sidebar` (collapsible), `sw-switch` (toggle with `.switch-{color}` variants), `.slide-y`/`.slidedown`/`.slideup` (animation utilities), `.btn` (standardized button).

### Technology Stack
- **Frontend Framework**: Vue 3.5 with Composition API and TypeScript
- **UI Library**: PrimeVue 4.5 with Aura theme
- **Styling**: Tailwind CSS 3.4 with SCSS preprocessing
- **Build Tool**: Vite 8
- **Routing**: Vue Router 5
- **Icons**: unplugin-icons with Iconify

### Architectural Patterns
1. **Component-Based Architecture**: Hierarchical Vue components with clear separation of concerns
2. **Centralized State**: Reactive state management with clear data flow
3. **Service Layer**: Modular services for API, history, notifications, and utilities
4. **Plugin System**: App plugins (like debate) can extend routes and components
5. **Theme System**: Multiple SCSS themes with runtime switching capability
6. **Sidebar Navigation**: Dispatch-based sidebar system for tasks, agents, workflows

### Key Dependencies
- `@agent-smith/server`: Backend server integration
- `@agent-smith/wscli`: WebSocket client features
- `@agent-smith/types`: Shared TypeScript types
- `markstream-vue`: Markdown streaming display
- `mermaid`: Diagram rendering
- `highlight.js`: Code syntax highlighting
- `vuecodit`: Code editing capabilities
- `stream-monaco`: Monaco editor integration

### Build Process
1. Vite builds the Vue application
2. App modules are copied to dist/apps/
3. Assets are compressed with gzipper (brotli compression)
4. TypeScript compiles the server binary (tsconfig_bin.json)
5. Binary is exposed as `lmui` command
