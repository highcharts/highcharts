# v5 Migration Guide

This guide walks you through all breaking changes introduced in `v5.0.0` to help you migrate from `v4.x`.

## Module components

We moved all [module-related components](https://www.highcharts.com/docs/react/components/modules/accessibility) from `/options` to `/modules`:

```ts
// Before
import { Accessibility } from "@highcharts/react/options/accessibility";

// After
import { Accessibility } from "@highcharts/react/modules/accessibility";
```

## Pure ESM migration

We migrated to the pure ESM paths, replacing the webpack-bundled `/esm/` imports with `/es-modules/masters/` for better compatibility with modern bundlers.

```ts
// Before
import "highcharts/esm/modules/boost.src.js";

// After
import "highcharts/es-modules/masters/modules/boost.src.js";
```

> **Note:** We recommend using [module-related components](https://www.highcharts.com/docs/react/components/modules/accessibility) wherever possible. Only import modules directly if the integration does not yet provide a corresponding module component.

### Vite users

In Vite `v7` and below, esbuild's dependency pre-bundling breaks the expected module initialization order in development by bundling them into a single module. To avoid this, you can exclude `highcharts` from pre-bundling to load each module directly:

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ["highcharts"],
  },
});
```

> **Note:** This does not affect production builds.

## Chart options type

We renamed the `HighchartsOptionsType` type for the [`Chart`](https://www.highcharts.com/docs/react/components/chart#props) component `options` prop to `ChartOptions`:

```ts
// Before
import { type HighchartsOptionsType } from "@highcharts/react";

// After
import { type ChartOptions } from "@highcharts/react";
```
