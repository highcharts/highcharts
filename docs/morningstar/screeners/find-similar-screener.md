# Find Similar Screener

Using the Morningstar **Find Similar Screener** endpoint allows you to find
investments with similar characteristics to one you are already familiar with.

## How to use Find Similar Screener

The Find Similar capability helps identify alternative investments with
comparable characteristics. For example, if a preferred investment is closed to
new investors or has high minimum requirements, this tool can help you find
suitable alternatives using customizable filters.

This connector is designed to be interacted with using external buttons, that
might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the Find Similar Screener Connector:

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
    universeIds: ['FOESP$$ALL']
});
```

For more details, see [Morningstar's Screener API - Find Similar].

## Morningstar API Reference

For more details, see [Morningstar's Screener API].

<!-- Links -->
[Morningstar's Screener API]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/screener/overview
[Morningstar's Screener API - Find Similar]: https://developer.morningstar.com/direct-web-services/documentation/enterprise-component-apis/screener/find-similar
