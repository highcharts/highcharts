# Appendix A: Option Component children

The table below shows what Highcharts option the child content of each option
component will be bound to.

| Component | Highcharts API Option                                                         |
|-----------|-------------------------------------------------------------------------------|
| Title     | [title.text](https://api.highcharts.com/highcharts/title.text)                |
| Subtitle  | [subtitle.text](https://api.highcharts.com/highcharts/subtitle.text)          |
| Credits   | [credits.text](https://api.highcharts.com/highcharts/credits.text)            |
| Tooltip   | [tooltip.format](https://api.highcharts.com/highcharts/tooltip.format)        |
| XAxis     | [xAxis.title.text](https://api.highcharts.com/highcharts/xAxis.title.text)    |
| YAxis     | [yAxis.title.text](https://api.highcharts.com/highcharts/yAxis.title.text)    |
| Legend    | [legend.labelFormat](https://api.highcharts.com/highcharts/legend.labelFormat)|

## Advanced configuration

It is possible to change this binding by setting the `_HCReact.childOption`
property of the component.

```ts
import { Tooltip } from '@highcharts/react';

Tooltip._HCReact.childOption = 'footerFormat';
```

The above will apply to all tooltip components.
