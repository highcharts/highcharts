# PlotOptions

You can set default options that affect multiple series by using the `PlotOptions` component:

```tsx
import { Chart, PlotOptions } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";
import { LineSeries } from "@highcharts/react/series/Line";

export default function PlotOptionsChart() {
  return (
    <Chart>
      <PlotOptions
        series={{ dataLabels: { enabled: true } }}
        line={{ marker: { enabled: false } }}
        column={{ borderRadius: 5 }}
      />
      <LineSeries data={[3, 4, 1, 5, 2]} />
      <ColumnSeries data={[2, 1, 3, 2, 4]} />
    </Chart>
  );
}
```

The `PlotOptions` component supports both the generic
[`plotOptions.series`](https://api.highcharts.com/highcharts/plotOptions.series)
option and specific series keys like
[`plotOptions.line`](https://api.highcharts.com/highcharts/plotOptions.line)
and
[`plotOptions.column`](https://api.highcharts.com/highcharts/plotOptions.column).

## Scope and precedence

Series options resolve in three levels, each overriding the one before it:

1. `series`, which applies to every series in the chart.
2. A series-type key such as `line` or `column`, which applies only to series of that type and overrides `series` for them.
3. Options set on an individual series component, which override both.

The key an option sits under therefore decides which series it reaches, not just where it is written. In the example above `dataLabels` is set on `series`, so both the line and the column series show them. Moving it to `column` would leave the line series without labels.
