---
description: >-
  Use ESM imports for only the chart components, series, and modules you
  render; keep product bundles out unless needed, configure production
  bundling correctly, and inspect the result with an analyzer.
---

# Bundling and tree shaking

Highcharts React is ESM-first and designed to work with modern bundlers.
ESM uses static imports, allowing bundlers to analyze and resolve dependencies at build time.
When you only import the pieces you use, bundlers like Webpack, Vite, Rollup,
and esbuild can tree shake unused code.

## Imports

The package root exports the `Chart` component and the chart option components:

```jsx
import { Chart, Title, XAxis, YAxis } from "@highcharts/react";
```

The chart components for the other products are exported from
`@highcharts/react/Stock`, `@highcharts/react/Maps` and
`@highcharts/react/Gantt`.

Series, technical indicator and module components are imported from their own
paths:

```jsx
import { VennSeries } from "@highcharts/react/series/Venn";
import { SMASeries } from "@highcharts/react/indicators/SMA";
import { StockTools } from "@highcharts/react/modules/StockTools";
```

Highcharts React does not provide barrel files such as
`@highcharts/react/series` or `@highcharts/react/modules`. Each of these
components loads its Highcharts module as a side effect, so a barrel file would
load every module in the folder, even if you only use one of its components.
For example, importing a single module component would also enable stock tools
on your charts.

If you prefer a single import site, re-export the components you use from your
own module:

```jsx
// src/highcharts.js
export { StockTools } from "@highcharts/react/modules/StockTools";
export { Exporting } from "@highcharts/react/modules/Exporting";
```

> **Note:** The barrel files were removed in Highcharts React v6.0.0. If you are
> upgrading, import option components from `@highcharts/react` instead of
> `@highcharts/react/options`, and import series and module components from
> their own paths instead of `@highcharts/react/series` and
> `@highcharts/react/modules`.

## Import only what you render

Import just the components you use in JSX:

```jsx
import { Chart, Title } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
```

If you use components for Highcharts modules (for example [Accessibility](https://www.highcharts.com/docs/react/components/modules/accessibility) or
[Exporting](https://www.highcharts.com/docs/react/components/modules/exporting)), directly import only the modules you need:

```jsx
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { Exporting } from "@highcharts/react/modules/Exporting";
```

If you use modules without a dedicated Highcharts React component, import only those you need using the `/es-modules/masters` path to use ESM:

```tsx
import "highcharts/es-modules/masters/modules/venn.src.js";
import "highcharts/es-modules/masters/modules/draggable-points.src.js";
```

## Keep Highcharts lean with core + modules

Prefer the core Highcharts build plus only the modules you need. Avoid product
bundles (Stock, Maps, Gantt) unless you need their full feature set.

```jsx
import { Chart, Series, Highcharts } from "@highcharts/react";
import { Exporting } from "@highcharts/react/modules/Exporting";
```

You can define chart data either with the generic `Series` component or with a
specific series component (for example `VennSeries`). If you use specific
series components that require extra Highcharts modules, import only the ones
you need to keep the bundle lean:

```jsx
import { VennSeries } from "@highcharts/react/series/Venn";
```

## Bundler configuration matters

Tree shaking depends on your bundler setup. Make sure you:

- Build in production mode (minification and dead code elimination).
- Avoid forcing a CommonJS build when ESM is available.
- Do not import full product bundles when you only need core charts.
- Validate the result with a bundle analyzer.

## Example bundle size comparison

These numbers are illustrative ranges from a minimal React app (one line chart,
production build, gzip). Actual sizes vary by chart type, modules, and bundler
settings, so use a bundle analyzer in your own app for exact results.

| Scenario                                      | Approx. gzip size |
| --------------------------------------------- | ----------------- |
| @highcharts/react (core + line)               | 80-95 KB          |
| @highcharts/react + exporting + accessibility | 100-120 KB        |
| Charting library A (comparable line chart)    | 110-140 KB        |
| Charting library B (comparable line chart)    | 150-190 KB        |
