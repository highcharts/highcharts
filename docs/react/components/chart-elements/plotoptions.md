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
