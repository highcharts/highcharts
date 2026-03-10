# PlotOptions

You can set default options that affect multiple series by using the `PlotOptions` component:

```tsx
import { Chart, PlotOptions } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function PlotOptionsChart() {
  return (
    <Chart>
      <PlotOptions series={{ dataLabels: { enabled: true } }} />
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

At the moment, the `PlotOptions` component accepts only the [series API option](https://api.highcharts.com/highcharts/plotOptions.series).
