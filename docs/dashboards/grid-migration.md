# Upgrade DataGrid to Grid Pro
The core of **Grid Pro** (formerly: **DataGrid**) has been changed in version 3.2. Currently, **Grid Pro** is part of Highcharts Dashboards and will be available as a standalone library after the release of **Dashboards** v4.

## Initialize
To initialize, you can use the factory function `Grid.grid`:

```js
const grid = Grid.grid('container', {
    dataTable: {
        columns: { ... }
    }
});
```

## API changes
Some API options have been renamed or removed. For the full list, make sure to check the [API reference](https://api.highcharts.com/dashboards/).

## Example of the new Grid Pro

```js
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
        }
    },
    columnDefaults: {
        cells: {
            editable: true,
            events: {
                afterEdit: function () {
                    // Callback action
                },
                afterRender: function () {
                    // Callback action
                },
                click: function () {
                    // Callback action
                },
                dblClick: function () {
                    // Callback action
                },
                mouseOver: function () {
                    // Callback action
                },
                mouseOut: function () {
                    // Callback action
                }
            }
        }
        sorting: {
            sortable: false
        },
        events: {
            afterSorting: function () {
                // Callback action
            },
            afterResize: function () {
                // Callback action
            }
        },
        header: {
            events: {
                click: function () {
                    // Callback action
                }
            }
        }
    }
    rendering: {
        columns: {
            distribution: 'full'
        },
        rows: {
            bufferSize: 10,
            strictHeights: false
        }
    }
    columns: [{
        id: 'weight',
        className: 'custom-column-class-name',
        cells: {
            format: 'V:{value}';
        }
    }, {
        id: 'metaData',
        enabled: false
    }]
```

## Recommended reading
We recommend reading our article on [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) for an overview of new options and possibilities, and also the [Changelog](https://www.highcharts.com/changelog/#highcharts-dashboards) for any breaking changes.
