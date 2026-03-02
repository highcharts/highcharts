# BrokenAxis

You can add the broken-axis module to your chart using the `BrokenAxis` component:

```tsx
import { Chart, XAxis } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { BrokenAxis } from "@highcharts/react/modules/BrokenAxis";

export default function BrokenAxisChart() {
  return (
    <Chart>
      <BrokenAxis />
      <XAxis
        tickInterval={1}
        breaks={[
          {
            from: 2,
            to: 7,
            breakSize: 1,
          },
        ]}
      />
      <LineSeries
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        options={{ gapSize: 1 }}
      />
    </Chart>
  );
}
```

To configure broken-axis behavior on your chart, see the [xAxis.breaks](https://api.highcharts.com/highcharts/xAxis.breaks) / [yAxis.breaks](https://api.highcharts.com/highcharts/yAxis.breaks) and series.gapSize / series.gapUnit API options.
