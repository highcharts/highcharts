---
description: >-
  Import the Highcharts export from @highcharts/react, not the highcharts
  package, to set global chart options or call global methods, and remember
  that those options affect every chart using that instance.
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

Use this export rather than `import Highcharts from "highcharts"`, which loads a second, separate copy of `Highcharts`. Anything applied to that copy, such as `setOptions`, plugins, or modules, does not affect the charts Highcharts React renders.
