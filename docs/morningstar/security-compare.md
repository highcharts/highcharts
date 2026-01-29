# Security Compare

This type retrieves investment data for multiple securities, making it ideal for comparison.

## How to use SecurityCompare

Use the `SecurityCompareConnector` to load the connector.

Specify the securities in the options along with your credentials or a session token
for authentication.

### Views

To access the desired data, configure the `viewIds` option according to your account setup. For more details, see [Getting View IDs].

### Securities

Securities are the investments whose details are retrieved. They can be specified using various ID types. Unlike in SecurityDetails, the IDs must be stored in an array.

Supported id-types are: `CUSIP`, `FundCode`, `ISIN`, `MSID`, `PerformanceId`, `SecurityID`, `TradingSymbol`.

If any securities are invalid, the connector will still yield results. The invalid securities will appear in the connector's `metadata` after load.


### Column Names

Columns are named based on the values they represent, followed by their respective security ID (MSID), for example: `Nav_DayEnd_TimePeriod_F0GBR050DD`. This naming convention distinguishes the columns and enables quick comparison when inspecting the table. Below is an example of how the columns may be used in practice.

#### Security Compare Types

You can specify the type of data to retrieve by using an array of types: `converters: ['AssetAllocations', 'RegionalExposure']` in the connector. The following types are available:

- **TrailingPerformance**
- **AssetAllocations**
- **RegionalExposure**
- **GlobalStockSectorBreakdown**
- **CountryExposure**
- **PortfolioHoldings**
- **MarketCap**
- **IndustryBreakdown**
- **IndustryGroupBreakdown**
- **BondStatistics**
- **StyleBoxBreakdown**
- **BondStyleBoxBreakdown**
- **CreditQualityBreakdown**
- **HistoricalPerformanceSeries**
- **RiskStatistics**

If no converter types are provided or the converter type doesn't exist, all available types will be returned for the Security Compare connector.

Example usage:

```js
const connector = new HighchartsConnectors.Morningstar.SecurityCompareConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        ids: ['F0GBR050DD', 'F00000Q5PZ'],
        idType: 'MSID'
    },
    converters: ['AssetAllocation'] // Specify the types of data to retrieve
});
```

For more details, see [Morningstar’s Investment Compare API].

### Security Compare with Morningstar standalone for Highcharts:

```js
const ids = ['F0GBR050DD', 'F00000Q5PZ'];

const connector = new HighchartsConnectors.Morningstar.SecurityCompareConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        ids,
        idType: 'MSID'
    }
});

await connector.load();

Highcharts.chart('container', {
    title: {
        text: 'Comparing multiple securities (Trailing performance)'
    },
    series: ids.map(id => ({
        type: 'column',
        name: id,
        data: connector.dataTables.TrailingPerformance.getRows(
            void 0,
            void 0,
            [
                // Categories on x-axis
                'Nav_DayEnd_TimePeriod_' + id,
                // Values on y-axis
                'Nav_DayEnd_Value_' + id
            ]
        )
    })),
    xAxis: {
        type: 'category'
    }
});
```

## Relevant demo

You will find examples of how to use SecurityCompareConnector in our demos.

[Morningstar’s Investment Compare API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/security-details/investment-compare

[Getting View IDs]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/security-details/investment-details#get-views