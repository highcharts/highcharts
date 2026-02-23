# Cell context menu

Highcharts Grid supports context menus for table body cells. When enabled, Grid
shows a context menu on right-click for table body cells.

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

### Enabling behavior

The context menu is enabled/disabled per column using `contextMenu.enabled`.

When `enabled` is omitted, Grid enables the context menu when:

- `contextMenu.items` is provided (explicit opt-in), or
- row pinning is explicitly configured via `rendering.rows.pinning` and not
  disabled.

If the context menu is enabled and `items` is omitted, Grid uses built-in row
pinning actions by default: `pinRowTop`, `pinRowBottom`, `unpinRow`.

If `items` is empty, the browser's native context menu is kept.

Use `contextMenu: { enabled: false }` to disable Grid context menu for a
column (or globally via `columnDefaults`).

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

Built-in actions can also be declared by ID:

- `'pinRowTop'`
- `'pinRowBottom'`
- `'unpinRow'`

Built-ins and custom items can be mixed in one list:

```js
contextMenu: {
    items: [
        'pinRowTop',
        {
            actionId: 'unpinRow',
            label: 'Unpin now',
            icon: 'unpin'
        },
        { separator: true },
        {
            label: 'Show context',
            onClick: function (cell) {
                console.log(cell.row.id);
            }
        }
    ]
}
```

If `items` is explicitly set to `[]`, Grid does not open its popup and keeps
the native browser context menu.

## Nested submenus

Any action item can define `items` to become a branch item with a submenu.
Branch items open submenus on click and do not execute leaf callbacks.

```js
contextMenu: {
    enabled: true,
    items: [{
        label: 'Pinning',
        items: [
            'pinRowTop',
            {
                actionId: 'unpinRow',
                label: 'Unpin now'
            },
            {
                label: 'Advanced',
                items: [{
                    label: 'Custom leaf',
                    onClick: function (cell) {
                        console.log('Leaf click', cell.row.id);
                    }
                }]
            }
        ]
    }]
}
```

For built-in branch items (`{ actionId, items }`), `actionId` is used for
default label/icon only. Built-in row-state disabling is applied only to
built-in leaf actions.

Nested levels do not use implicit defaults. You must provide submenu `items`
explicitly.

## Keyboard navigation

- `ArrowRight`: Opens the focused branch submenu and focuses its first item.
- `ArrowLeft`: Closes the current submenu and focuses its parent branch item.
- `Escape`: Closes the current submenu and focuses parent. Press repeatedly to
  close parent levels up to the root menu.

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
