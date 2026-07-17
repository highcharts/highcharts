# Country and Regional Exposure Breakdown

The **Country and Regional Exposure Breakdown** view provides a portfolio's
geographic exposure broken down by region and individual country for its equity
and fixed-income holdings, together with revenue-based exposure, reported as
long, net, and rescaled percentages.

It populates the `RegionEquity`, `RegionFixedIncome`, `RegionFixedIncomeGeo`,
`RegionRevenueExposure`, `CountryEquity`, `CountryBreakdown`, and
`CountryRevenueExposure` data tables.

## Available data tables

Currently the following data tables are supported in the
`CountryAndRegionExposure` connector:

- **RegionEquity**
- **RegionFixedIncome**
- **RegionFixedIncomeGeo**
- **RegionRevenueExposure**
- **CountryEquity**
- **CountryBreakdown**
- **CountryRevenueExposure**

## How to use Country and Regional Exposure Breakdown

Select the `CountryAndRegionExposure` converter on the `InvestmentsConnector`,
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
        CountryAndRegionExposure: {}
    }
});

await connector.load();

const regionEquityTable = connector.getTable('RegionEquity'),
    data = regionEquityTable.getRows(void 0, void 0, ['Region', 'PercNet']);

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Region Equity (Net)'
    },
    series: [{
        name: 'Region Equity (Net)',
        data
    }]
});
```

## Relevant demos

You will find examples of how to use `CountryAndRegionExposure` converter in
our demos.

- **Highcharts Core + Morningstar Country and Region Exposure**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
