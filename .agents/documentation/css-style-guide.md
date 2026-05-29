# CSS Style Guide - Agent Smith UI

## Overview

Agent Smith UI uses **Tailwind CSS 3.4** with custom plugins for semantic color utilities and PrimeVue integration. The styling system combines:

1. **Tailwind CSS** - Utility-first CSS framework
2. **tailwindcss-semantic-colors** - Plugin for semantic color classes
3. **@snowind/plugin** - Vue state-driven styling helper
4. **SCSS Themes** - Custom theme files with CSS custom properties
5. **PrimeVue** - UI component library with Aura theme

## Theme System

### Available Themes

The project supports multiple themes defined in SCSS files under `/workspace/src/scss/`:

| Theme | Class | Description | Dark Mode |
|-------|-------|-------------|-----------|
| Default | `theme-default` | Cyan/teal color scheme | ✅ Full support |
| Bluestar | `theme-bluestar` | Blue color scheme | ⚠️ Light mode only |
| Brown | `theme-brown` | Brown/stone color scheme | ⚠️ Light mode only |
| Pink-Black | `theme-pink-black` | Dark with pink accents | ⚠️ Light mode only |
| Lime-Black | `theme-lime-black` | Black with lime green accents | ⚠️ Light mode only |
| Black | `theme-black` | Dark theme | ⚠️ Light mode only |

### Theme Activation

Themes are applied via CSS class on the root element:

```vue
<div :class="`theme-${theme}`">
  <!-- Application content -->
</div>
```

The default theme is **bluestar** (set in `src/state.ts`).

### Theme Files Structure

Each theme file defines CSS custom properties (variables) for semantic colors. Example from `default.scss`:

```scss
:root {
    --primary-light-bg: #0e7490;
    --primary-light-txt: white;
    --secondary-light-bg: #06b6d4;
    --secondary-light-txt: white;
    // ... more variables
}
```

## Semantic Colors

### Configuration

Semantic colors are defined in `/workspace/tailwind.config.cjs` using the `semanticColors` extension:

```javascript
theme: {
  extend: {
    semanticColors: {
      accent: {
        light: { bg: colors.yellow[600], txt: colors.black },
        dark: { bg: colors.yellow[700], txt: colors.white }
      },
      primary: {
        light: { bg: 'var(--primary-light-bg)', txt: 'var(--primary-light-txt)' },
        dark: { bg: 'var(--primary-dark-bg)', txt: 'var(--primary-dark-txt)' }
      },
      // ... other colors
    }
  }
}
```

### Available Semantic Colors

| Color | Light Mode (Light/Dark) | Dark Mode (Light/Dark) | Source |
|-------|------------------------|------------------------|--------|
| **accent** | `bg-yellow-600` / `text-black` | `bg-yellow-700` / `text-white` | Direct Tailwind colors |
| **primary** | CSS variable | CSS variable | Theme-dependent |
| **secondary** | CSS variable | CSS variable | Theme-dependent |
| **background** | CSS variable | CSS variable | Theme-dependent |
| **foreground** | CSS variable | CSS variable | Theme-dependent |
| **light** | CSS variable | CSS variable | Theme-dependent |
| **lighter** | CSS variable | CSS variable | Theme-dependent |
| **semilight** | CSS variable | CSS variable | Theme-dependent |
| **secondary-strong** | CSS variable | CSS variable | Theme-dependent |

### Color Variants in Themes

Themes may also define additional semantic colors (not exposed as Tailwind utilities):

- `success` - Green color for success states
- `warning` - Amber/yellow color for warnings
- `danger` - Red color for errors/danger states

## Utility Classes

### Background and Text Utilities

The `semanticColors` plugin generates utility classes that support dark mode automatically.

#### Full Color Utility (Background + Text)

```html
<div class="primary">Primary block</div>
<!-- Expands to: -->
<div class="text-[var(--primary-light-txt)] bg-[var(--primary-light-bg)] 
           dark:text-[var(--primary-dark-txt)] dark:bg-[var(--primary-dark-bg)]">
  Primary block
</div>
```

#### Available Full Color Classes

