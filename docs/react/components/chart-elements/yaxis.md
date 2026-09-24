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

The `YAxis` component accepts all [y-axis API options](https://api.highcharts.com/highcharts/yAxis) as props.

Children set [`title.text`](https://api.highcharts.com/highcharts/yAxis.title.text), and the `title` prop carries the other [title options](https://api.highcharts.com/highcharts/yAxis.title), as in `<YAxis title={{ align: "high" }}>Y axis values</YAxis>`.

A y-axis has a default title, [`Values`](https://api.highcharts.com/highcharts/yAxis.title.text), which can also be changed through the [`lang.yAxisTitle`](https://api.highcharts.com/highcharts/lang.yAxisTitle) option. To render no title at all, set the title text to `null`, as in `<YAxis title={{ text: null }} />`.

A chart can have several y-axes. To add them, render one `YAxis` component per axis. They make up the [`yAxis`](https://api.highcharts.com/highcharts/yAxis) array in the order they are written, so the first `YAxis` is index `0`, the second is index `1`, and so on. A series selects an axis by that index:

```tsx
import { Chart, YAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function MultipleYAxesChart() {
  return (
    <Chart>
      <YAxis /> {/* index 0 */}
      <YAxis opposite={true} /> {/* index 1 */}
      <LineSeries data={[3, 4, 1, 5, 2]} />
      <LineSeries data={[1, 2, 5, 3, 4]} options={{ yAxis: 1 }} />
    </Chart>
  );
}
```
