# Chart

Highcharts React provides dedicated chart components. Each serves as the root of your chart, containing series and other chart elements.

## Highcharts Core

Use the `Chart` component to create Core charts:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function ChartComponent() {
  return (
    <Chart
      spacing={[20, 20, 25, 20]}
      options={{
        chart: {
          zooming: {
            type: "x",
          },
        },
      }}
      containerProps={{
        className: "chart-element",
        style: { width: "100%", height: "100%" },
      }}
    >
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

### Props:

| Option           | Type                                                                                          | Default                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options          | `ChartOptions`                                                                                | -                                                                                                                | Chart configuration object. See [TypeScript](https://www.highcharts.com/docs/react/typescript) and all available [options](https://api.highcharts.com/highcharts/).                                                                                                                                                                                                                                                                                                                                                                                                     |
| containerProps   | `object`                                                                                      | -                                                                                                                | HTML attributes passed to the `<div>` container in which the chart is rendered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ref              | `ref`                                                                                         | -                                                                                                                | React ref object providing access to the chart instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| highcharts       | `object`                                                                                      | -                                                                                                                | Highcharts instance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| chartConstructor | `string`                                                                                      | `chart`                                                                                                          | Chart constructor. Available values: `chart`, `stockChart`, `mapChart`, `ganttChart`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| renderToHTML     | `function`                                                                                    | Built-in renderer                                                                                                | Converts React elements to static HTML strings.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| title            | `string`                                                                                      | `"Chart title"`                                                                                                  | Chart title text. To disable the title, set it to `undefined`. Maps to [title.text](https://api.highcharts.com/highcharts/title.text).                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| subtitle         | `string`                                                                                      | -                                                                                                                | Chart subtitle text. Maps to [subtitle.text](https://api.highcharts.com/highcharts/subtitle.text).                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| caption          | `string`                                                                                      | -                                                                                                                | Chart caption text. Maps to [caption.text](https://api.highcharts.com/highcharts/caption.text).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| credits          | `string`                                                                                      | `"Highcharts.com"`                                                                                               | Credits label text. Maps to [credits.text](https://api.highcharts.com/highcharts/credits.text).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| type             | `string`                                                                                      | `"line"`                                                                                                         | Default series type for the chart. Maps to [chart.type](https://api.highcharts.com/highcharts/chart.type).                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| height           | `number` \| `string`                                                                          | -                                                                                                                | Explicit chart height in pixels or as a percentage string (for example `"56%"` of chart width). Maps to [chart.height](https://api.highcharts.com/highcharts/chart.height).                                                                                                                                                                                                                                                                                                                                                                                             |
| width            | `number` \| `string`                                                                          | -                                                                                                                | Chart width shortcut. Maps to [chart.width](https://api.highcharts.com/highcharts/chart.width).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| inverted         | `boolean`                                                                                     | `false`                                                                                                          | Inverts axes so x-axis is vertical and y-axis horizontal (x-axis is reversed by default). Maps to [chart.inverted](https://api.highcharts.com/highcharts/chart.inverted).                                                                                                                                                                                                                                                                                                                                                                                               |
| animation        | `boolean` \| `Partial<Highcharts.AnimationOptionsObject>`                                     | `true`                                                                                                           | Overall animation for chart updates. Set `false` to disable updates animation, or pass `defer`, `duration`, and `easing` options. Initial series animation is controlled by [plotOptions.series.animation](https://api.highcharts.com/highcharts/plotOptions.series.animation). Maps to [chart.animation](https://api.highcharts.com/highcharts/chart.animation).                                                                                                                                                                                                       |
| styledMode       | `boolean`                                                                                     | `false`                                                                                                          | Enables styled mode. In styled mode, presentational SVG attributes are not applied; styling should be done in CSS. Maps to [chart.styledMode](https://api.highcharts.com/highcharts/chart.styledMode).                                                                                                                                                                                                                                                                                                                                                                  |
| backgroundColor  | `string`                                                                                      | -                                                                                                                | Chart background color. Maps to [chart.backgroundColor](https://api.highcharts.com/highcharts/chart.backgroundColor).                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| borderColor      | `Highcharts.ColorString` \| `Highcharts.GradientColorObject` \| `Highcharts.PatternObject`    | `"#334eff"`                                                                                                      | Color of the outer chart border. In styled mode, the stroke is set with the `.highcharts-background` class. Maps to [chart.borderColor](https://api.highcharts.com/highcharts/chart.borderColor).                                                                                                                                                                                                                                                                                                                                                                       |
| borderWidth      | `number`                                                                                      | `0`                                                                                                              | Width of the outer chart border. Maps to [chart.borderWidth](https://api.highcharts.com/highcharts/chart.borderWidth).                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| margin           | `number` \| `Array<number>`                                                                   | -                                                                                                                | Margin between the chart outer edge and the plot area. Array order is top, right, bottom, left. Use [chart.marginTop](https://api.highcharts.com/highcharts/chart.marginTop), [chart.marginRight](https://api.highcharts.com/highcharts/chart.marginRight), [chart.marginBottom](https://api.highcharts.com/highcharts/chart.marginBottom), and [chart.marginLeft](https://api.highcharts.com/highcharts/chart.marginLeft) for per-side shorthand. Maps to [chart.margin](https://api.highcharts.com/highcharts/chart.margin).                                          |
| spacing          | `Array<number>`                                                                               | `[10, 10, 15, 10]`                                                                                               | Distance between the chart outer edge and chart content (title, legend, axis labels). Array order is top, right, bottom, left. Use [chart.spacingTop](https://api.highcharts.com/highcharts/chart.spacingTop), [chart.spacingRight](https://api.highcharts.com/highcharts/chart.spacingRight), [chart.spacingBottom](https://api.highcharts.com/highcharts/chart.spacingBottom), and [chart.spacingLeft](https://api.highcharts.com/highcharts/chart.spacingLeft) for per-side shorthand. Maps to [chart.spacing](https://api.highcharts.com/highcharts/chart.spacing). |
| colors           | `Array<Highcharts.ColorString \| Highcharts.GradientColorObject \| Highcharts.PatternObject>` | `["#2caffe", "#544fc5", "#00e272", "#fe6a35", "#6b8abc", "#d568fb", "#2ee0ca", "#fa4b42", "#feb56a", "#91e8e1"]` | Default series colors. When all colors are used, new colors are pulled from the start. In styled mode, `colors` is not used (use CSS classes or [chart.colorCount](https://api.highcharts.com/highcharts/chart.colorCount)). Maps to [colors](https://api.highcharts.com/highcharts/colors).                                                                                                                                                                                                                                                                            |

> **Note:** These props cover only selected chart options. Configure all other options through the `options` prop.

## Highcharts Stock

Use the `StockChart` component to create Stock charts:

```tsx
import { StockChart } from "@highcharts/react/Stock";
import { CandlestickSeries } from "@highcharts/react/series/Candlestick";

export default function StockChartComponent() {
  return (
    <StockChart>
      <CandlestickSeries
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
import { MapsChart } from "@highcharts/react/Maps";
import { MapSeries } from "@highcharts/react/series/Map";

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
import { GanttChart } from "@highcharts/react/Gantt";
import { GanttSeries } from "@highcharts/react/series/Gantt";

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
