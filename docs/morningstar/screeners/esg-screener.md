# ESG Screener

Using the Morningstar ESG Screener endpoint allows you to filter Morningstar's database of global investments with a focus on data related to sustainable investing.

## How to use ESG Screener

Data can be filtered on any data point comprehensively covered by Morningstar, including proprietary data such as:

 * Morningstar ESG Ratings
 * Carbon Risk
 * Fossil Fuel Exposure
 * Controversial Weapons Exposure

With this solution, you can develop a sophisticated screening tool offering dozens of filters for advanced users.

You can also use it to power predefined screeners for common ESG research interests such as Sustainable Investment Leaders, Low Carbon Risk Funds, and more.

For more details, see [Morningstar's ESG Screener API].

<!-- Links -->
[Morningstar's ESG Screener API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/screener/esg-screener


This connector is designed to be interacted with using external buttons, that might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the ESG Screener connector:

```js
const screenerConnector = new HighchartsConnectors.Morningstar.InvestmentScreenerConnector({
    page: 1,
    pageSize: 20,
    languageId: 'en-GB',
    currencyId: 'USD',
    filters: [
        {
            dataPointId: 'SustainableInvestmentOverall',
            comparatorCode: 'EQ',
            value: true
        }
    ],
    securityDataPoints: [
        'secId',
        'name',
        'sustainableInvestmentOverall',
        'historicalSustainabilityScore',
        'sustainabilityPercentRank',
        'average12MonthCarbonRiskScore',
        'average12MonthFossilFuelExposure',
        'tobacco',
        'controversialWeapons',
        'renewableEnergyProductionInvolvement'
    ],
    universeIds: ['FOALL$$ALL'],
    postman: {
        environmentJSON: postmanJSON
    }
});
```

For more details, see [Morningstar's ESG Screener API].