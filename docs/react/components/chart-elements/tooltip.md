# Tooltip

You can customize the [chart tooltip](https://www.highcharts.com/docs/chart-concepts/tooltip) using the `Tooltip` component:

```tsx
import { Chart, Series, Tooltip } from "@highcharts/react";

export default function TooltipChart() {
  return (
    <Chart>
      <Tooltip>{"<b>{series.name}</b>: {point.y} USD"}</Tooltip>
      <Series data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Tooltip` component accepts all [tooltip API options](https://api.highcharts.com/highcharts/tooltip) as props. The [tooltip format](https://api.highcharts.com/highcharts/tooltip.format) can be passed as `children`.

**Note:** For a more structured tooltip, it's a good practice to use the `data-hc-option` attribute to map child elements to specific tooltip options. See the [Option binding](https://www.highcharts.com/docs/react/options-component-format#option-binding) documentation for more details.
