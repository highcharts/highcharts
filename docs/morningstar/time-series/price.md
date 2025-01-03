# Price

Get price time series data for single or multiple securities.

Returns price series data for securities specified, based on Market data 
entitlement.

When multiple securities are sent, the start date of the first security 
in the list is used as the start date for the series.

## How to use Price

In order to fetch price time series, specify series type `Price` in 
the Time Series Connector options.

```js
const priceConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    postman: {
        environmentJSON: postmanJSON
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

For more details, see [Morningstar’s Time Series API].

## Relevant demos

- **Highcharts Stock + Morningstar TimeSeries**: Shows how to use 
TimeSeriesConnector to retrieve Price time series.

[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/time-series/price