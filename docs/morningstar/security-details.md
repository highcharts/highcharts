# Security Details

This type retrieves investment data for a specified set of securities and is ideal for building single-investment profiles.

## How to use SecurityDetails

Use the `SecurityDetailsConnector` to load security details.

In dashboards, this connector is called `MorningstarSecurityDetails`.

Specify the security in the options along with your credentials or a session token
for authentication.

### Views

To access the desired data, configure the `viewId` option according to your account setup. For more details, see [Getting View IDs].

### Securities

Securities are the investments whose details are retrieved. They can be specified using various ID types.

Supported id-types are: `CUSIP`, `FundCode`, `ISIN`, `MSID`, `PerformanceId`, `SecurityID`, `TradingSymbol`.

If any securities are invalid, the connector will still yield results. The invalid securities will appear in the connector's `metadata` after load.

#### Security Details Types

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
- **Meta**
- **StyleBoxBreakdown**
- **BondStyleBoxBreakdown**
- **CreditQualityBreakdown**
- **HistoricalPerformanceSeries**

If no converter types are provided or the converter type doesn't exist, all available types will be returned for the Security Details connector.

The Meta converter extracts essential security details, including identification, pricing, risk metrics, and provider information, ensuring a structured overview of the security.

Example usage:

```js
const securityDetailsConnector = new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        id: 'F0GBR050DD',
        idType: 'MSID'
    },
    converters: ['AssetAllocations'] // Specify the types of data to retrieve
});
```

For more details, see [Morningstar’s Security Details API].

### Security Details with Morningstar standalone for Highcharts:

```js
const securityDetailsConnector = new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        id: 'F0GBR050DD',
        idType: 'MSID'
    },
    converters: ['TrailingPerformance']
});

await securityDetailsConnector.load();

Highcharts.chart('container', {
    title: {
        text: 'Aviva Investors UK Listed Equity Unconstrained Fund 2 GBP Acc'
    },
    series: [{
        type: 'column',
        name: 'F0GBR050DD',
        data: connector.dataTables.TrailingPerformance.getRows(
            void 0,
            void 0,
            // Get X and Y data for the chart:
            ['Nav_DayEnd_TimePeriod', 'Nav_DayEnd_Value']
        )
    }],
    xAxis: {
        type: 'category'
    }
});
```

## Relevant demo

You will find examples of how to use SecurityDetailsConnector in our demos.

[Morningstar’s Security Details API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/security-details/overview

[Getting View IDs]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/security-details/investment-details#get-views