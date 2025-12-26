---
sidebar_label: "Resizing"
---

# Column resizing

End users can resize columns by dragging the handle on the right edge of each column header.

Column resizing is a global rendering concern and cannot be configured per column. Because resizing affects how widths are recalculated and redistributed across the entire table, it is not part of `columnDefaults` and cannot be overridden in `columns[]`. Instead, resizing behavior is configured under `rendering.columns.resizing`.

This ensures consistent and predictable layout behavior, regardless of individual column configuration.

## Resizing modes

The [resizing mode](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ResizingOptions#mode) determines how column widths are adjusted when a column is resized.

* **`adjacent`**
  Adjusts both the resized column and its immediate neighbor. Columns further to the right retain their original positions.

* **`independent`**
  Only the resized column changes width. Columns to the right are shifted, and their widths become fixed in pixels.

* **`distributed`**
  Only the resized column is directly modified. Other columns without fixed widths automatically adjust to fill the remaining space, preserving the overall table width.

## Width behavior after resizing

Once a column has been resized by the user, its width becomes **fixed in pixels**, regardless of whether it was originally defined using `'auto'`, a percentage, or left undefined.

After resizing:

* The resized column no longer participates in automatic width distribution
* Percentage and `'auto'` behavior is replaced by a pixel width
* Other columns adjust according to the active resizing mode

This behavior ensures stable and predictable layouts after user interaction.

## Disabling resizing

To [disable column resizing](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ResizingOptions#enabled) entirely, set `rendering.columns.resizing.enabled` to `false`.

## Example

```js
rendering: {
    columns: {
        resizing: {
            enabled: true,
            mode: 'distributed'
        }
    }
},
columns: [{
    id: 'column_1',
    width: 150
}, {
    id: 'column_2',
    width: '20%'
}]
```

* Column resizing is enabled globally
* The `distributed` mode keeps the table width stable
* All columns except column_1 and column_2 initially behave as `'auto'`
* Once resized, their widths become fixed in pixels

This demo shows how the different modes work in practice:
<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-resizing?force-light-theme" allow="fullscreen"></iframe>
