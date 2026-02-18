# PlotOptions

You can configure default series options using the `PlotOptions` component:

```tsx
import { Chart, Serie, PlotOptions } from "@highcharts/react";

export default function PlotOptionsChart() {
  return (
    <Chart>
      <PlotOptions series={{ dataLabels: { enabled: true } }} />
      <Series data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `PlotOptions` component accepts all [plotOptions API options](https://api.highcharts.com/highcharts/plotOptions) as props.
