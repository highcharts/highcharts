---
description: >-
  Customize chart title text with the Title component, pass title API options
  as props, and supply the displayed text as child content inside the chart.
---

# Title

You can customize the [chart title](https://www.highcharts.com/docs/chart-concepts/title-and-subtitle) using the `Title` component:

```tsx
import { Chart, Title } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function TitleChart() {
  return (
    <Chart>
      <Title>Monthly Sales</Title>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Title` component accepts all [title API options](https://api.highcharts.com/highcharts/title) as props. The [title text](https://api.highcharts.com/highcharts/title.text) can be passed as `children`.
