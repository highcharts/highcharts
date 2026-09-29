# Equity Style Box

The **Equity Style Box** view returns Morningstar's proprietary Style Box along
with Stock Grades. The Style Box positions a stock by market capitalization and
growth, scoring it so you can spot holdings that match your investment strategy,
while the Stock Grades add further classifications centred on a company's
financial health and profitability.

It populates the `StockStyle` table (the current style/size grid) and the
`TimeSeries` table (its historical series). The converter also accepts optional
**startDate** and **endDate** options to bound the time series.

## Available data tables

Currently the following data tables are supported in the `EquityStyleBox`
connector:

- **StockStyle**
- **TimeSeries**

## How to use Equity Style Box

Select the `EquityStyleBox` converter on the `InvestmentsConnector`, then read
the data tables with `connector.getTable('<TableName>')`.

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
        EquityStyleBox: {
            startDate: '2025-01-01',
            endDate: '2025-12-01'
        }
    }
});

await connector.load();

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

## Relevant demos

You will find examples of how to use `EquityStyleBox` converter in our demos.

- **Highcharts Core + Morningstar Equity Style Box**
- **Highcharts Core + Morningstar Equity Style Box Time Series**

## Morningstar API Reference

For more details, see [Morningstar's Investment Details API].

<!-- Links -->
[Morningstar's Investment Details API]:
https://developer.morningstar.com/direct-web-services/documentation/direct-web-services/investment-details---managed-investments/overview
