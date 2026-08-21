# Series types

You can add a series to your chart using the generic `Series` component or a dedicated component like `ColumnSeries`.

## Dedicated series

Each series type has its own dedicated component (see [available dedicated series components](#available-dedicated-series-components)):

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

**Note:** Dedicated series components bundle any required modules automatically — no extra imports needed.

### Dedicated series options

Each dedicated series component accepts all options available for its corresponding series type — for example, `LineSeries` supports all [series.line](https://api.highcharts.com/highcharts/series.line) options.

You can provide the most common options as direct props, and all of them via the `options` prop:

```tsx
// Via direct props
<LineSeries
  data={[1, 2, 3]}
  name="Line series"
  color="red"
/>

// Via options prop
<LineSeries
  data={[1, 2, 3]}
  options={{
    name: "Line series",
    color: "red"
  }}
/>
```

### Props

| Prop      | Type     | Default | Description                                                                                                                                      |
| --------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| data      | `array`  | -       | Data points for the series. Format depends on the series type (see [series.line.data](https://api.highcharts.com/highcharts/series.line.data)).  |
| name      | `string` | -       | The name of the series as shown in the legend, tooltip etc. (see [series.line.name](https://api.highcharts.com/highcharts/series.line.name)).    |
| id        | `string` | -       | The id of the series (see [series.line.id](https://api.highcharts.com/highcharts/series.line.id)).                                               |
| className | `string` | -       | The className of the series (see [series.line.className](https://api.highcharts.com/highcharts/series.line.className)).                          |
| color     | `string` | -       | The main color of the series (see [series.line.color](https://api.highcharts.com/highcharts/series.line.color)).                                 |
| index     | `number` | -       | The index of the series (see [series.line.index](https://api.highcharts.com/highcharts/series.line.index)).                                      |
| events    | `object` | -       | The events of the series (see [series.line.events](https://api.highcharts.com/highcharts/series.line.events)).                                   |
| options   | `object` | -       | Configuration options for the series. Available options depend on `type` (see [series.line](https://api.highcharts.com/highcharts/series.line)). |

### Available dedicated series components

| Series type       | Component                     | Product                                             |
| ----------------- | ----------------------------- | --------------------------------------------------- |
| arcdiagram        | `<ArcDiagramSeries />`        | Highcharts Core                                     |
| area              | `<AreaSeries />`              | Highcharts Core, Highcharts Stock                   |
| arearange         | `<AreaRangeSeries />`         | Highcharts Core, Highcharts Stock                   |
| areaspline        | `<AreaSplineSeries />`        | Highcharts Core, Highcharts Stock                   |
| areasplinerange   | `<AreaSplineRangeSeries />`   | Highcharts Core, Highcharts Stock                   |
| bar               | `<BarSeries />`               | Highcharts Core                                     |
| bellcurve         | `<BellcurveSeries />`         | Highcharts Core                                     |
| boxplot           | `<BoxPlotSeries />`           | Highcharts Core                                     |
| bubble            | `<BubbleSeries />`            | Highcharts Core, Highcharts Stock                   |
| bullet            | `<BulletSeries />`            | Highcharts Core                                     |
| column            | `<ColumnSeries />`            | Highcharts Core, Highcharts Stock                   |
| columnpyramid     | `<ColumnPyramidSeries />`     | Highcharts Core, Highcharts Stock                   |
| columnrange       | `<ColumnRangeSeries />`       | Highcharts Core, Highcharts Stock                   |
| contour           | `<ContourSeries />`           | Highcharts Core, Highcharts Maps                    |
| cylinder          | `<CylinderSeries />`          | Highcharts Core                                     |
| dependencywheel   | `<DependencyWheelSeries />`   | Highcharts Core                                     |
| dumbbell          | `<DumbbellSeries />`          | Highcharts Core, Highcharts Stock                   |
| errorbar          | `<ErrorBarSeries />`          | Highcharts Core                                     |
| funnel            | `<FunnelSeries />`            | Highcharts Core                                     |
| funnel3d          | `<Funnel3DSeries />`          | Highcharts Core                                     |
| gauge             | `<GaugeSeries />`             | Highcharts Core                                     |
| heatmap           | `<HeatmapSeries />`           | Highcharts Core, Highcharts Maps                    |
| histogram         | `<HistogramSeries />`         | Highcharts Core                                     |
| item              | `<ItemSeries />`              | Highcharts Core                                     |
| line              | `<LineSeries />`              | Highcharts Core, Highcharts Stock                   |
| lollipop          | `<LollipopSeries />`          | Highcharts Core, Highcharts Stock                   |
| networkgraph      | `<NetworkgraphSeries />`      | Highcharts Core                                     |
| organization      | `<OrganizationSeries />`      | Highcharts Core                                     |
| packedbubble      | `<PackedBubbleSeries />`      | Highcharts Core                                     |
| pareto            | `<ParetoSeries />`            | Highcharts Core                                     |
| pictorial         | `<PictorialSeries />`         | Highcharts Core                                     |
| pie               | `<PieSeries />`               | Highcharts Core, Highcharts Maps                    |
| polygon           | `<PolygonSeries />`           | Highcharts Core, Highcharts Stock                   |
| pyramid           | `<PyramidSeries />`           | Highcharts Core                                     |
| pyramid3d         | `<Pyramid3DSeries />`         | Highcharts Core                                     |
| sankey            | `<SankeySeries />`            | Highcharts Core                                     |
| scatter           | `<ScatterSeries />`           | Highcharts Core, Highcharts Stock                   |
| scatter3d         | `<Scatter3DSeries />`         | Highcharts Core                                     |
| solidgauge        | `<SolidGaugeSeries />`        | Highcharts Core                                     |
| spline            | `<SplineSeries />`            | Highcharts Core, Highcharts Stock                   |
| streamgraph       | `<StreamgraphSeries />`       | Highcharts Core, Highcharts Stock                   |
| sunburst          | `<SunburstSeries />`          | Highcharts Core                                     |
| timeline          | `<TimelineSeries />`          | Highcharts Core                                     |
| treegraph         | `<TreegraphSeries />`         | Highcharts Core                                     |
| treemap           | `<TreemapSeries />`           | Highcharts Core                                     |
| variablepie       | `<VariablePieSeries />`       | Highcharts Core                                     |
| variwide          | `<VariwideSeries />`          | Highcharts Core                                     |
| vector            | `<VectorSeries />`            | Highcharts Core, Highcharts Stock                   |
| venn              | `<VennSeries />`              | Highcharts Core                                     |
| waterfall         | `<WaterfallSeries />`         | Highcharts Core                                     |
| windbarb          | `<WindbarbSeries />`          | Highcharts Core, Highcharts Stock                   |
| wordcloud         | `<WordcloudSeries />`         | Highcharts Core                                     |
| candlestick       | `<CandlestickSeries />`       | Highcharts Stock                                    |
| flags             | `<FlagsSeries />`             | Highcharts Stock                                    |
| heikinashi        | `<HeikinAshiSeries />`        | Highcharts Stock                                    |
| hlc               | `<HLCSeries />`               | Highcharts Stock                                    |
| hollowcandlestick | `<HollowCandlestickSeries />` | Highcharts Stock                                    |
| ohlc              | `<OHLCSeries />`              | Highcharts Stock                                    |
| pointandfigure    | `<PointAndFigureSeries />`    | Highcharts Stock                                    |
| renko             | `<RenkoSeries />`             | Highcharts Stock                                    |
| flowmap           | `<FlowMapSeries />`           | Highcharts Maps                                     |
| geoheatmap        | `<GeoHeatmapSeries />`        | Highcharts Maps                                     |
| map               | `<MapSeries />`               | Highcharts Maps                                     |
| mapbubble         | `<MapBubbleSeries />`         | Highcharts Maps                                     |
| mapline           | `<MapLineSeries />`           | Highcharts Maps                                     |
| mappoint          | `<MapPointSeries />`          | Highcharts Maps                                     |
| tiledwebmap       | `<TiledWebMapSeries />`       | Highcharts Maps                                     |
| tilemap           | `<TilemapSeries />`           | Highcharts Core, Highcharts Maps                    |
| gantt             | `<GanttSeries />`             | Highcharts Gantt                                    |
| xrange            | `<XRangeSeries />`            | Highcharts Core, Highcharts Stock, Highcharts Gantt |

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
import "highcharts/es-modules/masters/modules/venn.src.js";

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

### Props

The generic `Series` component accepts the same [props](#props) as dedicated components, with the addition of `type`:

| Prop | Type     | Default | Description                                                                                                |
| ---- | -------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| type | `string` | `line`  | The series type to render. See all available [series types](https://api.highcharts.com/highcharts/series). |

### Other chart types

Each chart type has its own generic series component:

| Chart component | Series component | Import path               |
| --------------- | ---------------- | ------------------------- |
| `StockChart`    | `StockSeries`    | `@highcharts/react/Stock` |
| `MapsChart`     | `MapsSeries`     | `@highcharts/react/Maps`  |
| `GanttChart`    | `GanttSeries`    | `@highcharts/react/Gantt` |

### When to use generic series

We recommend using [dedicated series](#dedicated-series) components in most cases to keep your code lean. Reserve the generic `Series` component for situations where dedicated components become impractical — for example, when [adding series dynamically](https://www.highcharts.com/docs/react/data-handling#add-series-dynamically).

Dedicated series components support the same [props](#props) as `Series`, except for `type`.

