# Subtitle

You can add a [subtitle](https://www.highcharts.com/docs/chart-concepts/title-and-subtitle) to your chart using the `Subtitle` component:

```tsx
import { Chart, Subtitle } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function SubtitleChart() {
  return (
    <Chart>
      <Subtitle>Monthly sales data overview</Subtitle>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Subtitle` component accepts all [subtitle API options](https://api.highcharts.com/highcharts/subtitle) as props. The [subtitle text](https://api.highcharts.com/highcharts/subtitle.text) can be passed as `children`.

## Formatting the subtitle text

The subtitle is drawn as SVG text and takes the same inline tags as the title, passed as a single string:

```tsx
<Subtitle>{"Sales <i>overview</i>"}</Subtitle>
```

The tags it supports are the [subset of HTML that Highcharts renders in SVG](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting). As with the title, set [`useHTML`](https://api.highcharts.com/highcharts/subtitle.useHTML) for markup outside that subset, which renders the subtitle as an HTML element layered over the chart rather than as SVG text.
