# Palette

You can define the chart color system &mdash; including separate light and dark
palettes &mdash; using the `Palette` component:

```tsx
import { Chart, Palette } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";

export default function PaletteChart() {
  return (
    <Chart>
      <Palette
        colorScheme="dark"
        colors={["#2caffe", "#544fc5", "#00e272"]}
        light={{
          backgroundColor: "#ffffff",
          colors: ["#2caffe", "#544fc5", "#00e272"],
        }}
        dark={{
          backgroundColor: "#0f1115",
          colors: ["#66a3ff", "#8c94ff", "#37d39b"],
        }}
      />
      <ColumnSeries data={[3, 4, 1, 5, 2]} />
    </Chart>
  );
}
```

The `Palette` component accepts all
[palette API options](https://api.highcharts.com/highcharts/palette) as props,
such as
[`colorScheme`](https://api.highcharts.com/highcharts/palette.colorScheme),
[`colors`](https://api.highcharts.com/highcharts/palette.colors) and the
separate [`light`](https://api.highcharts.com/highcharts/palette.light) and
[`dark`](https://api.highcharts.com/highcharts/palette.dark) palettes.

The palette is the recommended way to style Highcharts (since v13): define a base
palette, then optionally deviate from it with more targeted chart options. To
learn more, explore the
[Highcharts branding and theming guide](https://www.highcharts.com/docs/chart-design-and-style/branding).
