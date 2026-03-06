# Rating

This type yields Morningstar Rating time series data for single or multiple securities.

Returns Morningstar Rating series data for securities specified.

The Morningstar Rating, also referred to as the star rating, is a quantitative measurement
of a fund's past performance on a scale of 1 to 5. The rating is assigned within
each Morningstar Category based on risk-adjusted returns. Star ratings are calculated and assigned
at the end of every month.

When multiple securities are sent, the start date of the first security
in the list is used as the start date for the series.

## How to use Rating

In order to fetch Morningstar rating time series, specify series type `Rating` in
the Time Series Connector options.

```js
const ratingConnector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    series: {
        type: 'Rating'
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
TimeSeriesConnector to retrieve Rating time series. Specify type
`Rating`.

[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/time-series/overview