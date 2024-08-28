Understanding DataGrid
===

The DataGrid is a tool that can help you visualize your data in a table.

![datagrid.png](datagrid.png)

Defaults
---------
Default options for all columns.

```js
columnDefaults: {
    editable: true
}
```

For more information on `columnDefaults` options see the [API reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.Options-1#columnDefaults).

Caption
---------

The caption of the datagrid grid.

```js
caption: {
    text: 'Title of the DataGrid'
}
```

For more information on `caption` options see the [API reference](http://localhost:9005/dashboards/#interfaces/DataGrid_Options.Options-1#caption).

Header
---------

The [table header](https://api.highcharts.com/dashboards/#classes/DataGrid_DataGridTableHeader) is a special row, always on the top, containing the column IDs.
Cells in the `header` are called `headerCell`. Their contents can be edited using the
[`headerFormat` option](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#headerFormat).

The API allows you to group headers into sections.
You can find more information about in our [Columns article](/docs/dashboards/columns).

Row
---------

Represents a [row](https://api.highcharts.com/dashboards/#classes/DataGrid_DataGridRow.DataGridRow-1) in the data grid.

```js
settings: {
    rows: {
        bufferSize: 5,
        strictHeights: true
    }
}
```

For more information on row settings see the [API reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.RowsSettings).

Column resizer
---------

Allows you to resize the entire [column](https://api.highcharts.com/dashboards/#classes/DataGrid_DataGridColumn.DataGridColumn-1). The functionality is enabled by default,
but you can disable it in the [settings option](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnsSettings).

```js
settings: {
    columns: {
        resizable: false
    }
}
```

For more information on the column resizer see the [API reference](https://api.highcharts.com/dashboards/#classes/DataGrid_Actions_ColumnsResizer.ColumnsResizer).

Column
---------

Represents a column in the data grid. Options for a column often apply to all of the cells it contains. See the [column options API docs](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html).

```js
columnDefaults: {
    useHTML: true
},
columns: [{
    id: 'column1',
    cellFormat: '<h3>{value}</h3>'
}, {
    id: 'column2',
    cellFormatter: function () {
        return '<a href="' + this.value + '">URL</a>';
    }
}]
```

For more information on the column element see the [API reference](https://api.highcharts.com/dashboards/typedoc/classes/DataGrid_DataGridColumn.DataGridColumn-1.html).


Cell
---------

The basic element in the DataGrid can be formatted by [`cellFormat`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormat) or [`cellFormatter`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormatter).
You can also set the [`useHTML`](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#useHTML) option and apply the custom HTML in formatters.

For more information on the cell element see the [API reference](https://api.highcharts.com/dashboards/typedoc/classes/DataGrid_DataGridCell.DataGridCell-1.html).


Value editor
---------

Allows you to edit the main value of the cell.

```js
columnDefaults: {
    editable: true
}
```

Click on a cell and change the value.

If you declared `cellFormatter` or `cellFormat` props, it will be applied to the
new value.

For more information on cell options see the [API reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#editable).
