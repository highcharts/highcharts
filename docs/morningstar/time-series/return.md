# Return

This type yields return time series data for single or multiple securities.

Returns return time series data for securities specified.

When multiple securities are sent, the start date of the first security 
in the list is used as the start date for the series.

## How to use Return

In order to fetch a return time series, specify series type 
`Return` in the Time Series Connector options.

```js
const dividendConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'Return'
    },
    securities: [{
        id: 'F0GBR04S23',
        idType: 'MSID'
    }]
});
```

For more details, see [Morningstar’s Time Series API].

## Relevant demos

- **Highcharts Stock + Morningstar TimeSeries**: Shows how to use 
TimeSeriesConnector to retrieve Return time series. Specify type 
`Return`.

[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/time-series/overview