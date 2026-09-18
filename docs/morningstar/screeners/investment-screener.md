# Investment Screener

Using Morningstar **Investment Screener** endpoint allows you to filter
Morningstar's database of global investments using hundreds of data points
including Morningstar proprietary data.

## How to use Investment Screener

Data can be filtered on any data point which is comprehensively covered by
Morningstar, including proprietary data such as:

- Morningstar Sustainability Ratings
- Analyst Rating
- Fair Value
- Style Box

With the solution, you can develop a sophisticated screening tool offering
dozens of filters for advanced users.

You can also use it to power predefined screeners for common investment
research interests such as Top Fixed Income Funds, Top Rated US Bond Index
Funds, Sustainable Investments, and so on.

This connector is designed to be interacted with using external buttons, that
might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the Investment Screener Connector:

```js
const screenerConnector = new HighchartsConnectors.Morningstar.InvestmentScreenerConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
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
    universeIds: ['FOALL$$ALL']
});
```

For more details, see [Morningstar's Screener API - Investment Screener].

## Morningstar API Reference

For details see [Morningstar's Screener API].

<!-- Links -->
[Morningstar's Screener API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/screener/overview
[Morningstar's Screener API - Investment Screener]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/screener/investment-screener
