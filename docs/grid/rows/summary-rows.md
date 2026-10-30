---
sidebar_label: "Summary rows"
tags: ["grid-pro"]
description: >-
  Add Grid Pro summary rows that aggregate each column, such as a total or an
  average, above or below the table body.
---

# Summary rows

Summary rows is a Highcharts Grid Pro feature that adds total rows, such as a
sum or an average of each column, above or below the table body. The rows stay
in place while the body scrolls, and they are recomputed whenever the data is
sorted, filtered or edited.

Summary rows work with the local data provider. With
[server-side data handling](https://www.highcharts.com/docs/grid/data-handling/serverside),
no summary rows are rendered.

## Basic configuration

Set `summaryRows.aggregator` to an aggregation function, such as `SUM`,
`AVERAGE`, `MIN`, `MAX`, `COUNT` or `MEDIAN`. Use `columns` to override single
cells: set a static `value`, such as a `'Total'` label, a different
`aggregator`, or `aggregator: false` to leave the cell empty.

```js
Grid.grid('container', {
    data: {
        columns: {
            region: ['Americas', 'EMEA', 'APAC'],
            q1: [1840, 1520, 1275],
            q2: [1910, 1495, 1360]
        }
    },
    summaryRows: {
        aggregator: 'SUM',
        columns: [{
            id: 'region',
            value: 'Total'
        }]
    }
});
```

## Several summary rows

Pass an array to render several rows. Rows are placed at the `bottom` of the
body by default; set `position: 'top'` to show a row above the data rows.

By default, a row aggregates the rows left after filtering, across all pages.
Set `scope` to `'all'` to ignore filters, or to `'page'` to aggregate the
current [page](https://www.highcharts.com/docs/grid/rows/pagination) only:

```js
summaryRows: [{
    aggregator: 'SUM',
    scope: 'page',
    columns: [{ id: 'region', value: 'Page total' }]
}, {
    aggregator: 'SUM',
    scope: 'all',
    columns: [{ id: 'region', value: 'Grand total' }]
}]
```

## Tree view

With [TreeView](https://www.highcharts.com/docs/grid/rows/tree-view), parent
rows are aggregated together with their children. When the parents already hold
the totals of their children, set `skipParents: true` to avoid counting values
twice. Group rows from
[row grouping](https://www.highcharts.com/docs/grid/rows/grouping) are never
aggregated.

## Formatting and styling

A summary cell uses the `cells.format` of its column. Set `format` on the row,
or on a single cell in `columns`, to override it. Use `className` and `style`
the same way.

Summary rows carry the `hcg-summary-row` class. For their CSS variables, see
[Summary separators](https://www.highcharts.com/docs/grid/theming/grid-variables#summary-separators).

## Summary columns

To aggregate the cells of each row instead of each column, use
[summary columns](https://www.highcharts.com/docs/grid/columns/index#summary-columns-columnaggregator).
The two features can be combined, as in the
[summary rows and columns demo](https://www.highcharts.com/samples/grid/basic/summary-rows-and-columns).

## API reference

- [`summaryRows`](https://api.highcharts.com/grid/summaryRows)
- [`rendering.rows.summary`](https://api.highcharts.com/grid/rendering.rows.summary)

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/options/summary-rows?force-light-theme" allow="fullscreen"></iframe>
