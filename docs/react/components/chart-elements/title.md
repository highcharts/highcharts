# Title

You can customize the [chart title](https://www.highcharts.com/docs/chart-concepts/title-and-subtitle) using the `Title` component:

```tsx
import { Chart, Title } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function TitleChart() {
  return (
    <Chart>
      <Title>Monthly Sales</Title>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Title` component accepts all [title API options](https://api.highcharts.com/highcharts/title) as props. The [title text](https://api.highcharts.com/highcharts/title.text) can be passed as `children`.

## Formatting the title text

The title is drawn as SVG text, and the SVG text renderer handles a small set of inline tags, so basic formatting needs no extra options:

| Tag                  | Effect                                     |
| -------------------- | ------------------------------------------ |
| `<b>`, `<strong>`    | Bold                                       |
| `<i>`, `<em>`        | Italic                                     |
| `<br>`               | Line break                                 |
| `<a href="...">`     | Link                                       |
| `<span style="...">` | Applies its style to the text it encloses  |

Pass the markup as a single string:

```tsx
<Title>{"Monthly Sales <b>2026</b>"}</Title>
```

Tags outside this set are reduced to plain text, keeping any `style` attribute they carry.

To use markup the SVG renderer does not handle, set [`useHTML`](https://api.highcharts.com/highcharts/title.useHTML). The title is then rendered as an HTML element layered over the chart rather than as SVG text, so set it only when you need that.
