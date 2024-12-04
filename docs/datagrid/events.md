# Events

The DataGrid supports event listeners that can be added to the [events](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.IndividualColumnOptions.html#events) object. These listeners will call functions when interacting with the DataGrid.

The available events are:

## cell

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterEdit`        | Triggered after a cell's value is edited.                | `this: Cell`          |
| `afterSetValue`    | Triggered after setting a cell's value (init/edit).      | `this: Cell`          |
| `click`            | Triggered after clicking on a cell.                      | `this: Cell`          |
| `dblClick`         | Triggered after double-clicking on a cell.               | `this: Cell`          |
| `mouseOver`        | Triggered when the mouse is hovered over a cell.         | `this: Cell`          |
| `mouseOut`         | Triggered when the mouse leaves a cell.                  | `this: Cell`          |

## column

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterResize`      | Triggered after resizing a column.                       | `this: Column`        |
| `afterSorting`     | Triggered after sorting a column.                        | `this: Column`        |

## header

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `click`            | Triggered after clicking on a column header.             | `this: Column`        |

# Example

Here is a sample code that demonstrates how to use these event callbacks in the `events` object:

```js
events: {
  cell: {
    afterEdit: function () {
      console.log('Cell edited:', this);
    },
    afterSetValue: function () {
      console.log('Cell value set:', this);
    },
    click: function () {
      console.log('Cell clicked:', this);
    },
    dblClick: function () {
      console.log('Cell double-clicked:', this);
    },
    mouseOver: function () {
      console.log('Mouse over cell:', this);
    },
    mouseOut: function () {
      console.log('Mouse out of cell:', this);
    }
  },
  column: {
    afterResize: function () {
      console.log('Column resized:', this);
    },
    afterSorting: function () {
      console.log('Column sorted:', this);
    }
  },
  header: {
    click: function () {
      console.log('Header clicked:', this);
    }
  }
}
```

Live example:
<iframe src="https://www.highcharts.com/samples/embed/data-grid/basic/cell-events" allow="fullscreen"></iframe>