- `accent` - Accent color (yellow)
- `primary` - Primary color (theme-dependent)
- `secondary` - Secondary color (theme-dependent)
- `background` - Background color (theme-dependent)
- `foreground` - Foreground color (theme-dependent)
- `light` - Light color (theme-dependent)
- `lighter` - Lighter color (theme-dependent)
- `semilight` - Semi-light color (theme-dependent)
- `secondary-strong` - Strong secondary color (theme-dependent)

### Background Only Utilities

```html
<div class="block-primary">Primary background block</div>
<!-- Expands to: -->
<div class="bg-[var(--primary-light-bg)] dark:bg-[var(--primary-dark-bg)]">
  Primary background block
</div>
```

#### Available Background Classes

- `block-accent`
- `block-primary`
- `block-secondary`
- `block-background`
- `block-foreground`
- `block-light`
- `block-lighter`
- `block-semilight`
- `block-secondary-strong`

### Text Only Utilities

```html
<div class="txt-primary">Primary text block</div>
<!-- Expands to: -->
<div class="text-[var(--primary-light-txt)] dark:text-[var(--primary-dark-txt)]">
  Primary text block
</div>
```

#### Available Text Classes

- `txt-accent`
- `txt-primary`
- `txt-secondary`
- `txt-background`
- `txt-foreground`
- `txt-light`
- `txt-lighter`
- `txt-semilight`
- `txt-secondary-strong`

### Border Utilities

```html
<div class="border bord-primary">Block with border</div>
<!-- Expands to: -->
<div class="border border-[var(--primary-light-bg)] dark:border-[var(--primary-dark-bg)]">
  Block with border
</div>
```

#### Available Border Classes

- `bord-accent`
- `bord-primary`
- `bord-secondary`
- `bord-background`
- `bord-foreground`
- `bord-light`
- `bord-lighter`
- `bord-semilight`
- `bord-secondary-strong`

## Variants

### Hover Variant

```html
<div class="primary hover:warning">Primary hover block</div>
<!-- Expands to include hover states with appropriate colors -->
```

### Focus Variant

Focus variants are also enabled by default.

### Configuring Variants

Variants can be configured in `tailwind.config.cjs`:

```javascript
variants: {
  semanticColors: ['focus', 'hover']
}
```

## Theme Color Reference

### Default Theme (`default.scss`)

| Variable | Light Mode | Dark Mode |
|----------|-----------|-----------|
| `--primary-light-bg` | `#0e7490` (cyan-700) | `#0a0a0a` |
| `--primary-light-txt` | `white` | `#f5f5f5` |
| `--secondary-light-bg` | `#06b6d4` (cyan-500) | `#475569` (slate-600) |
| `--secondary-light-txt` | `white` | `#f5f5f5` |
| `--success-light-bg` | `#16a34a` (green-600) | `#16a34a` |
| `--warning-light-bg` | `#f59e0b` (amber-500) | `#f59e0b` |
| `--danger-light-bg` | `#ef4444` (red-500) | `#ef4444` |
| `--light-light-bg` | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| `--lighter-light-bg` | `#e2e8f0` (slate-200) | `#525252` (zinc-700) |
| `--semilight-light-bg` | `#94a3b8` (slate-400) | `#525252` |
| `--background-light-bg` | `white` | `#272822` |
| `--foreground-light-bg` | `white` | `black` |

### Bluestar Theme (`bluestar.scss`)

| Variable | Light Mode | Dark Mode |
|----------|-----------|-----------|
| `--primary-light-bg` | `#0e599a` (custom blue) | *Not defined* |
| `--primary-light-txt` | `white` | *Not defined* |
| `--secondary-light-bg` | `#dbecfe` (light blue) | *Not defined* |
| `--secondary-light-txt` | `#0e599a` | *Not defined* |
| `--success-light-bg` | `#01DA97` (custom green) | *Not defined* |
| `--warning-light-bg` | `#FAC165` (custom amber) | *Not defined* |
| `--danger-light-bg` | `#FE606C` (custom red) | *Not defined* |
| `--light-light-bg` | `#c2d3e5` (light blue-gray) | *Not defined* |
| `--lighter-light-bg` | `#dbecfe` | *Not defined* |
| `--background-light-bg` | `#eff7ff` (very light blue) | *Not defined* |

