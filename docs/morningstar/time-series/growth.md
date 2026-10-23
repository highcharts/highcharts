---
description: >-
  Retrieve growth time-series data for one or more securities and prepare it
  for charting by setting the Growth series type on TimeSeriesConnector;
  multi-security requests use the first security's start date.
---

# Growth

This type yields growth time series data for single or multiple securities.
This data can be used to plot growth charts.

Returns growth time series data for securities specified.

When multiple securities are sent, the start date of the first security in the
list is used as the start date for the series.

## How to use Growth

In order to fetch time series for growth, specify series type `Growth` in the
Time Series Connector options.

```js
const growthConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'Growth'
    },
    securities: [{
        id: 'F0GBR04S23',
        idType: 'MSID'
    }]
});
```

For more details, see [Morningstar’s Time Series API - Growth].

## Relevant demos

- [Highcharts Stock + Morningstar Time Series](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/financial/interactive-chart/)

## Morningstar API Reference

For more details, see [Morningstar’s Time Series API].

<!-- Links -->
[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/about
[Morningstar’s Time Series API - Growth]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/growth
