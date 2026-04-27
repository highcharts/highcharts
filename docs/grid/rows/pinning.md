---
sidebar_label: "Pinning"
tags: ["grid-pro"]
---

# Row pinning

Row pinning is available in Highcharts Grid Pro. It lets you keep selected rows
visible at the top or bottom while the main rows scroll normally.

Pinned rows are existing `data.dataTable` rows. They remain in the scrollable
area and are also rendered in dedicated pinned sections.

## Basic configuration

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                id: ['row-001', 'row-002', 'row-999'],
                price: [1, 2, 999]
            }
        },
        idColumn: 'id'
    },
    rendering: {
        rows: {
            pinning: {
                topIds: ['row-001'],
                bottomIds: ['row-999']
            }
        }
    }
});
```

In Grid Pro, row pinning is enabled by default. Use `pinning.enabled: false` to
disable row pinning UI:

```js
Grid.grid('container', {
    rendering: {
        rows: {
            pinning: {
                enabled: false
            }
        }
    }
});
```

When disabled, Grid still applies row pinning config (`topIds`, `bottomIds`,
`resolve`, etc.) and the runtime row pinning API continues to work. The
setting only disables built-in row pinning affordances such as context menu
actions.

```js
const grid = Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                id: ['row-001', 'row-002', 'row-003'],
                priority: ['critical', 'normal', 'done']
            }
        },
        idColumn: 'id'
    },
    rendering: {
        rows: {
            pinning: {
                enabled: false,
                topIds: ['row-001'],
                resolve: (row) => row.priority === 'done' ? 'bottom' : null
            }
        }
    }
});

await grid.rowPinning.pin('row-002', 'top');
```

Use `data.idColumn` to define stable row identity for persistence and restore.
If it is not set, Grid uses a default row id.

## Resolve pinning from row data

You can compute pinned rows dynamically with `pinning.resolve`.

The callback receives a row object and should return:

- `'top'` to pin the row to the top section
- `'bottom'` to pin the row to the bottom section
- `null` or `undefined` to keep the row unpinned

```js
Grid.grid('container', {
    data: {
        idColumn: 'id'
    },
    rendering: {
        rows: {
            pinning: {
                resolve: function (row) {
                    if (row.priority === 'critical') {
                        return 'top';
                    }
                    if (row.status === 'done') {
                        return 'bottom';
                    }
                    return null;
                }
            }
        }
    }
});
```

`resolve` is recomputed when query state changes. Explicit `topIds` and
`bottomIds` are applied first, and `resolve` adds additional IDs that are not
already pinned explicitly.

## Runtime API

Use the scoped row pinning API to update pinning dynamically:

```js
await grid.rowPinning.pin('row-001'); // defaults to top
await grid.rowPinning.pin('row-010', 'top');
await grid.rowPinning.pin('row-025', 'bottom');
await grid.rowPinning.pin('row-050', 'top', 0); // insert at index 0 in top section
await grid.rowPinning.toggle('row-025'); // defaults to top when currently unpinned
await grid.rowPinning.toggle('row-030', 'bottom');
await grid.rowPinning.unpin('row-010');

const pinned = grid.rowPinning.getPinnedRows();
// { topIds: [...], bottomIds: [...] }
```

In Grid Pro, you can also listen to runtime row pinning events in
`rendering.rows.pinning.events`:

```js
Grid.grid('container', {
    rendering: {
        rows: {
            pinning: {
                events: {
                    beforeRowPin: function (event) {
                        console.log(
                            this,
                            'before',
                            event.action,
                            event.rowId,
                            event.topIds,
                            event.bottomIds
                        );
                    },
                    afterRowPin: function (event) {
                        console.log(
                            this,
                            'after',
                            event.action,
                            event.rowId,
                            event.topIds,
                            event.bottomIds
                        );
                    }
                }
            }
        }
    }
});
```

Event payload fields:
- `rowId`: changed row id
- `action`: `'pin' | 'unpin' | 'toggle'`
- `position`: pin target when relevant (`'top'` for new toggle pins)
- `index`: insertion index when provided to `grid.rowPinning.pin(...)`
- `changed`: whether pinned state actually changed
- `previousTopIds` / `previousBottomIds`
- `topIds` / `bottomIds`

`beforeRowPin` fires before redraw, and
`afterRowPin` fires after redraw.

## Built-in context menu actions

Available built-in actions are:

- `pinRowTop`
- `pinRowBottom`
- `unpinRow`

For configuration and customization details, see
[Cell context menu](https://www.highcharts.com/docs/grid/cell-context-menu).

## Sorting and filtering behavior

Pinned sections always render from the original data source and are not affected
by active sorting, filtering, or pagination.

Pinned rows also remain in the scrollable area, so they can appear in both
sections at once.

For accessibility, Grid announces both representations and adds context so
screen readers can distinguish rows rendered in pinned sections from rows in the
main scrollable section that are also pinned.

## Pinned section max height

You can make top/bottom pinned sections scroll independently by setting
`pinning.top.maxHeight` and/or `pinning.bottom.maxHeight`.

If `maxHeight` is not set, pinned sections do not use internal scrolling by
default.

When rows are pinned at runtime (`grid.rowPinning.pin(...)` or
`grid.rowPinning.toggle(...)` when it pins), Grid
automatically scrolls the affected top/bottom pinned section just enough to keep
the inserted row visible.

```js
rendering: {
    rows: {
        pinning: {
            topIds: ['row-001', 'row-002', 'row-003'],
            bottomIds: ['row-998', 'row-999'],
            top: {
                maxHeight: 120 // pixels
            },
            bottom: {
                maxHeight: '25%' // percent of table height
            }
        }
    }
}
```

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid-pro/demo/row-pinning?force-light-theme" allow="fullscreen"></iframe>
