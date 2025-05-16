---
tags: ["grid-pro"]
---

# Events

The Grid supports event listeners that can be added to the [columnDefaults.events](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.Options-1#columnDefaults) object or a particular column. These listeners will call functions when interacting with the Grid.

Please note that the [events](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.IndividualColumnOptions.html#events) has been deprecated.

The available events are:

## cell

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterRender`      | Triggered after setting a cell's value (init/edit).      | `this: Cell`          |
| `afterSetValue`    | Deprecated. Use `afterRender` instead.                   | `this: Cell`          |
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
columnDefaults: {
  events: {
    afterResize: function () {
      console.log('Column resized:', this);
    },
    afterSorting: function () {
      console.log('Column sorted:', this);
    }
  },
  cells: {
    events: {
      afterRender: function () {
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
    }
  },
  header: {
    events: {
      click: function () {
        console.log('Header clicked:', this);
      }
    }
  }
}
```

You can also declare all events to the dedicated column:

```js
columns: [{
  id: 'columnId',
  events: {
    afterResize: function () {
      // callback
    }
  }
  cell: {
    events: {
      click: function () {
        // callback
      }
    }
  },
  header: {
    events: {
      click: function () {
        // callback
      }
    }
  }
}]
```

Live example:
<iframe src="https://www.highcharts.com/samples/embed/grid-pro/basic/cell-events" allow="fullscreen"></iframe>