### Brown Theme (`brown.scss`)

| Variable | Light Mode |
|----------|-----------|
| `--primary-light-bg` | `#57534e` (stone-600) |
| `--secondary-light-bg` | `#78716c` (stone-500) |
| `--background-light-bg` | `#f5f5f4` (stone-50) |
| `--secondary-strong-light-bg` | `#78716c` |

### Pink-Black Theme (`pink-black.scss`)

| Variable | Light Mode |
|----------|-----------|
| `--primary-light-bg` | `#1e293b` (slate-800) |
| `--secondary-light-bg` | `#EB03B7` (magenta) |
| `--background-light-bg` | `#f5f5f4` |
| `--secondary-strong-light-bg` | `#EB03B7` |

### Lime-Black Theme (`lime-black.scss`)

| Variable | Light Mode |
|----------|-----------|
| `--primary-light-bg` | `#000` (black) |
| `--primary-light-txt` | `white` |
| `--secondary-light-bg` | `#a3e635` (lime-400) |
| `--background-light-bg` | `#f5f5f4` |
| `--secondary-strong-light-bg` | `#4d7c0f` (lime-700) |

### Black Theme (`black.scss`)

| Variable | Light Mode |
|----------|-----------|
| `--primary-light-bg` | `#1e293b` (slate-800) |
| `--secondary-light-bg` | `#475569` (slate-600) |
| `--background-light-bg` | `#f5f5f4` |

## Usage Examples

### Basic Component with Semantic Colors

```vue
<template>
  <div class="primary p-4 rounded">
    <h2 class="txt-secondary-strong text-lg font-bold">
      Primary Section
    </h2>
    <p class="text-sm opacity-90">
      Content with primary background and secondary-strong text on hover
    </p>
  </div>
</template>
```

### Interactive Element with Variants

```vue
<template>
  <button 
    class="block-primary hover:accent border bord-primary"
  >
    Click me
  </button>
</template>
```

### Theme Switching

```vue
<template>
  <div :class="`theme-${currentTheme}`">
    <!-- Content adapts to theme -->
    <div class="primary">Uses current theme's primary color</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const currentTheme = ref('bluestar'); // or 'default', 'brown', etc.
</script>
```

## Best Practices

1. **Use semantic color classes** instead of direct Tailwind colors when possible for theme compatibility
2. **Always test in both light and dark modes** - the default theme has full dark mode support
3. **When creating new themes**, ensure all required CSS variables are defined
4. **Use variants** (`hover:`, `focus:`) for interactive elements
5. **Combine utilities** for complex styling (e.g., `block-primary hover:accent`)

## Plugin Dependencies

- `@tailwindcss/forms` - Form element styling
- `@snowind/plugin` - Vue state-driven styling
- `tailwindcss-semantic-colors` - Semantic color utilities
- `tailwindcss-primeui` - PrimeVue component integration

---

# Snowind Custom Classes and Components

## Overview

Snowind is a Vue 3 component library that provides custom UI components with Tailwind CSS integration. The project uses three main Snowind packages:

- **@snowind/plugin** - Tailwind CSS plugin with utility classes
- **@snowind/header** - Responsive header with mobile menu (`SwTopbar`)
- **@snowind/sidebar** - Collapsible sidebar widget (`SwSidebar`)
- **@snowind/switch** - Toggle switch component (`SwSwitch`)
- **@snowind/state** - State management primitives for Vue

## Snowind Plugin Classes

The `@snowind/plugin` Tailwind CSS plugin provides the following custom classes:

### Layout and Animation Classes

| Class | Description | Example Usage |
|-------|-------------|---------------|
| `.slide-x` | Horizontal slide with overflow hidden and width transition | `<div class="slide-x">` |
| `.slide-y` | Vertical slide with overflow hidden and max-height transition | `<div class="slide-y">` |
| `.slidedown` | Sets `maxHeight: 1000px` for expanded state | `<div :class="isOpen ? 'slidedown' : 'slideup'">` |
| `.slideup` | Sets `maxHeight: 0` for collapsed state | `<div :class="isOpen ? 'slidedown' : 'slideup'">` |

