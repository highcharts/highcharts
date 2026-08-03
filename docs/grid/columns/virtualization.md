---
sidebar_label: "Virtualization"
---

# Column virtualization

Column virtualization is the horizontal counterpart of [row virtualization](https://www.highcharts.com/docs/grid/rows/virtualization). Instead of rendering every column, the grid renders only the columns currently visible in the viewport, plus a small buffer (also called *overscan*) to the left and to the right.

This keeps the DOM small and the initial render fast for wide data sets, where a grid with hundreds of columns would otherwise create tens of thousands of cells up front.

## How it works

1. **Column layout**
   The grid resolves all column widths once and stores their horizontal offsets, so the total table width and the scrollbar stay correct even though most columns are not rendered.

2. **Visible window calculation**
   Based on the horizontal scroll position and the viewport width, the grid resolves the first and last visible column index.

3. **Selective rendering**
   Only columns within that range (plus the buffer) are rendered — in the body rows, in the header (including grouped headers), and in the inline filter row.

4. **Positioning**
   Rendered cells are offset to their real horizontal position, so column alignment behaves as if all columns were present.

As the user scrolls horizontally, columns entering the viewport are rendered and columns leaving it are removed.

Row and column virtualization are independent and can be combined. In a data set that is both wide and long, only the intersection of both windows is rendered.

## Virtualization threshold

By default, column virtualization turns on when the column count reaches 20. Below that, all columns are rendered.

Raising the threshold keeps all columns in the DOM for moderately wide grids, which can improve browser search and text selection. Lowering it favors wide grids by keeping the DOM size predictable and avoiding long initial renders.

```js
rendering: {
    columns: {
        virtualizationThreshold: 50 // default is 20
    }
}
```

## Enable/disable virtualization

If you want to override the threshold, you can force column virtualization on or off regardless of the column count.

Force `virtualization: true` when you want consistent horizontal scrolling performance or expect the column count to grow. Force `virtualization: false` when all columns must exist in the DOM, for example for bulk DOM operations or custom integrations that query cells directly.

```js
rendering: {
    columns: {
        virtualization: true
    }
}
```

## Buffer size (overscan)

The `bufferSize` option controls how many extra columns are rendered to the left and to the right of the visible area. A larger buffer reduces flicker while scrolling, at the cost of more DOM nodes. In most situations, the default buffer size of 2 is optimal.

```js
rendering: {
    columns: {
        bufferSize: 4 // default is 2
    }
}
```

## Fixed column widths

For very wide grids, column virtualization can be combined with `rendering.columns.strictWidths`, which gives every column the same fixed width and lets the grid skip per-column width and offset calculations. This further shortens the initial render, at the cost of per-column widths and column resizing. See [Column width and resizing](https://www.highcharts.com/docs/grid/columns/resizing-and-width).

```js
rendering: {
    columns: {
        strictWidths: true
    }
}
```

## Things to keep in mind

- Only rendered columns exist in the DOM, so the browser's native search (Ctrl+F) and text selection cover the rendered window only. [Exporting](https://www.highcharts.com/docs/grid/exporting) is not affected, because it reads from the data, not from the DOM.
- Keyboard navigation covers the whole column set: moving focus to a column outside the rendered window scrolls that column into view and renders it.
- Column resizing keeps working with virtualization enabled. It is only unavailable when `strictWidths` is used.

## API reference

- [`rendering.columns.virtualization`](https://api.highcharts.com/grid/rendering.columns.virtualization)
- [`rendering.columns.virtualizationThreshold`](https://api.highcharts.com/grid/rendering.columns.virtualizationThreshold)
- [`rendering.columns.bufferSize`](https://api.highcharts.com/grid/rendering.columns.bufferSize)
- [`rendering.columns.strictWidths`](https://api.highcharts.com/grid/rendering.columns.strictWidths)

## Demo

<iframe style="width: 100%; height: 590px; border: none;" src="https://www.highcharts.com/samples/embed/grid/options/columns-virtualization?force-light-theme" allow="fullscreen"></iframe>
