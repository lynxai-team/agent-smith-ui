# CSS Style Guide - Agent Smith UI

## Overview

Agent Smith UI uses **Tailwind CSS 4** (config-free, via the `@tailwindcss/vite` plugin) with custom
plugins for semantic color utilities and PrimeVue integration. Styling is configured in
`/workspace/src/styles/global.css` through CSS `@import` directives; there is **no `tailwind.config`
file** (config was removed during the Tailwind 4 migration).

The styling system combines:

1. **Tailwind CSS** — Utility-first CSS framework (v4, config-free)
2. **tailwindcss-semantic-colors** — CSS-only plugin for semantic color utilities (`prim`, `sec`, `ter`…)
3. **Snowind CSS** — Utility classes defined manually in `src/styles/snowind.css` (`.btn`, `.slide-*`)
4. **@snowind/header** — `SwTopbar` responsive header component
5. **SCSS Themes** — Custom theme files under `src/scss/` with CSS custom properties
6. **PrimeVue** — UI component library with Aura theme

### The styling stack (`global.css`)

```css
@import "tailwindcss";
@import "tailwindcss-semantic-colors";   /* semantic color utilities (prim/sec/ter…) */
@import "tailwindcss-primeui";            /* PrimeVue component integration */
@import "./snowind.css";                  /* .btn, .slide-x, .slide-y, .slidedown, .slideup */
```

## Theme System

### Available Themes

13 SCSS files live under `/workspace/src/scss/`. `main.scss` aggregates them; `conf.ts` registers the
12 switchable themes for the runtime switcher. `default.scss` provides the base `:root` variables
(always active); every other file overrides them via a `.theme-{name}` class. **`stone` is the default
theme** (set in `src/state.ts` as `uistate.theme`).

| Theme | Class | Description |
|-------|-------|-------------|
| default | `:root` (base) | Base `:root` variables — always active, not switchable |
| stone | `theme-stone` | **Default** switchable theme (oklch neutrals) |
| black | `theme-black` | Dark slate theme |
| navy | `theme-navy` | Classic navy blue (full 24-variable theme) |
| forest | `theme-forest` | Green-dark |
| slate | `theme-slate` | Gray-blue |
| royal | `theme-royal` | Royal blue |
| teal | `theme-teal` | Teal accent |
| pearl | `theme-pearl` | Light pearl |
| sandstone | `theme-sandstone` | Warm stone |
| cloud | `theme-cloud` | Light gray |
| graphite | `theme-graphite` | Dark graphite |
| airy-soft | `theme-airy-soft` | Soft light |

> Note: older docs referenced non-existent themes (`bluestar`, `brown`, `pink-black`, `lime-black`).
> No such `.scss` files exist in the current codebase.

### Theme Activation

Themes are applied via a CSS class on the root `<html>` element (managed by `setTheme()` in
`src/state.ts`):

```vue
<!-- the class is toggled on <html>, not on a local element -->
```

```ts
import { setTheme } from '@/state.js';
setTheme('navy'); // removes .theme-<old>, adds .theme-navy to <html>
```

### Theme Variable Naming

Each theme defines CSS custom properties following the pattern
`--{color}-{mode}-{property}`:

| Token | Meaning | Example |
|-------|---------|---------|
| `--{color}-light-bg` | light-mode background | `--prim-light-bg: #0e7490` |
| `--{color}-light-txt` | light-mode text | `--prim-light-txt: white` |
| `--{color}-dark-bg` | dark-mode background | `--prim-dark-bg: #0a0a0a` |
| `--{color}-dark-txt` | dark-mode text | `--prim-dark-txt: #f5f5f5` |

`color` ∈ `prim, sec, ter, background, light, semilight, lighter, superlight, success, warning,
danger, info`. Only override the variables that differ from `default.scss`; unspecified variables
fall back to the base defaults.

## Semantic Colors (`tailwindcss-semantic-colors`)

### How the plugin works

`tailwindcss-semantic-colors` (v0.6.0) is a **CSS-only** Tailwind v4 plugin — no JavaScript entry
point. Its single `style.css` uses native Tailwind v4 directives:

- **`@theme`** — maps Tailwind color tokens to the SCSS theme variables, e.g.
  `--color-prim: var(--prim-light-bg); --color-on-prim: var(--prim-light-txt);`
- **`@layer base`** — the `.dark, [data-theme="dark"]` block re-maps the same tokens to the
  `--{color}-dark-*` variables for dark mode (proper cascade priority)
- **`@utility`** — 16 utility classes that set both `background-color` and `color`

Because the tokens live in Tailwind's `--color-*` namespace, Tailwind auto-generates the
`bg-*` / `text-*` / `border-*` / `on-*` variants — you never write them by hand.

### Full-color utilities (background + text)

Each utility applies **both** background and text color by default:

