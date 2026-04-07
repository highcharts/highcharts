# v5 Migration Guide

This guide walks you through all breaking changes introduced in `v5.0.0` to help you migrate from `v4.x`.

## Module components

All [module-related components](https://www.highcharts.com/docs/react/components/modules/accessibility) have been moved from `/options` to `/modules`:

```ts
// Before
import { Accessibility } from "@highcharts/react/options/accessibility";

// After
import { Accessibility } from "@highcharts/react/modules/accessibility";
```

## Chart options type

The `HighchartsOptionsType` type for the [`Chart`](https://www.highcharts.com/docs/react/components/chart#props) component `options` prop has been renamed to `ChartOptions`:

```ts
// Before
import { type HighchartsOptionsType } from "@highcharts/react";

// After
import { type ChartOptions } from "@highcharts/react";
```

## Module import paths

The import path suffix for modules has been changed from `.src.js` to `.js`:

```ts
// Before
import "highcharts/esm/modules/boost.src.js";

// After
import "highcharts/esm/modules/boost.js";
```

> **Note:** We recommend using module components wherever possible. Only import modules directly if the integration does not yet provide a corresponding module component.
