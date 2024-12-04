X-Ray
===============

The Morningstar X-Ray capability enables you to quickly analyze a portfolio's
holdings. You define the portfolio individually in the connector options.

The X-Ray Connector aggregates individual holdings data with the help of the
Morningstar API. Data returned by the Highcharts Connector shows how a portfolio
is diversified by region, sector, and investment style.



How to use X-Ray
----------------

You can use the X-Ray Connector to fetch portfolio data points, holding data
points, or benchmark data points. Depending on the request additional breakdown
columns might be added to the table.

In order to fetch a benchmark, you can request for example:

```js
const xRayConnector = MC.XRayConnector({
    postman: {
        environmentJSON: postmanJSON
    },
    dataPoints: {
        type: 'benchmark',
        dataPoints: [
            'HistoricalPerformanceSeries',
            ['PerformanceReturn', 'M0', 'M1', 'M2', 'M3', 'M6', 'M12'],
            'ShowBreakdown'
        ]
    },
    holdings: [
        {
            id: 'GB00BWDBJF10',
            idType: 'ISIN',
            weight: 100
        }
    ]
});
```

For more details, see [Morningstar's X-Ray API].



<!-- Links -->



[Morningstar's X-Ray API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/portfolio-analysis-apacemea/x-ray
