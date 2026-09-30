# Fixed Income Sectors Breakdown

The **Fixed Income Sectors Breakdown** view provides the
fixed-income portion of a portfolio classified by Morningstar's fixed-income
sector structure into super, primary, and secondary sectors - including the
per-region government, treasury, inflation-protected, and agency sectors -
reported as long, short, and net percentages.

It populates several data tables covering the sector groupings, their breakdown
(`Brk`) variants, and the per-region tables.

## Available data tables

Currently the following data tables are supported in the
`FixedIncomeSectorsBreakdown` connector:

- **IncGovernmentPerRegionSuperSectors**
- **IncTreasuryPerRegionSecondarySectors**
- **IncInflationPerRegionSecondarySectors**
- **IncAgencyPerRegionSecondarySectors**
- **IncAllSectors**
- **IncSuperSectors**
- **IncPrimarySectors**
- **IncSecondarySectors**
- **IncBrkAllSectors**
- **IncBrkSuperSectors**
- **IncBrkPrimarySectors**
- **IncBrkSecondarySectors**

## How to use Fixed Income Sectors Breakdown

Select the `FixedIncomeSectorsBreakdown` converter on the
`InvestmentsConnector`, then read the data tables with
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
        FixedIncomeSectorsBreakdown: {}
    }
});

await connector.load();

const dataTable = connector.getTable('IncBrkSuperSectors');

Highcharts.chart('container-brk-super-sectors', {
    title: {
        text: 'Fixed Income Super Sectors Breakdown'
    },
    subtitle: {
        text: dataTable.metadata.performanceId
    },
    series: [{
        name: 'Fixed Income Breakdown Super Sectors Long',
        data: dataTable.getRows(
            void 0,
            void 0,
            [
                'Fixed_Income_Breakdown_Type',
                'Fixed_Income_Breakdown_CalcLongFiperc'
            ]
        )
    }, {
        name: 'Fixed Income Breakdown Super Sectors Short',
        data: dataTable.getRows(
            void 0,
            void 0,
            [
                'Fixed_Income_Breakdown_Type',
                'Fixed_Income_Breakdown_CalcShortFiperc'
            ]
        )
    }, {
        name: 'Fixed Income Breakdown Super Sectors Net',
        data: dataTable.getRows(
            void 0,
            void 0,
            [
                'Fixed_Income_Breakdown_Type',
                'Fixed_Income_Breakdown_CalcNetFiperc'
            ]
        )
    }]
});
```

## Relevant demos

You will find examples of how to use `FixedIncomeSectorsBreakdown` converter in
our demos.

- **Highcharts Core + Morningstar Fixed Income Region Sectors Breakdown**
- **Highcharts Core + Morningstar Fixed Income Sectors Breakdown**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
