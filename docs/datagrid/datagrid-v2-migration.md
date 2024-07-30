Upgrade DataGrid to v2
===
The core of DataGrid has been changed in the version 2.0. We increased the peformance, flexibility and added accessibility supoort. It means that API options have been changed and definition of styles or data source are different. We described all changes below. 

### Data source
In the newest DataGrid, the data source definition has been redesigned. It is a critical upgrade, so please double-check if everything is configured properly.

v1
```js
const grid = new DataGrid.DataGrid('container', {
    dataTable: new DataGrid.DataTable({ columns })
});
```

v2
```js
const grid = DataGrid.dataGrid('container', {
    table: new DataTable({
        columns
    })
});
```

### Columns
The `useHTML` parameter has been moved to the `columns` object.

You can find more information in our [API Reference](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#useHTML).

### Styling
The name of CSS classes have been also changed. We recommend to read our [article about styling](https://www.highcharts.com/docs/datagrid/style-by-css) the DataGrid 2.0.

### Changelog
The rest of changes and new options you can find in the Changelog.