---
description: >-
  Configure cell context menus for mouse, touch, and keyboard use, define
  clickable items and nested submenus, add Grid Pro row pinning actions, and
  localize built-in labels.
---

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

A registered item accepts the same properties as an inline one. `label`,
`visible` and `disabled` may also be callbacks, which receive the context the
menu was opened in; an item with `items` is a group, and `defaultIn: ['cell']`
puts it in the menu of columns that configure no `items` of their own.

Referring to a registered item by ID and giving it properties alongside
overrides what was registered, except that an override can only restrict an
item: `visible` is combined with `and`, `disabled` with `or`.

> The earlier `Grid.CellContextMenuBuiltInActions.registerBuiltInAction` and
> `registerBuiltInGroup` are deprecated as of v3.3.0 and still work.

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
of the cell: it is bound to `this` and passed as the first argument to
`onClick`. Built-in action IDs are not available here, since they act on a row
or a column.

The element does not have to sit inside the Grid. A menu opened on an attached
element renders in the browser's top layer, so the Grid, which hides its own
overflow, cannot clip it.

The call returns a function that detaches the menu again:

```js
const detach = grid.contextMenu.attach(element, { items });

detach();
```

<iframe src="https://www.highcharts.com/samples/embed/grid-lite/basic/context-menu-attach?force-light-theme" allow="fullscreen"></iframe>

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