#### Example: Collapsible Content

```vue
<template>
  <div class="slide-y" :class="showContent ? 'slidedown' : 'slideup'">
    <p>This content slides open/closed</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showContent = ref(false);
</script>
```

### Button Component

The `.btn` class provides a standardized button style:

```css
.btn {
  borderWidth: 1px;
  borderRadius: 0.25rem;
  paddingLeft: 1rem;
  paddingRight: 1rem;
  paddingTop: 0.25rem;
  paddingBottom: 0.25rem;
  letterSpacing: 0.05em;
  cursor: pointer;
  borderColor: transparent;
}

.btn:hover { opacity: 0.9; }
.btn:disabled { opacity: 0.75; cursor: not-allowed; }
```

#### Example: Styled Buttons

```vue
<template>
  <button class="btn primary">Primary Button</button>
  <button class="btn secondary">Secondary Button</button>
  <button class="btn danger" disabled>Disabled Button</button>
</template>
```

### Sidebar Component (`.sw-sidebar`)

The `.sw-sidebar` class provides a collapsible sidebar with two states:

| State | Width | Class |
|-------|-------|-------|
| Closed | 80px (`w-20`) | `.sw-sidebar` |
| Opened | 208px (`w-52`) | `.sw-sidebar.opened` |

#### Example: Sidebar Usage

```vue
<template>
  <div class="sw-sidebar" :class="{ opened: isSidebarOpen }">
    <div class="p-4">
      <p>Sidebar content</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isSidebarOpen = ref(false);
</script>

<style scoped>
/* Optional: Override default width */
.opened.sw-sidebar {
  width: 24rem; /* Custom width when opened */
}
</style>
```

### Stepper Component (`.sw-stepper`)

The `.sw-stepper` class provides a step-by-step progress indicator with semantic colors. Each semantic color has its own stepper variant:

| Class | Description |
|-------|-------------|
| `.stepper-primary` | Primary colored stepper |
| `.stepper-secondary` | Secondary colored stepper |
| `.stepper-success` | Success (green) colored stepper |
| `.stepper-warning` | Warning (amber) colored stepper |
| `.stepper-danger` | Danger (red) colored stepper |
| `.stepper-light` | Light colored stepper |
| `.stepper-lighter` | Lighter colored stepper |
| `.stepper-semilight` | Semi-light colored stepper |
| `.stepper-background` | Background colored stepper |
| `.stepper-accent` | Accent (yellow) colored stepper |

#### Stepper Structure

```html
<div class="sw-stepper stepper-primary">
  <div class="step-wrapper">
    <div class="stepper-step done">1</div>
    <div class="stepper-label">Step 1</div>
    <div class="stepper-line done"></div>
    <div class="stepper-step active">2</div>
    <div class="stepper-label">Step 2</div>
    <div class="stepper-line"></div>
    <div class="stepper-step">3</div>
    <div class="stepper-label">Step 3</div>
  </div>
</div>
```

#### Stepper States

| State | Class | Appearance |
|-------|-------|------------|
| Completed | `.done` | Filled with color, label colored |
| Active | `.active` | Colored border and text |
| Pending | (none) | Default state |

## Snowind Vue Components

### SwTopbar (`@snowind/header`)

A responsive header component with mobile menu support.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `topbar` | `TopbarState` | Reactive topbar state from `useTopbar()` |
| `breakpoint` | `string` | Mobile breakpoint (e.g., 'lg', 'md') |

#### Slots

| Slot | Description |
|------|-------------|
| `#mobile-back` | Back button for mobile view |
| `#mobile-branding` | Branding in mobile menu |
| `#branding` | Main branding/logo area |
| `#menu` | Menu items and actions |
| `#mobile-menu` | Mobile menu content |

#### Example: Header with Topbar

