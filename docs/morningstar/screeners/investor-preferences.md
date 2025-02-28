Investor Preferences
=============================

Using Morningstar Investor Preferences screener allows you to filter Morningstar's database of global investments for securities that match a set of criteria unique to an investor.

This connector allows you to configure and pass a set of criteria an investment must satisfy in order to be considered aligned with an investor’s preferences.

Securities that match the criteria in the request are tagged with a data point, making it easy to identify and highlight them for use in investment lists, comparisons, portfolio analysis, and building portfolios.

How to use Investor Preferences
----------------

The Investor Preferences endpoint allows you to highlight securities matching on user-defined criteria like risk tolerance, sustainability score, objectives, and exclusions. Calculated data points, represented as boolean flags, make it straightforward to identify investments aligned with user preferences for comparison, portfolio construction, or detailed analysis.

Additionally, you can filter the returned securities list to ensure that only portfolios strictly meeting investor preferences are included.

For more details, see [Morningstar's Investor Preferences API]

This connector is designed to be interacted with using external buttons, that might filter data on the backend, provide pagination as well as sorting.

Here is an example of how to use the Investor Preferences connector:

```js
const investorPreferencesConnector = new HighchartsConnectors.Morningstar.InvestorPreferencesConnector({
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
        'name',
        'sustainabilityRank'
    ],
    calculatedDataPoints: [{
        name: 'ClientPreferences',
        type: 'bool',
        condition: {
            and: [{
                fields: [
                    {
                        name: 'EET_EUSFDRType',
                        op: 'eq',
                        value: 8
                    },
                    {
                        name: 'EET_PAI_GHGEmissions1Considered',
                        op: 'eq',
                        value: 'Y'
                    },
                    {
                        name: 'EET_PAI_GHGEmissions3Considered',
                        op: 'in',
                        value: ['N','I']
                    }
                ]
            }]
        }
    }],
    universeIds: ['FOALL$$ALL'],
    postman: {
        environmentJSON: postmanJSON
    }
});
```

For details see [Morningstar's Investor Preferences API].

<!-- Links -->
[Morningstar's Investor Preferences API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/screener/investor-preferences
