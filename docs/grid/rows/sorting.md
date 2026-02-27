---
sidebar_label: "Sorting"
---

# Row sorting

Row sorting is configured using the `sorting` option. When a column is sorted, the grid reorders rows based on the values in that column.

Sorting is **enabled by default**, and can be configured for individual columns using `columns[].sorting` or globally using `columnDefaults.sorting`.

## Disable sorting for a specific column

Use `columns[].sorting.enabled` to control whether the end user can sort by clicking on a specific column header.

```js
columns: [{
    id: 'price',
    sorting: {
        enabled: false
    }
}]
```

## Disable sorting for all columns

Use `columnDefaults.sorting.enabled` to control whether the end user can sort by clicking all column headers, and override for specific columns if needed.

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

Use `sorting.order` to set an initial sort order (`'asc'` or `'desc'`) when the grid is rendered.

```js
columns: [{
    id: 'price',
    sorting: {
        order: 'asc'
    }
}]
```

Note that `enabled` only specifies whether the end user can sort by clicking headers or not, so you can still set an initial sort order while disabling end user sorting.

## Custom sorting

Provide a custom `compare(a, b)` function when you need non-standard sorting logic. The function should return:

* `< 0` if `a` should come before `b`
* `0` if they are equal
* `> 0` if `a` should come after `b`

This example sorts values that are stored as grams or kilograms (e.g. `100 g` or `40 kg`).  

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

## Multicolumn sorting

To do a multicolumn sort, hold `Shift` while clicking additional headers. The active sort order is shown as a priority indicator when more than one column is sorted.

When multiple columns define `sorting.order`, `sorting.priority` controls the order of precedence (lower numbers have higher priority). If no priority is set, the last column with sorting defined becomes the primary sort, and earlier columns become secondary.

```js
columns: [{
    id: 'region',
    sorting: {
        order: 'asc',
        priority: 2
    }
}, {
    id: 'price',
    sorting: {
        order: 'desc',
        priority: 1
    }
}]
```

## Programmatic sorting

Multicolumn sorting can be configured programmatically, enabling sorting to be applied at any point in the grid lifecycle or driven by custom controls outside the grid.

```js
grid.setSorting([
    { columnId: 'group', order: 'asc' },
    { columnId: 'score', order: 'asc' }
]);
```

Note that in this example `priority` is not defined, so `score` becomes the primary sort.

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/multi-column-sorting?force-light-theme" allow="fullscreen"></iframe>
