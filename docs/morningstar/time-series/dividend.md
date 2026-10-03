---
description: >-
  Request dividend time-series data for one or more securities with the
  TimeSeriesConnector, set the Dividend series type, and account for how a
  multi-security request takes its starting date.
---

# Dividend

This type yields dividend time series data for single or multiple securities.

Returns rolling return time series data for securities specified.

When multiple securities are sent, the start date of the first security in the
list is used as the start date for the series.

## How to use Dividend

In order to fetch a dividend time series, specify series type `Dividend` in the
Time Series Connector options.

```js
const dividendConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'Dividend'
    },
    securities: [{
        id: 'F0GBR04S23',
        idType: 'MSID'
    }]
});
```

For more details, see [Morningstar’s Time Series API - Dividend].

## Relevant demos

- [Highcharts Stock + Morningstar TimeSeries](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/financial/interactive-chart/).

## Morningstar API Reference

For more details, see [Morningstar’s Time Series API].

<!-- Links -->
[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/about
[Morningstar’s Time Series API - Dividend]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/dividend
