# PlotOptions

You can set default options that affect multiple series by using the `PlotOptions` component:

```tsx
import { Chart, Series, PlotOptions } from "@highcharts/react";

export default function PlotOptionsChart() {
  return (
    <Chart>
      <PlotOptions series={{ dataLabels: { enabled: true } }} />
      <Series data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

At the moment, the `PlotOptions` component accepts only the [series API option](https://api.highcharts.com/highcharts/plotOptions.series).
