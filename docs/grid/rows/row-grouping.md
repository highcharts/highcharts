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
        aggregator: 'SUM'
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
    groupColumn: 'group'
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
`lang.rowGrouping.columnHeader`. The column ID must not collide with a
source column ID.

Grouped columns are hidden from the rendered table by default, because their
values are already represented by the group rows. Set `hideGroupedColumns` to
`false` to keep them visible - group rows then repeat the group value of their
own and their ancestor levels.

```js
rowGrouping: {
    enabled: true,
    groupBy: ['region', 'segment'],
    hideGroupedColumns: false
}
```

Grouped columns are structural columns and are rendered readonly.

## Aggregation

Group rows have no source row of their own, so their cells are empty unless the
column defines an `aggregator`.

```js
columns: [{
    id: 'revenue',
    aggregator: 'SUM'
}, {
    id: 'margin',
    aggregator: 'AVERAGE'
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
