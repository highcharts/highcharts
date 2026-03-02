---
sidebar_label: "Pagination"
---

# Row pagination
Pagination splits row data into pages, so the grid renders a manageable subset of rows at a time. This is useful for large datasets and helps keep the interface fast and readable.

## Enable pagination with default configuration

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {...}
        }
    },
    pagination: {
        enabled: true
    }
});
```

This enables pagination with all default elements and controls enabled, and can be customized further if needed.

## Page size

The `pageSize` option controls how many rows appear on each page. The default value is `10`.

Pagination does not disable row virtualization. If `pageSize` is higher than the number of rows that fit in the grid viewport, only the visible subset of rows in the current page is rendered at a time, and additional rows are rendered as you scroll.

```js
pagination: {
    enabled: true,
    pageSize: 25
}
```

## Position

Use `pagination.position` to control where the pagination UI is rendered.

Supported values are:
- `top`: renders pagination before the grid.
- `bottom`: renders pagination after the grid (default).
- `footer`: renders pagination inside the grid footer.
- `#element-id`: renders pagination inside a custom container selected by ID.

```js
pagination: {
    enabled: true,
    position: '#my-pagination'
}
```

## Alignment

Use `pagination.align` to control how the pagination controls are aligned inside the pagination container.

Supported values are:
- `distributed` (default)
- `left`
- `center`
- `right`

```js
pagination: {
    enabled: true,
    position: 'bottom',
    align: 'left'
}
```

## Controls

Use `pagination.controls` to enable or disable individual pagination UI parts. All options accepts both `boolean` or an object with `enabled`.

Available options are:
- `pageSizeSelector`: number of rows per page selector.
- `pageInfo`: page summary text (for example, "Showing 1 - 10 of 42").
- `firstLastButtons`: first and last page navigation buttons.
- `previousNextButtons`: previous and next page navigation buttons.
- `pageButtons`: numbered page buttons.

Example with all controls configured:

```js
pagination: {
    enabled: true,
    controls: {
        pageSizeSelector: {
            enabled: true,
            options: [10, 25, 50, 100]
        },
        pageInfo: true,
        firstLastButtons: false,
        previousNextButtons: true,
        pageButtons: {
            enabled: true,
            count: 9
        }
    }
}
```

## Responsive pagination

Pagination is a typical use case for `responsive.rules`. Use it to override pagination settings for smaller grid widths and reduce control density on e.g. mobile devices.

```js
Grid.grid('container', {
    data: {
        dataTable: {
            columns: {...}
        }
    },
    pagination: {
        enabled: true,
        pageSize: 25,
        controls: {
            pageButtons: {
                count: 9
            }
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            gridOptions: {
                pagination: {
                    pageSize: 10,
                    controls: {
                        pageSizeSelector: false,
                        prevNextButtons: false,
                        pageButtons: {
                            count: 5
                        }
                    }
                }
            }
        }]
    }
});
```

## Events __grid_pro__

In Grid Pro, pagination events are configured in `pagination.events`.

Available events are:
- `beforePageChange`
- `afterPageChange`
- `beforePageSizeChange`
- `afterPageSizeChange`

```js
pagination: {
    enabled: true,
    events: {
        beforePageChange: function (e) {
            console.log('Page changing from', e.currentPage, 'to', e.nextPage);
        },
        afterPageChange: function (e) {
            console.log('Page changed to', e.currentPage);
        },
        beforePageSizeChange: function (e) {
            console.log('Page size changing from', e.pageSize, 'to', e.newPageSize);
        },
        afterPageSizeChange: function (e) {
            console.log('Page size changed to', e.pageSize);
        }
    }
}
```

For a complete list of pagination options, see the [pagination API reference](https://api.highcharts.com/grid/pagination).
