# Time Series

Time Series gives data on performance for securities. This data can for instance
be used for visualization in a chart, or to calculate returns for a given time
period.

## Capabilities

- [Cumulative Return](cumulative-return.md)
- [Dividend](dividend.md)
- [Growth](growth.md)
- [OHLCV](ohlcv.md)
- [Price](price.md)
- [Regulatory News Announcements](../../regulatory-news-announcements.md)


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
    postman: {
        environmentJSON: postmanJSON
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
        table: dividendConnector.table.getRows(0, undefined)
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
            options: {
                postman: {
                    environmentJSON: postmanJSON
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
            }
        }]
    },
    components: [
        {
            renderTo: 'dashboard-col-0',
            connector: {
                id: 'time-series'
            },
            type: 'DataGrid',
            title: 'Dividends',
            dataGridOptions: {
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