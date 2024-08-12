Column options in the Datagrid
===
The DataGrid provides flexible configuration options to meet your specific needs.
for your requirements.

## Defaults
By default, the options from the [Defaults](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridDefaults) property are applied to all columns.
For instance, you can set sorting or editing cells in columns instead of applying an option in each column separately.

```js
defaults: {
  columns: {
    editable: true
  }
}
```

## Column header
In column options, use the [headerFormat](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#headerFormat) to customize the name of the column that is rendered in the header.

```js
columns: {
  column1: {
    headerFormat: 'Custom header text'
  }
}
```

## How to format cells
The [cellFormat](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormat) or [cellFormatter](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.ColumnOptions#cellFormatter) allow you to customize the column content.


```js
columns: {
  column1: {
    cellFormatter: function () {
        return 'V: ' + this.value;
    }
  },
  column2: {
    cellFormat: '{value}$'
  }
```

### How to edit cells
Every cell in a column can be edited on the fly (by user). Set the column option to [editable](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#editable).

```js
columns {
  column1: {
    editable: true
  }
}
```

You can also use the [Defaults](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridDefaults) property

## Events
The DataGrid supports event listeners that can be added to the column [events](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#events) object which will call functions when editing the cell or column.

The available events are:

 - `cell`
    - `click` - called after click on a cell,
    - `mouseOver` - called after mouse over a cell,
    - `mouseOut` - called after mouse out a cell
    - `afterEdit` - called after a cell was edited
 - `column`
    - `afterSorting` - called after sorting a column
    - `resize` - called after resizing a column
 - `header`
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

## Sorting
The DataGrid allows you to set the filtering option per column. The basic one is sorting.

You have three states of sorting:
 * 1 - default
 * 2 - descending
 * 3 - ascending

When you click on the header, it triggers the next state in order to the current one.

The [sorting](https://api.highcharts.com/dashboards/typedoc/interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#sorting) option is available in the `columns`.

```js
columns: {
  column1: {
    sorting: true
  }
}
```

You can apply sorting to all columns by the [Defaults]() option as described in the first point.

```js
defaults {
  columns: {
     sorting: true
  }
}
```

