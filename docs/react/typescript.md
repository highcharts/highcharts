# TypeScript

The React integration exports TypeScript helpers for common chart patterns. This page documents the recommended types to use with `@highcharts/react`.

## `ChartOptions` for the `Chart` `options` prop

Use the exported `ChartOptions` type for the `options` prop instead of importing `Options` directly from Highcharts:

```tsx
import { useState } from "react";
import { Chart, type ChartOptions } from "@highcharts/react";

export default function App() {
  const [options] = useState<ChartOptions>({
    series: [{ type: "line", data: [1, 2, 3] }]
  });

  return <Chart options={options} />;
}
```

## Other useful exported types

### `SeriesProps`

Use `SeriesProps` when you need to type data passed to the generic `Series` component:

```tsx
import { useState } from "react";
import { Series, type SeriesProps } from "@highcharts/react";

export default function App() {
  const [lineSeries] = useState<SeriesProps>({
    type: "line",
    data: [1, 2, 3]
  });

  return <Series {...lineSeries} />;
}
```

### `HighchartsReactRefObject`

Use `HighchartsReactRefObject` to type refs that access the chart instance:

```tsx
import { useEffect, useRef } from "react";
import {
  Chart,
  Series,
  type HighchartsReactRefObject
} from "@highcharts/react";

export default function App() {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    chartRef.current?.chart?.reflow();
  }, []);

  return (
    <Chart ref={chartRef}>
      <Series data={[1, 2, 3]} />
    </Chart>
  );
}
```

## See also

- [Chart component](https://www.highcharts.com/docs/react/components/chart)
- [Highcharts TypeScript declarations](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations)
