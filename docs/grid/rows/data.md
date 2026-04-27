---
sidebar_label: "Data"
---

# Row data

Rows in Highcharts Grid are served by the configured `grid.dataProvider`. Each
column contributes one value per row, and the row index defines which values
are grouped together in the current presentation dataset.

With the default `LocalDataProvider`, access the underlying `DataTable`
through `grid.dataProvider.getDataTable()` when you need direct table access.

## Row data in configuration

Rows are formed implicitly from column arrays. Each array index represents a row.

```js
Grid.grid('container', {
    data: {
        columns: {
            product: ['Apple', 'Pear', 'Orange'],
            price: [3.5, 2.5, 3.0],
            inStock: [true, true, false]
        }
    }
});
```

In the example above, row index `0` maps to `{ product: 'Apple', price: 3.5, inStock: true }`.

## Accessing rows

Once the Grid is created, use `grid.dataProvider` to read rows, values and row
metadata.

```js
const grid = await Grid.grid('container', { /* options */ }, true);
const provider = grid.dataProvider;

if (provider) {
    const firstRowObject = await provider.getRowObject(0);
    // { product: 'Apple', price: 3.5, inStock: true }

    const firstPrice = await provider.getValue('price', 0);
    // 3.5

    const rowCount = await provider.getRowCount();
    // 3
}
```

Common row methods include:

* `getRowObject(index)`
* `getRowCount()`
* `getRowId(rowIndex)`
* `getRowIndex(rowId)`

For data-provider configuration details, see the
[Data handling overview](https://www.highcharts.com/docs/grid/data-handling/overview)
and [Client-side data handling](https://www.highcharts.com/docs/grid/data-handling/clientside).

## Updating rows

Use `dataProvider.setValue()` to update cell values after render. This works for
both local and remote providers.

```js
const grid = await Grid.grid('container', { /* options */ }, true);
const provider = grid.dataProvider;

if (provider) {
    // setValue() uses a stable row ID, not a row index
    const rowId = await provider.getRowId(0);
    if (rowId !== void 0) {
        await provider.setValue(3.8, 'price', rowId);
    }
}
```

If you use the default `LocalDataProvider`, you can still access the underlying
`DataTable` for batch operations like `setRows()` or `deleteRows()`:

```js
const grid = await Grid.grid('container', { /* options */ }, true);
const provider = grid.dataProvider;

if (provider && 'getDataTable' in provider) {
    const dataTable = provider.getDataTable();

    dataTable?.setRows([
        ['Pear', 2.7, true],
        ['Orange', 3.1, false]
    ], 1);

    dataTable?.deleteRows(0, 1);
}
```

For more on data structures, see the [Data Table documentation](https://www.highcharts.com/docs/dashboards/data-table).
