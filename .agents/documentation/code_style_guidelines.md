# Agent Smith UI — Code Style Guidelines

> Auto-generated from the project's codebase analysis.

---

## Table of Contents

1. [File Naming Conventions](#1-file-naming-conventions)
2. [Import Conventions](#2-import-conventions)
3. [Vue Single-File Component (SFC) Structure](#3-vue-single-file-component-sfc-structure)
4. [TypeScript Patterns](#4-typescript-patterns)
5. [CSS / SCSS / Tailwind Conventions](#5-css--scss--tailwind-conventions)
6. [Naming Conventions](#6-naming-conventions)
7. [Error Handling](#7-error-handling)
8. [State Management](#8-state-management)
9. [Component Architecture](#9-component-architecture)
10. [Service Layer](#10-service-layer)
11. [Template Patterns](#11-template-patterns)
12. [Script Setup Patterns](#12-script-setup-patterns)
13. [General Principles](#13-general-principles)

---

## 1. File Naming Conventions

| File Type | Convention | Example |
|-----------|-----------|---------|
| Vue Components | `PascalCase.vue` | `TheHeader.vue`, `SidebarAgents.vue`, `SwToast.vue` |
| TypeScript Files | `camelCase.ts` | `utils.ts`, `state.ts`, `notify.ts` |
| SCSS Theme Files | `kebab-case.scss` | `bluestar.scss`, `black.scss`, `main.scss` |
| CSS Files | `kebab-case.css` | `index.css`, `markstream.css` |
| Composables | `camelCase.ts` | `composable.ts` |

**Directory naming:** `kebab-case` (e.g., `sidebars/`, `widgets/`, `components/`)

---

## 2. Import Conventions

### 2.1 Extension Requirement

**Always use `.js` extension for relative TypeScript imports**, even though the files are `.ts`:

```typescript
// ✅ Correct
import { initState, state, theme } from './state.js';
import { api } from '../services/api.js';
import { humanize } from '../services/str.js';

// ❌ Wrong
import { initState, state, theme } from './state';
import { api } from '../services/api';
```

### 2.2 Absolute Path Alias

Use `@/` to reference the `src/` directory:

```typescript
import TheHeader from "@/components/TheHeader.vue";
import { resetCurrentFeature, user, state, conf, uistate } from '@/state.js';
```

### 2.3 Import Order

1. **Third-party imports** (alphabetically)
2. **Relative imports** (grouped by directory)
3. **Global / polyfill imports**

```typescript
// Third-party
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Popover from 'primevue/popover';

// Relative
import { resetCurrentFeature, user, state, conf, uistate } from '@/state.js';
import { humanize } from '../services/str.js';
import NavbarTask from './navbars/NavbarTask.vue';
```

### 2.4 CSS/SCSS Imports

Import styles directly in the component or in `main.ts`:

```typescript
import 'primeicons/primeicons.css';
import 'markstream-vue/index.css';
```

---

## 3. Vue Single-File Component (SFC) Structure

### 3.1 Script Setup

Always use `<script setup lang="ts">` syntax:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
// ... component logic
</script>
```

### 3.2 Props Definition

Use TypeScript generics for typed props:

```typescript
const props = defineProps<{
    toolsDef: Array<{ def: ToolDefSpec, type: string }>,
    mcp: Record<string, any>,
    autoTools: Array<string>,
}>();
```

Or with runtime validators:

```typescript
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isAgent: {
    type: Boolean,
    default: false,
  }
});
```

### 3.3 Emits Definition

Use string-array syntax for emits:

```typescript
const emit = defineEmits(["end"]);
const emit = defineEmits(["pick", "close"]);
const emit = defineEmits(["update", "run"]);
```

### 3.4 Style Blocks

Support both SCSS and SASS syntax using `lang` attribute:

```vue
<style lang="scss">
@use "./scss/main.scss";
</style>

<style lang="sass">
.p-tree, .p-tree-filter-input
    background-color: transparent !important
    border-top: 0
.dark .p-tree-node-label
    color: white !important
</style>
```

---

## 4. TypeScript Patterns

### 4.1 Type Aliases vs Interfaces

- Use `type` for union types, tuple types, and simple aliases
- Use `interface` for object shapes that may be extended

```typescript
type SidebarType = "tasks" | "agents" | "workflows" | "tools" | "mcp";
type UiTaskView = "view" | "run";

interface NotificationMsg {
    info: (title: any, body: string, lifeTime?: number) => void;
    success: (title: string, body: string, lifeTime?: number) => void;
    warn: (title: string, body: string, lifeTime?: number) => void;
    error: (title: string, body: string, lifeTime?: number) => void;
}
```

### 4.2 Export Style

Use named exports grouped in a single `export` block:

```typescript
export {
    SidebarType,
    UiTaskView,
    NotificationMsg,
}
```

Or inline with `export` keyword:

```typescript
export {
    createAwaiter,
    transformTasksData,
}
```

### 4.3 Type Assertions

Use `as` for type assertions; avoid `<>` syntax:

```typescript
nodes.value = transformTasksData(ts) as Array<TreeNode>;
```

### 4.4 Optional Chaining

Use optional chaining (`?.`) extensively:

```typescript
if (q?.redirect) {
    url = q.redirect.toString();
}
if (t?.category) {
    ts[n] = t.category;
}
```

### 4.5 Type Imports

Use `import type` for type-only imports:

```typescript
import type { SidebarType, UiTaskView } from "./interfaces.js";
import type { ModelInfo, UiHistoryTurn, ConfigFile, TaskState } from "@agent-smith/types";
import type { ToolDefSpec } from '@agent-smith/types';
```

---

## 5. CSS / SCSS / Tailwind Conventions

### 5.1 Tailwind CSS Usage

Use Tailwind utility classes extensively in templates:

```html
<div class="flex flex-col space-y-3 mx-3">
    <div class="flex flex-row space-x-3 items-center btn hover:lighter w-fit">
        <div class="text-lg font-semibold">{{ tool.def.name }}</div>
        <div class="txt-semilight">{{ tool.type }}</div>
    </div>
</div>
```

### 5.2 Custom CSS Layers

Use `@layer` in CSS to manage specificity:

```css
@layer tailwind-base, primevue, tailwind-utilities;

@layer tailwind-base {
    @tailwind base;
}

@layer tailwind-utilities {
    @tailwind components;
    @tailwind utilities;
}
```

### 5.3 SCSS Theme Variables

Define themes using CSS custom properties:

```scss
.theme-bluestar {
    --primary-light-bg: #0e599a;
    --primary-light-txt: white;
    --secondary-light-bg: #dbecfe;
    --secondary-light-txt: #0e599a;
    --success-light-bg: #01DA97;
    --warning-light-bg: #FAC165;
    --danger-light-bg: #FE606C;
}
```

### 5.4 @apply Directive

Use `@apply` for reusing Tailwind classes in SCSS:

```sass
.p-inputtext, .p-overlaypanel-content
  @apply background bord-lighter
.p-confirmdialog-accept-button
  @apply success bord-success
.p-confirmdialog-reject-button
  @apply bord-danger danger p-3
```

### 5.5 Theme Switching

Apply theme via class on root element:

```html
<div class="h-full w-full" :class="`theme-${theme}`">
```

---

## 6. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Variables | `camelCase` | `showApps`, `backendCls`, `toolCallRequest` |
| Functions | `camelCase` | `toggleApps`, `goHome`, `initState` |
| Constants | `camelCase` | `defaultInferenceParams`, `baseTitle` |
| Component names | `PascalCase` | `TheHeader`, `SwToast`, `SidebarAgents` |
| CSS classes | `kebab-case` | `bord-lighter`, `txt-semilight`, `hover:lighter` |
| Ref variables | `camelCase` | `showApps`, `isReady`, `nodes` |
| State variables | `camelCase` | `state`, `uistate`, `inferOptions` |
| Composable functions | `camelCase` | `useTaskEvents`, `useToast`, `useInferencePerfTimer` |

**Note:** Constants use `camelCase` (not `UPPER_SNAKE_CASE`).

---

## 7. Error Handling

### 7.1 Toast Notifications

Use the centralized `msg` service for user-facing notifications:

```typescript
msg.error("Can not load models", "Check you backend server")
msg.success(`Default backend set to ${name}`, `The backend ${uistate.value.backend} is ready`)
msg.warn("title", "body", lifeTime = 5000)
msg.info("title", "body", lifeTime = 3000)
```

### 7.2 Confirmation Dialogs

Use `confirmSuccess` and `confirmDanger` for user confirmations:

```typescript
confirmDanger("Start a new conversation?", "Remove this conversation history and start a new one",
    async () => {
        state.history = [];
        stream.value = "";
    }
)
```

### 7.3 Try/Catch Blocks

Wrap async operations in try/catch:

```typescript
try {
    state.models = await srv.loadModels();
} catch (e) {
    msg.error("Can not load models", "Check you backend server")
}
```

### 7.4 Error Messages

Use descriptive error messages:

```typescript
throw new Error("no current turn")
throw new Error(`tool call id ${tc.id} not found in current turn: ${JSON.stringify(currentTurn)}`)
throw new Error("the timer has not started, can not end it")
```

---

## 8. State Management

### 8.1 Reactive State

Use Vue's `reactive`, `ref`, and `shallowRef`:

```typescript
const debugInference = ref(false);
const theme = ref("bluestar");
const appSidebar = shallowRef();
const state = reactive<TaskState>({ ... });
```

### 8.2 Persistent State

Use `useStorage` from VueUse for localStorage persistence:

```typescript
const uistate = useStorage<{
    sidebar: SidebarType,
    taskView: UiTaskView,
    autoscroll: boolean,
    viewMode: "text" | "markdown" | "raw",
    title: string,
    backend: string,
}>('uistate', {
    sidebar: "agents",
    taskView: "view",
    autoscroll: true,
    viewMode: "markdown",
    title: "",
    backend: "",
});
```

### 8.3 State Exports

Export state objects and their management functions:

```typescript
export {
    initState,
    resetCurrentFeature,
    state,
    theme,
    user,
    uistate,
    debugInference,
    conf,
    appSidebar,
    srv,
};
```

---

## 9. Component Architecture

### 9.1 Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── navbars/         # Navbar-specific components
│   ├── sidebars/        # Sidebar-specific components
│   └── vibe/            # Vibe-themed components (e.g., toast)
├── views/               # Route-level page components
├── widgets/             # Small reusable widgets
│   └── icons/           # Icon components
├── services/            # API, notification, utility services
├── scss/                # Theme SCSS files
├── assets/              # Static assets (CSS, images)
├── apps/                # App-specific modules
├── bin/                 # CLI/server entry points
├── main.ts              # Application entry point
├── App.vue              # Root component
├── router.ts            # Vue Router configuration
├── state.ts             # Global state management
├── interfaces.ts        # Shared type definitions
├── utils.ts             # Shared utility functions
└── conf.ts              # Configuration defaults
```

### 9.2 Component Hierarchy

- **Views** — Route-level components that compose multiple sub-components
- **Components** — Reusable UI building blocks
- **Widgets** — Small, focused components (icons, textareas)
- **Services** — Side-effect modules (API, notifications, utilities)

### 9.3 Icon Components

Icon components follow the pattern `<NameIcon.vue>`:

```
AgentIcon.vue
AppsIcon.vue
ArgumentIcon.vue
BackendIcon.vue
MarkdownIcon.vue
McpIcon.vue
NoScrollIcon.vue
ScrollIcon.vue
TaskIcon.vue
TextFormatIcon.vue
TextIcon.vue
ToolsIcon.vue
UserEditIcon.vue
WorkflowIcon.vue
```

---

## 10. Service Layer

### 10.1 API Service

Centralize API calls in a dedicated service:

```typescript
import { useApi } from 'restmix';

const api = useApi({
    serverUrl: "http://localhost:5184/api"
});

export { api };
```

### 10.2 Notification Service

Export a unified `msg` object with typed methods:

```typescript
const msg: NotificationMsg = {
    info,
    success,
    warn,
    error,
}

export { initNotifyService, confirmSuccess, confirmDanger, msg }
```

### 10.3 Utility Services

Keep utility functions pure and well-documented:

```typescript
function humanize(name: string) {
    const sname = name.replaceAll("-", " ").replaceAll("_", "");
    return sname.charAt(0).toUpperCase() + sname.slice(1);
}

function humanizeNumber(num: number): string {
    // ...
}

export {
    humanize,
    humanizeNumber,
}
```

---

## 11. Template Patterns

### 11.1 Conditional Rendering

Use `v-if` / `v-else` / `v-else-if` chains:

```html
<template v-if="state.hasConfig">
    <!-- config present -->
</template>
<router-view v-else class="container mx-auto w-full h-full"></router-view>
```

### 11.2 List Rendering

Use `v-for` with `key` attributes:

```html
<div v-for="(tool, i) in toolsDef" :key="i" class="flex flex-col space-y-3 mx-3">
```

### 11.3 Event Handling

Use `@click`, `@update`, `@nodeSelect` etc.:

```html
@click="toggleApps($event)"
@click="goHome()"
@nodeSelect="onNodeSelect"
@update="prompt = $event"
@run="exec()"
```

### 11.4 Class Binding

Use dynamic class binding with `:class`:

```html
:class="`theme-${theme}`"
:class="view == 'file' ? 'txt-semilight' : 'txt-light'"
:class="confirmRestart !== null ? 'visible' : 'border invisible hover:visible'"
```

### 11.5 Slot Usage

Use named slots for component composition:

```html
<template #mobile-back>
    <i-ion-arrow-back-outline class="inline-flex ml-2 text-3xl" v-if="!isHome"></i-ion-arrow-back-outline>
</template>
```

---

## 12. Script Setup Patterns

### 12.1 Lifecycle Hooks

Use Vue lifecycle hooks in `<script setup>`:

```typescript
import { onBeforeMount, onMounted, onBeforeUnmount, watch } from 'vue';

onBeforeMount(() => {
    initState().then(r => {
        if (!state.hasConfig) {
            router.push("/init")
        }
    });
    initNotifyService();
});

onMounted(() => setPromptInputWidth());

onBeforeUnmount(() => resetCurrentFeature())

watch(props, () => {
    if (props.name != srv.task.value?.name) {
        resetCurrentFeature()
        srv.isReady.value = false;
        state.history = [];
        stream.value = "";
        load()
    };
});
```

### 12.2 Composables

Use the `use` prefix for composable functions:

```typescript
const taskEvents = useTaskEvents(stream, scrollOutput, nodes, thinkingNodes, toolCallRequest, hasThinking, props.name);
const srv = useClientFeatures(state, { ...taskEvents, defaultInferenceParams: defaultInferenceParams });
```

### 12.3 Watch Patterns

Use `watch` with `toRaw` for deep reactivity:

```typescript
watch(prompt, () => {
    setMainHeight();
})

watch(
    () => props.data,
    (_d) => {
        _data.value = _d
    }
)
```

---

## 13. General Principles

### 13.1 No `let` for Module-Level Variables

Use `const` for module-level declarations. Use `let` only when reassignment is necessary within a function scope.

### 13.2 No `var`

Never use `var`. Always use `const` or `let`.

### 13.3 Comment Style

Use inline comments sparingly for non-obvious logic:

```typescript
// @ts-ignore
import "@fontsource/roboto";

// @ts-ignore
prtoast.add({ severity: severity as ToastSeverityOptions, summary: title, detail: body, life: lifeTime });
```

### 13.4 Async/Await

Use `async/await` for all asynchronous operations:

```typescript
async function initState() {
    const { found, config } = await srv.checkState();
    // ...
}
```

### 13.5 Arrow Functions

Use arrow functions for callbacks and event handlers:

```typescript
@click="() => null"
@click="async () => { state.history = []; stream.value = ''; }"
```

### 13.6 Destructuring

Use object destructuring for cleaner code:

```typescript
const { found, config } = await srv.checkState();
const { awaiter, unblock } = createAwaiter<boolean>();
```

### 13.7 Template Literals

Use template literals for string interpolation:

```typescript
router.push(`/app/${name}`);
router.push(`/${type}/view/${tool.name}`);
msg.success(`Default backend set to ${name}`, `The backend ${uistate.value.backend} is ready`);
```

---

## Appendix: Quick Reference

### Common Tailwind Utility Classes Used

| Class | Purpose |
|-------|---------|
| `flex`, `flex-col`, `flex-row` | Flexbox layout |
| `space-y-3`, `space-x-3` | Spacing between children |
| `items-center`, `justify-end` | Flex alignment |
| `w-full`, `w-fit`, `w-56` | Width |
| `h-full`, `h-16`, `h-max` | Height |
| `p-3`, `px-0`, `py-0` | Padding |
| `m-0`, `mx-3`, `my-3` | Margin |
| `rounded-md`, `rounded-full` | Border radius |
| `border`, `bord-lighter`, `bord-success` | Custom border classes |
| `txt-light`, `txt-semilight`, `txt-danger` | Custom text color classes |
| `btn`, `btn success`, `btn warning`, `btn danger` | Button variants |
| `hover:lighter`, `hover:success` | Hover states |
| `overflow-y-auto` | Scrollable content |
| `fixed`, `absolute` | Positioning |
| `z-10`, `z-40`, `z-50` | Z-index |
| `dark:` | Dark mode variants |

### Custom Semantic Color Classes

The project uses semantic color classes that map to theme variables:

- `background` — Background color
- `txt-light`, `txt-semilight`, `txt-lighter` — Text colors
- `bord-lighter`, `bord-success`, `bord-danger`, `bord-primary`, `bord-secondary` — Border colors
- `success`, `warning`, `danger` — Semantic action colors
- `lighter` — Lighter variant for hover states

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `vue` | UI framework |
| `vue-router` | Client-side routing |
| `primevue` | UI component library |
| `tailwindcss` | Utility-first CSS framework |
| `sass` | SCSS preprocessor |
| `@vueuse/core` | Composable utilities |
| `restmix` | API client |
| `markstream-vue` | Markdown rendering |
| `highlight.js` | Code syntax highlighting |
| `yaml` | YAML parsing |
| `mermaid` | Diagram rendering |
