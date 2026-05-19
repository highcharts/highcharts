# Performance

The Morningstar Performance feature calculates how a portfolio performed over time.
You define the portfolio individually in the connector options.

The Performance Connector returns trailing returns, calendar year returns, and best/worst time periods.
It also includes risk metrics like Sharpe ratio and standard deviation.

## How to use Performance

You can use the Performance Connector to fetch return and risk data for portfolios and benchmarks.
Returned data depends on the selected view and config and may include tracking error, excess return, or MPT stats.


## Available data converters

Currently the following data points are supported in the Performance connector:

- **CalendarYearReturn**
- **RiskStatistics**
- **CorrelationMatrix**
- **TrailingReturns**
- **MPTStatistics**

Example request:

```js
const performanceConnector = new HighchartsConnectors.Morningstar.PerformanceConnector({
    api: {
        access: {
            token: 'JWT token'
        }
    },
    requestSettings: {
        outputCurrency: 'USD',
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
                    securityId: 'FOUSA05H5F',
                    type: 'FO',
                    weight: 50
                },
                {
                    securityId: 'FOUSA04BCR',
                    type: 'FO',
                    weight: 50
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

await performanceConnector.load();

const data = performanceConnector.dataTables.CalendarYearReturn;
```

For more details, see [Morningstar's Performance API].

[Morningstar's Performance API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/portfolio-analysis-americas/performance
