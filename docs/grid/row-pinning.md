---
sidebar_label: "Row pinning"
---

# Row pinning (Grid Lite)

Row pinning lets you keep selected rows visible at the top or bottom while the
main rows scroll normally.

Pinned rows are existing `dataTable` rows. They are removed from the scrollable
area and rendered in dedicated pinned sections.

## Basic configuration

```js
Grid.grid('container', {
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

Use `pinning.idColumn` to define stable row identity for persistence and
restore.
If it is not set, Grid uses a default row id derived from the row's
position.

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

In Grid Pro, you can also listen to `events.rowPinningChanged`:

```js
Grid.grid('container', {
    events: {
        rowPinningChanged(e) {
            console.log(e.action, e.rowId, e.topIds, e.bottomIds);
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

## Notes

- Pinned rows are always visible and are not paginated.
- A row cannot be both pinned and scrollable at the same time.
- Row pinning works with both local and remote data providers.
- With remote providers, `resolve(row)` may require scanning rows to derive
  initial state, which can be expensive on very large datasets.
- Row pinning is available in **Grid Lite** and **Grid Pro**.

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid-lite/demo/row-pinning?force-light-theme" allow="fullscreen"></iframe>
