---
description: >-
  Import the Highcharts export from @highcharts/react to set global options or
  call global methods at module level, attach handlers that run for every chart,
  and avoid a second instance from the highcharts package.
---

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

`Chart` constructs the chart in an effect, and a component's own effects run after those of its children. So global setup placed in your own `useEffect`, such as `setOptions` or the event handler below, runs after the chart already exists and misses it. Module-level code runs at import time, before any of that, which is why global setup belongs there, as in the example above.

To run code for every chart, attach a handler to the `Highcharts.Chart` class at module level. See [Extending Highcharts](https://www.highcharts.com/docs/extending-highcharts/extending-highcharts#initializing-an-extension-when-the-chart-initializes) for how class events work.

```jsx
import { Highcharts } from "@highcharts/react";

Highcharts.addEvent(Highcharts.Chart, "load", function () {
  // Runs for every chart constructed from here on.
});
```

To subscribe to events on one specific chart instead, see [Chart instance](https://www.highcharts.com/docs/react/chart-instance).

## Use the exported instance

The `Highcharts` export is the instance the components render with, so use it rather than `import Highcharts from "highcharts"`, which loads a second, separate instance: options you set on it, such as with `setOptions`, do not reach the charts that Highcharts React renders.
