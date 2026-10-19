---
description: >-
  Type the Chart options prop with ChartOptions, chart refs with
  HighchartsReactRefObject, and series with SeriesType, SeriesOptions, and
  SeriesProps, including wrapper components, with links to the chart component
  and Highcharts declarations.
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

  return (
    <>
      <button
        onClick={() =>
          setSeriesType(seriesType === "line" ? "column" : "line")
        }
      >
        Toggle series type
      </button>
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
import { Chart, Series, type SeriesOptions } from "@highcharts/react";

const seriesOptions: SeriesOptions<"line"> = {
  name: "Revenue",
  data: [1, 2, 3],
  dashStyle: "Dash"
};

export default function App() {
  return (
    <Chart>
      <Series type="line" options={seriesOptions} />
    </Chart>
  );
}
```

### `SeriesProps`

`SeriesProps<K>` resolves to the full prop set for a `Series` component constrained to series type `K`. Use it to type props in a custom wrapper component:

```tsx
import { Chart, Series, type SeriesProps } from "@highcharts/react";

function BrandedColumn({ options, ...rest }: SeriesProps<"column">) {
  return (
    <Series
      type="column"
      options={{
        color: "#7c3aed",
        borderColor: "#4c11b5",
        borderRadius: 10,
        borderWidth: 2,
        ...options
      }}
      {...rest}
    />
  );
}

export default function App() {
  return (
    <Chart>
      <BrandedColumn name="Revenue" data={[1, 2, 3]} />
    </Chart>
  );
}
```

## See also

- [Chart component](https://www.highcharts.com/docs/react/components/chart)
- [Highcharts TypeScript declarations](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations)
