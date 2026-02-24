# Chart

Highcharts React integration provides dedicated chart components. Each serves as the root of your chart, containing series and other chart elements.

## Highcharts Core

Use the `Chart` component to create Core charts:

```tsx
import { Chart, Series } from "@highcharts/react";

export default function ChartComponent() {
  return (
    <Chart
      options={{
        chart: {
          spacing: [20, 20, 25, 20],
        },
      }}
      containerProps={{
        className: "chart-element",
        style: { width: "100%", height: "100%" },
      }}
    >
      <Series data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

### Props:

| Option           | Type       | Default           | Description                                                                                      |
| ---------------- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| options          | `object`   | -                 | Chart configuration object. See all available [options](https://api.highcharts.com/highcharts/). |
| containerProps   | `object`   | -                 | HTML attributes passed to the `<div>` container in which the chart is rendered.                  |
| ref              | `ref`      | -                 | React ref object providing access to the chart instance.                                         |
| highcharts       | `object`   | -                 | Highcharts instance.                                                                             |
| chartConstructor | `string`   | `chart`           | Chart constructor. Available values: `chart`, `stockChart`, `mapChart`, `ganttChart`.            |
| renderToHTML     | `function` | Built-in renderer | Converts React elements to static HTML strings.                                                  |
| title            | `string`   | `null`            | Chart title. Maps to [title.text](https://api.highcharts.com/highcharts/title.text).             |

## Highcharts Stock

Use the `StockChart` component to create Stock charts:

```tsx
import { StockChart, StockSeries } from "@highcharts/react/Stock";

export default function StockChartComponent() {
  return (
    <StockChart>
      <StockSeries
        type="candlestick"
        data={[
          [1609459200000, 100, 110, 90, 105],
          [1609545600000, 105, 115, 95, 110],
          [1609632000000, 110, 120, 100, 115],
        ]}
      />
    </StockChart>
  );
}
```

**Note:** Shares the exact same [props](#props) as the `Chart` component.

You can also use **technical indicators** with your Stock charts. See the [Technical indicators](https://www.highcharts.com/docs/react/components/technical-indicators) documentation.

## Highcharts Maps

Use the `MapsChart` component to create Map charts:

```tsx
import { MapsChart, MapSeries } from "@highcharts/react/Maps";

// Fetch map data
const mapData = await fetch(
  "https://code.highcharts.com/mapdata/custom/world.topo.json",
).then((res) => (res.ok ? res.json() : null));

export default function MapsChartComponent() {
  return (
    <MapsChart
      options={{
        chart: {
          map: mapData,
        },
      }}
    >
      <MapSeries
        data={[
          { "hc-key": "no", value: 1 },
          { "hc-key": "dk", value: 2 },
          { "hc-key": "se", value: 3 },
        ]}
      />
    </MapsChart>
  );
}
```

**Note:** Shares the exact same [props](#props) as the `Chart` component.

## Highcharts Gantt

Use the `GanttChart` component to create Gantt charts:

```tsx
import { GanttChart, GanttSeries } from "@highcharts/react/Gantt";

export default function GanttChartComponent() {
  return (
    <GanttChart>
      <GanttSeries
        data={[
          {
            start: Date.UTC(2026, 0, 1),
            end: Date.UTC(2026, 0, 5),
            name: "Task 1",
          },
          {
            start: Date.UTC(2026, 0, 3),
            end: Date.UTC(2026, 0, 8),
            name: "Task 2",
          },
        ]}
      />
    </GanttChart>
  );
}
```

**Note:** Shares the exact same [props](#props) as the `Chart` component.

To learn more about series components, see the [Series types](https://www.highcharts.com/docs/react/components/series-types#other-chart-types) documentation.
