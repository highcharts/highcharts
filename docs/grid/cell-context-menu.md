# Cell context menu

Highcharts Grid supports context menus for table body cells. When enabled, Grid
shows a context menu on right-click for table body cells.

On touch devices, you can open the context menu using a long-press on a cell.
This is particularly important on iOS, where browsers do not fire the
`contextmenu` event on long-press.

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

The context menu is controlled per column using `contextMenu.enabled`.

If `enabled` is omitted, Grid opens the menu when you provide
`contextMenu.items`, or when a Grid Pro feature adds an active built-in item.
For example, row pinning adds its menu items when
`rendering.rows.pinning.enabled` is `true`.

If `items` is empty, the browser's native context menu is kept.

Use `contextMenu: { enabled: false }` to disable Grid context menu for a
column (or globally via `columnDefaults`).

## Keyboard access

When a cell is focused, open the context menu using the `ContextMenu` key or
`Shift+F10`.

## Menu items

Each item supports:

- `label`: Text shown in the menu
- `icon`: Optional built-in or custom Grid icon name (see [Custom icons](https://www.highcharts.com/docs/grid/theming/custom-icons))
- `separator: true`: Renders a divider instead of a clickable item
- `disabled: true`: Disables the item
- `onClick(cell)`: Callback invoked when the item is clicked

Grid Pro exposes the built-in row pinning group ID `'pinning'`. Use it to add
the full row pinning action group inline.

The individual row pinning action IDs are:

- `'pinRowTop'`
- `'pinRowBottom'`
- `'unpinRow'`

These built-ins are not available in Grid Lite.

With row pinning enabled, the built-in group can be mixed with custom items in
Grid Pro:

```js
contextMenu: {
    items: [
        'pinning',
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

## Localize built-in labels

Built-in row pinning actions use these root language keys in Grid Pro:

- `lang.pinRowTop`
- `lang.pinRowBottom`
- `lang.unpinRow`

```js
Grid.grid('container', {
    lang: {
        pinRowTop: 'Pin to top',
        pinRowBottom: 'Pin to bottom',
        unpinRow: 'Remove pin'
    }
});
```

## Nested submenus

Use `type: 'submenu'` and `items` to define a branch item with a submenu.
Branch items open submenus on click and do not execute leaf callbacks.

To place row pinning actions in a submenu, define a custom submenu and include
the individual built-in action IDs. This example applies to Grid Pro only.

```js
contextMenu: {
    enabled: true,
    items: [{
        type: 'submenu',
        label: 'Pinning',
        items: [
            'pinRowTop',
            {
                actionId: 'unpinRow',
                label: 'Unpin now'
            },
            {
                type: 'submenu',
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

Nested levels do not use implicit defaults. Define each submenu with
`type: 'submenu'` and provide its `items` explicitly.

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
