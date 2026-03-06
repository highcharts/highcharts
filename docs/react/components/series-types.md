# Series types

You can add a series to your chart using the generic `Series` component or a dedicated component like `ColumnSeries`.

## Generic series

The `Series` component supports any [series type](https://api.highcharts.com/highcharts/series) available in the `Highcharts` bundle.

```tsx
import { Chart, Series } from "@highcharts/react";

export default function ColumnChart() {
  return (
    <Chart>
      <Series type="column" data={[1, 2, 3]} />
    </Chart>
  );
}
```

When using the `Series` component, some series types require you to import an additional module:

```tsx
import { Chart, Series } from "@highcharts/react";
import "highcharts/esm/modules/venn.src.js";

export default function VennChart() {
  return (
    <Chart>
      <Series
        type="venn"
        data={[
          {
            sets: ["A"],
            value: 2,
          },
          {
            sets: ["B"],
            value: 2,
          },
          {
            sets: ["A", "B"],
            value: 1,
          },
        ]}
      />
    </Chart>
  );
}
```

> **Note:** You should import additional modules using their ESM versions. See the [Bundling and tree shaking](https://www.highcharts.com/docs/react/bundling-and-tree-shaking) documentation.

To determine which module is needed, refer to the **Requires** section under each [series](https://api.highcharts.com/highcharts/series).

### Other chart types

Each chart type has its own generic series component:

| Chart component | Series component | Import path               |
| --------------- | ---------------- | ------------------------- |
| `StockChart`    | `StockSeries`    | `@highcharts/react/Stock` |
| `MapsChart`     | `MapsSeries`     | `@highcharts/react/Maps`  |
| `GanttChart`    | `GanttSeries`    | `@highcharts/react/Gantt` |

### Props

All chart type series components share the following props:

| Option    | Type     | Default | Description                                                                                                                                     |
| --------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| type      | `string` | -       | The series type to render. See all available [series types](https://api.highcharts.com/highcharts/series).                                      |
| data      | `array`  | -       | Data points for the series. Format depends on the series `type` (see [series.data](https://api.highcharts.com/highcharts/series.line.data)).    |
| options   | `object` | -       | Configuration options for the series. Available options depend on the `type` (see [series](https://api.highcharts.com/highcharts/series.line)). |
| id        | `string` | -       | ID for the series. Maps to [series.id](https://api.highcharts.com/highcharts/series.line.id).                                                   |
| className | `string` | -       | Class name for the series' graphical elements. Maps to [series.className](https://api.highcharts.com/highcharts/series.line.className).         |

### When to use generic series

We recommend using [dedicated series](https://www.highcharts.com/docs/react/components/series-types#dedicated-series) components in most cases to keep your code lean. Reserve the generic `Series` component for situations where dedicated components become impractical — for example, when [adding series dynamically](https://www.highcharts.com/docs/react/data-handling#add-series-dynamically).

## Dedicated series

Each series type has its own dedicated component:

```tsx
import { Chart } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function ColumnChart() {
  return (
    <Chart>
      <ColumnSeries data={[1, 2, 3]} />
    </Chart>
  );
}
```

**Note:** Unlike `Series`, dedicated components bundle any required modules automatically — no extra imports needed.

Dedicated series components support the same [props](#props) as `Series`, except for `type`.

## Available components

| Series Type       | Component               | Product          |
| ----------------- | ----------------------- | ---------------- |
| arcdiagram        | `<ArcDiagram />`        | Highcharts Core  |
| area              | `<Area />`              | Highcharts Core  |
| arearange         | `<AreaRange />`         | Highcharts Core  |
| areaspline        | `<AreaSpline />`        | Highcharts Core  |
| areasplinerange   | `<AreaSplineRange />`   | Highcharts Core  |
| bar               | `<Bar />`               | Highcharts Core  |
| bellcurve         | `<Bellcurve />`         | Highcharts Core  |
| boxplot           | `<BoxPlot />`           | Highcharts Core  |
| bubble            | `<Bubble />`            | Highcharts Core  |
| bullet            | `<Bullet />`            | Highcharts Core  |
| column            | `<Column />`            | Highcharts Core  |
| columnpyramid     | `<ColumnPyramid />`     | Highcharts Core  |
| columnrange       | `<ColumnRange />`       | Highcharts Core  |
| cylinder          | `<Cylinder />`          | Highcharts Core  |
| dependencywheel   | `<DependencyWheel />`   | Highcharts Core  |
| dumbbell          | `<Dumbbell />`          | Highcharts Core  |
| errorbar          | `<ErrorBar />`          | Highcharts Core  |
| funnel            | `<Funnel />`            | Highcharts Core  |
| funnel3d          | `<Funnel3D />`          | Highcharts Core  |
| gauge             | `<Gauge />`             | Highcharts Core  |
| heatmap           | `<Heatmap />`           | Highcharts Core  |
| histogram         | `<Histogram />`         | Highcharts Core  |
| item              | `<Item />`              | Highcharts Core  |
| line              | `<Line />`              | Highcharts Core  |
| lollipop          | `<Lollipop />`          | Highcharts Core  |
| networkgraph      | `<Networkgraph />`      | Highcharts Core  |
| organization      | `<Organization />`      | Highcharts Core  |
| packedbubble      | `<PackedBubble />`      | Highcharts Core  |
| pareto            | `<Pareto />`            | Highcharts Core  |
| pictorial         | `<Pictorial />`         | Highcharts Core  |
| pie               | `<Pie />`               | Highcharts Core  |
| polygon           | `<Polygon />`           | Highcharts Core  |
| pyramid           | `<Pyramid />`           | Highcharts Core  |
| pyramid3d         | `<Pyramid3D />`         | Highcharts Core  |
| sankey            | `<Sankey />`            | Highcharts Core  |
| scatter           | `<Scatter />`           | Highcharts Core  |
| scatter3d         | `<Scatter3D />`         | Highcharts Core  |
| solidgauge        | `<SolidGauge />`        | Highcharts Core  |
| spline            | `<Spline />`            | Highcharts Core  |
| streamgraph       | `<Streamgraph />`       | Highcharts Core  |
| sunburst          | `<Sunburst />`          | Highcharts Core  |
| timeline          | `<Timeline />`          | Highcharts Core  |
| treegraph         | `<Treegraph />`         | Highcharts Core  |
| treemap           | `<Treemap />`           | Highcharts Core  |
| variablepie       | `<VariablePie />`       | Highcharts Core  |
| variwide          | `<Variwide />`          | Highcharts Core  |
| vector            | `<Vector />`            | Highcharts Core  |
| venn              | `<Venn />`              | Highcharts Core  |
| waterfall         | `<Waterfall />`         | Highcharts Core  |
| windbarb          | `<Windbarb />`          | Highcharts Core  |
| wordcloud         | `<Wordcloud />`         | Highcharts Core  |
| candlestick       | `<Candlestick />`       | Highcharts Stock |
| flags             | `<Flags />`             | Highcharts Stock |
| heikinashi        | `<HeikinAshi />`        | Highcharts Stock |
| hlc               | `<HLC />`               | Highcharts Stock |
| hollowcandlestick | `<HollowCandlestick />` | Highcharts Stock |
| ohlc              | `<OHLC />`              | Highcharts Stock |
| pointandfigure    | `<PointAndFigure />`    | Highcharts Stock |
| renko             | `<Renko />`             | Highcharts Stock |
| flowmap           | `<FlowMap />`           | Highcharts Maps  |
| geoheatmap        | `<GeoHeatmap />`        | Highcharts Maps  |
| map               | `<Map />`               | Highcharts Maps  |
| mapbubble         | `<MapBubble />`         | Highcharts Maps  |
| mapline           | `<MapLine />`           | Highcharts Maps  |
| mappoint          | `<MapPoint />`          | Highcharts Maps  |
| tiledwebmap       | `<TiledWebMap />`       | Highcharts Maps  |
| tilemap           | `<Tilemap />`           | Highcharts Maps  |
| gantt             | `<Gantt />`             | Highcharts Gantt |
| xrange            | `<XRange />`            | Highcharts Gantt |
