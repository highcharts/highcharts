# Upgrade DataGrid from v2.x.x to a newer version
The core of DataGrid has been changed in version 3.0. We have improved the performance and flexibility while adding accessibility support. This means API options and the definition of styles or data sources differ from the previous version. We outline all of the changes below.

## Data source
DataGrid v3.0 and higher allows you to define the data source in the `dataTable` option without creating a new instance of the `DataTable` class.  
If you do not provide your instance, the datagrid will automatically create a new instance of the `DataTable` class.

```js
const grid = DataGrid.dataGrid('container', {
    dataTable: {
        columns: { ... }
    }
});
```

## API changes
Some API options have been renamed or removed. For the full list, make sure to check the [API reference](https://api.highcharts.com/dashboards/).

## Styling
All styling is now done via CSS instead of the built-in API options.

Since v3.0, we have removed the `cellHeight` option from the DataGrid, and the following example shows how to adjust the height for the rows in `thead` and `tbody`, respectively, and also how to override height in selected rows:

```css
.highcharts-datagrid-table thead tr {
    height: 70px;
}

.highcharts-datagrid-table tbody tr {
    height: 50px;
}

.highcharts-datagrid-table tbody tr[data-row-index="0"] {
    height: 150px;
}
```
We recommend reading our [Style by CSS article](https://www.highcharts.com/docs/datagrid/style-by-css) for information on more CSS naming changes and tips on styling the DataGrid.

## Example of the new DataGrid

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
We recommend reading our article on [Understanding DataGrid](https://www.highcharts.com/docs/datagrid/understanding-datagrid) for an overview of new options and possibilities, and also the [Changelog](https://www.highcharts.com/changelog/#highcharts-dashboards) for any breaking changes.
