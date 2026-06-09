# Investment Details Connector

The `HighchartsConnectors.MorningstarDWS.InvestmentsConnector` provides access
to Morningstar's **Investment Details API** (the newer DWS API). A single
connector instance can request multiple converters at once. Each converter
populates one or more named data tables that you bind to your Highcharts
series.

## Requirements

Using the Morningstar Connectors requires an active Highcharts license and a
Morningstar subscription, plus Morningstar Direct Web Services credentials -
either an access token from your server or a username and password. See the
[Morningstar Connectors overview](https://www.highcharts.com/docs/morningstar/morningstar)
for licensing and credential details.

## Setup

Load the DWS bundle alongside Highcharts. As an ES module:

```js
import Highcharts from 'highcharts';
import '@highcharts/connectors-morningstar/dws';
```

Or as a UMD script from the CDN:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/connectors/morningstar/connectors-morningstar-dws.js"></script>
```

## How to use the Investments Connector

The `InvestmentsConnector` allows you to select multiple converters
simultaneously.

```js
new HighchartsConnectors.MorningstarDWS.InvestmentsConnector({
    api: {
        access: {
            token: 'your_access_token'
        }
    },
    security: {
        id: '0P00000FIA'
    },
    converters: {
        // Chosen converters
    }
});
```

Below, you will find the currently implemented data converters, with more
planned for the future.

## Available data converters

Here is a list of available converters along with a short description and their
corresponding data table names. Each converter is selected by name under the
`converters` option, and each data table is retrieved with
`connector.getTable('<TableName>')`.

- **AssetAllocationBreakdown** - the security's asset-allocation breakdown
  (general, Canadian, and underlying-instrument views). Data tables:
  - `AssetAlloc`
  - `CanadianAssetAlloc`
  - `UnderlyingAssetAlloc`

- **CountryAndRegionExposure** - exposure broken down by region and country,
  for equity, fixed income, and revenue. Data tables:
  - `RegionEquity`
  - `RegionFixedIncome`
  - `RegionFixedIncomeGeo`
  - `RegionRevenueExposure`
  - `CountryEquity`
  - `CountryBreakdown`
  - `CountryRevenueExposure`

- **EquityAggregatesResidualRisk** - aggregate equity residual-risk statistics
  (Alpha, Beta, and their company counts, including non-dividend variants).
  Data table:
  - `EquityAggregatesResidualRisk`

- **EquityResidualRisk** - equity residual-risk statistics (Alpha, Beta,
  RSquare, including non-dividend variants) at daily and monthly granularity.
  Data tables:
  - `RiskDaily`
  - `RiskMonthly`

- **EquitySectorsBreakdown** - equity sector exposure at super-sector, sector,
  and industry levels. Data tables:
  - `EqSuperSectors`
  - `EqSectors`
  - `EqIndustries`

- **EquityStyleBox** - the Morningstar equity style box: the current style/size
  grid and its historical time series. Data tables:
  - `StockStyle`
  - `TimeSeries`

- **FixedIncomeSectorsBreakdown** - fixed-income sector exposure across multiple
  groupings: super/primary/secondary sectors, their breakdown (`Brk`) variants,
  and per-region tables. Data tables:
  - `IncGovernmentPerRegionSuperSectors`
  - `IncTreasuryPerRegionSecondarySectors`
  - `IncInflationPerRegionSecondarySectors`
  - `IncAgencyPerRegionSecondarySectors`
  - `IncAllSectors`
  - `IncSuperSectors`
  - `IncPrimarySectors`
  - `IncSecondarySectors`
  - `IncBrkAllSectors`
  - `IncBrkSuperSectors`
  - `IncBrkPrimarySectors`
  - `IncBrkSecondarySectors`

- **ProspectusFees** - prospectus fee data for the security. Data table:
  - `ProspectusFees`

## The `InvestmentsConnector` examples

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
        AssetAllocationBreakdown: {},
        CountryAndRegionExposure: {},
        EquityAggregatesResidualRisk: {},
        EquityResidualRisk: {},
        EquitySectorsBreakdown: {},
        EquityStyleBox: {
            startDate: '2025-01-01',
            endDate: '2025-12-01'
        },
        FixedIncomeSectorsBreakdown: {},
        ProspectusFees: {}
    }
});

await connector.load();
```

### The `AssetAllocationBreakdown` converter

```js
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

### The `CountryAndRegionExposure` converter

```js
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

### The `EquityAggregatesResidualRisk` converter

```js
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

### The `EquityResidualRisk` converter

```js
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

### The `EquitySectorsBreakdown` converter

```js
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

### The `EquityStyleBox` converter

```js
const dataTable = connector.getTable('StockStyle');

Highcharts.chart('container', {
    chart: {
        type: 'heatmap'
    },
    title: {
        text: 'Equity Style Box'
    },
    subtitle: {
        text: 'Stock Style',
        align: 'left'
    },
    xAxis: {
        categories: ['Value', 'Core', 'Growth'],
        lineWidth: 0,
        gridLineWidth: 0,
        opposite: true,
        labels: {
            style: {
                fontSize: '1rem',
                color: '#6e7481'
            }
        }
    },
    yAxis: {
        categories: ['Small', 'Medium', 'Large'],
        gridLineWidth: 0,
        title: {
            text: ''
        },
        labels: {
            rotation: -90,
            style: {
                fontSize: '1rem',
                color: '#6e7481'
            }
        }
    },
    legend: {
        layout: 'vertical',
        verticalAlign: 'top',
        align: 'right',
        y: 75,
        symbolRadius: 0,
        itemMarginTop: 9,
        itemMarginBottom: 9
    },
    colorAxis: {
        dataClasses: [{
            from: 49,
            color: '#014ce5',
            name: '50+'
        }, {
            from: 24,
            to: 49,
            color: '#487cea',
            name: '25-49'
        }, {
            from: 9,
            to: 24,
            color: '#acc2f3',
            name: '10-24'
        }, {
            from: 0,
            to: 9,
            color: '#fafafa',
            name: '0-9'
        }]
    },
    series: [{
        name: 'Equity Style Box',
        borderWidth: 1,
        borderColor: '#e5e7e9',
        keys: ['x', 'y', 'value'],
        data: dataTable.getRows(0, 9),
        dataLabels: {
            enabled: true,
            format: '{value:.0f}%',
            style: {
                fontSize: '1rem',
                textOutline: 'none'
            }
        }
    }]
});
```

### The `FixedIncomeSectorsBreakdown` converter

```js
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

### The `ProspectusFees` converter

```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'prospectus-fees',
            type: 'MorningstarDWSInvestments',
            api: {
                access: {
                    token: 'your_access_token'
                }
            },
            security: {
                id: '0P00000FIA'
            },
            converters: {
                ProspectusFees: {}
            },
            dataModifier: {
                type: 'Invert'
            }
        }]
    },
    components: [{
        renderTo: 'container',
        type: 'Grid',
        connector: {
            id: 'prospectus-fees',
            dataTableKey: 'ProspectusFees'
        },
        title: 'Prospectus Fees'
    }]
});
```

## Relevant demos

Examples of using the **Investment Details Connector** are available in our
demos:

- **Highcharts Core + Morningstar Asset Allocation Breakdown**
- **Highcharts Core + Morningstar Country and Region Exposure**
- **Highcharts Core + Morningstar Equity Aggregates Residual Risk**
- **Highcharts Core + Morningstar Equity Residual Risk**
- **Highcharts Core + Morningstar Equity Sectors Breakdown**
- **Highcharts Core + Morningstar Equity Style Box**
- **Highcharts Core + Morningstar Equity Style Box Time Series**
- **Highcharts Core + Morningstar Fixed Income Sectors Breakdown**
- **Highcharts Dashboards Grid + Morningstar Prospectus Fees**

## Morningstar API Reference

For more details, see [Morningstar’s Investment Details API].

<!-- Links -->
[Morningstar’s Investment Details API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments---async/openapi-specification
