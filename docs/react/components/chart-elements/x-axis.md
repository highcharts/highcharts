# XAxis

You can customize the [chart x-axis](https://www.highcharts.com/docs/chart-concepts/axes) using the `XAxis` component:

```tsx
import { Chart, Series, XAxis } from "@highcharts/react";

export default function XAxisChart() {
  return (
    <Chart>
      <XAxis plotBands={[{ from: 1, to: 2, color: "red" }]}>
        X axis values
      </XAxis>
      <Series data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `XAxis` component accepts all [x-axis API options](https://api.highcharts.com/highcharts/xAxis) as props. The [axis title text](https://api.highcharts.com/highcharts/xAxis.title.text) can be passed as `children`.
