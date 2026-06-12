# Equity Aggregates Residual Risk and Return Sensitivity

The **Equity Aggregates Residual Risk and Return Sensitivity** view supplies a
stock's excess return, its volatility, and its relative performance, grouped by
industry classification according to Morningstar's Global Equity Classification
Structure. The figures are averaged across each industry on a country-by-country
basis, so a company can be benchmarked against its peers within the same
industry, industry group, or sector.

It populates a single `EquityAggregatesResidualRisk` data table holding Alpha,
Beta, and their company counts, including non-dividend variants.

## Available data tables

Currently the following data tables are supported in the
`EquityAggregatesResidualRisk` connector:

- **EquityAggregatesResidualRisk**

## How to use Equity Aggregates Residual Risk and Return Sensitivity

Select the `EquityAggregatesResidualRisk` converter on the
`InvestmentsConnector`, then read the data table with
`connector.getTable('<TableName>')`.

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
        EquityAggregatesResidualRisk: {}
    }
});

await connector.load();

const dataTable = connector.getTable('EquityAggregatesResidualRisk');

Highcharts.chart('container', {
    title: {
        text: 'Equity Aggregates Residual Risk Values'
    },
    subtitle: {
        text: dataTable.metadata.performanceId
    },
    series: [{
        name: 'Alpha',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'Alpha']
        )
    }, {
        name: 'Beta',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'Beta']
        )
    }, {
        name: 'Non Dividend Alpha',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'NonDividendAlpha']
        )
    }, {
        name: 'Non Dividend Beta',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'NonDividendBeta']
        )
    }]
});
```

## Relevant demos

You will find examples of how to use `EquityAggregatesResidualRisk` converter
in our demos.

- **Highcharts Core + Morningstar Equity Aggregates Residual Risk**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
