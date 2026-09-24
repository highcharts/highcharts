# Bundling and tree shaking

Highcharts React is ESM-first and designed to work with modern bundlers.
ESM uses static imports, allowing bundlers to analyze and resolve dependencies at build time.
When you only import the pieces you use, bundlers like Webpack, Vite, Rollup,
and esbuild can tree shake unused code.

## Import only what you render

Import just the components you use in JSX:

```jsx
import { Chart, LineSeries, Title } from "@highcharts/react";
```

Eight Highcharts modules have dedicated components: `Accessibility`, `Boost`, `BrokenAxis`, `Data`, `DraggablePoints`, `Drilldown`, `Exporting`, and `StockTools`. Import only the ones you use:

```jsx
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { Exporting } from "@highcharts/react/modules/Exporting";
```

Each component bundles the Highcharts module it needs, so no additional bare import is required alongside it.

Bundling follows components, so an option that needs a module has nothing to pull it in and you import it yourself. Setting [`chart.polar`](https://api.highcharts.com/highcharts/chart.polar) needs `highcharts-more`, which the Cartesian series components do not bundle:

```tsx
import "highcharts/es-modules/masters/highcharts-more.src.js";
```

Other options behave the same way, including `chart.options3d`, `annotations`, and `sonification`. Each option's **Requires** line in the [API reference](https://api.highcharts.com/highcharts/) names the module it needs.

For modules and themes without a dedicated component, use the `/es-modules/masters` path:

```tsx
import "highcharts/es-modules/masters/modules/venn.src.js";
import "highcharts/es-modules/masters/modules/series-label.src.js";
```

Place bare module imports after your `@highcharts/react` imports. Module files run setup code at evaluation time, and ES modules evaluate in source order, so importing them first can run that setup before Highcharts is ready.

```tsx
import { Chart } from "@highcharts/react";
import { Exporting } from "@highcharts/react/modules/Exporting";
import "highcharts/es-modules/masters/modules/series-label.src.js";
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

## Styled mode

In styled mode Highcharts omits presentational SVG attributes and takes styling from CSS instead, so the Highcharts stylesheet has to be imported alongside enabling the mode:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import "highcharts/css/highcharts.css";

function StyledChart() {
  return (
    <Chart styledMode>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The stylesheet is not scoped to styled mode. It sets properties such as `fill-opacity` and `stroke-width` on Highcharts class names, and CSS wins over the SVG presentation attributes that options produce, so it restyles every chart on the page once loaded. A chart that is not in styled mode loses any option that sets one of those properties: a `fillOpacity` of `0.3` renders at the stylesheet's `0.75`, and an x-axis `gridLineWidth` of `1` disappears.

Where you import it does not change this. A stylesheet's rules apply document-wide once loaded, so the import location affects only when it loads, not what it affects. If every chart in your app uses styled mode, load it wherever suits your build.

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
