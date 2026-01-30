# Cell context menu

Highcharts Grid supports context menus for table body cells. When
configured, a custom menu is shown on right-click, and each menu item triggers a
user-provided callback with access to the clicked cell and its row/column.

This is a v1 foundation intended to be extended over time (for example with
built-in actions like add/delete row, hide column, etc.).

## Configure a cell context menu

The context menu is configured at the cell level:

- `columnDefaults.cells.contextMenu` for all columns
- `columns[].cells.contextMenu` to override per column

In its simplest form:

```js
Grid.grid('container', {
    columnDefaults: {
        cells: {
            contextMenu: {
                items: [{
                    label: 'Show context',
                    onClick: function (ctx) {
                        console.log(ctx.cell, ctx.row, ctx.column);
                    }
                }]
            }
        }
    }
});
```

If `items` is empty or missing, the browser's native context menu is kept.

## Menu items

Each item supports:

- `label`: Text shown in the menu
- `icon`: Optional built-in Grid icon name (see `GridIconName` in the API)
- `separator: true`: Renders a divider instead of a clickable item
- `disabled: true`: Disables the item
- `onClick(ctx)`: Callback invoked when the item is clicked

## Callback context

The menu item callback receives a single `ctx` argument:

- `ctx.cell`: Clicked table cell
- `ctx.row`: Corresponding row
- `ctx.column`: Corresponding column

For compatibility with Highcharts-style callbacks, `this` is also bound to the
same context object when using `function () { ... }` callbacks:

```js
onClick: function (ctx) {
    console.log(this === ctx); // true
    console.log(ctx.cell.value);
}
```

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/demo/cell-context-menu?force-light-theme" allow="fullscreen"></iframe>
