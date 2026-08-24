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

See [formatting the title text](https://www.highcharts.com/docs/react/components/chart-elements/title#formatting-the-title-text) for the supported tags and for when to reach for `useHTML`.
