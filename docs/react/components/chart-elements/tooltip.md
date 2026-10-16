---
description: >-
  Customize chart tooltips with the Tooltip component, which renders HTML by
  default: pass tooltip API options as props, set the format with string or JSX
  children or section props, bind sections with data-hc-option, or render SVG
  text instead.
---

# Tooltip

You can customize the [chart tooltip](https://www.highcharts.com/docs/chart-concepts/tooltip) using the `Tooltip` component:

```tsx
import { Chart, Tooltip } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function TooltipChart() {
  return (
    <Chart>
      <Tooltip>{"<b>{series.name}</b>: {point.y} USD"}</Tooltip>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Tooltip` component accepts all [tooltip API options](https://api.highcharts.com/highcharts/tooltip) as props. The children set [`tooltip.format`](https://api.highcharts.com/highcharts/tooltip.format) (see [Formatting tooltip content](#formatting-tooltip-content)). The component sets [`useHTML`](https://api.highcharts.com/highcharts/tooltip.useHTML) to `true` by default; this default applies to the component only and is not inherited when tooltip options are set through `<Chart options={{ tooltip: {...} }}>`.

## Formatting tooltip content

A single string child is passed to Highcharts as it is, so tags inside the string render as markup, as in the example above.

Several children, or JSX elements, are converted to an HTML string by the built-in HTML rendering (see [Custom HTML Rendering](https://www.highcharts.com/docs/react/options-component-format#custom-html-rendering)). That conversion HTML-escapes the strings inside them, so tags written inside a string appear as visible text. Write the markup as JSX elements instead:

```tsx
import { Chart, Tooltip } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function JSXTooltipChart() {
  return (
    <Chart>
      <Tooltip>
        <b>{"{series.name}"}</b>
        {": {point.y} USD"}
      </Tooltip>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

Format expressions such as `{point.y}` and `{#if point.y}` pass through the conversion.

When a tooltip format needs separate `headerFormat`, `pointFormat`, and `footerFormat` sections where the HTML structure spans section boundaries (for example, a `<table>` opened in the header and closed in the footer), JSX children cannot represent that, because JSX requires well-formed elements. Pass each section as a direct string prop instead:

```tsx
import { Chart, Tooltip } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function TableTooltipChart() {
  return (
    <Chart>
      <Tooltip
        headerFormat={'<table><tr><th colspan="2">{series.name}</th></tr>'}
        pointFormat={'<tr><td style="color:{point.color}">{point.x}</td><td><b>{point.y}</b></td></tr>'}
        footerFormat="</table>"
      />
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

For structured tooltips where each section is well-formed JSX, use the `data-hc-option` attribute to bind child elements to `headerFormat`, `pointFormat`, and `footerFormat`. See the [Option binding](https://www.highcharts.com/docs/react/options-component-format#option-binding) documentation.

## Rendering as SVG text

To draw the tooltip as SVG text, the Highcharts default, set `useHTML={false}`. The markup is then limited to the [subset of HTML that Highcharts renders in SVG](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html-in-highcharts):

```tsx
import { Chart, Tooltip } from "@highcharts/react";
import { LineSeries } from "@highcharts/react/series/Line";

export default function SVGTooltipChart() {
  return (
    <Chart>
      <Tooltip useHTML={false}>{"<b>{series.name}</b>: {point.y} USD"}</Tooltip>
      <LineSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```
