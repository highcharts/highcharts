# Growth

This type yields growth time series data for single or multiple securities. 
This data can be used to plot growth charts.

Returns growth time series data for securities specified.

When multiple securities are sent, the start date of the first security 
in the list is used as the start date for the series.


## How to use Growth

In order to fetch time series for growth, specify series type `Growth` in 
the Time Series Connector options.

```js
const growthConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    postman: {
        environmentJSON: postmanJSON
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

For more details, see [Morningstar’s Time Series API].

## Relevant demos

- **Highcharts Stock + Morningstar TimeSeries**: Shows how to use 
TimeSeriesConnector to retrieve Price time series. Specify type 
`Growth`.

[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/time-series/growth