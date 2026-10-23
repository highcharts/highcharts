---
description: >-
  Configure Grid context menus for mouse, touch, and keyboard use, define
  clickable items and nested submenus, register reusable items, add Grid Pro
  built-in actions, and localize their labels.
---

# Context menu

Highcharts Grid opens a context menu on right-click. What the menu holds
depends on what it was opened on, which the menu calls its *target*: a menu on
a table body cell can act on that cell's row and column, while a menu on a
button of your own acts on whatever you wrote it to.

## Where a menu can open

| Target | Opened on | Configured with |
|---|---|---|
| `cell` | A table body cell | `columnDefaults.cells.contextMenu`, or `columns[].cells.contextMenu` per column |
| `element` | Any element you give a menu to | The options passed to [`grid.contextMenu.attach()`](#a-menu-on-an-element-of-your-own) |

Both use the same items, the same registry and the same rendering. Only the
target they hand to your callbacks differs.

## Configuring a menu

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

The cell menu is controlled per column using `contextMenu.enabled`.

If `enabled` is omitted, Grid opens the menu when you provide
`contextMenu.items`, or when a Grid Pro feature contributes an item that
applies to the cell. For example, row pinning contributes its items when
`rendering.rows.pinning.enabled` is `true`.

If `items` is empty, or nothing in it applies, the browser's native context
menu is kept. Setting `items` to `[]` is therefore the way to ask for the
native menu explicitly.

Use `contextMenu: { enabled: false }` to disable the Grid menu for a column,
or globally via `columnDefaults`.

## Menu items

Each item supports:

- `label`: Text shown in the menu
- `icon`: Optional built-in or custom Grid icon name (see [Custom icons](https://www.highcharts.com/docs/grid/theming/custom-icons))
- `separator: true`: Renders a divider instead of a clickable item
- `disabled: true`: Shows the item, but does not let it run
- `visible: false`: Leaves the item out entirely
- `items`: Makes the item a branch with a [submenu](#nested-submenus)
- `onClick(target, context)`: Callback invoked when the item is clicked
- `id`: Uses a [registered item](#registering-your-own-items), including the
  built-in ones

`label`, `visible` and `disabled` also accept a callback, which receives the
context the menu was opened in.

Grid Pro contributes built-in items. Row pinning exposes the group ID
`'pinning'` and the individual action IDs `'pinRowTop'`, `'pinRowBottom'` and
`'unpinRow'`; table editing exposes the groups `'rows'` and `'columns'` and the
actions behind them. These are not available in Grid Lite.

A group ID used in `items` expands in place, so built-ins and your own items
mix freely:

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

## Registering your own items

Items you want to reuse across columns, or across Grids, can be registered
once and then referred to by ID, the same way the built-ins are:

```js
Grid.ContextMenu.registerItem('copyValue', {
    label: 'Copy value',
    icon: 'copy',
    visible: context => context.target.cell.value !== void 0,
    onClick: cell => navigator.clipboard.writeText(String(cell.value))
});
```

```js
contextMenu: {
    items: ['copyValue', { separator: true }, 'pinning']
}
```

A registered item accepts the same properties as an inline one, plus two that
only make sense in the registry:

- `targets`: The targets the item applies to, `['cell']` by default. Referring
  to it from a menu on any other target is ignored with a warning.
- `defaultIn`: The targets whose menu the item joins when nothing configures
  `items`, for example `['cell']`.

An item with `items` is a group. Referring to a registered item by ID and
giving it properties alongside overrides what was registered, except that an
override may only restrict an item: `visible` is combined with `and`,
`disabled` with `or`.

> The earlier `Grid.CellContextMenuBuiltInActions.registerBuiltInAction` and
> `registerBuiltInGroup` are deprecated as of v3.3.0, and still work.

## Nested submenus

Give an item its own `items` to make it a branch. Branch items open their
submenu on hover, and on click for touch, and run no callback of their own.
Moving the pointer to another item closes the submenu again; the keyboard
focus stays where it is, since a hover is not a move through the menu.

To place row pinning actions in a submenu, define the branch yourself and list
the individual built-in action IDs inside it. This example applies to Grid Pro
only.

```js
contextMenu: {
    enabled: true,
    items: [{
        label: 'Pinning',
        items: [
            'pinRowTop',
            {
                id: 'unpinRow',
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

Nested levels do not use implicit defaults: give every branch its `items`
explicitly.

> `type: 'submenu'`, `actionId` and `groupId` are deprecated as of v3.3.0, and
> still work. `items` now says that an item is a branch, and `id` refers to a
> registered item whether it is an action or a group.

## A menu on an element of your own

`grid.contextMenu.attach(element, options)` gives any element the same menu
the Grid uses for its cells, on right-click and on `ContextMenu` / `Shift+F10`:

```js
const grid = Grid.grid('container', { /* … */ });

grid.contextMenu.attach(document.getElementById('actions'), {
    items: [{
        label: 'Cheapest first',
        icon: 'arrowUp',
        onClick: () => grid.update({
            columns: [{ id: 'price', sorting: { order: 'asc' } }]
        })
    }, {
        separator: true
    }, {
        label: 'Rename this button',
        onClick: button => {
            button.textContent = 'Renamed';
        }
    }]
});
```

The `items` are the same as for cells, except that the element takes the place
of the cell as the target. The built-in action IDs are not available here,
since they act on a row or a column.

The element does not have to sit inside the Grid; see
[the Grid's edges](#menus-and-the-grids-edges) below.

The call returns a function that detaches the menu again:

```js
const detach = grid.contextMenu.attach(element, { items });

detach();
```

<iframe src="https://www.highcharts.com/samples/embed/grid-lite/basic/context-menu-attach?force-light-theme" allow="fullscreen"></iframe>

## Callback context

An item callback receives the target first and the full context second:

```js
onClick: function (cell, context) {
    console.log(this === cell);      // true
    console.log(cell.value);         // the clicked cell
    console.log(context.target.type) // 'cell'
    console.log(context.grid);       // the Grid instance
}
```

The target is what the menu was opened on: the `TableCell` for a cell menu,
and the element itself for a menu attached to one. For Highcharts-style
callbacks it is also bound to `this`.

The context carries `grid` and `target`. On a cell menu the target holds
`cell`, `column` and `row`; on an attached one it holds `element`. Its `type`
says which.

## Menus and the Grid's edges

The Grid container hides its overflow, so anything laid out inside it is cut
off at its edges. Menus therefore open as native popovers, which nothing on
the page clips - a menu taller than a short Grid spills over it rather than
scrolling within it, and a menu opened on an attached element outside the Grid
is whole wherever that element sits.

A popover is positioned against the window, so it closes itself once its
anchor has scrolled off screen.

On browsers without the Popover API, which is Baseline since January 2025,
menus fall back to being laid out inside the Grid, and clipped by it.

## Keyboard and touch

When a cell is focused, open its menu with the `ContextMenu` key or
`Shift+F10`. The same keys work on an element you attached a menu to, once it
has the focus. Inside the menu, the arrow keys move between items, `ArrowRight`
opens the submenu of a branch and `ArrowLeft` closes it again.

On touch devices, a long-press opens the menu, on a cell and on an attached
element alike. This matters most on iOS, where browsers do not fire the
`contextmenu` event on long-press at all. A long-press that lands on a native
control inside the target is left to that control.

## Localize built-in labels

Built-in feature actions use feature-specific language options in Grid Pro.
For row pinning:

- `lang.rowPinning.label`
- `lang.rowPinning.pinRowTop`
- `lang.rowPinning.pinRowBottom`
- `lang.rowPinning.unpinRow`

```js
Grid.grid('container', {
    lang: {
        rowPinning: {
            label: 'Pinning',
            pinRowTop: 'Pin to top',
            pinRowBottom: 'Pin to bottom',
            unpinRow: 'Remove pin'
        }
    }
});
```

Table editing labels are configured under `lang.tableEditing`, for example
`lang.tableEditing.rows`, `lang.tableEditing.addRowAbove` and
`lang.tableEditing.deleteColumn`.

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid-lite/demo/cell-context-menu?force-light-theme" allow="fullscreen"></iframe>
