---
tags: ["grid-pro"]
---

# Events

**Highcharts Grid Pro** supports event listeners that can be added to the [columnDefaults.events](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.Options#columnDefaults) object or a particular column. These listeners will call functions when interacting with the grid.

Please note that the root [events property](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.IndividualColumnOptions.html#events) has been deprecated.

The available events are:

## grid

| **Event Name**         | **Description**                                               | **Function Context**  |
|------------------------|---------------------------------------------------------------|-----------------------|
| `beforeLoad`           | Triggered before the grid is fully loaded for the first time. | `this: Grid`          |
| `afterLoad`            | Triggered after the grid is fully loaded for the first time.  | `this: Grid`          |
| `beforeUpdate`         | Triggered before the grid is updated.                         | `this: Grid`          |
| `afterUpdate`          | Triggered after the grid is updated.                          | `this: Grid`          |

## cell

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterEdit`        | Triggered after a cell's value is edited.                | `this: Cell`          |
| `afterRender`      | Triggered after setting a cell's value (init/edit)       | `this: Cell`          |
| `click`            | Triggered after clicking on a cell.                      | `this: Cell`          |
| `dblClick`         | Triggered after double-clicking on a cell.               | `this: Cell`          |
| `mouseOver`        | Triggered when the mouse is hovered over a cell.         | `this: Cell`          |
| `mouseOut`         | Triggered when the mouse leaves a cell.                  | `this: Cell`          |

## column

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterResize`      | Triggered after resizing a column.                       | `this: Column`        |
| `beforeSort`       | Triggered before sorting a column.                       | `this: Column`        |
| `afterSort`        | Triggered after sorting a column.                        | `this: Column`        |
| `beforeFilter`     | Triggered before filtering a column.                     | `this: Column`        |
| `afterFilter`      | Triggered after filtering a column.                      | `this: Column`        |

## header

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `click`            | Triggered after clicking on a column header.             | `this: Column`        |
| `afterRender`      | Triggered after init of a column header.                 | `this: Column`        |

## pagination

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `beforePageChange` | Triggered before a page change occurs.                   | `this: Pagination`    |
| `afterPageChange`  | Triggered after a page change occurs.                    | `this: Pagination`    |
| `beforePageSizeChange` | Triggered before the page size setting changes.      | `this: Pagination`    |
| `afterPageSizeChange`  | Triggered after the page size setting changes.       | `this: Pagination`    |

# Example

Here is a sample code that demonstrates how to use these event callbacks in the `events` object:

```js
{
    events: {
        beforeLoad: function () {
            console.log('Grid loading started.');
        },
        afterLoad: function () {
            console.log('Grid finished loading and is ready to use.');
        },
        beforeUpdate: function () {
            console.log('Grid update started.');
        },
        afterUpdate: function () {
            console.log('Grid update finished.');
        }
    },
    columnDefaults: {
        events: {
            afterResize: function () {
                console.log('Column resized:', this);
            },
            beforeSort: function () {
                console.log('Before sorting column:', this.id);
            },
            afterSort: function () {
                console.log('After sorting column:', this.id);
            },
            beforeFilter: function () {
                console.log('Before filtering column:', this.id);
            },
            afterFilter: function () {
                console.log('After filtering column:', this.id);
            }
        },
        cells: {
            events: {
                afterEdit: function () {
                    console.log('Cell value set:', this);
                },
                afterRender: function () {
                    console.log('Cell value:', this);
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
    },
    cells: {
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

Pagination events are configured at the grid level:

```js
pagination: {
    enabled: true,
    events: {
        beforePageChange: function (e) {
            // callback
        },
        afterPageChange: function (e) {
            // callback
        },
        beforePageSizeChange: function (e) {
            // callback
        },
        afterPageSizeChange: function (e) {
            // callback
        }
    }
}
```

Live example:
<iframe src="https://www.highcharts.com/samples/embed/grid/basic/cell-events?force-light-theme" allow="fullscreen"></iframe>
