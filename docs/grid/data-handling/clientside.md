---
sidebar_label: "Client-side"
---

# Client-side data handling

Client-side data handling is the default model in Highcharts Grid. Grid loads
data into a `DataTable`, then applies sorting, filtering, and pagination in
memory through the local data provider.

## DataTable

In client-side mode, `DataTable` is the grid's internal "database". Whether you
start with `data.columns`, an existing `data.dataTable`, or
[`data.connector`](https://www.highcharts.com/docs/grid/data-handling/connectors),
Grid works with a `DataTable` internally.

To access the underlying table in client-side mode, use
`grid.dataProvider.getDataTable()` when the provider is local.

For a full description of `DataTable`, see the [Dashboards article on
DataTable](https://www.highcharts.com/docs/dashboards/data-table).

## Local data sources

The local provider is used when you configure any of the following:

- `data.columns`
- `data.dataTable`
- [`data.connector`](https://www.highcharts.com/docs/grid/data-handling/connectors)

This means a [connector-backed Grid](https://www.highcharts.com/docs/grid/data-handling/connectors)
is still client-side after the initial load, even if the connector fetched data
from a remote URL.

## How client-side querying works

With the local provider, Grid reads from the source `DataTable`, applies active
sorting and filtering modifiers, and then applies pagination to the resulting
presentation table.

Use this model when:

- the full dataset can be loaded in the browser
- sorting and filtering should react immediately after the initial load
- you want to work directly with `DataTable` and Data Modifiers

## Basic example

```js
Grid.grid('container', {
    data: {
        providerType: 'local', // Optional
        columns: {
            id: ['a1', 'p1', 'o1'],
            product: ['Apple', 'Pear', 'Orange'],
            price: [3.5, 2.5, 3]
        },
        // Optional: column that contains stable, unique row IDs.
        idColumn: 'id'
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    pagination: {
        enabled: true
    }
});
```

In this setup, `idColumn` provides stable row IDs and all sorting, filtering,
and pagination happen in memory.

## Existing DataTable instance

If you already have a `DataTable`, pass it through `data.dataTable`. This is a
good fit when the table is created or updated outside Grid and then reused by
the Grid instance.

```js
const dataTable = new Grid.DataTable({
    columns: {
        id: ['a1', 'p1', 'o1'],
        product: ['Apple', 'Pear', 'Orange'],
        price: [3.5, 2.5, 3]
    }
});

Grid.grid('container', {
    data: {
        // Reuse an existing DataTable created outside Grid.
        dataTable,
        // Optional: column that contains stable, unique row IDs.
        idColumn: 'id'
    },
    pagination: {
        enabled: true
    }
});
```

## Stable row IDs and updates

Use `data.idColumn` when rows need stable IDs based on a column value instead of
their original row index.

Use `updateOnChange` when the underlying `DataTable` or
[connector](https://www.highcharts.com/docs/grid/data-handling/connectors)
data changes outside Grid and you want the rendered rows to refresh
automatically.

## When not to use this model

If your backend should do sorting, filtering, or pagination before rows are
sent to the browser, use [Server-side data handling](https://www.highcharts.com/docs/grid/data-handling/serverside) instead.

## API reference

- [`data`](https://api.highcharts.com/grid/data)
- [`data.local`](https://api.highcharts.com/grid/data.local)
