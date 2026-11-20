---
tags: ["grid-pro"]
sidebar_label: "Pivot"
description: >-
  Turn flat Grid Pro data into a pivot table, where column field values become
  generated columns and row field values become expandable rows, with
  aggregated values, subtotals and grand totals.
---

# Pivot

Pivot is a Highcharts Grid Pro feature that cross-tabulates flat data. The
values of the `pivot.columns` fields become generated columns, the values of
the `pivot.rows` fields become expandable rows, and every cell aggregates the
source rows behind it.

```js
Grid.grid('container', {
    data: {
        columns: {
            region: ['Europe', 'Europe', 'Europe', 'Asia'],
            country: ['Norway', 'Norway', 'Poland', 'Japan'],
            year: [2025, 2026, 2025, 2025],
            sales: [100, 140, 80, 200],
            units: [3, 4, 2, 5]
        }
    },
    pivot: {
        enabled: true,
        rows: ['region', 'country'],
        columns: ['year'],
        values: [{
            columnId: 'sales',
            aggregator: 'SUM'
        }, {
            columnId: 'units',
            aggregator: 'AVERAGE'
        }]
    }
});
```

The example renders one column group per year, each holding a `sales` and a
`units` column, plus a `Total` group aggregating every year. Rows nest
`country` under `region`, and the row below the table holds the grand total.

## Minimum requirements

- Pivot is available in Highcharts Grid Pro.
- Set `pivot.enabled: true`. Declaring the remaining pivot options alone does
  not enable the feature.
- Set `pivot.values` to at least one value field. A source column can be used
  once.
- Pivot requires local data (`data.columns`, `data.dataTable`, or
  connector-backed data).
- Pivot cannot be combined with
  [tree view](https://www.highcharts.com/docs/grid/rows/tree-view) or
  [row grouping](https://www.highcharts.com/docs/grid/rows/grouping). When
  either is enabled, the pivot is ignored.

## Rows, columns and values

`rows` and `columns` both list source column IDs, ordered from the outermost
level down. They are the same operation in two directions: `rows` nests its
field values into expandable rows, `columns` spreads them across generated
columns.

`values` lists the fields aggregated in every cell. Each entry adds one
generated column under every column field value, so a layout with two column
field values and two value fields renders four columns, plus the total group.

Field values are listed in ascending order on every level.

## Expanding rows

Pivot rows are rendered by the same tree projection as
[tree view](https://www.highcharts.com/docs/grid/rows/tree-view), so
`rendering.rows.expandedLevels`, `rendering.rows.expandedRowIds` and
`rendering.rows.stickyParents` apply. Rows start collapsed, so set
`expandedLevels` to open them.

```js
rendering: {
    rows: {
        expandedLevels: 'all'
    }
}
```

## Aggregation

`values[].aggregator` takes a registered Formula processor function name, such
as `SUM`, `AVERAGE`, `COUNT`, `MIN` or `MAX`, or a callback returning one. The
callback receives the cell being aggregated, including its `rowPath`,
`columnPath`, `rowCount` and the `isSubtotal` and `isGrandTotal` flags.

```js
values: [{
    columnId: 'sales',
    aggregator: (context) => (context.isGrandTotal ? 'AVERAGE' : 'SUM')
}]
```

Every cell aggregates the source rows it covers, not the cells below it, so an
`AVERAGE` subtotal is the average of the source rows rather than an average of
averages. A combination of field values that no source row has renders an empty
cell.

## Totals

`pivot.totals` controls the aggregated rows and columns.

```js
pivot: {
    totals: {
        subtotals: true,
        grandTotalRow: 'bottom',
        grandTotalColumn: 'end'
    }
}
```

- `subtotals` aggregates every row that has child rows. Default `true`.
- `grandTotalRow` renders a [summary row](https://www.highcharts.com/docs/grid/rows/summary-rows)
  aggregating every source row, at `'top'` or `'bottom'`. Set it to `false` to
  omit it. Default `'bottom'`.
- `grandTotalColumn` renders a column group aggregating every column field
  value, at `'start'` or `'end'`. Set it to `false` to omit it. Default
  `'end'`. It is not rendered when `pivot.columns` is empty.

## Formatting and column options

Generated columns inherit `header.format`, `cells.format` and
`cells.formatter` from the source column of their value field, so the source
column is configured once for every column generated from it.

```js
columns: [{
    id: 'sales',
    header: { format: 'Sales' },
    cells: { format: '${value:,0f}' }
}]
```

The generated column holding the row field values has the ID `pivotRows` and is
configured like any other column.

```js
columns: [{
    id: 'pivotRows',
    header: { format: 'Region / country' },
    width: 190
}]
```

The IDs of the generated value columns are opaque. Each one carries a `pivot`
entry in its options, holding the `columnPath` it aggregates, its
`valueColumnId` and whether it `isTotal`.

## Sorting and filtering

Filtering runs on the source rows before the pivot, so a filter on a source
column narrows the rows every cell aggregates.

Sorting a generated column orders sibling rows inside each parent, through the
aggregated values. Sorting is set on the generated column, which is why
`columns[].sorting.order` has to address its generated ID, and clicking a
column header is the usual way to sort a pivot.

Pivot cells hold aggregates, so they are read-only and cannot be filtered.

## Changing the layout

Call `grid.update()` with new pivot options to change the layout, and set
`pivot.enabled` to `false` to render the flat source data again.

```js
grid.update({
    pivot: {
        rows: ['country'],
        columns: ['year']
    }
});
```

## Internationalization

`lang.pivot` holds the pivot strings.

```js
lang: {
    pivot: {
        rowsColumnHeader: 'Rows',
        grandTotal: 'Total',
        blank: '(blank)'
    }
}
```

`blank` is rendered in place of an empty row or column field value.
