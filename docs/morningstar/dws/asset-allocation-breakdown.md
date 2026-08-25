# Asset Allocation Breakdown

The **Asset Allocation Breakdown** view provides the split of a portfolio's net
assets across the major asset classes – equity, bond, convertible bond, cash,
and other - reported as long, short, net, and rescaled-long percentages. It
also includes US/non-US splits, the Canadian asset-allocation view, and a
breakdown by underlying instrument type.

It populates the `AssetAlloc`, `CanadianAssetAlloc`, and `UnderlyingAssetAlloc`
data tables.

## Available data tables

Currently the following data tables are supported in the
`AssetAllocationBreakdown` connector:

- **AssetAlloc**
- **CanadianAssetAlloc**
- **UnderlyingAssetAlloc**

## How to use Asset Allocation Breakdown

Select the `AssetAllocationBreakdown` converter on the `InvestmentsConnector`,
then read the data tables with `connector.getTable('<TableName>')`.

```js
const connector = new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        id: '0P00006W6Q'
    },
    converters: {
        AssetAllocationBreakdown: {}
    }
});

await connector.load();

const generalTable = connector.getTable('AssetAlloc'),
    // Example only uses the first data table. This is how to get
    // the other tables.
    canadaTable = connector.getTable('CanadianAssetAlloc'),
    underlyingTable = connector.getTable('UnderlyingAssetAlloc');

Highcharts.chart('container', {
    title: {
        text: 'General Asset Allocation Breakdown Data'
    },
    chart: {
        type: 'column'
    },
    xAxis: {
        categories: generalTable.getColumn('Type')
    },
    series: [{
        name: 'Long',
        data: generalTable.getColumn('Long')
    }, {
        name: 'Long Rescaled',
        data: generalTable.getColumn('LongRescaled')
    }, {
        name: 'Net',
        data: generalTable.getColumn('Net')
    }, {
        name: 'Short',
        data: generalTable.getColumn('Short')
    }]
});
```

## Relevant demos

You will find examples of how to use `AssetAllocationBreakdown` converter in
our demos.

- **Highcharts Core + Morningstar Asset Allocation Breakdown**
- **Highcharts Core + Morningstar Asset Allocation Breakdown (Pre-fetched JSON)**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