| Utility | Reads (light) | Reads (dark) |
|---------|---------------|--------------|
| `prim` | `--prim-light-bg` / `--prim-light-txt` | `--prim-dark-bg` / `--prim-dark-txt` |
| `sec` | `--sec-light-bg` / `--sec-light-txt` | `--sec-dark-bg` / `--sec-dark-txt` |
| `ter` | `--ter-light-bg` / `--ter-light-txt` | `--ter-dark-bg` / `--ter-dark-txt` |
| `background` | `--background-light-bg` / `--background-light-txt` | `--background-dark-bg` / `--background-dark-txt` |
| `light` | `--light-light-bg` / `--light-light-txt` | `--light-dark-bg` / `--light-dark-txt` |
| `semilight` | `--semilight-light-bg` / `--semilight-light-txt` | `--semilight-dark-bg` / `--semilight-dark-txt` |
| `lighter` | `--lighter-light-bg` / `--lighter-light-txt` | `--lighter-dark-bg` / `--lighter-dark-txt` |
| `superlight` | `--superlight-light-bg` / `--superlight-light-txt` | `--superlight-dark-bg` / `--superlight-dark-txt` |
| `success` | `--success-light-bg` / `--success-light-txt` | `--success-dark-bg` / `--success-dark-txt` |
| `warning` | `--warning-light-bg` / `--warning-light-txt` | `--warning-dark-bg` / `--warning-dark-txt` |
| `danger` | `--danger-light-bg` / `--danger-light-txt` | `--danger-dark-bg` / `--danger-dark-txt` |
| `info` | `--info-light-bg` / `--info-light-txt` | `--info-dark-bg` / `--info-dark-txt` |

**Aliases** (identical output to their base utility): `l1` → `light`, `l2` → `semilight`,
`l3` → `lighter`, `l4` → `superlight`.

```html
<div class="prim p-4 rounded">Primary block</div>
<!-- expands to: -->
<div class="text-[var(--prim-light-txt)] bg-[var(--prim-light-bg)]
           dark:text-[var(--prim-dark-txt)] dark:bg-[var(--prim-dark-bg)]">
  Primary block
</div>
```

### Background / text / border variants

Tailwind's automatic color prefixes let you apply only one side of the pairing:

```html
<div class="bg-prim">Primary background only</div>      <!-- bg-[var(--prim-light-bg)] -->
<div class="text-prim">Primary text only</div>           <!-- text-[var(--prim-light-txt)] -->
<div class="border border-prim">Primary border only</div><!-- border-[var(--prim-light-bg)] -->
<div class="bg-on-prim">Uses the on-* token</div>
```

### Variants

`hover:` / `focus:` / etc. work automatically on every utility — **no config file** is needed:

```html
<button class="bg-prim hover:warning border border-prim">Save</button>
```

## Theme Color Reference

### Base theme (`default.scss` — `:root`, always active)

| Variable | Light | Dark |
|----------|-------|------|
| `--prim-light-bg` / `--prim-dark-bg` | `#0e7490` (cyan-700) | `#0a0a0a` |
| `--prim-light-txt` / `--prim-dark-txt` | `white` | `#f5f5f5` |
| `--sec-light-bg` / `--sec-dark-bg` | `#06b6d4` (cyan-500) | `#475569` (slate-600) |
| `--sec-light-txt` / `--sec-dark-txt` | `white` | `#f5f5f5` |
| `--ter-light-bg` / `--ter-dark-bg` | `#4cdaf3` | `#8f959d` |
| `--success-light-bg` / `--success-dark-bg` | `#16a34a` (green-600) | `#16a34a` |
| `--warning-light-bg` / `--warning-dark-bg` | `#f59e0b` (amber-500) | `#f59e0b` |
| `--danger-light-bg` / `--danger-dark-bg` | `#ef4444` (red-500) | `#ef4444` |
| `--info-light-bg` / `--info-dark-bg` | `#4758ef` | `#0b0b13` |
| `--background-light-bg` / `--background-dark-bg` | `white` | `#272822` |
| `--background-light-txt` / `--background-dark-txt` | `#1f2937` | `#d4d4d4` |
| `--light-light-bg` / `--light-dark-bg` | `#6b7280` (gray-500) | `#9ca3af` (gray-400) |
| `--lighter-light-bg` / `--lighter-dark-bg` | `#e2e8f0` (slate-200) | `#3f3f46` |
| `--semilight-light-bg` / `--semilight-dark-bg` | `#94a3b8` (slate-400) | `#525252` |
| `--superlight-light-bg` / `--superlight-dark-bg` | `#e9ecf0` | `#1d1c1c` |

### Example override (`black.scss`)

Minimal themes only override what changes:

```scss
.theme-black {
    --prim-light-bg: #1e293b;   /* slate-800 */
    --sec-light-bg:  #475569;   /* slate-600 */
    --background-light-bg: #f5f5f4; /* stone-50 */
}
```

### Example full theme (`navy.scss`)

A complete theme defines all 24 variables (12 light + 12 dark) — use as the template for new themes.

