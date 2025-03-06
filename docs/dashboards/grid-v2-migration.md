# Upgrade DataGrid from 3.x.x to a Grid Pro
The core of DataGrid has been changed in version 3.2. We have improved the performance and flexibility while adding accessibility support. This means API options and the definition of styles or data sources differ from the previous version. We outline all of the changes below.

## Initialize
To initialize, you can use the factory function `Grid.grid`:

```js
const grid = Grid.grid('container', {
    dataTable: {
        columns: { ... }
    }
});
```

Currently, Grid Pro is part of Highcharts Dashboards and will be available as a standalone library after the release of Dashboards v4.

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
            editable: true
        }
        sorting: {
            sortable: false
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
        }
    }, {
        id: 'metaData',
        enabled: false
    }],
    events: {
        cell: {
            click: function () {
                // Callback action
            },
            dblClick: function() {
                // Callback action
            },
            afterEdit: function () {
                // Callback action
            }
        },
        column: {
            afterSorting: function () {
                // Callback action
            },
            afterResize: function () {
                // Callback action
            }
        },
        header: {
            click: function () {
                // Callback action
            }
        }
    }
```

## Recommended reading
We recommend reading our article on [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) for an overview of new options and possibilities, and also the [Changelog](https://www.highcharts.com/changelog/#highcharts-dashboards) for any breaking changes.