```vue
<template>
  <sw-topbar :topbar="topBar" class="z-10 flex items-center w-full h-16" breakpoint="lg">
    <template #branding>
      <div class="flex items-center">
        <img src="@/assets/logo.png" class="h-8 mr-2" />
        <span class="text-2xl txt-semilight">My App</span>
      </div>
    </template>
    <template #menu>
      <div class="flex items-center space-x-4">
        <button class="btn primary">Login</button>
        <button class="btn secondary">Sign Up</button>
      </div>
    </template>
  </sw-topbar>
</template>

<script setup>
import { SwTopbar, useTopbar } from '@snowind/header';
import { useRouter } from 'vue-router';

const router = useRouter();
const topBar = useTopbar(router);
</script>
```

### SwSidebar (`@snowind/sidebar`)

A collapsible sidebar component with v-model binding.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `opened` (v-model) | `boolean` | Sidebar open/close state |
| `name` | `string` | Unique sidebar identifier |

#### Example: Collapsible Sidebar

```vue
<template>
  <sw-sidebar 
    v-model:opened="sidebarOpen" 
    name="main-sidebar"
    class="z-30 flex flex-col h-full border bord-secondary"
  >
    <div class="p-4">
      <h3 class="txt-semilight text-lg">Sidebar Title</h3>
      <nav class="mt-4 space-y-2">
        <button class="btn w-full text-left">Item 1</button>
        <button class="btn w-full text-left">Item 2</button>
      </nav>
    </div>
    <div 
      class="flex items-center justify-center h-12 cursor-pointer txt-semilight"
      @click="sidebarOpen = !sidebarOpen"
    >
      <i-fa-solid:angle-left v-if="sidebarOpen" />
      <i-fa-solid:angle-right v-else />
    </div>
  </sw-sidebar>
</template>

<script setup>
import { ref } from 'vue';
import SwSidebar from '@snowind/sidebar';

const sidebarOpen = ref(true);
</script>
```

### SwSwitch (`@snowind/switch`)

A toggle switch component with semantic color support.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `value` (v-model) | `boolean` | Switch state |

#### Color Variants

| Class | Description |
|-------|-------------|
| `.switch-primary` | Primary colored switch |
| `.switch-secondary` | Secondary colored switch |
| `.switch-success` | Success (green) colored switch |
| `.switch-warning` | Warning (amber) colored switch |
| `.switch-danger` | Danger (red) colored switch |
| `.switch-light` | Light colored switch |
| `.switch-lighter` | Lighter colored switch |
| `.switch-semilight` | Semi-light colored switch |
| `.switch-background` | Background colored switch |
| `.switch-accent` | Accent (yellow) colored switch |

#### Size Variants

| Class | Description |
|-------|-------------|
| (default) | Standard size (w-10 h-6, dot w-4 h-4) |
| `.big` | Large size (w-14 h-8, dot w-6 h-6) |

#### Example: Toggle Switches

```vue
<template>
  <div class="space-y-3">
    <sw-switch v-model:value="enabled" class="switch-success text-sm">
      <span class="ml-2">Enable feature</span>
    </sw-switch>
    
    <sw-switch v-model:value="notifications" class="switch-primary big">
      <span class="ml-2">Large switch</span>
    </sw-switch>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SwSwitch from '@snowind/switch';

const enabled = ref(true);
const notifications = ref(false);
</script>
```

## State-Driven Styling

Snowind provides state management primitives that enable reactive styling. The `@snowind/state` package exports a `User` class that manages application state including dark mode, themes, and UI preferences.

### User State

```typescript
import { user } from '@/state.js';

// Check dark mode
if (user.isDarkMode.value) {
  // Apply dark mode styles
}

// Toggle dark mode
user.toggleDarkMode();
```

### Theme State

```typescript
import { state } from '@/state.js';

// Current theme name
const currentTheme = state.theme; // e.g., 'bluestar', 'default'

// Apply theme class
<div :class="`theme-${currentTheme}`">
  <!-- Content adapts to theme -->
</div>
```

## Codestyle Guidelines

### 1. Use Semantic Color Classes

Always prefer semantic color classes over direct color values for theme compatibility:

```vue
<!-- ✅ Good: Uses semantic colors -->
<div class="primary p-4 rounded">
  <h2 class="txt-secondary-strong">Title</h2>
</div>

<!-- ❌ Bad: Hardcoded colors -->
<div class="bg-cyan-700 text-white p-4 rounded">
  <h2 class="text-cyan-500">Title</h2>
</div>
```

