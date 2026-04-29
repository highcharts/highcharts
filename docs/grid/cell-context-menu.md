# Cell context menu

Highcharts Grid supports context menus for table body cells. When enabled, Grid
shows a context menu on right-click for table body cells.

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
- one or more built-in groups is active for the clicked cell (see below).

If `items` is empty, the browser's native context menu is kept.

Use `contextMenu: { enabled: false }` to disable Grid context menu for a
column (or globally via `columnDefaults`).

## Default menu and built-in groups

In Grid Pro, common feature actions are grouped into built-in groups that
activate automatically when the matching feature is enabled. Each group has a
stable key and an ordered list of built-in actions:

| Group id    | Actions                                        | Activated by  |
|-------------|------------------------------------------------|---------------|
| `pinning`   | `pinRowTop`, `pinRowBottom`, `unpinRow`        | Row pinning   |
| `rows`      | `addRowAbove`, `addRowBelow`, `deleteRow`      | Cell editing  |
| `columns`   | `addColumnBefore`, `addColumnAfter`, `deleteColumn` | Cell editing |

When `contextMenu.items` is not provided, Grid assembles a default menu from
the currently active groups:

- **One active group** — the group's actions render flat at the top level,
  without a submenu wrapper. (Example: row pinning only.)
- **Two or more active groups** — each group renders as its own submenu
  section with the group's label and icon. (Example: editing enabled, which
  activates both `rows` and `columns`.)

## Overriding the default menu

Custom `items` arrays may contain:

- Individual **built-in action** keys (strings), e.g. `'pinRowTop'`.
- Built-in **group** keys (strings), e.g. `'pinning'` — the group is expanded
  inline at that position (not wrapped in a submenu). A group is only
  expanded when its activation predicate is true.
- Custom action items (`{ label, onClick, icon? }`).
- Built-in overrides (`{ actionId, label?, icon?, disabled? }`).
- Dividers (`{ separator: true }`).

A flat "editing only" menu:

```js
contextMenu: {
    items: ['rows', { separator: true }, 'columns']
}
```

## Keyboard access

When a cell is focused, open the context menu using the `ContextMenu` key or
`Shift+F10`.

## Menu items

Each item supports:

- `label`: Text shown in the menu
- `icon`: Optional built-in Grid icon name (see [Custom icons](https://www.highcharts.com/docs/grid/theming/custom-icons))
- `separator: true`: Renders a divider instead of a clickable item
- `disabled: true`: Disables the item
- `onClick(cell)`: Callback invoked when the item is clicked

Grid Pro exposes these built-in action IDs:

- Row pinning: `'pinRowTop'`, `'pinRowBottom'`, `'unpinRow'` (group `'pinning'`)
- Row mutations: `'addRowAbove'`, `'addRowBelow'`, `'deleteRow'` (group `'rows'`)
- Column mutations: `'addColumnBefore'`, `'addColumnAfter'`, `'deleteColumn'`
  (group `'columns'`)

These built-in actions are not available in Grid Lite.

Built-ins and custom items can be mixed in one list in Grid Pro:

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

## Localize built-in labels

Built-in actions use root language keys:

- `lang.pinRowTop`, `lang.pinRowBottom`, `lang.unpinRow`
- `lang.addRowAbove`, `lang.addRowBelow`, `lang.deleteRow`
- `lang.addColumnBefore`, `lang.addColumnAfter`, `lang.deleteColumn`

Built-in group labels (used as submenu section headers in the default menu):

- `lang.pinningGroup`
- `lang.rowsGroup`
- `lang.columnsGroup`

```js
Grid.grid('container', {
    lang: {
        pinRowTop: 'Pin to top',
        pinRowBottom: 'Pin to bottom',
        unpinRow: 'Remove pin',
        pinningGroup: 'Pinning actions'
    }
});
```

## Nested submenus

Any action item can define `items` to become a branch item with a submenu.
Branch items open submenus on click and do not execute leaf callbacks.

The built-in row pinning submenu example below applies to Grid Pro only.

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

<iframe src="https://www.highcharts.com/samples/embed/grid-pro/demo/cell-context-menu?force-light-theme" allow="fullscreen"></iframe>
