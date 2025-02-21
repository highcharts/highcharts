# Security Details

This type retrieves investment data for a specified set of securities and is ideal for building single-investment profiles.

## How to use SecurityDetails

Use the `SecurityDetailsConnector` to load security details.

In dashboards, this connector is called `MorningstarSecurityDetails`.

Specify the securities in the options along with a Postman environment file for authentication and other parameters such as and `currency`.

### Securities

Securities are the investments whose details are retrieved. They can be specified using various ID types.

Supported id-types are: `CUSIP`, `FundCode`, `ISIN`, `MSID`, `PerformanceId`, `SecurityID`, `TradingSymbol`.

If any securities are invalid, the connector will still yield results. The invalid securities will appear in the connector's `metadata` after load.

#### Security Details Types

You can specify the type of data to retrieve by using the `type` option in the connector. The following types are available:

- **TrailingPerformance** (default)
- **AssetAllocations**
- **RegionalExposure**
- **GlobalStockSectorBreakdown**
- **CountryExposure**

Example usage:

```js
const securityDetailsConnector = new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
    postman: {
        environmentJSON: postmanJSON
    },
    security: {
        id: 'F0GBR050DD',
        idType: 'MSID'
    },
    converter: {
        type: 'AssetAllocations' // Specify the type of data to retrieve
    }
});
```

For more details, see [Morningstar’s Security Details API].

### Security Details with Morningstar standalone for Highcharts:

```js
const securityDetailsConnector = new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
    postman: {
        environmentJSON: postmanJSON
    },
    security: {
        id: 'F0GBR050DD',
        idType: 'MSID'
    }
});

await securityDetailsConnector.load();

Highcharts.chart('container', {
    title: {
        text: 'Aviva Investors UK Listed Equity Unconstrained Fund 2 GBP Acc'
    },
    series: [{
        type: 'column',
        name: 'F0GBR050DD',
        data: connector.table.getRowObjects().map(obj => [
            obj.SecurityDetails_TrailingPerformance_TimePeriod,
            obj.SecurityDetails_TrailingPerformance_Value
        ])
    }],
    xAxis: {
        type: 'category'
    }
});
```

## Relevant demo

You will find examples of how to use SecurityDetailsConnector in our demos.

[Morningstar’s Security Details API]: https://developer.morningstar.com/direct-web-services/documentation/api-reference/security-details/overview