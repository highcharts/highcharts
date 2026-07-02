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

## Cell formatting

Cell output is configured through `columns[].cells`, including template
formatting, formatter callbacks, and edit-mode behavior. See
[Cell formatting](https://www.highcharts.com/docs/grid/cells/formatting).
