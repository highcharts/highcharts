---
description: >-
  Look up which Highcharts option receives child content from each option
  component, learn how child order sets axis and series indexes, and set
  _HCReact.childOption to change a component’s child binding across your
  application.
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

Every binding above resolves its children to a string, JSX elements included. `Drilldown` is the exception: its children are series components, collected into the `drilldown.series` array.

## Child order

Order among `<Chart>`'s children matters only among components of the same kind, with all series components counting as one kind.

`XAxis`, `YAxis`, and `DataTable` can appear several times, as can series components. Each of these forms an array in the order the components are written, so the first is index `0`, the second index `1`, and so on. A series that selects an axis by index depends on that order.

## Advanced configuration

It is possible to change this binding by setting the `_HCReact.childOption`
property of the component.

```ts
import { Tooltip } from "@highcharts/react";

Tooltip._HCReact.childOption = "footerFormat";
```

The above will apply to all tooltip components.
