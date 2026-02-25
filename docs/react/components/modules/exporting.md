# Exporting

You can add the [exporting module](https://www.highcharts.com/docs/export-module/export-module-overview) to your chart using the `Exporting` component:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { Exporting } from "@highcharts/react/modules/exporting";

export default function ExportingChart() {
  return (
    <Chart>
      <Exporting chartOptions={{ title: { text: "exported Chart" } }} />
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Exporting` component accepts all [exporting API options](https://api.highcharts.com/highcharts/exporting) as props.
