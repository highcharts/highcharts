---
description: >-
  Configure y-axis options with the YAxis component, including plot bands,
  pass axis API settings as props, supply axis title text as child content, and
  add several y-axes to a chart.
---

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

The `YAxis` component accepts all [y-axis API options](https://api.highcharts.com/highcharts/yAxis) as props. The [axis title text](https://api.highcharts.com/highcharts/yAxis.title.text) can be passed as `children`, and the other [title options](https://api.highcharts.com/highcharts/yAxis.title) through the `title` prop.

A chart can have several y-axes, one `YAxis` component per axis. The first `YAxis` has index `0`, the second index `1`, and so on, and a series selects an axis by that index:

```tsx
import { Chart, YAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function MultipleYAxesChart() {
  return (
    <Chart>
      <YAxis />
      <YAxis opposite={true} />
      <LineSeries data={[3, 4, 1, 5, 2]} />
      <LineSeries data={[1, 2, 5, 3, 4]} options={{ yAxis: 1 }} />
    </Chart>
  );
}
```
