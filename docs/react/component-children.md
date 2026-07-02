# Appendix A: Option Component children

The table below shows what Highcharts option the child content of each option
component will be bound to.

| Component                                                                            | Highcharts API Option                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| [Title](https://www.highcharts.com/docs/react/components/chart-elements/title)       | [title.text](https://api.highcharts.com/highcharts/title.text)                 |
| [Subtitle](https://www.highcharts.com/docs/react/components/chart-elements/subtitle) | [subtitle.text](https://api.highcharts.com/highcharts/subtitle.text)           |
| [Credits](https://www.highcharts.com/docs/react/components/chart-elements/credits)   | [credits.text](https://api.highcharts.com/highcharts/credits.text)             |
| [Tooltip](https://www.highcharts.com/docs/react/components/chart-elements/tooltip)   | [tooltip.format](https://api.highcharts.com/highcharts/tooltip.format)         |
| [XAxis](https://www.highcharts.com/docs/react/components/chart-elements/x-axis)      | [xAxis.title.text](https://api.highcharts.com/highcharts/xAxis.title.text)     |
| [YAxis](https://www.highcharts.com/docs/react/components/chart-elements/y-axis)      | [yAxis.title.text](https://api.highcharts.com/highcharts/yAxis.title.text)     |
| [Legend](https://www.highcharts.com/docs/react/components/chart-elements/legend)     | [legend.labelFormat](https://api.highcharts.com/highcharts/legend.labelFormat) |

## Advanced configuration

It is possible to change this binding by setting the `_HCReact.childOption`
property of the component.

```ts
import { Tooltip } from "@highcharts/react";

Tooltip._HCReact.childOption = "footerFormat";
```

The above will apply to all tooltip components.