### 2. Combine Snowind Components with Tailwind

Use Snowind components as wrappers and Tailwind for layout:

```vue
<!-- ✅ Good: Clean separation -->
<sw-sidebar v-model:opened="isOpen" name="sidebar">
  <div class="flex flex-col h-full p-4 space-y-3">
    <button class="btn primary w-full">Action</button>
  </div>
</sw-sidebar>

<!-- ❌ Bad: Overly complex inline classes -->
<sw-sidebar v-model:opened="isOpen" name="sidebar" class="z-30 flex flex-col h-full border bord-secondary bg-[#f1f2f4] dark:background bg-opacity-50 min-w-24">
```

### 3. Use Slide Classes for Animations

Use `.slide-y` and `.slidedown`/`.slideup` for collapsible content:

```vue
<!-- ✅ Good: Proper animation -->
<div class="slide-y" :class="showDetails ? 'slidedown' : 'slideup'">
  <div class="p-4">
    <!-- Details content -->
  </div>
</div>

<!-- ❌ Bad: Manual transition handling -->
<div v-show="showDetails" class="transition-all duration-300">
```

### 4. Theme-Aware Styling

Always provide both light and dark mode styles when possible:

```vue
<!-- ✅ Good: Theme-aware -->
<div class="background lighter dark:background-dark">
  <p class="txt-foreground dark:text-foreground-dark">Content</p>
</div>

<!-- ❌ Bad: Only light mode -->
<div class="bg-white text-gray-800">
```

### 5. Button Styling Pattern

Use the `.btn` class with semantic colors:

```vue
<!-- ✅ Good: Standard button pattern -->
<button class="btn primary" @click="handleClick">
  Primary Action
</button>

<button class="btn secondary hover:danger" :disabled="isLoading">
  {{ isLoading ? 'Loading...' : 'Secondary Action' }}
</button>

<!-- ❌ Bad: Manual button styling -->
<button 
  class="px-4 py-2 rounded border border-transparent hover:opacity-90 disabled:opacity-75"
  style="background-color: #0e7490; color: white;"
>
```

### 6. Sidebar Pattern

Use the `.sw-sidebar` class with proper state management:

```vue
<!-- ✅ Good: Proper sidebar pattern -->
<template>
  <sw-sidebar 
    v-model:opened="sidebarOpen" 
    name="main-sidebar"
    class="z-30 flex flex-col h-full border bord-secondary"
  >
    <div class="flex-1 p-4 overflow-y-auto">
      <!-- Sidebar content -->
    </div>
    <div 
      class="h-12 flex items-center justify-center cursor-pointer txt-semilight"
      @click="sidebarOpen = !sidebarOpen"
    >
      <i-fa-solid:angle-left v-if="sidebarOpen" />
      <i-fa-solid:angle-right v-else />
    </div>
  </sw-sidebar>
</template>

<script setup>
import { ref } from 'vue';
import SwSidebar from '@snowind/sidebar';

const sidebarOpen = ref(true);
</script>
```

### 7. Switch Component Pattern

Use switches for boolean toggles with appropriate semantic colors:

```vue
<!-- ✅ Good: Appropriate color usage -->
<sw-switch v-model:value="enabled" class="switch-success text-sm">
  <span class="ml-2">Enable feature</span>
</sw-switch>

<sw-switch v-model:value="dangerMode" class="switch-danger text-sm">
  <span class="ml-2">Danger mode (use with caution)</span>
</sw-switch>

<!-- ❌ Bad: Wrong color for context -->
<sw-switch v-model:value="enabled" class="switch-danger text-sm">
  <span class="ml-2">Enable feature</span>
</sw-switch>
```

### 8. Responsive Design

Use Tailwind's responsive prefixes with Snowind components:

```vue
<!-- ✅ Good: Responsive header -->
<sw-topbar 
  :topbar="topBar" 
  class="z-10 flex items-center w-full h-16"
  breakpoint="lg"
>
  <!-- Content -->
</sw-topbar>

<!-- ❌ Bad: Fixed widths -->
<div class="w-96">
```

### 9. Dark Mode Classes

Use Tailwind's `dark:` prefix for dark mode variations:

