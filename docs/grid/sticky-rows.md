# Sticky rows

Sticky rows keep selected rows visible while vertical scrolling, without moving
rows into fixed top/bottom sections. The row stays in its natural order, and
sticks to the top or bottom edge of the viewport depending on scroll position.

This is useful for milestone rows, summary rows, and future tree-data parent
stickiness.

## Basic setup

```js
Grid.grid('container', {
    dataTable: {
        columns: {
            id: ['SKU-001', 'SKU-002', 'SKU-003'],
            product: ['Product 1', 'Product 2', 'Product 3'],
            stock: [15, 3, 42]
        }
    },
    rendering: {
        rows: {
            sticky: {
                idColumn: 'id',
                ids: ['SKU-002']
            }
        }
    }
});
```

## Sticky API

Sticky configuration is available under `rendering.rows.sticky`.

### `rendering.rows.sticky.ids`

Explicit list of row IDs to treat as sticky.

```js
sticky: {
    idColumn: 'id',
    ids: ['SKU-002', 'SKU-010']
}
```

### `rendering.rows.sticky.idColumn`

Column used to resolve row IDs from row objects.

If omitted, Grid uses the provider row ID.

```js
sticky: {
    idColumn: 'id',
    ids: ['SKU-002']
}
```

### `rendering.rows.sticky.resolve(row)`

Callback used to derive sticky rows from row data. Return `true` to make the
row sticky.

```js
sticky: {
    idColumn: 'id',
    resolve: function (row) {
        return Number(row.stock) < 5;
    }
}
```

## Runtime methods

### `grid.stickRow(rowId, index?)`

Adds a row ID to sticky rows at runtime.

```js
await grid.stickRow('SKU-040');
```

### `grid.unstickRow(rowId)`

Removes a row ID from sticky rows at runtime.

```js
await grid.unstickRow('SKU-040');
```

### `grid.getStickyRows()`

Returns currently sticky row IDs.

```js
const stickyIds = grid.getStickyRows();
```

## Behavior notes

- Sticky rows use one semantic table body for Grid content.
- Sticky visual overlays are rendered only when sticky rows are active.
- Sticky behavior respects the current queried view (sorting/filtering/
  pagination).
- With virtualization on, sticky updates are optimized for scroll performance.
- A sticky row appears in the top overlay when it is above the visible window,
  and in the bottom overlay when it is below the visible window.

## Virtualization notes

With row virtualization enabled, Grid may keep a small render buffer outside the
viewport for smooth scrolling. Sticky logic is based on the **visible window**,
not only on rendered row instances.

This means a row can be rendered but still considered outside view, and then be
shown in sticky overlay until it enters the visible area.

## Remote provider notes

Sticky rows are supported for local and remote providers.

For remote data:

- Prefer a stable `idColumn` so sticky IDs remain predictable.
- `ids` are resolved against the current queried data.
- `resolve(row)` can be more expensive on large datasets, because row objects
  may need to be evaluated to determine stickiness.

## Edge cases

- Unknown IDs in `sticky.ids` are ignored in rendered sticky output.
- Duplicate IDs are deduplicated (first-seen order is kept).
- If `resolve(row)` throws, the error is ignored for that row and Grid logs a
  warning once.
- If `idColumn` is omitted, Grid falls back to provider row IDs.

## Performance guidance

- Keep sticky set sizes moderate for best scroll performance.
- Prefer explicit `ids` over heavy `resolve(row)` logic for large datasets.
- Keep sticky row cell rendering lightweight (especially custom formatters).
- For remote datasets, use stable IDs and avoid expensive per-row derivation
  when possible.

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/demo/sticky-rows?force-light-theme" allow="fullscreen"></iframe>
