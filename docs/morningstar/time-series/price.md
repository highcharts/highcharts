---
description: >-
  Fetch price time-series data under the account's market-data entitlement by
  setting the Price series type on TimeSeriesConnector; when requesting
  several securities, the first one determines the start date.
---

# Price

Get price time series data for single or multiple securities.

Returns price series data for securities specified, based on Market data
entitlement.

When multiple securities are sent, the start date of the first security in the
list is used as the start date for the series.

## How to use Price

In order to fetch price time series, specify series type `Price` in the Time
Series Connector options.

```js
const priceConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'Price'
    },
    securities: [{
        id: 'F0GBR04S23',
        idType: 'MSID'
    }]
});
```

For more details, see [Morningstar’s Time Series API - Price].

## Relevant demos

- [Highcharts Stock + Morningstar TimeSeries](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/financial/interactive-chart/)

## Morningstar API Reference

For more details, see [Morningstar’s Time Series API].

<!-- Links -->
[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/about
[Morningstar’s Time Series API - Price]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/price
