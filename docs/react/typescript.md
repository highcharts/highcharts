# TypeScript

Highcharts React exports TypeScript helpers for common chart patterns. This page documents the recommended types to use with `@highcharts/react`.

## `ChartOptions` for the `Chart` `options` prop

Use the exported `ChartOptions` type for the `options` prop instead of importing `Options` directly from Highcharts:

```tsx
import { useState } from "react";
import { Chart, type ChartOptions } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function App() {
  const [options] = useState<ChartOptions>({
    chart: {
      backgroundColor: "#f8f8ff"
    }
  });

  return (
    <Chart options={options}>
      <LineSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

## Other useful exported types

### `HighchartsReactRefObject`

Use `HighchartsReactRefObject` to type refs that access the chart instance:

```tsx
import { useEffect, useRef } from "react";
import {
  Chart,
  type HighchartsReactRefObject
} from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function App() {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    chartRef.current?.chart?.reflow();
  }, []);

  return (
    <Chart ref={chartRef}>
      <LineSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

## See also

- [Chart component](https://www.highcharts.com/docs/react/components/chart)
- [Highcharts TypeScript declarations](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations)
