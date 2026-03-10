# Bundling and tree shaking

The React integration is ESM-first and designed to work with modern bundlers.
ESM uses static imports, allowing bundlers to analyze and resolve dependencies at build time.
When you only import the pieces you use, bundlers like Webpack, Vite, Rollup,
and esbuild can tree shake unused code.

## Import only what you render

Import just the components you use in JSX:

```jsx
import { Chart, LineSeries, Title } from "@highcharts/react";
```

If you use components for Highcharts modules (for example [Accessibility](https://www.highcharts.com/docs/react/components/modules/accessibility) or
[Exporting](https://www.highcharts.com/docs/react/components/modules/exporting)), import them directly so only those modules are included:

```jsx
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { Exporting } from "@highcharts/react/modules/Exporting";
```

If you use additional modules, import only those you need using the `highcharts/esm` path:

```tsx
import "highcharts/esm/modules/venn.src.js";
import "highcharts/esm/modules/draggable-points.src.js";
```

## Keep Highcharts lean with core + modules

Prefer the core Highcharts build plus only the modules you need. Avoid product
bundles (Stock, Maps, Gantt) unless you need their full feature set.

```jsx
import Highcharts from "highcharts";
import { Chart, Series } from "@highcharts/react";
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
