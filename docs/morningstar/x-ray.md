# X-Ray

The Morningstar X-Ray capability enables you to quickly analyze a portfolio's
holdings. You define the portfolio individually in the connector options.

The X-Ray Connector aggregates individual holdings data with the help of the
Morningstar API. Data returned by the Highcharts Connector shows how a portfolio
is diversified by region, sector, and investment style.

## How to use X-Ray

You can use the X-Ray Connector to fetch portfolio data points, holding data
points, or benchmark data points. Depending on the request additional breakdown
columns might be added to the table.

## X-Ray APAC/EMEA API

### Available data converters

Currently the following data points are supported in the APAC/EMEA X-Ray converter:

- **AssetAllocation**
- **GlobalStockSector**
- **HistoricalPerformanceSeries**
- **PerformanceReturn**
- **RegionalExposure**
- **SharpeRatio**
- **ShowBreakdown**
- **StandardDeviation**
- **StyleBox**
- **UnderlyingHolding**


In order to fetch a benchmark, you can request for example:

```js
const xRayConnector = new HighchartsConnectors.Morningstar.XRayConnector({
    api: {
        access: {
            token: 'JWT token'
        }
    },
    benchmarkId: 'EUCA000812',
    currencyId: 'GBP',
    dataPoints: [{
        type: 'portfolio',
        dataPoints: [
            'AssetAllocationMorningstarEUR3',
            'GlobalStockSector',
            'RegionalExposure'
        ]
    }, {
        type: 'benchmark',
        dataPoints: [
            'HistoricalPerformanceSeries',
            ['PerformanceReturn', 'M0', 'M1', 'M2', 'M3', 'M6', 'M12'],
            'ShowBreakdown'
        ]
    }],
    holdings: [{
        id: 'F0GBR052QA',
        idType: 'MSID',
        weight: 50
    }, {
        id: 'GB00BWDBJF10',
        idType: 'ISIN',
        weight: 50
    }]
});
```

## How to get data from the connector above
```js
await xRayConnector.load();

const data = xRayConnector.dataTables.AssetAllocation;
```

For more details, see [Morningstar's APAC/EMEA X-Ray API].

## X-Ray Americas API

Currently the following data points are supported in the Americas X-Ray converter:

- **CreditQuality**
- **CorrelationMatrix**
- **EquityStyle**
- **FixedIncomeStyle**
- **AssetAllocation**
- **RollingReturns**
- **RiskStatistics**
- **CalendarYearReturn**
- **FundStatistics**
- **Holdings**
- **MPTStatistics**
- **TrailingReturns**


Example request:

```js
const americasXRayConnector = new HighchartsConnectors.Morningstar.XRayUSConnector({
    api: {
        access: {
            token: 'JWT token'
        }
    },
    viewId: 'All',
    configId: 'Default',
    requestSettings: {
        outputCurrency: 'USD',
        outputReturnsFrequency: 'MonthEnd',
        assetClassGroupConfigs: {
            assetClassGroupConfig: [
                {
                    id: 'ACG-USBROAD'
                }
            ]
        }
    },
    portfolios: [
        {
            name: 'TestPortfolio1',
            totalValue: 10000,
            currency: 'USD',
            holdings: [
                {
                    securityId: 'F00000VCTT',
                    weight: 20
                },
                {
                    securityId: '0P00002NW8',
                    weight: 10
                },
                {
                    tradingSymbol: 'AAPL',
                    weight: 15
                },
                {
                    isin: 'US09251T1034',
                    weight: 35
                },
                {
                    cusip: '256219106',
                    weight: 20
                }
            ],
            benchmark: {
                type: 'Standard',
                holdings: [
                    {
                        securityId: 'XIUSA04G92',
                        type: 'XI',
                        weight: 100
                    }
                ]
            }
        }
    ]
});
```

Americas X-Ray API supports multiple portfolios return. Simply add more portfolio objects to `portfolios` array to utilize multiple X-Ray returns in one API request.

## How to get data from the connector above
```js
await americasXRayConnector.load();

const data = americasXRayConnector.dataTables.EquityStyle;
```

For more details, see [Morningstar's Americas X-Ray API].

<!-- Links -->



[Morningstar's APAC/EMEA X-Ray API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/portfolio-analysis-apacemea/x-ray
[Morningstar's Americas X-Ray API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/portfolio-analysis-americas/x-ray