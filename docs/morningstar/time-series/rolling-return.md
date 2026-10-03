---
description: >-
  Request rolling return history for one or more securities with the
  TimeSeriesConnector by selecting the RollingReturn series type, and note
  that the first security sets the start date for multiple-security requests.
---

# Rolling Return

This type yields rolling return time series data for single or multiple
securities.

Returns rolling return time series data for securities specified.

When multiple securities are sent, the start date of the first security in the
list is used as the start date for the series.

## How to use Rolling Return

In order to fetch a rolling return time series, specify series type
`RollingReturn` in the Time Series Connector options.

```js
const dividendConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'RollingReturn'
    },
    securities: [{
        id: 'F0GBR04S23',
        idType: 'MSID'
    }]
});
```

## Relevant demos

- [Highcharts Stock + Morningstar TimeSeries](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/financial/interactive-chart/)

## Morningstar API Reference

For more details, see [Morningstar’s Time Series API].

<!-- Links -->
[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/about
