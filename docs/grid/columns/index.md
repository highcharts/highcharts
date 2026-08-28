---
sidebar_label: "Overview"
---

# Columns overview

Columns define how Grid renders headers, cells, layout, and per-column
interactions. Use `columnDefaults` to define shared behavior and `columns[]`
to override individual columns when needed.

## Defaults

```js
{
    columnDefaults: {
        cells: {
            format: "<span>{value}</span>"
        },
        sorting: {
            enabled: false
        }
    },
    columns: [
        {
            id: "product",
            sorting: {
                enabled: true
            }
        }
    ]
}
```

The `columnDefaults` object defines shared options for all columns in the
Grid. The `columns[]` array is used to override those defaults or add
column-specific behavior where needed.

Most options in `columnDefaults` are mirrored 1:1 in `columns[]`.

## Working with data (`autogenerateColumns`)
`data.autogenerateColumns` controls how Grid combines provider columns with
`columns[]` configuration.

- `true` (default): provider columns are rendered automatically. If `header` is
  not set, they keep provider order. Columns configured in `columns[]` that are
  not present in provider data (for example unbound/computed columns) are
  appended at the end in `columns[]` order.
- `false`: provider columns are not rendered automatically. Grid renders only
  columns explicitly defined in `columns[]` (or referenced by `header`).

### Example: append custom column in auto-generation mode
```js
Grid.grid('container', {
    data: {
        columns: {
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columns: [{
        id: 'weight',
        enabled: false
    }, {
        id: 'lineValue',
        dataId: null,
        dataType: 'number',
        cells: {
            valueGetter: cell => cell.row.data.weight * cell.row.data.price,
            format: '${value:,.2f}'
        }
    }]
});
// Rendered order (no header): product, price, lineValue
```

### Example: manual column set only
```js
Grid.grid('container', {
    data: {
        autogenerateColumns: false,
        columns: {
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            price: [3.24, 2.62, 5.99, 4.74],
            revenue: [120, 85, 200, 150],
            ignoredByConfig: ['A', 'B', 'C', 'D']
        }
    },
    columns: [{
        id: 'sum',
        dataId: null,
        cells: {
            valueGetter: cell => cell.row.data.revenue * cell.row.data.price
        }
    }, {
        id: 'sales',
        dataId: 'revenue'
    }, {
        id: 'price'
    }, {
        id: 'product'
    }]
});
// Rendered columns: sum, sales, price, product
```

## Summary columns (`columnAggregator`)

A summary column derives its value from the other columns of the same row, for
example a `Total` column summing quarterly columns. It is the per-row mirror of
a summary row. Set `columnAggregator` to an aggregation function name (`SUM`,
`AVERAGE`, `MIN`, `MAX`, `COUNT`, `MEDIAN`, `PRODUCT`, ...) and list the source
columns in `aggregatedColumns`:

```js
Grid.grid('container', {
    data: {
        columns: {
            region: ['North', 'South'],
            q1: [120, 80],
            q2: [140, 85]
        }
    },
    columns: [{
        // No source column provides `total`, so the column is unbound.
        id: 'total',
        columnAggregator: 'SUM',
        aggregatedColumns: ['q1', 'q2']
    }]
});
```

- `aggregatedColumns` is optional. When omitted, every other numeric column of
  the table is aggregated, skipping columns that are derived themselves. List
  the columns explicitly when the table holds numeric columns that must stay out
  of the result, such as an id or a year.
- Without an explicit `dataType`, a summary column is assumed numeric.
- The header and body cells always carry the `hcg-summary-column` class, so
  styling them needs no `className` of your own.
- The cells are derived, so they are never editable.
- The value is re-resolved whenever a cell of its row is edited.
- By default only the rendered cells are resolved, which keeps the column out of
  sorting, filtering, and exports. Set `materialize` to change that.

### Sorting, filtering and exporting (`materialize`)

Sorting and filtering are stages of the data pipeline, not of rendering: they run
on the data table before anything aggregates. A summary column resolved per cell
has no column in that table, so there is nothing to sort by.

`materialize: true` writes the aggregate into the queried table ahead of the
sorting and filtering modifiers, which makes the column behave like a regular
data column — while the cells stay read-only:

```js
columns: [{
    id: 'total',
    columnAggregator: 'SUM',
    aggregatedColumns: ['q1', 'q2'],
    materialize: true
}]
```

What it costs, and when not to use it:

- One pass over every row on each query, instead of resolving only the cells on
  screen. With virtualized data that is the difference between all rows and a
  screenful.
- A cell edit becomes a requery rather than a cheap refresh of the row.
- It needs a local data provider. Sorting and filtering of a remote provider run
  on the server, which knows nothing about the column, so `materialize` is
  ignored there and reported in the console.
- The aggregator callback runs before sorting and filtering, so its `rowIndex`
  addresses the source table, and `rowId` is only resolved when `data.idColumn`
  is set.
- Under TreeView or row grouping the column behaves like any other data column:
  give it a `rowAggregator` for parent rows to aggregate it.

Pass a callback to decide per row, returning a function name or a falsy value to
skip aggregation and leave the column's own data in place:

```js
columns: [{
    id: 'total',
    aggregatedColumns: ['q1', 'q2'],
    columnAggregator: context => context.rowIndex === 0 ? false : 'SUM'
}]
```

For logic no Formula function covers, use `cells.valueGetter` instead. It
receives the cell, derives the value from `cell.row.data`, takes precedence over
`columnAggregator`, and follows edits the same way:

```js
columns: [{
    id: 'margin',
    dataId: null,
    dataType: 'number',
    cells: {
        valueGetter: cell => cell.row.data.revenue - cell.row.data.cost
    }
}]
```

See the
[summary columns demo](https://www.highcharts.com/samples/grid-pro/options/summary-columns).

Aggregating *down* a column instead — one value per column over many rows — is
what [`rowAggregator`](https://www.highcharts.com/docs/grid/rows/grouping) and
summary rows do.

## Styling and Theming

Use column-level classes, inline styles, and theme variables to control how
headers and body cells look. See
[Styling and Theming](https://www.highcharts.com/docs/grid/columns/styling-and-theming).

## Header

Headers can be configured per column with `columns[].header` or structurally
with the root `header[]` option for order, inclusion, and grouped headers.
See [Column headers](https://www.highcharts.com/docs/grid/columns/header).

## Grouping

Use grouped headers when several columns belong under a shared label.
Grouping is defined in the root `header[]` option and can be nested. See
[Column grouping](https://www.highcharts.com/docs/grid/columns/grouping).

## Width and resizing

Columns can use fixed widths, percentages, or automatic distribution, and end
users can optionally resize them from the header. See
[Column width and resizing](https://www.highcharts.com/docs/grid/columns/resizing-and-width).

## Sorting

Sorting can be enabled per column or globally, with support for initial
ordering, custom compare logic, and multicolumn sorting. See
[Column sorting](https://www.highcharts.com/docs/grid/columns/sorting).

## Filtering

Filtering adds popup or inline filter controls to individual columns, with
conditions based on each column's data type. See
[Column filtering](https://www.highcharts.com/docs/grid/columns/filtering).

## Virtualization

Wide grids render only the columns visible in the viewport, which keeps the DOM
small and the initial render fast. See
[Column virtualization](https://www.highcharts.com/docs/grid/columns/virtualization).

## Cell formatting

Cell output is configured through `columns[].cells`, including template
formatting, formatter callbacks, and edit-mode behavior. See
[Cell formatting](https://www.highcharts.com/docs/grid/cells/formatting).
