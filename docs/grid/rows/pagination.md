---
sidebar_label: "Pagination"
---

# Row pagination

Pagination splits row data into pages, so the Grid renders a manageable subset of rows at a time. This is useful for large datasets and helps keep the interface fast and readable.

If you prefer continuous scrolling instead of pages, consider row virtualization under `rendering.rows`.

## Enable pagination

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                product: ['Apple', 'Pear', 'Orange', 'Banana', 'Grape', 'Mango'],
                price: [3.5, 2.5, 3, 2.2, 4.1, 3.8]
            }
        }
    },
    pagination: true
});
```

To customize pagination, use the object form:

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {
                product: ['Apple', 'Pear', 'Orange', 'Banana', 'Grape', 'Mango'],
                price: [3.5, 2.5, 3, 2.2, 4.1, 3.8]
            }
        }
    },
    pagination: {
        enabled: true,
        pageSize: 5,
        position: 'bottom'
    }
});
```

## Page size

The `pageSize` option controls how many rows appear on each page. The default value is `10`.

```js
pagination: {
    enabled: true,
    pageSize: 25
}
```

## Pagination controls

You can enable or disable individual UI controls, such as the page size selector or the page buttons:

```js
pagination: {
    enabled: true,
    controls: {
        pageSizeSelector: {
            enabled: true,
            options: [10, 25, 50]
        },
        pageInfo: {
            enabled: true
        },
        pageButtons: {
            enabled: true,
            count: 7
        }
    }
}
```

For a complete list of options and methods, see the [Pagination article](https://www.highcharts.com/docs/grid/rows/pagination) or the [pagination API reference](https://api.highcharts.com/grid/#interfaces/Grid_Core_Pagination_PaginationOptions.PaginationOptions).
