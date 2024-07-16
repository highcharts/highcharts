Understanding DataGrid
===

The DataGrid is a tool that can help you to vizualize your data in a table.

![datagrid.png](datagrid.png)

Defaults
---------
Default options for the all rows or all columns.

```
    defaults: {
        columns: {
            editable: true
        }
    }
```

For more information on defaults options see the [API reference]().

Caption
---------

The caption of the datagrid grid.

```
    caption: {
        text: 'Your title of datagrid'
    }
```

For more information on caption options see the [API reference]().

Head
---------

The table's header row containing the column names.


Row
---------

Represents a row in the data grid.

```
    defaults: {
        rows: {
            bufferSize: 5
        }
    }
```

For more information on caption options see the [API reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.CaptionOptions.html).

Column resizer
---------

Allows you to resize the entire column. The functionality is enabled by default,
but you can disable it in the settings option.

```
    settings: {
        columns: {
            resizing: false
        }
    }
```

For more information on resizer options see the [API reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.ColumnsSettings.html#resizing).

Cell
---------

The basic element on the DataGrid, can be formatted by `cellFormat` or `cellFormatter`.
You can also set the `useHTML` option and apply the custom HTML in formatters.

```
    defaults: {
        columns: {
            useHTML: true
        }
    },
    columns: {
        column1: {
            cellFormat: '<h3>{value}</h3>'
        },
        column2: {
            cellFormatter: function () {
                return '<a href="' + this.value + '">URL</a>';
            }
        }
    }
```

For more information on column options see the [API reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html).

Value editor
---------

Allows you to edit the main value of the cell.

```
    defaults: {
        columns: {
            editable: true
        }
    }
```

Click on a cell and change the value.

If you declared `cellFormatter` or `cellFormat` props, it will be applied to the
new value.

For more information on cell options see the [API reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#editable).