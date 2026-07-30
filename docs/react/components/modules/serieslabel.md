# SeriesLabel

You can add the series-label module to your chart using the `SeriesLabel` component:

```tsx
import { Chart, Legend } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { SeriesLabel } from "@highcharts/react/modules/SeriesLabel";

export default function SeriesLabelChart() {
  return (
    <Chart>
      <SeriesLabel />
      <Legend enabled={false} />
      <LineSeries name="Rainfall" data={[1, 3, 2, 5, 4, 7, 6, 9, 8, 11]} />
      <LineSeries name="Snowfall" data={[10, 9, 11, 8, 9, 6, 7, 4, 5, 2]} />
    </Chart>
  );
}
```

Series labels are placed next to the series they belong to, which makes the
legend redundant in most cases.

To configure series-label behavior on your chart, see the
[plotOptions.series.label](https://api.highcharts.com/highcharts/plotOptions.series.label)
API option. Set it for all series through the `PlotOptions` component, or for a
single series through its `options` prop:

```tsx
<PlotOptions series={{ label: { connectorAllowed: false } }} />
```
