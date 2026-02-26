# Chart instance

If you need to access the specific chart instance, you can use the `ref` prop. The `ref` prop will be
passed a reference to the chart instance, as well as the chart container element.

```jsx
import { Chart } from "@highcharts/react";

function RefExample() {
  const ref = useRef();

  useEffect(() => {
    if (ref.current?.chart) {
      // Access the chart instance.
    }
    if (ref.current?.container) {
      // Access the chart container element.
    }
  }, []);

  return <Chart ref={ref} />;
}
```

## Accessing the Highcharts instance

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

## Loading modules and setting a custom Highcharts instance

If you need to load additional modules or use a specific Highcharts version, you can provide a
custom Highcharts instance. This can be accomplished via the `setHighcharts` function:

```jsx
import { Chart, setHighcharts } from "@highcharts/react";

import Highcharts from "highcharts/highcharts";
import "highcharts/modules/exporting";
import "highcharts/modules/accessibility";

setHighcharts(Highcharts);

export function ChartWithCustomHC() {
  return (
    <Chart>
      <Series data={[1, 2, 3, 4, 5]} />
    </Chart>
  );
}
```
