---
sidebar_label: "Selection"
tags: ["grid-pro"]
---

# Row selection

Row selection is available in Highcharts Grid Pro. It lets end users pick one
or more rows so your application can act on those records: editing, deleting,
exporting, comparing, or driving a connected component such as a Highcharts
chart.

Selected rows are highlighted, optionally show a checkbox, and are available
through a public API and a pair of events.

## Basic configuration

Selection is off by default. Set `rowSelection.enabled` to turn it on:

```js
Grid.grid('container', {
    data: {
        columns: {
            id: ['row-001', 'row-002', 'row-003'],
            product: ['Alpha', 'Beta', 'Gamma']
        },
        idColumn: 'id'
    },
    rowSelection: {
        enabled: true
    }
});
```

## Selection modes

The `mode` option controls how many rows can be selected at once.

| Mode | Behavior |
|---|---|
| `single` (default) | Only one row is selected at a time. Clicking the selected row again deselects it. |
| `multiple` | Several rows can be selected. `Shift`-click selects a continuous range from the last clicked row. |

```js
rowSelection: {
    enabled: true,
    mode: 'multiple'
}
```

### Click behavior in the multiple mode

In the `multiple` mode, `clickBehavior` decides what a click without a modifier
key does:

| Value | Behavior |
|---|---|
| `toggle` (default) | The clicked row is added to, or removed from, the selection. Every row can be picked with a plain click. |
| `replace` | The clicked row replaces the selection. Rows are added or removed with the modifier key instead, the way file managers behave. |

`modifierKey` chooses that modifier. The default, `ctrlOrMeta`, matches the
Command key on macOS and the Control key elsewhere; `alt` is the alternative.
`Shift` is not available, because it selects a range.

```js
rowSelection: {
    enabled: true,
    mode: 'multiple',
    clickBehavior: 'replace',
    modifierKey: 'ctrlOrMeta'
}
```

Whatever `clickBehavior` is set to, clicking a checkbox always toggles the row.

## What selects a row

The `trigger` option controls the interactions that select a row, so row clicks
can be enabled or disabled independently of the checkbox.

| Value | Behavior |
|---|---|
| `both` (default) | Clicking anywhere on the row, and clicking the checkbox, both select. |
| `row` | Only clicking the row selects. The checkbox becomes a read-only indicator. |
| `checkbox` | Only clicking the checkbox selects. Requires `checkbox.enabled`. |

Clicks that land on an interactive element inside a cell — an `input`,
`select`, `button`, `a`, or `textarea` — never change the selection, so cell
renderers and links keep working.

