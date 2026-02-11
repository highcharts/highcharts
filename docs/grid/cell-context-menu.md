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
                    onClick: function (cell) {
                        console.log(cell, cell.row, cell.column);
                    }
                }]
            }
        }
    }
});
```

If `items` is empty or missing, the browser's native context menu is kept.

## Keyboard access

When a cell is focused, open the context menu using the `ContextMenu` key or
`Shift+F10`.

## Menu items

Each item supports:

- `label`: Text shown in the menu
- `icon`: Optional built-in Grid icon name (see `GridIconName` in the API)
- `separator: true`: Renders a divider instead of a clickable item
- `disabled: true`: Disables the item
- `onClick(cell)`: Callback invoked when the item is clicked

## Callback context

The menu item callback receives a single `cell` argument:

- `cell`: Clicked table cell
- `cell.row`: Corresponding row
- `cell.column`: Corresponding column

For compatibility with Highcharts-style callbacks, `this` is also bound to the
same context object when using `function () { ... }` callbacks:

```js
onClick: function (cell) {
    console.log(this === cell); // true
    console.log(cell.value);
}
```

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/demo/cell-context-menu?force-light-theme" allow="fullscreen"></iframe>
