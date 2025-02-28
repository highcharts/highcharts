# Regulatory Screener

Using the Morningstar Regulatory Screener endpoint allows you to access key regulatory data on global investments, supporting your processes for meeting regulatory requirements.

## How to use Regulatory Screener

The Regulatory Screener provides a comprehensive solution for accessing regulatory data from a single source. It enables you to retrieve essential compliance information and legal filings, such as KIIDs and prospectuses, in a format tailored to your needs.

Data can be filtered on any data point comprehensively covered by Morningstar, including proprietary data such as:

 * Sustainability Preferences Considered
 * EU SFDR Classification
 * Principal Adverse Impacts (PAI)
 * Planned Investments and Allocations

For more details, see [Morningstar's Regulatory Screener API].

<!-- Links -->
[Morningstar's Regulatory Screener API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/screener/regulatory-screener

This connector is designed to be interacted with using external buttons, that might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the Regulatory Screener connector:

```js
const screenerConnector = new HighchartsConnectors.Morningstar.InvestmentScreenerConnector({
    page: 1,
    pageSize: 20,
    languageId: 'en-AU',
    currencyId: 'AUD',
    filters: [
        {
            dataPointId: 'EET_PAIConsidered',
            comparatorCode: 'EQ',
            value: true
        }
    ],
    securityDataPoints: [
        'secId',
        'name',
        'EET_SustPreferencesConsidered',
        'EET_PAIConsidered',
        'EET_SustInv_A8',
    ],
    universeIds: ['FOEUR$$ALL_5791'],
    sortOrder: 'name asc',
    postman: {
        environmentJSON: postmanJSON
    }
});
```

For more details, see [Morningstar's Regulatory Screener API].