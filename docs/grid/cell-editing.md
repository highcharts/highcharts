---
tags: ["grid-pro"]
---

# Cell editing

Note: cell editing is not part of Highcharts Grid Lite, so refer to [install instructions](https://www.highcharts.com/docs/dashboards/grid-standalone) for the full version to enable this functionality.

End users can edit data in cells if cell editing is enabled by setting the `columnDefaults.cells.editable` and/or `columns[].cells.editable` API options:

```js
columnDefaults: {
    cells: {
      editable: true,
    },
},
columns: [
  {
    id: "firstName",
    cells: {
      editable: false,
    },
  },
],
```

In the example above cell editing is enabled for ALL columns, expect the `firstName` column. The reverse can be achived by not setting `columnDefaults` and `columns[].cells.editable: true` instead.

## The afterRender event

The `afterRender` event is called after a cell value is edited, and can be used to e.g. post result to server, generate feedback GUI etc:

```js
columnDefaults: {
  cells: {
    events: {
      afterRender: function () {
        console.log(`${this.column.id} for ${this.row.data.firstName} was updated to ${this.value}`);
      }
    }
  },
}
```

## Cell editing roadmap

Cell editing is currently in development, and API support for input validation and different input mechanisms (string, number, boolean etc.) will be released in Q3 2025.
