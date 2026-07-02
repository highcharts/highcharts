# YAxis

You can customize the [chart y-axis](https://www.highcharts.com/docs/chart-concepts/axes) using the `YAxis` component:

```tsx
import { Chart, YAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function YAxisChart() {
  return (
    <Chart>
      <YAxis plotBands={[{ from: 2, to: 4, color: "red" }]}>
        Y axis values
      </YAxis>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `YAxis` component accepts all [y-axis API options](https://api.highcharts.com/highcharts/yAxis) as props. The [axis title text](https://api.highcharts.com/highcharts/yAxis.title.text) can be passed as `children`.