```vue
<!-- ✅ Good: Proper dark mode support -->
<div class="background lighter dark:background-dark">
  <h2 class="txt-foreground dark:text-foreground-dark">Title</h2>
  <p class="txt-light dark:text-lighter">Content</p>
</div>

<!-- ❌ Bad: No dark mode support -->
<div class="bg-white text-gray-800">
```

### 10. State Management Integration

Integrate with Snowind's state management for reactive UI:

```vue
<!-- ✅ Good: Reactive state -->
<template>
  <div :class="`theme-${state.theme}`">
    <sw-switch v-model:value="user.isDarkMode.value" class="switch-primary">
      <span class="ml-2">{{ user.isDarkMode.value ? 'Light Mode' : 'Dark Mode' }}</span>
    </sw-switch>
  </div>
</template>

<script setup>
import { state, user } from '@/state.js';
</script>

<!-- ❌ Bad: Local state without integration -->
<template>
  <div :class="isDarkMode ? 'dark' : ''">
    <button @click="isDarkMode = !isDarkMode">Toggle</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isDarkMode = ref(false);
</script>
```

## Common Patterns and Anti-Patterns

### Pattern: Collapsible Card

```vue
<template>
  <div class="border bord-lighter rounded p-4">
    <div 
      class="flex items-center justify-between cursor-pointer txt-semilight"
      @click="isOpen = !isOpen"
    >
      <h3 class="text-lg">Card Title</h3>
      <i-fa-solid:chevron-down :class="{ 'rotate-180': isOpen }" />
    </div>
    <div class="slide-y mt-3" :class="isOpen ? 'slidedown' : 'slideup'">
      <p>Card content here</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Pattern: Sidebar with Toggle

```vue
<template>
  <div class="flex h-screen">
    <sw-sidebar v-model:opened="sidebarOpen" name="main" class="z-30">
      <div class="p-4 space-y-3">
        <button class="btn primary w-full">Dashboard</button>
        <button class="btn secondary w-full">Settings</button>
      </div>
    </sw-sidebar>
    <div class="flex-1 p-6">
      <button 
        class="btn primary mb-4"
        @click="sidebarOpen = !sidebarOpen"
      >
        {{ sidebarOpen ? 'Close Sidebar' : 'Open Sidebar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SwSidebar from '@snowind/sidebar';
const sidebarOpen = ref(true);
</script>
```

### Anti-Pattern: Mixing Direct Colors with Semantic Classes

```vue
<!-- ❌ Bad: Inconsistent styling -->
<div class="bg-cyan-700 primary p-4">
  <h2 class="text-white txt-secondary-strong">Title</h2>
</div>

<!-- ✅ Good: Consistent semantic styling -->
<div class="primary p-4">
  <h2 class="txt-secondary-strong">Title</h2>
</div>
```

### Anti-Pattern: Manual Transition Management

```vue
<!-- ❌ Bad: Complex manual transitions -->
<transition name="fade">
  <div v-show="show" class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out" :class="{ 'max-h-screen': show }">
  </div>
</transition>

<!-- ✅ Good: Use slide classes -->
<div class="slide-y" :class="show ? 'slidedown' : 'slideup'">
  <div>Content</div>
</div>
```

## Component Quick Reference

| Component | Import | Class Prefix | Color Variants |
|-----------|--------|--------------|----------------|
| Topbar | `@snowind/header` | `sw-topbar` | N/A (uses slots) |
| Sidebar | `@snowind/sidebar` | `sw-sidebar` | N/A (uses semantic borders) |
| Switch | `@snowind/switch` | `sw-switch` | `.switch-{color}` |
| Stepper | Plugin | `sw-stepper` | `.stepper-{color}` |
| Button | Plugin | `.btn` | `.primary`, `.secondary`, etc. |
| Slide X | Plugin | `.slide-x` | N/A |
| Slide Y | Plugin | `.slide-y` | N/A |

## Further Reading

- [Snowind Documentation](https://synw.github.io/snowind/)
- [Tailwind CSS Semantic Colors](https://github.com/synw/tailwindcss-semantic-colors)
- [PrimeVue Components](https://primefaces.org/primevue/)
