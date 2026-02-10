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
            pinned: {
                idColumn: 'id',
                top: ['row-001'],
                bottom: ['row-999']
            }
        }
    }
});
```

Use `pinned.idColumn` to define stable row identity for persistence and
restore.
If it is not set, Grid uses the original row index.

## Runtime API

Use runtime methods to update pinning dynamically:

```js
await grid.pinRow('row-010', 'top');
await grid.pinRow('row-025', 'bottom');
await grid.unpinRow('row-010');

const pinned = grid.getPinnedRows();
// { top: [...], bottom: [...] }
```

## Sorting and filtering behavior

By default, pinned rows are excluded from sorting and filtering changes.

```js
rendering: {
    rows: {
        pinned: {
            sorting: 'exclude',
            filtering: 'exclude'
        }
    }
}
```

Set `sorting: 'include'` or `filtering: 'include'` when pinned rows should also
follow active sorting/filtering while still remaining pinned.

## Limit pinned area height

You can limit the visible height of top and bottom pinned areas. When the
content exceeds the limit, the pinned area becomes vertically scrollable.

Use pixels (`number` or `'120px'`) or percentage of Grid height (`'25%'`):

```js
rendering: {
    rows: {
        pinned: {
            maxTopHeight: '30%',
            maxBottomHeight: 120
        }
    }
}
```

## Notes

- Pinned rows are always visible and are not paginated.
- A row cannot be both pinned and scrollable at the same time.
- Row pinning works with both local and remote data providers.
- With remote providers, `resolve(row)` may require scanning rows to derive
  initial state, which can be expensive on very large datasets.
- Row pinning is available in **Grid Lite** and **Grid Pro**.

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid-lite/demo/row-pinning?force-light-theme" allow="fullscreen"></iframe>
