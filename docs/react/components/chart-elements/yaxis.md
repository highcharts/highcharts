---
description: >-
  Configure y-axis options such as plot bands with the YAxis component, pass
  axis API settings as props, set the axis title through children or the title
  prop, and add several y-axes that series select by index.
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

The `YAxis` component accepts all [y-axis API options](https://api.highcharts.com/highcharts/yAxis) as props.

Children set [`title.text`](https://api.highcharts.com/highcharts/yAxis.title.text), and the `title` prop carries the other [title options](https://api.highcharts.com/highcharts/yAxis.title), as in `<YAxis title={{ align: "high" }}>Y axis values</YAxis>`.

A chart can have several y-axes, one `YAxis` component per axis. A series selects an axis by its index, which follows the order the components are written in (see [Child order](https://www.highcharts.com/docs/react/component-children#child-order)):

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
