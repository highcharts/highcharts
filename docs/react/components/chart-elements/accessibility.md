# Accessibility

You can add the [accessibility module](https://www.highcharts.com/docs/accessibility/accessibility-module) to your chart using the `Accessibility` component:

```tsx
import { Chart, Series } from "@highcharts/react";
import { Accessibility } from "@highcharts/react/options/accessibility";

export default function AccessibilityChart() {
  return (
    <Chart>
      <Accessibility series={{ describeSingleSeries: true }} />
      <Series data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Accessibility` component accepts all [accessibility API options](https://api.highcharts.com/highcharts/accessibility) as props.

To learn more, explore [Highcharts Accessibility](https://www.highcharts.com/accessibility/).