## Usage Examples

```vue
<template>
  <!-- semantic color + Snowind .btn + Tailwind layout -->
  <div class="prim p-4 rounded shadow">
    <h2 class="text-lg font-bold text-prim">Primary Section</h2>
    <p class="text-sm text-semilight">Muted text via the semilight token</p>
    <button class="btn mt-3 bg-prim hover:warning border border-prim text-sm">
      Save changes
    </button>
  </div>
</template>
```

## Codestyle / Best Practices

1. **Prefer semantic color utilities** over hardcoded Tailwind colors for theme compatibility:
   `class="prim"` instead of `class="bg-cyan-700 text-white"`.
2. **Always ship light + dark** — dark variants are applied automatically via the `.dark`/
   `[data-theme="dark"]` layer; theme variables carry both modes.
3. **Use Tailwind color prefixes** for one-sided needs: `bg-prim`, `text-prim`, `border-prim`.
4. **Use variants** (`hover:`, `focus:`) for interactive elements — no config required.
5. **When adding a theme**, override only the variables that differ from `default.scss` in a new
   `src/scss/{name}.scss` with a `.theme-{name}` class, register it in `main.scss`, and add the name
   to the `themes` array in `src/conf.ts`.
6. **Keep contrast** (WCAG AA ≥ 4.5:1) between each `{color}-bg` and its `{color}-txt`.

## Snowind CSS Utilities (`src/styles/snowind.css`)

These utility classes are defined manually in `src/styles/snowind.css` (imported last in
`global.css`):

| Class | Purpose |
|-------|---------|
| `.btn` | Base button: 1px border, rounded, padded, pointer cursor; `:hover` → 0.9 opacity, `:disabled` → 0.75 |
| `.slide-x` | Horizontal slide (width transition, overflow hidden, 300ms) |
| `.slide-y` | Vertical slide (max-height transition, overflow hidden, 300ms) |
| `.slidedown` | Expanded state (`max-height: 1000px`) |
| `.slideup` | Collapsed state (`max-height: 0`) |

```vue
<template>
  <button class="btn bg-prim hover:warning border border-prim">Action</button>
  <div class="slide-y" :class="open ? 'slidedown' : 'slideup'">
    <div class="p-4">Collapsible content</div>
  </div>
</template>
```

## Snowind Vue Components

### SwTopbar (`@snowind/header`)

Responsive header with a mobile menu. Uses `useTopbar(router)` for state.

| Prop / Slot | Description |
|-------------|-------------|
| `:topbar` | Reactive topbar state from `useTopbar()` |
| `:breakpoint` | Mobile breakpoint, e.g. `'lg'` |
| `#branding` | Main logo/branding area |
| `#menu` | Menu items and actions |
| `#mobile-menu` / `#mobile-back` / `#mobile-branding` | Mobile-view slots |

```vue
<template>
  <sw-topbar :topbar="topBar" class="z-10 flex items-center w-full h-16" breakpoint="lg">
    <template #branding>
      <img src="@/assets/logo.png" class="h-8 mr-2" />
      <span class="text-2xl text-prim">My App</span>
    </template>
    <template #menu>
      <button class="btn bg-prim hover:warning text-sm">Login</button>
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

## State-Driven Styling

`@snowind/state` provides the `User` class that manages dark mode; `src/state.ts` holds the active
theme. The theme class is toggled on `<html>` by `setTheme()`.

```ts
import { user, uistate, setTheme } from '@/state.js';

user.isDarkMode.value          // current dark-mode flag
uistate.value.theme            // e.g. 'stone' (default), 'navy', 'black'...
setTheme('navy');              // switch theme (persists via useStorage)
user.toggleDarkMode();         // toggle dark mode
```

## Component Quick Reference

| Component / Utility | Source | Class | Color Variants |
|---------------------|--------|-------|----------------|
| Semantic colors | `tailwindcss-semantic-colors` | `prim`, `sec`, `ter`, `background`, `light`, `semilight`, `lighter`, `superlight`, `success`, `warning`, `danger`, `info` (+ `l1`–`l4`) | `bg-*`, `text-*`, `border-*`, `hover:*` |
| `.btn` | `src/styles/snowind.css` | `.btn` | combine with `bg-prim`, `hover:warning`, `border-prim` |
| Slide animations | `src/styles/snowind.css` | `.slide-x`, `.slide-y`, `.slidedown`, `.slideup` | N/A |
| SwTopbar | `@snowind/header` | `<sw-topbar>` | via slots + semantic classes |

## Further Reading

- [tailwindcss-semantic-colors README](https://github.com/synw/tailwindcss-semantic-colors) (installed at `node_modules/tailwindcss-semantic-colors/README.md`)
- [Snowind Documentation](https://synw.github.io/snowind/)
- [PrimeVue Components](https://primefaces.org/primevue/)
- `.agents/documentation/code_style_guidelines.md` — UI code style guidelines
