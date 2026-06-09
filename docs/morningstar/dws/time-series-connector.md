# Time Series Connector

The `HighchartsConnectors.MorningstarDWS.TimeSeriesConnector` is a connector
that provides access to Morningstar’s **Time Series API**, allowing you to
retrieve historical time series data for given securities.

## Requirements

Using the Morningstar Connectors requires an active Highcharts license and a
Morningstar subscription, plus Morningstar Direct Web Services credentials -
either an access token from your server, or a username and password. See the
[Morningstar Connectors overview](https://www.highcharts.com/docs/morningstar/morningstar)
for licensing and credential details.

## Setup

Load the DWS bundle alongside Highcharts Stock. As an ES module:

```js
import Highcharts from 'highcharts/highstock';
import '@highcharts/connectors-morningstar/dws';
```

Or as a UMD script from the CDN:

```html
<script src="https://code.highcharts.com/stock/highstock.js"></script>
<script src="https://code.highcharts.com/connectors/morningstar/connectors-morningstar-dws.js"></script>
```

## How to use Time Series Connector

The `TimeSeriesConnector` allows you to fetch most recent data from up to 25
securities per one request.

You can fetch time series data of various kinds. For more details regarding
available categories and dataPoints, see [Morningstar’s Time Series API].

The `category` and `dataPoint` values can be directly extracted from the
request path, where the two path segments immediately after `time-series/v1/`
represent them, e.g. in `.../time-series/v1/performance/growth/`, performance
is the `category` and growth is the `dataPoint`.

When setting securities, if the identifier type is `performanceId`, the
`idType` property may be omitted, as it is used as the default.

Example of fetching Time Series data:

```js
const timeSeriesConnector = new HighchartsConnectors.MorningstarDWS.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    ids: [{
        id: '0P00000FIA',
        idType: 'performanceId'
    }, {
        id: 'MDLOX',
        idType: 'tradingSymbol'
    }],
    category: 'performance',
    dataPoint: 'growth',
    startDate: '2023-10-30',
    endDate: '2025-10-30'
});

await timeSeriesConnector.load();
```

## Charting the result

The connector exposes a single data table whose first column is `Date`. When you
request a single security, the values are in a `Value` column. When you request
multiple securities, each value column is suffixed with that security's
Morningstar `performanceId` (`Value_<performanceId>`), regardless of the
`idType` used to request it. Pair `Date` with the relevant value column to build
each series:

```js
const growthConnector = new HighchartsConnectors.MorningstarDWS.TimeSeriesConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    ids: [{
        id: '0P00000FIA',
        idType: 'performanceId'
    }, {
        id: '0P00002PB8',
        idType: 'performanceId'
    }],
    category: 'performance',
    dataPoint: 'growth',
    startDate: '2024-10-30',
    endDate: '2025-10-30',
    currencyId: 'EUR'
});

await growthConnector.load();

Highcharts.stockChart('container', {
    title: {
        text: 'Growth'
    },
    series: [{
        name: '0P00000FIA',
        data: growthConnector.getTable().getRows(
            void 0,
            void 0,
            ['Date', 'Value_0P00000FIA']
        )
    }, {
        name: '0P00002PB8',
        data: growthConnector.getTable().getRows(
            void 0,
            void 0,
            ['Date', 'Value_0P00002PB8']
        )
    }]
});
```

## Relevant demos

Examples of using the **Time Series Connector** are available in our demos:

- **Highcharts Stock + Morningstar Time Series**

## Morningstar API Reference

For more details, see [Morningstar’s Time Series API].

<!-- Links -->
[Morningstar’s Time Series API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/time-series---sync/overview
