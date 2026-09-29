# Equity Residual Risk and Return Sensitivity

The **Equity Residual Risk and Return Sensitivity** view reports a stock's
excess return together with how volatile it is and how it performs when measured
against a benchmark index.

It populates the `RiskDaily` and `RiskMonthly` data tables, each holding
**Alpha**, **Beta**, and **RSquare**, including their non-dividend variants.

## Available data tables

Currently the following data tables are supported in the
`EquityResidualRisk` connector:

- **RiskDaily**
- **RiskMonthly**

## How to use Equity Residual Risk and Return Sensitivity

Select the `EquityResidualRisk` converter on the `InvestmentsConnector`, then
read the data tables with `connector.getTable('<TableName>')`.

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
        EquityResidualRisk: {}
    }
});

await connector.load();

const dataTable = connector.getTable('RiskDaily');

Highcharts.chart('container-daily', {
    title: {
        text: 'Equity Residual Risk Daily Values'
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
        name: 'RSquare',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'RSquare']
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
    }, {
        name: 'Non Dividend RSquare',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Type', 'NonDividendRSquare']
        )
    }]
});
```

## Relevant demos

You will find examples of how to use `EquityResidualRisk` converter in our
demos.

- **Highcharts Core + Morningstar Equity Residual Risk**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
