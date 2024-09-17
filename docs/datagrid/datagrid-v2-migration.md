Upgrade DataGrid to v3
===
The core of DataGrid has been changed in version 3.0. We have increased the performance and flexibility while adding accessibility support. This means that API options have been changed and the definition of styles or data source are different. We outline all of the changes below.

## Factory function
The factory function `DataGrid.DataGrid` has been replaced with `DataGrid.dataGrid`.

## Data source
In the newest DataGrid, the data source definition has been redesigned. This is a critical upgrade, so please double-check if everything is configured properly.

DataGrid v2.x.x requires you to create a new instance of the DataTable class.
```js
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({ columns })
});
```

DataGrid v3.0.0 and higher allows to define the data source in the `dataTable` option without creating a new instance of the DataTable class.  
The grid will automatically create a new instance of the DataTable class for you.

```js
const grid = DataGrid.dataGrid('container', {
    dataTable: {
        columns: { ... }
    }
});
```

## Styling
The main change is CSS styling instead of the built-in API options.

Since Dashboards v3.0, we have removed the following option from the DataGrid:
 * `cellHeight`

so if you want to change the default height by CSS:

```css
.highcharts-datagrid-row[data-row-index="1"] td {
  height: 150px;
}
```

The next main change is a new naming of CSS classes.
We recommend reading our [article about styling the DataGrid in Dashboards v3.0 and higher](https://www.highcharts.com/docs/datagrid/style-by-css).

## Example of the new DataGrid

```js
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
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
            formatter: function () {
                return 'V: ' + this.value;
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

            },
            mouseOver: function () {
                // Callback action
            },
            mouseOut: function () {
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

### Column Defaults
The options applied to all columns.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.Options-1#columnDefaults).

### Rendering
Options to control the way datagrid is rendered.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.Options-1#rendering).

### Columns
Column options that are applied individually.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.Options-1#columns).

### Events
Events applied to column, column header, or a cell.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.Options-1#events).

## Changelog
The rest of changes and new options you can be found in [the Changelog.](https://www.highcharts.com/changelog/#highcharts-dashboards)