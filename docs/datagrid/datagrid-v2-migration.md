Upgrade DataGrid to v2
===
The core of DataGrid has been changed in the version 2.0. We increased the peformance, flexibility and added accessibility support. It means that API options have been changed and definition of styles or data source are different. We described all changes below. 

## Data source
In the newest DataGrid, the data source definition has been redesigned. It is a critical upgrade, so please double-check if everything is configured properly.

DataGrid v1
```js
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({ columns })
});
```

DataGrid v2
```js
const grid = DataGrid.dataGrid('container', {
    table: new DataTable({
        columns
    })
});
```

or

```js
const grid = DataGrid.dataGrid('container', {
    table: {
        columns: { ... }
    }
});
```

## Columns
It is worth to mantion that the `useHTML` parameter has been moved to the `columns` object.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#useHTML).

## Styling
The main change is CSS styling instead of the build-in API options.

Since DataGrid v2 we removed the option:
 * cellHeight

so, you if you want to change the default height by CSS:

```css
.highcharts-datagrid-row[data-row-index="1"] td {
  height: 150px;
}
```

The next main change is a new naming of CSS classes.
We recommend to read our [article about styling](https://www.highcharts.com/docs/datagrid/style-by-css) the DataGrid 2.0.

## Example of the new DataGrid

```js
    table: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    defaults: {
        columns: {
            editable: true,
            sorting: true
        }
    },
    settings: {
        columns: {
            distribution: 'full'
        },
        rows: {
            bufferSize: 10,
            strictHeights: false
        }
    }
    columns: {
        weight: {
            className: 'custom-column-class-name',
            cellFormatter: function () {
                return 'V: ' + this.value;
            }
        },
        metaData: {
            enabled: false
        }
    },
    events: {
        cell: {
            click: function () {
                // Callback action
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
            resize: function () {
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

### Defaults
The options applied to all columns.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.DataGridDefaults).

### Settings
Options to control the way DataGrid is rendered.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.DataGridSettings).

### Columns
Column options that are applied individually.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html).

### Events
Events applied to column, column header or a cell.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#events).

## Changelog
The rest of changes and new options you can find in the Changelog.