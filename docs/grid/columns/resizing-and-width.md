---
sidebar_label: "Width and resizing"
---

# Column width and resizing

Column widths are configured using `columns[].width` and/or `columnDefaults.width`.
Supported values are pixels (for example `150` or `'150px'`), percentages (for example `'20%'`), and `'auto'`.

The default value is `'auto'`. An `'auto'` width, either explicitly set or implied by omitting the option, causes the column to participate in automatic width distribution.

Percentage values are calculated relative to the table width.

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

### Width behavior after resize

After user resize, the resized column width becomes fixed in pixels.

## Events

Relevant column events:
- `afterResize`

See [Interaction / Events](https://www.highcharts.com/docs/grid/events).

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-resizing?force-light-theme" allow="fullscreen"></iframe>
