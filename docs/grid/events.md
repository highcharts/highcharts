---
tags: ["grid-pro"]
---

# Events

**Highcharts Grid Pro** supports event listeners that are triggered when interacting with the grid. Events are configured at different levels depending on their scope:

- **Grid-level events** are configured in the `events` property at the root of grid options
- **Column-level events** are configured in `columnDefaults.events` or `columns[].events`
- **Cell events** are configured in `columnDefaults.cells.events` or `columns[].cells.events`
- **Header events** are configured in `columnDefaults.header.events` or `columns[].header.events`
- **Pagination events** are configured in `pagination.events`

## Grid-level events

Configured in `events` at the root of grid options:

| **Event Name**         | **Description**                                               | **Function Context**  |
|------------------------|---------------------------------------------------------------|-----------------------|
| `beforeLoad`           | Triggered before the grid is fully loaded for the first time. | `this: Grid`          |
| `afterLoad`            | Triggered after the grid is fully loaded for the first time.  | `this: Grid`          |
| `beforeUpdate`         | Triggered before grid options are updated. | `this: Grid`          |
| `afterUpdate`          | Triggered after grid options are updated. | `this: Grid`          |
| `beforeRedraw`         | Triggered before the grid DOM is redrawn. Only fired when `update()` is called with `redraw = true` or when `redraw()` is called directly. | `this: Grid`          |
| `afterRedraw`          | Triggered after the grid DOM is redrawn. Only fired when `update()` is called with `redraw = true` or when `redraw()` is called directly. | `this: Grid`          |

## Column-level events

Configured in `columnDefaults.events` or `columns[].events`:

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterResize`      | Triggered after resizing a column.                       | `this: Column`        |
| `beforeSort`       | Triggered before sorting a column.                       | `this: Column`        |
| `afterSort`        | Triggered after sorting a column.                        | `this: Column`        |
| `beforeFilter`     | Triggered before filtering a column.                     | `this: Column`        |
| `afterFilter`      | Triggered after filtering a column.                      | `this: Column`        |

## Cell events

Configured in `columnDefaults.cells.events` or `columns[].cells.events`:

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `afterEdit`        | Triggered after a cell's value is edited.                | `this: Cell`          |
| `afterRender`      | Triggered after setting a cell's value (init/edit)       | `this: Cell`          |
| `click`            | Triggered after clicking on a cell.                      | `this: Cell`          |
| `dblClick`         | Triggered after double-clicking on a cell.               | `this: Cell`          |
| `mouseOver`        | Triggered when the mouse is hovered over a cell.         | `this: Cell`          |
| `mouseOut`         | Triggered when the mouse leaves a cell.                  | `this: Cell`          |

## Header events

Configured in `columnDefaults.header.events` or `columns[].header.events`:

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `click`            | Triggered after clicking on a column header.             | `this: Column`        |
| `afterRender`      | Triggered after init of a column header.                 | `this: Column`        |

## Pagination events

Configured in `pagination.events`:

| **Event Name**     | **Description**                                          | **Function Context** |
|--------------------|----------------------------------------------------------|-----------------------|
| `beforePageChange` | Triggered before a page change occurs.                   | `this: Pagination`    |
| `afterPageChange`  | Triggered after a page change occurs.                    | `this: Pagination`    |
| `beforePageSizeChange` | Triggered before the page size setting changes.      | `this: Pagination`    |
| `afterPageSizeChange`  | Triggered after the page size setting changes.       | `this: Pagination`    |

# Examples

## Grid-level events

Grid-level events are configured at the root `events` property:

```js
{
    events: {
        beforeLoad: function () {
            console.log('Grid loading started.');
        },
        afterLoad: function () {
            console.log('Grid finished loading and is ready to use.');
        },
        beforeUpdate: function (e) {
            console.log('Grid update started with options:', e.options);
        },
        afterUpdate: function (e) {
            console.log('Grid update finished with options:', e.options);
        },
        beforeRedraw: function () {
            console.log('Grid DOM redraw started.');
        },
        afterRedraw: function () {
            console.log('Grid DOM redraw finished.');
        }
    }
}
```

## Column-level events

Column-level events can be configured in `columnDefaults.events` (applies to all columns) or in individual column definitions:

```js
{
    columnDefaults: {
        events: {
            afterResize: function () {
                console.log('Column resized:', this.id);
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
        }
    },
    columns: [{
        id: 'columnId',
        events: {
            afterResize: function () {
                // Override default for this specific column
            }
        }
    }]
}
```

## Cell events

Cell events can be configured in `columnDefaults.cells.events` (applies to all cells in all columns) or in individual column definitions:

```js
{
    columnDefaults: {
        cells: {
            events: {
                afterEdit: function () {
                    console.log('Cell value edited:', this);
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
        }
    },
    columns: [{
        id: 'columnId',
        cells: {
            events: {
                click: function () {
                    // Override default for this specific column's cells
                }
            }
        }
    }]
}
```

## Header events

Header events can be configured in `columnDefaults.header.events` (applies to all headers) or in individual column definitions:

```js
{
    columnDefaults: {
        header: {
            events: {
                click: function () {
                    console.log('Header clicked:', this.id);
                },
                afterRender: function () {
                    console.log('Header rendered:', this.id);
                }
            }
        }
    },
    columns: [{
        id: 'columnId',
        header: {
            events: {
                click: function () {
                    // Override default for this specific column's header
                }
            }
        }
    }]
}
```

## Pagination events

Pagination events are configured in `pagination.events`:

```js
{
    pagination: {
        enabled: true,
        events: {
            beforePageChange: function (e) {
                console.log('Page changing from', e.currentPage, 'to', e.nextPage);
            },
            afterPageChange: function (e) {
                console.log('Page changed to', e.currentPage);
            },
            beforePageSizeChange: function (e) {
                console.log('Page size changing from', e.pageSize, 'to', e.newPageSize);
            },
            afterPageSizeChange: function (e) {
                console.log('Page size changed to', e.pageSize);
            }
        }
    }
}
```

Live example:
<iframe src="https://www.highcharts.com/samples/embed/grid/basic/cell-events?force-light-theme" allow="fullscreen"></iframe>
