# Accessibility

You can add the [accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) to your chart using the `Accessibility` component:

```tsx
import { Chart } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";
import { Accessibility } from "@highcharts/react/modules/accessibility";

export default function AccessibilityChart() {
  return (
    <Chart>
      <Accessibility series={{ describeSingleSeries: true }} />
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Accessibility` component accepts all [accessibility API options](https://api.highcharts.com/highcharts/accessibility) as props.

To learn more, explore [Highcharts Accessibility](https://www.highcharts.com/accessibility/).
