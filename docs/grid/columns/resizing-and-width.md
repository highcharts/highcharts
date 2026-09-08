---
sidebar_label: "Width and resizing"
---

# Column width and resizing

Column widths are configured using `columns[].width` and/or `columnDefaults.width`.
Supported values are pixels (for example `150` or `'150px'`), percentages (for example `'20%'`), and `'auto'`.

The default value is `'auto'`. An `'auto'` width, either explicitly set or implied by omitting the option, causes the column to participate in automatic width distribution.

Use `columnDefaults.width` when most columns should start with the same width,
and set `columns[].width` to `'auto'` on individual columns to opt back into
automatic distribution.

Percentage values are calculated relative to the table width.

Use `columns[].minWidth` and `columns[].maxWidth` (or their
`columnDefaults` equivalents) to constrain how far end users
can resize a column. Both options accept pixels and percentages.
The limits apply during initial layout as well as manual resizing, 
and they take precedence over `width` when there is a conflict.

## Width behavior

- No widths defined (or all set to `'auto'`): columns are distributed evenly.
- Some widths defined: fixed widths are applied first; remaining space is distributed among `'auto'` columns.
- Defined widths exceed table width: horizontal overflow appears.
- Defined widths below table width: unused whitespace can remain.

```js
columns: [{
    id: 'column_1',
    width: 150
}, {
    id: 'column_2',
    width: '20%'
}, {
    id: 'column_3'
}]
```

If you use shared defaults, an individual column can still opt out:

```js
columnDefaults: {
    width: 50
},
columns: [{
    id: 'column_1'
}, {
    id: 'column_2',
    width: 'auto'
}]
```

## Strict widths

For very wide grids, `rendering.columns.strictWidths` makes all columns share
one fixed width, so the grid can skip per-column width and offset calculations.
It is most useful together with
[column virtualization](https://www.highcharts.com/docs/grid/columns/virtualization).

```js
rendering: {
    columns: {
        strictWidths: true
    }
}
```

The shared width is resolved from `columnDefaults.width` (pixels or a percentage
of the table width), falling back to `100` when the option is not set or set to
`'auto'`. It is then clamped by `columnDefaults.minWidth` and
`columnDefaults.maxWidth`.

Two limitations follow from the single shared width:

- Per-column `columns[].width`, `minWidth`, and `maxWidth` are ignored, and
  automatic width distribution does not run.
- Column resizing is unavailable. No resize handles are rendered and
  `rendering.columns.resizing` has no effect, even when explicitly enabled.

## Resizing

End users can resize columns by dragging the handle on the right edge of each header.
Configure resizing globally in `rendering.columns.resizing`.

```js
rendering: {
    columns: {
        resizing: {
            enabled: true,
            mode: 'distributed'
        }
    }
}
```

### Resizing modes

- `adjacent`: resize current column and compensate in the immediate neighbor.
- `independent`: resize only current column; columns to the right keep their current widths.
- `distributed`: resize current column and rebalance remaining flexible columns.

## Events __grid_pro__

Relevant column events:
- `afterResize`

See [Interaction / Events](https://www.highcharts.com/docs/grid/events) for event details.

## API reference

- [`columnDefaults.width`](https://api.highcharts.com/grid/columnDefaults.width)
- [`columns.width`](https://api.highcharts.com/grid/columns.width)
- [`rendering.columns.resizing`](https://api.highcharts.com/grid/rendering.columns.resizing)
- [`rendering.columns.strictWidths`](https://api.highcharts.com/grid/rendering.columns.strictWidths)

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-resizing?force-light-theme" allow="fullscreen"></iframe>
