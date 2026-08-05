---
tags: ["grid-pro"]
---

# Row grouping

Row grouping is a Highcharts Grid Pro feature that turns repeated values of flat
data into expandable group rows. Use it to summarize records by category, such
as sales by region and segment, tickets by status, or employees by department.

Row grouping is enabled by setting `rowGrouping.enabled` to `true` together with
the `rowGrouping.groupBy` columns. Grid generates one group row per distinct
value combination and renders the group labels in a generated column.

```js
Grid.grid('container', {
    data: {
        columns: {
            region: ['EMEA', 'EMEA', 'APAC'],
            account: ['Luma Foods', 'Mercury Sports', 'Harbor Retail'],
            revenue: [68000, 54000, 62000]
        }
    },
    rowGrouping: {
        enabled: true,
        groupBy: 'region'
    },
    columns: [{
        id: 'revenue',
        rowAggregator: 'SUM'
    }]
});
```

Row grouping shares the tree projection with
[tree view](https://www.highcharts.com/docs/grid/rows/tree-view), so expansion
state, sticky parents, aggregation, and the runtime API work the same way. The
two features cannot be enabled at the same time - when both are enabled, tree
view takes precedence and row grouping is ignored.

## Minimum requirements

- Row grouping is available in Highcharts Grid Pro.
- Set `rowGrouping.enabled: true`. Declaring the remaining row grouping options
  alone does not enable the feature.
- Set `rowGrouping.groupBy` to one or more source column IDs.
- Row grouping works with local data (`data.columns`, `data.dataTable`, or
  connector-backed data).

## Grouping levels

`groupBy` accepts a single column ID or an array of column IDs. Each entry adds
one grouping level, ordered from the top level down.

```js
rowGrouping: {
    enabled: true,
    groupBy: ['region', 'segment']
}
```

Rows that share the same `region` are collected under a top level group row, and
within each of them rows are grouped again by `segment`.

## Group column

Group labels are rendered in a generated column with the `group` ID, which is
also the tree column of the grouped table. Configure it as any other column:

```js
rowGrouping: {
    enabled: true,
    groupBy: 'region',
    groupColumnId: 'group'
},
columns: [{
    id: 'group',
    header: {
        format: 'Region'
    },
    width: 200
}]
```

The default header of the generated column comes from
`lang.rowGrouping.columnHeader`.

`groupColumnId` must not collide with a source column ID, because the generated
column would shadow that column's data.

### Sorting and filtering

Sorting the group column orders the group rows by their labels. Filtering it
matches the values of all `groupBy` columns, so a row is kept when any of its
grouping levels matches the filter, and the matching group rows are rebuilt from
the remaining rows.

### Column position

The generated column is rendered first by default. Use
[`header`](https://www.highcharts.com/docs/grid/columns/header) to place it
anywhere in the column order:

```js
rowGrouping: {
    enabled: true,
    groupBy: 'region',
    groupColumnId: 'group'
},
header: ['account', 'group', 'revenue']
```

As with any `header` configuration, every column that should stay rendered has
to be listed, including the generated group column.

### Hiding grouped columns

Grouped columns are hidden from the rendered table by default, because their
values are already represented by the group rows. Set `hideGroupByColumns` to
`false` to keep them visible - group rows then repeat the group value of their
own and their ancestor levels.

```js
rowGrouping: {
    enabled: true,
    groupBy: ['region', 'segment'],
    hideGroupByColumns: false
}
```

Grouped columns are structural columns and are rendered readonly.

## Aggregation

Group rows have no source row of their own, so their cells are empty unless the
column defines a `rowAggregator`.

```js
columns: [{
    id: 'revenue',
    rowAggregator: 'SUM'
}, {
    id: 'margin',
    rowAggregator: 'AVERAGE'
}]
```

To aggregate most columns the same way, set `rowAggregator` in `columnDefaults`
and reset it with `rowAggregator: false` where it does not apply. Note that a
default aggregator also reaches text columns, where numeric functions such as
`SUM` resolve to `0`.

```js
columnDefaults: {
    rowAggregator: 'SUM'
},
columns: [{
    id: 'account',
    rowAggregator: false
}]
```

See [aggregation](https://www.highcharts.com/docs/grid/rows/tree-view#aggregation)
for the full set of rules and the callback form.

## Initial expansion state and sticky parents

Both features are configured in `rendering.rows`:

```js
rendering: {
    rows: {
        expandedLevels: 'all',
        stickyParents: true
    }
}
```

Group rows use generated row IDs, so seed the expansion state with
`expandedLevels` rather than with the explicit `expandedRowIds`.

## Runtime API

The tree projection controller of the grouped table is available on
`grid.treeView`:

```js
await grid.treeView?.expandAll();
await grid.treeView?.collapseAll();
```

Toggle events (`beforeTreeRowToggle` and `afterTreeRowToggle`) are fired for
group rows as well.

## API reference

See more in the
[API reference for `rowGrouping`](https://api.highcharts.com/grid/rowGrouping).
