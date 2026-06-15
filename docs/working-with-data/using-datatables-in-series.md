# Using DataTables with Series

The [`dataTable`](https://api.highcharts.com/highcharts/dataTable) and [`dataMapping`](https://api.highcharts.com/highcharts/series.line.dataMapping) options provide a structured approach to
working with series data. Instead of passing data directly to each series as an array, you can
use a `DataTable` to store your data in a tabular format and map specific
columns to series properties.

## When to use DataTables

DataTables are particularly useful when:

- Working with **structured or tabular data** from databases, CSV files, or APIs
- Displaying **multiple series from the same data source** with different column mappings
- Wanting to **share data between Grid and Chart components**
- Implementing **reactive data updates** without manual point management
- Dealing with **large datasets** where performance matters

## Creating a DataTable

### Manually with columns

```js
const dataTable = new Highcharts.DataTable({
    columns: {
        x: [1, 2, 3, 4, 5],
        y: [29.9, 71.5, 106.4, 129.2, 144.0],
        name: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    }
});
```

## Basic usage

### Simple mapping

Define a `DataTable` and map its columns to series properties using `dataMapping`:

```js
const dataTable = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Cost: [11, 13, 12, 14]
    }
});

Highcharts.chart('container', {
    dataTable,
    series: [{
        dataMapping: {
            x: 'Year',
            y: 'Cost'
        }
    }]
});
```

### Property from column

The `dataMapping` object keys reference point properties, and values reference
column IDs:


```js
dataMapping: {
    x: 'timestamp',        // Column 'timestamp' → point.x
    y: 'sales',            // Column 'sales' → point.y
    name: 'product',       // Column 'product' → point.name
    color: 'status_color'  // Column 'status_color' → point.color
}
```

If the columns of the DataTable have keys matching the series keys, the data
mapping is not necessary. For example, this DataTable will connect directly to
the series' `x` and `y` keys:

```js
const dataTable = new Highcharts.DataTable({
    columns: {
        x: ['2026-05-04', '2026-05-05', '2026-05-06'],
        y: [1, 4, 2]
    }
});
```

## Multiple series from one DataTable

Map different columns to different series:

```js
const dataTable = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Cost: [11, 13, 12, 14],
        Revenue: [12, 15, 14, 18]
    }
});

Highcharts.chart('container', {
    dataTable,
    title: {
        text: 'Common data table'
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Cost'
        }
    }, {
        dataMapping: {
            y: 'Revenue'
        }
    }]
});
```
[View it live on jsFiddle](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/datatable/chart-datatable-single/)

## Dynamic updates

When you update a `DataTable`, changes automatically propagate to all series using that table:

```js
const dataTable = new Highcharts.DataTable({
    columns: {
        x: [1, 2, 3],
        y: [10, 20, 30]
    }
});

const chart = Highcharts.chart('container', {
    series: [{
        dataTable
    }]
});

// Adds a row
dataTable.setRow({
    x: 5,
    y: 40
});
// Chart updates automatically
```
See an example of [adding and shifting data rows](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/datatable/live-chart/).

## Combining with data sorting

The `dataSorting` option works seamlessly with DataTables:

```js
Highcharts.chart('container', {
    series: [{
        dataTable,
        dataMapping: { x: 'category', y: 'value' },
        dataSorting: {
            enabled: true,
            sortKey: 'value'
        }
    }]
});
```

## Performance considerations

### When to use DataTables

- Large datasets (1000+ points)
- Multiple series sharing data
- Frequent data updates

### When direct series.data is fine

- Small datasets
- One-time chart generation
- Simple, isolated charts
- Data source is already an array

## API Reference

For comprehensive API documentation, see:

- [Chart-level dataTable](https://api.highcharts.com/highcharts/dataTable)
- [Series-level dataTable](https://api.highcharts.com/highcharts/series.line.dataTable)
- [series.dataMapping](https://api.highcharts.com/highcharts/series.line.dataMapping)
- [DataTable class reference](https://api.highcharts.com/class-reference/Highcharts.DataTable)

## See also

- [Working with data](https://www.highcharts.com/docs/working-with-data/data-intro)
- [Data module](https://www.highcharts.com/docs/working-with-data/data-module)
- [Chart series](https://www.highcharts.com/docs/chart-concepts/series)
