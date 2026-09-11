# XAxis

You can customize the [chart x-axis](https://www.highcharts.com/docs/chart-concepts/axes) using the `XAxis` component:

```tsx
import { Chart, XAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function XAxisChart() {
  return (
    <Chart>
      <XAxis plotBands={[{ from: 1, to: 2, color: "red" }]}>
        X axis values
      </XAxis>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `XAxis` component accepts all [x-axis API options](https://api.highcharts.com/highcharts/xAxis) as props.

Children set [`title.text`](https://api.highcharts.com/highcharts/xAxis.title.text), and the `title` prop carries the other [title options](https://api.highcharts.com/highcharts/xAxis.title), as in `<XAxis title={{ align: "high" }}>X axis values</XAxis>`.

An x-axis has no title by default. To add one, set it through children, or through the `title` prop as `title={{ text: "X axis values" }}`.

A chart can have several x-axes. To add them, render one `XAxis` component per axis. They make up the [`xAxis`](https://api.highcharts.com/highcharts/xAxis) array in the order they are written, so the first `XAxis` is index `0`, the second is index `1`, and so on. A series selects an axis by that index:

```tsx
import { Chart, XAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function MultipleXAxesChart() {
  return (
    <Chart>
      <XAxis /> {/* index 0 */}
      <XAxis opposite={true} /> {/* index 1 */}
      <LineSeries data={[3, 4, 1, 5, 2]} />
      <LineSeries data={[1, 2, 5, 3, 4]} options={{ xAxis: 1 }} />
    </Chart>
  );
}
```
