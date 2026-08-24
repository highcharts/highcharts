# Highcharts instance

If you need to set global Highcharts options or use global methods, access the `Highcharts` export:

```jsx
import { Highcharts } from "@highcharts/react";

Highcharts.setOptions({
  chart: {
    animation: false,
  },
});

export default function MyChartComponent() {
  // Your component code
}
```

**Note:** Setting global options will affect all charts rendered using the Highcharts instance, so use this feature thoughtfully.

## Global setup runs at module level

The chart is constructed during the first render, so anything that has to be in place beforehand belongs at module level, as in the example above. This covers `setOptions` and any plugin or series-type registration. Code inside `useEffect` runs after the chart already exists, so setup placed there does not reach the first render.

Registering against a Highcharts class rather than a chart instance is the usual shape of a plugin, and it applies to every chart:

```jsx
import { Highcharts } from "@highcharts/react";

Highcharts.addEvent(Highcharts.Chart, "load", function () {
  // Runs for every chart constructed from here on.
});
```

To subscribe to events on one specific chart instead, see [Chart instance](https://www.highcharts.com/docs/react/chart-instance).

## Importing Highcharts directly

The `Highcharts` export above is the same instance the components render with. If you would rather import Highcharts yourself, use the ES module path to get that same instance:

```jsx
import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";
```

Importing from the package root resolves to a different build, giving you a second and separate instance. Series types you register and behavior you compose on one instance are not visible to the other, so a chart rendered by Highcharts React would not see them.
