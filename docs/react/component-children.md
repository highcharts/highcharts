---
description: >-
  Look up which Highcharts option receives child content from each option
  component, and set _HCReact.childOption to change that component’s child
  binding across all instances in your application.
---

# Appendix A: Option Component children

The table below shows what Highcharts option the child content of each option
component will be bound to.

| Component                                                                            | Highcharts API Option                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| [Title](https://www.highcharts.com/docs/react/components/chart-elements/title)       | [title.text](https://api.highcharts.com/highcharts/title.text)                 |
| [Subtitle](https://www.highcharts.com/docs/react/components/chart-elements/subtitle) | [subtitle.text](https://api.highcharts.com/highcharts/subtitle.text)           |
| [Credits](https://www.highcharts.com/docs/react/components/chart-elements/credits)   | [credits.text](https://api.highcharts.com/highcharts/credits.text)             |
| [Tooltip](https://www.highcharts.com/docs/react/components/chart-elements/tooltip)   | [tooltip.format](https://api.highcharts.com/highcharts/tooltip.format)         |
| [XAxis](https://www.highcharts.com/docs/react/components/chart-elements/xaxis)       | [xAxis.title.text](https://api.highcharts.com/highcharts/xAxis.title.text)     |
| [YAxis](https://www.highcharts.com/docs/react/components/chart-elements/yaxis)       | [yAxis.title.text](https://api.highcharts.com/highcharts/yAxis.title.text)     |
| [Legend](https://www.highcharts.com/docs/react/components/chart-elements/legend)     | [legend.labelFormat](https://api.highcharts.com/highcharts/legend.labelFormat) |
| [Drilldown](https://www.highcharts.com/docs/react/components/modules/drilldown)      | [drilldown.series](https://api.highcharts.com/highcharts/drilldown.series)     |

Every binding above resolves its children to a string, JSX elements included, which are rendered to HTML. `Drilldown` is the exception: its children are series components, collected into the `drilldown.series` array.

## Child order

Option components can appear in any order among `<Chart>`'s children, because each one is routed to its own Highcharts option independently. Order matters only between components of the same array-type kind.

`XAxis`, `YAxis`, and `DataTable` are array-type, as are series components. Several of each are allowed, and they form their option array in the order they are written, so the first is index `0`, the second index `1`, and so on. A series that selects an axis by index depends on that order.

Every other option component is single: `Title`, `Subtitle`, `Credits`, `Legend`, `Tooltip`, `PlotOptions`, `Palette`, `Accessibility`, `Boost`, `Data`, `Drilldown`, `Exporting`, and `StockTools`. Rendering two of the same kind does not produce two options. Their props merge into one, and the later component wins wherever both set the same option. `BrokenAxis`, `DraggablePoints`, and `SeriesLabel` take no props. They load their module, which is configured through other options ([`xAxis.breaks`](https://api.highcharts.com/highcharts/xAxis.breaks), [`plotOptions.series.dragDrop`](https://api.highcharts.com/highcharts/plotOptions.series.dragDrop), and [`plotOptions.series.label`](https://api.highcharts.com/highcharts/plotOptions.series.label)), so rendering one more than once has no further effect.

## Advanced configuration

It is possible to change this binding by setting the `_HCReact.childOption`
property of the component.

```ts
import { Tooltip } from "@highcharts/react";

Tooltip._HCReact.childOption = "footerFormat";
```

The above will apply to all tooltip components.
