---
tags: ["grid-pro"]
---

# Row grouping

Row grouping is a Highcharts Grid Pro feature that collects rows sharing the
same column values under generated group rows. Use it when your data is flat
and the hierarchy is something you want to *present*, such as sales grouped by
region and segment, or tasks grouped by status.

Row grouping is enabled with `rowGrouping.enabled`, and the grouping levels are
listed in `rowGrouping.groupBy`, one nesting level per entry:

```js
Grid.grid('container', {
    data: {
        columns: {
            region: ['EMEA', 'EMEA', 'APAC'],
            segment: ['Retail', 'Enterprise', 'Retail'],
            revenue: [120, 80, 95]
        }
    },
    rowGrouping: {
        enabled: true,
        groupBy: ['region', 'segment']
    },
    columns: [{
        id: 'revenue',
        aggregator: 'SUM'
    }]
});
```

Row grouping is presentation only: it never changes the source data. It builds
its hierarchy from column values, in contrast to
[tree view](https://www.highcharts.com/docs/grid/rows/tree-view), which projects
hierarchy that is already part of the data. Both drive the same projection, so
they cannot be combined on one Grid — when `data.treeView` is enabled, grouping
is ignored.

## Grouping levels

Each entry of `rowGrouping.groupBy` becomes one grouping level, in the listed
order — the outermost group first. A single level can be given as a string:

```js
{
    rowGrouping: {
        enabled: true,
        groupBy: 'region'
    }
}
```

The entries are Grid column IDs, so columns bound to another data column with
`columns[].dataId` can be used as grouping levels too:

```js
{
    rowGrouping: {
        enabled: true,
        groupBy: ['regionLabel']
    },
    columns: [{
        id: 'regionLabel',
        dataId: 'region'
    }]
}
```

Grouped columns are hidden by default, because their values are shown in the
group rows. Set `rowGrouping.hideGroupedColumns: false` to keep them rendered,
in which case their values are shown for leaf rows only.

## The group column

Group labels and the expand/collapse UI are rendered in a generated column with
the id `group`. Configure it like any other column:

```js
{
    columns: [{
        id: 'group',
        header: {
            format: 'Region / segment'
        },
        width: 220
    }]
}
```

Use `rowGrouping.columnId` to rename it, for example when your data already has
a `group` column.

## Expansion state

Group rows are collapsed initially. Use `rowGrouping.expandedLevels` to expand
the first levels, or `'all'` to expand everything:

```js
{
    rowGrouping: {
        enabled: true,
        expandedLevels: 1
    }
}
```

Group rows stick to the top of the viewport while their children are scrolled.
Set `rowGrouping.stickyParents: false` to disable that.

## Aggregation

Use `columns[].aggregator` to derive group row values from their direct
children:

```js
columns: [{
    id: 'revenue',
    aggregator: 'SUM'
}, {
    id: 'margin',
    aggregator: 'AVERAGE'
}]
```

The aggregator takes a registered Formula processor function name, or a callback
returning one. Aggregated cells are rendered with the `hcg-cell-aggregated` CSS
class, and are read-only. See
[tree view aggregation](https://www.highcharts.com/docs/grid/rows/tree-view)
for the full aggregation rules, which are shared between both features.

## Runtime API

The row grouping controller is available on `grid.rowGrouping`.

```js
await grid.rowGrouping?.setGroupBy(['region']);
await grid.rowGrouping?.expandAll();
await grid.rowGrouping?.collapseAll();

grid.rowGrouping?.getGroupBy(); // ['region']
```

`setGroupBy()` replaces the grouping levels at runtime, which is the API to use
for a "group by" control in your UI. It enables row grouping when called with at
least one column, so the control does not have to set `rowGrouping.enabled`
itself.

## Turning grouping off

Set `rowGrouping.enabled: false` to turn grouping off without clearing
`groupBy` — the grouped columns are then rendered as regular columns:

```js
{
    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            gridOptions: {
                rowGrouping: {
                    enabled: false
                }
            }
        }]
    }
}
```
