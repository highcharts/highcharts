---
sidebar_label: "Data"
---

# Row data

Rows in Highcharts Grid are derived from the underlying `dataTable`. Each column contributes one value per row, and the row index defines which values are grouped together.

You can access or modify rows using the DataTable API that powers the Grid.

## Row data in configuration

Rows are formed implicitly from column arrays. Each array index represents a row.

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                product: ['Apple', 'Pear', 'Orange'],
                price: [3.5, 2.5, 3.0],
                inStock: [true, true, false]
            }
        }
    }
});
```

In the example above, row index `0` maps to `{ product: 'Apple', price: 3.5, inStock: true }`.

## Accessing rows

Once the Grid is created, use `grid.dataTable` to read rows. You can fetch rows as arrays or as objects keyed by column IDs.

```js
const grid = Grid.grid('container', { /* options */ });

const firstRow = grid.dataTable.getRow(0);
// ['Apple', 3.5, true]

const firstRowObject = grid.dataTable.getRowObject(0);
// { product: 'Apple', price: 3.5, inStock: true }
```

Common row methods include:

* `getRow(index)`
* `getRowObject(index)`
* `getRows()`
* `getRowCount()`
* `getRowIndexBy(columnId, value)`

For a complete list of DataTable methods, see the [DataTable API](https://api.highcharts.com/dashboards/#classes/Data_DataTable.DataTable).

## Updating rows

Use DataTable setters to update rows after render. The Grid listens to DataTable updates and refreshes automatically.

```js
const grid = Grid.grid('container', { /* options */ });

// Update a single row by index
grid.dataTable.setRow(0, ['Apple', 3.8, true]);

// Update multiple rows at once
grid.dataTable.setRows([
    ['Pear', 2.7, true],
    ['Orange', 3.1, false]
], 1);
```

You can also delete rows with `deleteRows()` or clone the table for offline processing before applying changes.

For more on data structures, see the [Data Table documentation](https://www.highcharts.com/docs/dashboards/data-table).