Keyboard users select the focused row with `Space`. `Enter` is reserved for
[cell editing](https://www.highcharts.com/docs/grid/editing/index).

## Checkboxes

Set `checkbox.enabled` to render a checkbox reflecting each row's selected
state. By default the checkbox gets its own dedicated column, inserted as the
first column:

```js
rowSelection: {
    enabled: true,
    mode: 'multiple',
    checkbox: {
        enabled: true
    }
}
```

Use `checkbox.columnWidth` to change how wide that column is. The dedicated
column holds no data, so it is excluded from sorting, filtering, editing, and
[exporting](https://www.highcharts.com/docs/grid/exporting).

To prepend the checkbox to an existing column instead of adding a new one, name
that column with `checkbox.columnId`:

```js
rowSelection: {
    enabled: true,
    mode: 'multiple',
    checkbox: {
        enabled: true,
        columnId: 'product'
    }
}
```

## Reading the selection

The controller on `grid.rowSelection` exposes the current selection and lets
you change it programmatically:

```js
const grid = await Grid.grid('container', { /* ... */ }, true);

grid.rowSelection.getSelectedRowIds(); // ['row-001', 'row-003']
grid.rowSelection.isSelected('row-001'); // true

grid.rowSelection.select('row-002');
grid.rowSelection.select(['row-002', 'row-003']);
grid.rowSelection.deselect('row-002');
grid.rowSelection.toggle('row-003');
grid.rowSelection.clear();
```

Row ids come from the data provider, so a selection survives sorting,
filtering, and page changes. See [Row ids](#row-ids) below.

## Events

Two grid-level events fire around every selection change:

| Event | Description |
|---|---|
| `beforeRowSelectionChange` | Before the change is applied. Call `event.preventDefault()` to cancel it. |
| `afterRowSelectionChange` | After the change was applied. |

Both receive the same payload:

| Property | Description |
|---|---|
| `addedRowIds` | Ids of the rows that became selected. |
| `removedRowIds` | Ids of the rows that became deselected. |
| `selectedRowIds` | The whole selection — before the change on `beforeRowSelectionChange`, after it on `afterRowSelectionChange`. |
| `originalEvent` | The browser event that caused the change, or `undefined` when the change came from the API. |

Each event fires once per gesture, so selecting a range of ten rows produces
one event carrying all ten in `addedRowIds`. Nothing fires when a change would
be a no-op.

### Driving a chart from the selection

`selectedRowIds` is all a connected component needs:

```js
Grid.grid('container', {
    // ...
    rowSelection: {
        enabled: true,
        mode: 'multiple',
        checkbox: { enabled: true }
    },
    events: {
        afterRowSelectionChange: function (e) {
            chart.update({
                series: e.selectedRowIds.map(id => ({
                    type: 'line',
                    name: cities[id].name,
                    data: cities[id].temperatures
                }))
            }, true, true);
        }
    }
});
```

To cancel a change — for example while a form is dirty — prevent it:

```js
events: {
    beforeRowSelectionChange: function (e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
        }
    }
}
```

## Row ids

The selection is keyed by row id, not by row position, which is what lets it
survive sorting, filtering, and pagination.

Set [`data.idColumn`](https://api.highcharts.com/grid/) to a column holding a
unique value per row whenever you can. Without it:

- The local data provider falls back to the row's original position in the
  source data. That is stable across sorting, filtering, and paging, but not
  across replacing the dataset.
- The remote data provider derives ids from positions in the current query
  result unless the server returns `rowIds`. Sorting or filtering then moves
  the selection onto different rows, so `data.idColumn` is effectively required
  there — the provider logs a console warning when it has to fall back to
  positions.

## Styling

Selected rows get the `hcg-row-selected` class. The highlight itself is part of
the theme, so it only applies to a themed grid — with `rendering.theme: ''` the
class is still set but nothing is painted, leaving the styling to you.

The same goes for the checkbox: it carries the shared `hcg-input` class, whose
`appearance: none` reset is unconditional while its border and background come
from the theme. On an unthemed grid it is therefore present and clickable, but
invisible until you style it — the built-in [checkbox
renderer](https://www.highcharts.com/docs/grid/editing/renderers) behaves the
same way. Target it with `.hcg-selection-checkbox`:

```css
.hcg-selection-checkbox {
    border: 1px solid currentcolor;
    border-radius: 2px;
}
```

Three CSS variables control the highlight:

| Variable | Description |
|---|---|
| `--hcg-row-selected-background` | The color blended into the selected row background. |
| `--hcg-row-selected-color` | The text color of a selected row. |
| `--hcg-row-selected-opacity` | How strongly the background color is blended in. Falls back to `--hcg-hover-opacity`, as the hover and sync states do. |

```css
.hcg-theme-default {
    --hcg-row-selected-background: #7cb5ec;
    --hcg-row-selected-opacity: 20%;
}
```

The checkbox carries the `hcg-selection-checkbox` class, and the cells of the
dedicated selection column carry `hcg-selection-cell`.

## Accessibility

Selected rows are marked with `aria-selected`, and the table is marked
`aria-multiselectable` in the `multiple` mode. The checkbox label comes from
`lang.rowSelection.selectRow`, so it can be localized:

```js
lang: {
    rowSelection: {
        selectRow: 'Velg rad'
    }
}
```

## Limitations

The dedicated selection column is a normal column, so it scrolls horizontally
with the others. If [column
virtualization](https://www.highcharts.com/docs/grid/columns/virtualization) is
active it can be detached once scrolled out of view. Prepend the checkbox to a
column you keep in view, or turn column virtualization off, when that matters.

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/options/row-selection?force-light-theme" allow="fullscreen"></iframe>
