---
description: >-
  Configure x-axis options such as plot bands with the XAxis component, pass
  axis API settings as props, set the axis title through children or the title
  prop, and add several x-axes that series select by index.
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

The `XAxis` component accepts all [x-axis API options](https://api.highcharts.com/highcharts/xAxis) as props.

Children set [`title.text`](https://api.highcharts.com/highcharts/xAxis.title.text), and the `title` prop carries the other [title options](https://api.highcharts.com/highcharts/xAxis.title), as in `<XAxis title={{ align: "high" }}>X axis values</XAxis>`.

A chart can have several x-axes, one `XAxis` component per axis. A series selects an axis by its index, which follows the order the components are written in (see [Child order](https://www.highcharts.com/docs/react/component-children#child-order)):

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
