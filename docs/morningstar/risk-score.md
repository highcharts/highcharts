# Portfolio Risk Score

This type analyzes the specified portfolios and yields a risk score. 

You can analyze up to two portfolios at a time.

## How to use RiskScore

Use the `RiskScoreConnector` to load risk scores.

In dashboards, this connector is called `MorningstarRiskScore`.

Specify the portfolio holdings in the options along with a postman environment
file for authentication, and other parameters such as `currency`.

### Holdings

Holdings are the securities that make up the portfolio. You can specify a 
holding using different kinds of id’s. 

Supported id-types are: `CUSIP`, `FundCode`, `ISIN`, `MSID`, `PerformanceId`,
 `SecurityID`, `TradingSymbol`.

You can specify the quantity of this holding in the portfolio by using either 
`weight` or `value`. If you decide to use `weight`, you need to specify 
the `totalValue` of the portfolio.

> **NOTE:** You cannot mix and match `weight` and `value`. 
Be consistent and stick to one.

If you specify any holdings that are invalid, the connector will still yield 
a result. The invalid holdings are in the connector’s `metadata` after load.

For more details, see [Morningstar’s RiskScore API].

### Risk Score with Morningstar standalone for Highcharts:

```js
const riskScoreConnector = new HighchartsConnectors.Morningstar.RiskScoreConnector({
    postman: {
        environmentJSON: postmanJSON
    },
    portfolios: [
        {
            name: 'MyPortfolio',
            currency: 'USD',
            totalValue: 100,
            holdings: [
                {
                    id: 'F00000VCTT',
                    idType: 'SecurityID',
                    weight: 50
                },
                {
                    id: 'AAPL',
                    idType: 'TradingSymbol',
                    weight: 50
                }
            ]
        }
    ]
});

await riskScoreConnector.load();

new DataGrid.DataGrid('container', {
    dataTable: riskScoreConnector,
    editable: false,
    columns: {
      'MyPortfolio_EffectiveDate': {
        cellFormatter: function () {
            return new Date(this.value)
                .toISOString()
                .substring(0, 10);
        }
      }
    }
});
```

## Relevant demos

You will find examples of how to use RiskScoreConnector in our demos.

- **Highcharts Dashboards + Morningstar Risk Score**: Shows how to use 
RiskScoreConnector in dashboards to retrieve Risk Score for a single portfolio.

[Morningstar’s RiskScore API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/portfolio-analysis-apacemea/risk-score