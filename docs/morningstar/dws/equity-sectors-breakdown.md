# Equity Sectors Breakdown

The **Equity Sectors Breakdown** view provides the equity portion of
a portfolio classified by Morningstar's Global Equity Classification Structure
into super sectors (Cyclical, Sensitive, Defensive), sectors, and industries,
reported as long, short, net, and rescaled-long percentages.

It populates the `EqSuperSectors`, `EqSectors`, and `EqIndustries` data tables.

## Available data tables

Currently the following data tables are supported in the
`EquitySectorsBreakdown` connector:

- **EqSuperSectors**
- **EqSectors**
- **EqIndustries**

## How to use Equity Sectors Breakdown

Select the `EquitySectorsBreakdown` converter on the `InvestmentsConnector`,
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
        EquitySectorsBreakdown: {}
    }
});

await connector.load();

const dataTable = connector.getTable('EqSuperSectors');

Highcharts.chart('container', {
    title: {
        text: 'Equity Super Sectors Breakdown'
    },
    subtitle: {
        text: dataTable.metadata.performanceId
    },
    series: [{
        name: 'Equity Super Sectors Long Rescaled',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'PercLongRescaled']
        )
    }, {
        name: 'Equity Super Sectors Long',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'PercLong']
        )
    }, {
        name: 'Equity Super Sectors Net',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'PercNet']
        )
    }]
});
```

## Relevant demos

You will find examples of how to use `EquitySectorsBreakdown` converter in our
demos.

- **Highcharts Core + Morningstar Equity Sectors Breakdown**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
