---
description: >-
  Configure x-axis options with the XAxis component, including plot bands,
  pass axis API settings as props, supply axis title text as child content, and
  add several x-axes to a chart.
---

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

The `XAxis` component accepts all [x-axis API options](https://api.highcharts.com/highcharts/xAxis) as props. The [axis title text](https://api.highcharts.com/highcharts/xAxis.title.text) can be passed as `children`, and the other [title options](https://api.highcharts.com/highcharts/xAxis.title) through the `title` prop.

A chart can have several x-axes, one `XAxis` component per axis. The first `XAxis` has index `0`, the second index `1`, and so on, and a series selects an axis by that index:

```tsx
import { Chart, XAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function MultipleXAxesChart() {
  return (
    <Chart>
      <XAxis />
      <XAxis opposite={true} />
      <LineSeries data={[3, 4, 1, 5, 2]} />
      <LineSeries data={[1, 2, 5, 3, 4]} options={{ xAxis: 1 }} />
    </Chart>
  );
}
```
