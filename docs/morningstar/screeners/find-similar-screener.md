# Find Similar Screener

Using the Morningstar Find Similar Screener endpoint allows you to find investments with similar characteristics to one you are already familiar with.

## How to use Find Similar Screener

The Find Similar capability helps identify alternative investments with comparable characteristics. For example, if a preferred investment is closed to new investors or has high minimum requirements, this tool can help you find suitable alternatives using customizable filters.

For more details, see [Morningstar's Find Similar Screener API].

<!-- Links -->
[Morningstar's Find Similar Screener API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/screener/find-similar

This connector is designed to be interacted with using external buttons, that might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the Find Similar Screener connector:

```js
const screenerConnector = new HighchartsConnectors.Morningstar.InvestmentScreenerConnector({
    page: 1,
    pageSize: 20,
    languageId: 'en-GB',
    currencyId: 'GBP',
    filters: [
        {
            dataPointId: 'CategoryId',
            comparatorCode: 'EQ',
            value: '0P00002D7X'
        },
        {
            dataPointId: 'OngoingCharge',
            comparatorCode: 'LT',
            value: 3
        }
    ],
    securityDataPoints: [
        'secId',
        'name',
        'riskRating'
        'ongoingCharge'
    ],
    sortOrder: 'Name+Asc',
    universeIds: ['FOESP$$ALL'],
    postman: {
        environmentJSON: postmanJSON
    }
});
```

For more details, see [Morningstar's Find Similar Screener API].