# Investments Connector

The `HighchartsConnectors.MorningstarDWS.InvestmentsConnector` is a connector
that allows access to the newer Morningstar API, which provides the Investment
Details API.

## How to use Investments Connector

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

Here is a list of available converters along with their corresponding data table
names:

* **AssetAllocationBreakdown**:
    - AssetAlloc
    - CanadianAssetAlloc
    - UnderlyingAssetAlloc

* **CountryAndRegionExposure**:
    - RegionEquity
    - RegionFixedIncome
    - RegionFixedIncomeGeo
    - RegionRevenueExposure
    - CountryEquity
    - CountryBreakdown
    - CountryRevenueExposure

* **EquitySectorsBreakdown**:
    - EqSuperSectors
    - EqSectors
    - EqIndustries

* **FixedIncomeSectorsBreakdown**:
    - IncSuperSectors
    - IncPrimarySectors
    - IncSecondarySectors
    - IncBrkSuperSectors
    - IncBrkPrimarySectors
    - IncBrkSecondarySectors

* **EquityStyleBox**:
    - StockStyle
    - TimeSeries

* **ProspectusFees**:
    - ProspectusFees

## Investments Connector Examples

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
        CountryAndRegionExposure: {},
        EquitySectorsBreakdown: {},
        FixedIncomeSectorsBreakdown: {},
        EquityStyleBox: {
            startDate: '2025-01-01',
            endDate: '2025-12-01'
        },
        ProspectusFees: {}
    }
});

await connector.load();
```

### The `EquitySectorsBreakdown` converter example:

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
            ['Type', 'Net']
        )
    }]
});
```

### The `FixedIncomeSectorsBreakdown` converter example:

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
            ['Fixed_Income_Breakdown_Type', 'Fixed_Income_Breakdown_CalcLongFiperc']
        )
    }, {
        name: 'Fixed Income Breakdown Super Sectors Short',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Fixed_Income_Breakdown_Type', 'Fixed_Income_Breakdown_CalcShortFiperc']
        )
    }, {
        name: 'Fixed Income Breakdown Super Sectors Net',
        data: dataTable.getRows(
            void 0,
            void 0,
            ['Fixed_Income_Breakdown_Type', 'Fixed_Income_Breakdown_CalcNetFiperc']
        )
    }]
});
```

### The `EquityStyleBox` converter example:

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
        categories: ['Value', 'Blend', 'Growth'],
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

### The `CountryAndRegionExposure` converter example:
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

### The `AssetAllocationBreakdown` converter example:
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

## Relevant demos

Examples of using the InvestmentsConnector are available in our demos:

- **Highcharts Core + Morningstar Asset Allocation Breakdown**
- **Highcharts Core + Morningstar Equity Sectors Breakdown**
- **Highcharts Core + Morningstar Fixed Income Sectors Breakdown**
- **Highcharts Core + Morningstar Equity Style Box**
- **Highcharts Core + Morningstar Equity Style Box Time Series**

[Morningstar’s Investment Details API]: https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments---async/openapi-specification
