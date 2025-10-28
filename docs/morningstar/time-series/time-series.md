# Time Series

Time Series gives data on performance for securities. This data can for instance
be used for visualization in a chart, or to calculate returns for a given time
period.

## Capabilities

- [Cumulative Return](https://www.highcharts.com/docs/morningstar/time-series/cumulative-return)
- [Dividend](https://www.highcharts.com/docs/morningstar/time-series/dividend)
- [Growth](https://www.highcharts.com/docs/morningstar/time-series/growth)
- [OHLCV](https://www.highcharts.com/docs/morningstar/time-series/ohlcv)
- [Price](https://www.highcharts.com/docs/morningstar/time-series/price)
- [Rating](https://www.highcharts.com/docs/morningstar/time-series/rating)
- [Regulatory News Announcements](https://www.highcharts.com/docs/morningstar/regulatory-news-announcements)
- [Return](https://www.highcharts.com/docs/morningstar/time-series/return)
- [Rolling Return](https://www.highcharts.com/docs/morningstar/time-series/rolling-return)


For more details, see [Morningstar’s Time Series API].

## How to use Time Series

Use the `TimeSeriesConnector` to load time series data.

In dashboards, this connector is called `MorningstarTimeSeries`

You can fetch time series data of various kinds. Specify the securities and type 
to retrieve in the options along with a postman environment file for 
authentication, and other parameters such as `startDate`, `endDate` 
or `currencyId`.

### Time Series with Morningstar standalone for Highcharts:

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
    }],
    startDate: '2000-01-01',
    endDate: '2020-12-31',
    currencyId: 'EUR'
});

await dividendConnector.load();

Highcharts.stockChart('container', {
    series: [{
        type: 'line',
        table: dividendConnector.getTable().getRows(0, undefined)
    }]
});
```

### Time Series with Morningstar connectors for Dashboards:

```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'time-series',
            type: 'MorningstarTimeSeries',
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
            }],
            startDate: '2000-01-01',
            endDate: '2020-12-31',
            currencyId: 'EUR'
        }]
    },
    components: [
        {
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'time-series'
            },
            type: 'Grid',
            title: 'Dividends',
            gridOptions: {
                editable: false,
                columns: {
                    Date: {
                        cellFormatter: function () {
                            return new Date(this.value)
                                .toISOString()
                                .substring(0, 10);
                        }
                    }
                }
            }
        }
    ]
});
```

## Relevant demos

You will find examples of how to use the time series connector in our demos.

- **Highcharts Stock + Morningstar TimeSeries**: Shows how to use 
TimeSeriesConnector to retrieve Dividend time series.

[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/time-series/overview