---
description: >-
  Type chart components with ChartProps, ChartOptions, and
  HighchartsReactRefObject, series components with SeriesProps, SeriesOptions,
  and SeriesType, and every other component, such as ColumnSeries or Title,
  with its own props type.
---

# TypeScript

This page describes the TypeScript types that Highcharts React exports and shows how to use each one.

| Type                                                    | Describes                                                                                                                                           |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`ChartProps`](#chartprops)                             | The props of the [chart components](https://www.highcharts.com/docs/react/components/chart)                                                         |
| [`ChartOptions`](#chartoptions)                         | The `options` prop of the [chart components](https://www.highcharts.com/docs/react/components/chart)                                                |
| [`HighchartsReactRefObject`](#highchartsreactrefobject) | The chart instance and container element from the `ref` of the [chart components](https://www.highcharts.com/docs/react/components/chart)           |
| [`<Name>SeriesProps`](#nameseriesprops)                 | The props of a [dedicated series component](https://www.highcharts.com/docs/react/components/series-types#dedicated-series), such as `ColumnSeries` |
| [`SeriesProps`](#seriesprops)                           | The props of the [generic `Series` component](https://www.highcharts.com/docs/react/components/series-types#generic-series)                         |
| [`SeriesOptions`](#seriesoptions)                       | The `options` prop of a [series component](https://www.highcharts.com/docs/react/components/series-types)                                           |
| [`SeriesType`](#seriestype)                             | The `type` prop of the [generic `Series` component](https://www.highcharts.com/docs/react/components/series-types#generic-series)                   |
| [`<Name>Props`](#chart-element-components)              | The props of a chart element component, such as [`Title`](https://www.highcharts.com/docs/react/components/chart-elements/title)                    |
| [`<Name>Props`](#module-components)                     | The props of a module component, such as [`Exporting`](https://www.highcharts.com/docs/react/components/modules/exporting)                          |
| [`<Name>SeriesProps`](#technical-indicator-components)  | The props of a [technical indicator component](https://www.highcharts.com/docs/react/components/technical-indicators), such as `SMASeries`          |

## Chart components

### `ChartProps`

Use `ChartProps` to type the props of a chart component:

```tsx
import { useState } from "react";
import { Chart, type ChartProps } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function App() {
  const [chartProps] = useState<ChartProps>({
    title: "Monthly sales",
    height: 300,
  });

  return (
    <Chart {...chartProps}>
      <ColumnSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

**Note:** Use `ChartProps` with any chart component: [`Chart`](https://www.highcharts.com/docs/react/components/chart#highcharts-core), [`StockChart`](https://www.highcharts.com/docs/react/components/chart#highcharts-stock), [`MapsChart`](https://www.highcharts.com/docs/react/components/chart#highcharts-maps), or [`GanttChart`](https://www.highcharts.com/docs/react/components/chart#highcharts-gantt). Import it from the same entry point as your component, for example `@highcharts/react/Stock`.

### `ChartOptions`

Use `ChartOptions` to type the `options` prop of a chart component:

```tsx
import { useState } from "react";
import { Chart, type ChartOptions } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function App() {
  const [chartOptions] = useState<ChartOptions>({
    chart: {
      backgroundColor: "#f8f8ff",
    },
  });

  return (
    <Chart options={chartOptions}>
      <ColumnSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

### `HighchartsReactRefObject`

Use `HighchartsReactRefObject` to type the `ref` of a chart component and access the [chart instance](https://www.highcharts.com/docs/react/chart-instance) and its container element:

```tsx
import { useEffect, useRef } from "react";
import { Chart, type HighchartsReactRefObject } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function App() {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    if (chartRef.current) {
      const { chart, container } = chartRef.current;
      // Access the chart instance and its container element.
    }
  }, []);

  return (
    <Chart ref={chartRef}>
      <ColumnSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

## Series components

### `<Name>SeriesProps`

Use `<Name>SeriesProps` to type the props of a dedicated series component, such as `ColumnSeriesProps` from `@highcharts/react/series/Column`:

```tsx
import { useState } from "react";
import { Chart } from "@highcharts/react";
import {
  ColumnSeries,
  type ColumnSeriesProps,
} from "@highcharts/react/series/Column";

export default function App() {
  const [seriesProps] = useState<ColumnSeriesProps>({
    name: "Revenue",
    data: [1, 2, 3],
  });

  return (
    <Chart>
      <ColumnSeries {...seriesProps} />
    </Chart>
  );
}
```

### `SeriesProps`

Use `SeriesProps` to type the props of the generic `Series` component:

```tsx
import { useState } from "react";
import { Chart, Series, type SeriesProps } from "@highcharts/react";

export default function App() {
  const [seriesProps] = useState<SeriesProps<"column">>({
    name: "Revenue",
    data: [1, 2, 3],
    options: { borderRadius: 8 },
  });

  return (
    <Chart>
      <Series type="column" {...seriesProps} />
    </Chart>
  );
}
```

### `SeriesOptions`

Use `SeriesOptions` to type the `options` prop of a series component:

```tsx
import { useState } from "react";
import { Chart, Series, type SeriesOptions } from "@highcharts/react";

export default function App() {
  const [seriesOptions] = useState<SeriesOptions<"column">>({
    name: "Revenue",
    data: [1, 2, 3],
    borderRadius: 8,
  });

  return (
    <Chart>
      <Series type="column" options={seriesOptions} />
    </Chart>
  );
}
```

### `SeriesType`

Use `SeriesType` to type the `type` prop of the generic `Series` component, for example when switching series types at runtime:

```tsx
import { useState } from "react";
import { Chart, Series, type SeriesType } from "@highcharts/react";

export default function App() {
  const [seriesType, setSeriesType] = useState<SeriesType>("line");

  function toggleSeriesType() {
    setSeriesType((prev) => (prev === "line" ? "column" : "line"));
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

## Chart element components

Use `<Name>Props` to type the props of a chart element component, such as `TitleProps` from `@highcharts/react/options/Title`:

```tsx
import { useState } from "react";
import { Chart, Title } from "@highcharts/react";
import type { TitleProps } from "@highcharts/react/options/Title";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function App() {
  const [titleProps] = useState<TitleProps>({
    text: "Monthly sales",
    align: "left",
  });

  return (
    <Chart>
      <Title {...titleProps} />
      <ColumnSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

## Module components

Use `<Name>Props` to type the props of a module component, such as `ExportingProps` from `@highcharts/react/modules/Exporting`:

```tsx
import { useState } from "react";
import { Chart } from "@highcharts/react";
import {
  Exporting,
  type ExportingProps,
} from "@highcharts/react/modules/Exporting";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function App() {
  const [exportingProps] = useState<ExportingProps>({
    filename: "monthly-sales",
  });

  return (
    <Chart>
      <Exporting {...exportingProps} />
      <ColumnSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

## Technical indicator components

Use `<Name>SeriesProps` to type the props of a technical indicator component, such as `SMASeriesProps` from `@highcharts/react/indicators/SMA`:

```tsx
import { useState } from "react";
import { Chart } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";
import {
  SMASeries,
  type SMASeriesProps,
} from "@highcharts/react/indicators/SMA";

export default function App() {
  const [smaProps] = useState<SMASeriesProps>({
    options: { linkedTo: "revenue", params: { period: 3 } },
  });

  return (
    <Chart>
      <ColumnSeries id="revenue" data={[1, 3, 2, 4, 3, 5]} />
      <SMASeries {...smaProps} />
    </Chart>
  );
}
```

## See also

- [Highcharts TypeScript declarations](https://www.highcharts.com/docs/advanced-chart-features/highcharts-typescript-declarations)
