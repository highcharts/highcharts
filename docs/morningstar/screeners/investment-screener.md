Investment Screener
=============================

Using Morningstar Investment Screener endpoint allows you to filter Morningstar's database of global investments using hundreds of data points including Morningstar proprietary data.

How to use Investment Screener
----------------

Data can be filtered on any data point which is comprehensively covered by Morningstar, including proprietary data such as:

 * Morningstar Sustainability Ratings
 * Analyst Rating
 * Fair Value
 * Style Box
 * With the solution, you can develop a sophisticated screening tool offering dozens of filters for advanced users.

You can also use it to power predefined screeners for common investment research interests such as Top Fixed Income Funds, Top Rated US Bond Index Funds, Sustainable Investments, and so on.

For more details, see [Morningstar's Investment Screener API].

<!-- Links -->
[Morningstar's Investment Screener API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/screener/investment-screener

This connector is designed to be interacted with using external buttons, that might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the Investment Screener connector:

```js
const screenerConnector = new HighchartsConnectors.Morningstar.InvestmentScreenerConnector({
    page: 1,
    pageSize: 20,
    languageId: 'en-GB',
    currencyId: 'USD',
    filters: [
        {
            dataPointId: 'StarRatingM255',
            comparatorCode: 'IN',
            value: 5
        }
    ],
    securityDataPoints: [
        'secId',
        'tenforeId',
        'name',
        'closePrice',
        'ongoingCharge',
        'initialPurchase',
        'maxFrontEndLoad',
        'analystRatingScale',
        'average12MonthCarbonRiskScore',
        'investmentType',
        'holdingTypeId',
        'universe'
    ],
    universeIds: ['FOALL$$ALL'],
    postman: {
        environmentJSON: postmanJSON
    }
});
```

For details see [Morningstar's Investment Screener API].

