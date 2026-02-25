---
sidebar_label: "Pinning"
---

# Row pinning

Row pinning lets you keep selected rows visible at the top or bottom while the
main rows scroll normally.

Pinned rows are existing `data.dataTable` rows. They are removed from the
scrollable area and rendered in dedicated pinned sections.

## Basic configuration

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                id: ['row-001', 'row-002', 'row-999'],
                price: [1, 2, 999]
            }
        }
    },
    rendering: {
        rows: {
            pinning: {
                idColumn: 'id',
                topIds: ['row-001'],
                bottomIds: ['row-999']
            }
        }
    }
});
```

Row pinning is enabled by default. Use `pinning.enabled: false` to disable it:

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

When disabled, Grid ignores row pinning config (`topIds`, `bottomIds`,
`resolve`, etc.), runtime pinning methods are no-op, and pinned row sections
are not rendered.

Use `pinning.idColumn` to define stable row identity for persistence and
restore.
If it is not set, Grid uses a default row id.

## Runtime API

Use runtime methods to update pinning dynamically:

```js
await grid.pinRow('row-001'); // defaults to top
await grid.pinRow('row-010', 'top');
await grid.pinRow('row-025', 'bottom');
await grid.toggleRow('row-025'); // defaults to top when currently unpinned
await grid.toggleRow('row-030', 'bottom');
await grid.unpinRow('row-010');

const pinned = grid.getPinnedRows();
// { topIds: [...], bottomIds: [...] }
```

In Grid Pro, you can also listen to
`events.beforeRowPin` and `events.afterRowPin`:

```js
Grid.grid('container', {
    events: {
        beforeRowPin(e) {
            console.log('before', e.action, e.rowId, e.topIds, e.bottomIds);
        },
        afterRowPin(e) {
            console.log('after', e.action, e.rowId, e.topIds, e.bottomIds);
        }
    }
});
```

Event payload fields:
- `rowId`: changed row id
- `action`: `'pin' | 'unpin' | 'toggle'`
- `position`: pin target when relevant (`'top'` for new toggle pins)
- `index`: insertion index when provided to `pinRow`
- `changed`: whether pinned state actually changed
- `previousTopIds` / `previousBottomIds`
- `topIds` / `bottomIds`

`beforeRowPin` fires before redraw, and
`afterRowPin` fires after redraw.

## Built-in context menu actions

The cell context menu supports built-in row pinning actions:
`pinRowTop`, `pinRowBottom`, and `unpinRow`.

```js
columnDefaults: {
    cells: {
        contextMenu: {
            items: ['pinRowTop', 'pinRowBottom', 'unpinRow']
        }
    }
}
```

You can also group built-ins in a submenu:

```js
columnDefaults: {
    cells: {
        contextMenu: {
            items: [{
                label: 'Pinning',
                items: ['pinRowTop', 'pinRowBottom', 'unpinRow']
            }]
        }
    }
}
```

## Sorting and filtering behavior

By default, pinned rows are excluded from sorting and filtering changes.

```js
rendering: {
    rows: {
        pinning: {
            sorting: 'exclude',
            filtering: 'exclude'
        }
    }
}
```

Set `sorting: 'include'` or `filtering: 'include'` when pinned rows should also
follow active sorting/filtering while still remaining pinned.

## Pinned section max height

You can make top/bottom pinned sections scroll independently by setting
`pinning.top.maxHeight` and/or `pinning.bottom.maxHeight`.

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

<iframe src="https://www.highcharts.com/samples/embed/grid-lite/demo/row-pinning?force-light-theme" allow="fullscreen"></iframe>
