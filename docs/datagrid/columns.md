Column options in the Datagrid
===
The DataGrid allows you to configure and apply some options, that can be useful
for your requirements.

### How to format cell
The [cellFormat](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormat) or [cellFormatter](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormatter) allow you to customize the column's content.


```js
columns: {
  yourColumnName: {
      cellFormatter: function () {
          return 'V: ' + this.value;
      }
  },
  yourColumnName2: {
    cellFormat: '<h3>{value}</h3>'
  }
```

### How to edit cell
Each cell in column can be edited on the fly (by user). Set the [editable](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#editable) option for column or for all columns

```js

defaults: {
    columns: {
        editable: true
    }
}
```

### Events
The DataGrid supports event listeners that can be added to the column [events]() object, which will call callback functions when editing the cell or column.

The available events are:

 - `cell`
    - `click` - called after click on a cell,
    - `mouseOver` - called after mouse over a cell,
    - `mouseOut` - called after mouse out a cell
    - `afterEdit` - called after a cell was edited
 - `column`
    - `afterSorting` - called after sorting column
    - `resize` - called after resizing column
 - `header`
    - `click` - called after a click on column's header

Example:
```js
events: {
  cell: {
    afterEdit: function () {
      // your action
    }
  },
  column: {
    resize: function () {
      // your action
    }
  },
  header: {
    click: function () {
      // your action
    }
  }
}
```