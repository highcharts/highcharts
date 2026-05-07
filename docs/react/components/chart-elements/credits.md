# Credits

You can customize the chart credits using the `Credits` component:

```tsx
import { Chart, Credits } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function CreditsChart() {
  return (
    <Chart>
      <Credits href="https://www.highcharts.com">Credits text</Credits>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Credits` component accepts all [credits API options](https://api.highcharts.com/highcharts/credits) as props. The [credit text](https://api.highcharts.com/highcharts/credits.text) can be passed as `children`.
