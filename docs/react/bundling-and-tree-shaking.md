---
description: >-
  Use ESM imports for only the chart components, series, and modules you render,
  import other modules after Highcharts React, load a stylesheet for styled
  mode, configure production bundling correctly, and inspect the result with an
  analyzer.
---

# Bundling and tree shaking

Highcharts React is ESM-first and designed to work with modern bundlers.
ESM uses static imports, allowing bundlers to analyze and resolve dependencies at build time.
When you only import the pieces you use, bundlers like Webpack, Vite, Rollup,
and esbuild can tree shake unused code.

## Import only what you render

Import just the components you use in JSX:

```jsx
import { Chart, Title } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
```

These Highcharts modules have dedicated components: `Accessibility`, `Boost`, `BrokenAxis`, `Data`, `DraggablePoints`, `Drilldown`, `Exporting`, `SeriesLabel`, and `StockTools`. Import only the ones you use:

```jsx
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { Exporting } from "@highcharts/react/modules/Exporting";
```

Setting an option does not load the module it needs. Unless a component you render already imports that module, import it yourself. For example, [`chart.polar`](https://api.highcharts.com/highcharts/chart.polar) needs `highcharts-more`:

```tsx
import "highcharts/es-modules/masters/highcharts-more.src.js";
```

Other options behave the same way, including `chart.options3d`, `annotations`, and `sonification`. Each option's **Requires** line in the [API reference](https://api.highcharts.com/highcharts/) names the module it needs.

For modules and themes without a dedicated component, use the `/es-modules/masters` path:

```tsx
import "highcharts/es-modules/masters/modules/annotations.src.js";
import "highcharts/es-modules/masters/modules/pattern-fill.src.js";
import "highcharts/es-modules/masters/themes/dark-unica.src.js";
```

Place module imports after your `@highcharts/react` imports. A module runs its setup code when it is imported, and ES modules are evaluated in source order, so a module such as `annotations` or `pattern-fill` imported before `@highcharts/react` throws an error.

```tsx
import { Chart } from "@highcharts/react";
import { Exporting } from "@highcharts/react/modules/Exporting";
import "highcharts/es-modules/masters/modules/annotations.src.js";
```

## Keep Highcharts lean with core + modules

Prefer the core Highcharts build plus only the modules you need. Avoid product
bundles (Stock, Maps, Gantt) unless you need their full feature set.

```jsx
import { Chart, Series, Highcharts } from "@highcharts/react";
import { Exporting } from "@highcharts/react/modules/Exporting";
```

You can define chart data either with the generic `Series` component or with a specific series component (for example `VennSeries`). Import only the specific series components you render:

```jsx
import { VennSeries } from "@highcharts/react/series/Venn";
```

For the modules that series types need and how each component loads them, see [Series types](https://www.highcharts.com/docs/react/components/series-types).

## Styled mode

To use styled mode, set the `styledMode` prop and import a stylesheet, such as the default `highcharts/css/highcharts.css`. See [Style by CSS](https://www.highcharts.com/docs/chart-design-and-style/style-by-css) for the class names it styles.

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import "highcharts/css/highcharts.css";

export default function StyledChart() {
  return (
    <Chart styledMode>
      <LineSeries data={[3, 4, 1]} />
    </Chart>
  );
}
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
