# Cumulative Return

This type yields cumulative return time series data for single or multiple
securities. This data can be used to plot cumulative month end returns charts.

Returns cumulative return time series data for securities specified.

When multiple securities are sent, the start date of the first security in the
list is used as the start date for the series.

## How to use Cumulative Return

In order to fetch a cumulative return, specify series type `CumulativeReturn`
in the Time Series Connector options.

```js
const cumulReturnConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'CumulativeReturn'
    },
    securities: [{
        id: 'F0GBR04S23',
        idType: 'MSID'
    }]
});
```

For more details, see [Morningstar’s Time Series API - Cumulative Return].

## Relevant demos

- **Highcharts Stock + Morningstar TimeSeries**: Shows how to use
`TimeSeriesConnector` to retrieve Price time series. Specify type
`CumulativeReturn`.

## Morningstar API Reference

For more details, see [Morningstar’s Time Series API].

<!-- Links -->
[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/about
[Morningstar’s Time Series API - Cumulative Return]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/time-series/cumulative-return
