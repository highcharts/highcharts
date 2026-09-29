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

The `Tooltip` component accepts all [tooltip API options](https://api.highcharts.com/highcharts/tooltip) as props. String children set [`tooltip.format`](https://api.highcharts.com/highcharts/tooltip.format). The component sets [`useHTML`](https://api.highcharts.com/highcharts/tooltip.useHTML) to `true` by default; this default applies to the component only and is not inherited when tooltip options are set through `<Chart options={{ tooltip: {...} }}>`.

## Formatting tooltip content

JSX elements and bare string literals follow different paths. A bare string literal is passed directly to Highcharts as `tooltip.format`, where Highcharts renders HTML tags because `useHTML` is `true`. JSX elements are first converted to an HTML string by the renderer: string literals nested inside those elements are HTML-escaped, so HTML tags within them appear as visible text. Format expressions such as `{point.y}` and conditionals such as `{#if}` and `{#each}` are not escaped in either case.

When using JSX elements as children, write the markup as elements rather than putting tags inside a string:

```tsx
<Tooltip>
  <span><b>{"{series.name}"}</b></span>
</Tooltip>
```

When a tooltip format needs separate `headerFormat`, `pointFormat`, and `footerFormat` sections where the HTML structure spans section boundaries (for example, a `<table>` opened in the header and closed in the footer), JSX children cannot represent that, because JSX requires well-formed elements. Pass each section as a direct string prop instead:

```tsx
<Tooltip
  headerFormat={'<table><tr><th colspan="2">{series.name}</th></tr>'}
  pointFormat={'<tr><td style="color:{point.color}">{point.x}</td><td><b>{point.y}</b></td></tr>'}
  footerFormat={"</table>"}
/>
```

For structured tooltips where each section is well-formed JSX, use the `data-hc-option` attribute to bind child elements to `headerFormat`, `pointFormat`, and `footerFormat`. See the [Option binding](https://www.highcharts.com/docs/react/options-component-format#option-binding) documentation. For a tooltip that sets a single section, a direct prop is simpler and is the recommended form; reach for `data-hc-option` children when binding two or more.

## Rendering as SVG text

`useHTML` defaults to `true` on this component so that JSX children can be rendered. When a tooltip uses only format strings, that default still applies, and it changes how the text is drawn: Highcharts renders the tooltip as HTML rather than as SVG text, so line breaks take their spacing from the browser's `line-height` rather than the SVG renderer's.

So if there are no JSX children, and the markup you use is handled by the SVG text renderer, you can turn the default off:

```tsx
<Tooltip useHTML={false} headerFormat="..." pointFormat="..." />
```

The tags available in that mode are the [subset of HTML that Highcharts renders in SVG](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting).
