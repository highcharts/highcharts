# Events

The DataGrid supports event listeners that can be added to the column [events](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#events) object which will call functions when editing the cell or column.

The available events are:

## cell

- `afterEdit` - called after a cell was edited
- `afterSetValue` - called after setting a cell value
- `click` - called after click on a cell,
- `dblClick` - called after double click on a cell,
- `mouseOver` - called after mouse over a cell,
- `mouseOut` - called after mouse out a cell

## column

- `afterResize` - called after resizing a column
- `afterSorting` - called after sorting a column

## header

- `click` - called after a click on a column header

Example:

```js
events: {
  cell: {
    afterEdit: function () {
      // your action
    }
  },
  column: {
    afterResize: function () {
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
