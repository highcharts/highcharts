---
description: >-
  Type the Chart options prop with ChartOptions, chart refs with
  HighchartsReactRefObject, and series with SeriesType, SeriesOptions, and
  SeriesProps, with links to the chart component and Highcharts declarations.
---

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

### `SeriesType`

Use `SeriesType` to type a state variable that holds the current series type, for example when switching series types at runtime:

```tsx
import { useState } from "react";
import { Chart, Series, type SeriesType } from "@highcharts/react";

export default function App() {
  const [seriesType, setSeriesType] = useState<SeriesType>("line");

  function toggleSeriesType() {
    setSeriesType(prev => (prev === "line" ? "column" : "line"));
  }

  return (
    <>
      <button onClick={toggleSeriesType}>Toggle series type</button>
      <Chart>
        <Series type={seriesType} data={[1, 2, 3]} />
      </Chart>
    </>
  );
}
```

### `SeriesOptions`

`SeriesOptions<K>` resolves to the options object for a specific series type, with the `type` key omitted. Use it to type a series configuration object that you pass to the `options` prop of a `Series` component with the same `type`:

```tsx
import { useState } from "react";
import { Chart, Series, type SeriesOptions } from "@highcharts/react";

export default function App() {
  const [seriesOptions] = useState<SeriesOptions<"column">>({
    name: "Revenue",
    data: [1, 2, 3],
    borderRadius: 8
  });

  return (
    <Chart>
      <Series type="column" options={seriesOptions} />
    </Chart>
  );
}
```

### `SeriesProps`

`SeriesProps<K>` resolves to the full prop set for a `Series` component constrained to series type `K`. Use it to type a props object that you spread onto a `Series` component:

```tsx
import { useState } from "react";
import { Chart, Series, type SeriesProps } from "@highcharts/react";

export default function App() {
  const [seriesProps] = useState<SeriesProps<"column">>({
    name: "Revenue",
    data: [1, 2, 3],
    options: { borderRadius: 10 }
  });

  return (
    <Chart>
      <Series type="column" {...seriesProps} />
    </Chart>
  );
}
```

## See also

- [Chart component](https://www.highcharts.com/docs/react/components/chart)
- [Highcharts TypeScript declarations](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations)
