Column filters in the Datagrid
===
The DataGrid allows you to set the filtering option per column. The basic one is sorting.

You have three states of sorting:
1 - default
2 - descending
3 - ascending

When you click on the header, it triggers the next state in order to the current one.


### Filters
The [sorting]() option is available in the `columns`.

```js
defaults: {
    columns: {
        sorting: true
    }
},
```

Applies sorting to all columns. However, you can define the option only for a particular column.

```js
columns: {
  yourColumnName: {
    sorting: true
  }
}
```

### Events
The DataGrid supports event listeners that can be added to the column [events]() object, which will call callback functions when filtering the cell or column.

Example:
```js
events: {
  column: {
    afterSorting: function () {
      // your action
    }
  }
}
```

<iframe src="https://www.highcharts.com/samples/embed/data-grid/demo/filters" allow="fullscreen"></iframe>