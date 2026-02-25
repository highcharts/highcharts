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
