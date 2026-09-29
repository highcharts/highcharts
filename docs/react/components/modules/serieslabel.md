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

Series labels sit next to the series they describe, which often removes the
need for a separate legend.

To configure series-label behavior, you can either set it for a single series
through its `options` prop (see
[series.line.label](https://api.highcharts.com/highcharts/series.line.label)):

```tsx
<LineSeries
  name="Rainfall"
  data={[1, 3, 2, 5, 4, 7, 6, 9, 8, 11]}
  options={{ label: { connectorAllowed: false } }}
/>
```

or for all series at once through the [PlotOptions](https://www.highcharts.com/docs/react/components/chart-elements/plotoptions) component (see
[plotOptions.series.label](https://api.highcharts.com/highcharts/plotOptions.series.label)):

```tsx
<PlotOptions series={{ label: { connectorAllowed: false } }} />
```
