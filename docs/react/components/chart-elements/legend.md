# Legend

You can customize the [chart legend](https://www.highcharts.com/docs/chart-concepts/legend) using the `Legend` component:

```tsx
import { Chart, Legend } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function LegendChart() {
  return (
    <Chart>
      <Legend>{"{index}: {name}"}</Legend>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Legend` component accepts all [legend API options](https://api.highcharts.com/highcharts/legend) as props. The [label format](https://api.highcharts.com/highcharts/legend.labelFormat) can be passed as `children`.
