---
sidebar_label: "Sorting"
---

# Column sorting

Sorting is configured in `columnDefaults.sorting` or `columns[].sorting`.

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

Related events:
- `beforeSort`
- `afterSort`

See [Interaction / Events](https://www.highcharts.com/docs/grid/events).
