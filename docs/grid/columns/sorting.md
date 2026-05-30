---
sidebar_label: "Sorting"
---

# Column sorting

Sorting is configured in `columnDefaults.sorting` or `columns[].sorting`.

With the default local data model, sorting is applied client-side on the loaded
data. In Grid Pro, use `providerType: 'remote'` when sorting should trigger a
server request instead. Read more in [Server-side data handling](https://www.highcharts.com/docs/grid/data-handling/serverside).

```js
Grid.grid('container', {
    columns: [{
        id: 'weight',
        sorting: {
            enabled: true,
            order: 'desc',
            orderSequence: ['desc', 'asc', null]
        }
    }]
});
```

## Enabling sorting

Use `sorting.enabled` to control whether end users can sort a column by
clicking its header. Set it globally in `columnDefaults.sorting` and override
individual columns when needed.

```js
columnDefaults: {
    sorting: {
        enabled: false
    }
},
columns: [{
    id: 'price',
    sorting: {
        enabled: true
    }
}]
```

## Initial sort order

Use `sorting.order` to apply an initial sort when the grid is rendered.
Supported values are `'asc'` and `'desc'`.

```js
columns: [{
    id: 'price',
    sorting: {
        order: 'asc'
    }
}]
```

`enabled` only controls click sorting from the UI, so you can still set an
initial order when `enabled` is `false`.

## Sorting options

The `sorting` object supports:

- `enabled`: Enables or disables header click sorting for the column.
- `order`: Sets the initial sorting order.
- `priority`: Sets priority when multiple columns are sorted. Lower numbers have higher priority.
- `compare`: Overrides the default sort comparison for the column.
- `orderSequence`: Controls the order cycle used when the user toggles sorting from the UI.

### Custom compare function

Use `compare(a, b)` when you need non-standard ordering.

```js
columns: [{
    id: 'weight',
    sorting: {
        compare: (a, b) => {
            const convert = n => parseFloat(n) * (
                n.endsWith('kg') ? 1000 : 1
            );

            return convert(a) - convert(b);
        }
    }
}]
```

### Custom order sequence

`orderSequence` can have any length, any order, and can include duplicates.
Allowed values are `'asc'`, `'desc'`, and `null`.

- `['asc', 'desc']` toggles between ascending and descending only.
- `['asc']` keeps the column in ascending order on every click while still showing sorting UI.
- `[]` makes clicks no-op while keeping sortable UI.

When `enabled` is `false`, click sorting is disabled even if `orderSequence`
is set.

## Multicolumn sorting

Hold `Shift` while clicking additional headers to build a multicolumn sort.
When more than one column is active, the order is shown as a priority
indicator.

When multiple columns define `sorting.order`, `sorting.priority` controls the
order of precedence. If no priority is set, the last column in the options
list with `sorting.order` becomes the primary sort.

```js
columns: [{
    id: 'group',
    sorting: {
        order: 'asc',
        priority: 2
    }
}, {
    id: 'score',
    sorting: {
        order: 'asc',
        priority: 1
    }
}]
```

## Programmatic sorting

You can also sort columns through the API.

```js
grid.setSorting([
    { columnId: 'group', order: 'asc' },
    { columnId: 'score', order: 'asc' }
]);
```

The array passed to `grid.setSorting` is already in priority order, so the
first item is the primary sort.

You can also sort a single column directly, even when click sorting is
disabled:

```js
const column = grid.getColumn('score');

column.sorting.setOrder('desc');
```

## Events __grid_pro__

Related events:
- `beforeSort`
- `afterSort`

See [Interaction / Events](https://www.highcharts.com/docs/grid/events) for event details.

## API reference

- [`columnDefaults.sorting`](https://api.highcharts.com/grid/columnDefaults.sorting)
- [`columns.sorting`](https://api.highcharts.com/grid/columns.sorting)

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/multi-column-sorting?force-light-theme" allow="fullscreen"></iframe>
