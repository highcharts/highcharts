# Pagination

Pagination in Highcharts Grid enables you to split large datasets into manageable pages, improving performance and user experience. When enabled, pagination displays a subset of data at a time with navigation controls, making it easier to browse through extensive datasets without overwhelming the user interface.

Alternatively, you can use row [Virtualization](https://www.highcharts.com/docs/grid/performance#performance-and-rendering), which renders only the rows currently visible in the viewport, enabling smooth, continuous scrolling through extensive datasets without dividing them into pages.

## Basic setup

To enable pagination in your Grid, you can use either `pagination: true` for default settings or `pagination.enabled: true` for custom configuration:

```js
// Using default settings
Grid.grid('container', {
    dataTable: {
        columns: {
            product: ["Apple", "Pear", "Orange", "Banana", "Grape", "Mango"],
            weight: [182, 178, 150, 120, 85, 200],
            price: [3.5, 2.5, 3, 2.2, 4.1, 3.8]
        }
    },
    pagination: true
});

// Using custom configuration
Grid.grid('container', {
    dataTable: {
        columns: {
            product: ["Apple", "Pear", "Orange", "Banana", "Grape", "Mango"],
            weight: [182, 178, 150, 120, 85, 200],
            price: [3.5, 2.5, 3, 2.2, 4.1, 3.8]
        }
    },
    pagination: {
        enabled: true,
        pageSize: 3
    }
});
```

## Defaults

When you set `pagination: true`, the Grid uses the following default configuration:

```js
pagination: {
    enabled: true,
    pageSize: 10,
    position: 'bottom',
    controls: {
        pageSizeSelector: {
            enabled: true,
            options: [10, 20, 50, 100]
        },
        pageInfo: {
            enabled: true
        },
        firstLastButtons: {
            enabled: true
        },
        previousNextButtons: {
            enabled: true
        },
        pageButtons: {
            enabled: true,
            count: 5
        }
    }
}
```

These defaults provide a complete pagination experience with all controls enabled, allowing users to navigate through pages, change page sizes, and see page information.

## Configuration options

The pagination object supports several configuration options to customize its behavior and appearance:

```js
pagination: {
    enabled: true,
    pageSize: 25,
    position: 'bottom',
    controls: {
        pageSizeSelector: {
            enabled: true,
            options: [10, 25, 50, 100]
        },
        pageInfo: {
            enabled: true
        },
        firstLastButtons: {
            enabled: true
        },
        previousNextButtons: {
            enabled: true
        },
        pageButtons: {
            enabled: true,
            count: 5
        }
    }
}
```

### Page size

The `pageSize` option determines how many rows are displayed per page. The default value is `10`, but you can set it to any positive integer that suits your data and user interface requirements.

### Position

The `position` option controls where the pagination controls are displayed relative to the grid:

- **`'bottom'`** (default): Pagination controls appear below the grid
- **`'top'`**: Pagination controls appear above the grid
- **`'footer'`**: Pagination controls are integrated into the table footer
- **`'#container'`**: Pagination controls are rendered in the custom HTML element, that has defined id

Example:

```html
<div id="grid-container"></div>
<div id="custom-pagination-container"></div>
```

```js
{
    pagination: {
        enabled: true,
        position: '#custom-pagination-container'
    }
}
```

### Controls

The `controls` object allows you to configure which pagination elements are displayed:

#### Page size selector

The `pageSizeSelector` enables users to choose how many items to display per page. It can be set as a boolean or an object:

```js
// Using boolean (default settings)
pageSizeSelector: true         // Default options: [10, 20, 50, 100]

// Using object (custom settings)
pageSizeSelector: {
    enabled: true,
    options: [10, 25, 50, 100]
}
```

#### Page information

The `pageInfo` displays current page information, such as "Page 1 of 5". It can be set as a boolean or an object:

```js
// Using boolean (default settings)
pageInfo: true                 // Shows page information

// Using object (custom settings)
pageInfo: {
    enabled: true
}
```

#### Navigation buttons

Control the visibility of navigation buttons. Each control can be set as a boolean (for default settings) or as an object (for custom configuration):

```js
    // Using boolean values (default settings)
    firstLastButtons: true,        // First/Last page buttons
    previousNextButtons: true,     // Previous/Next page buttons
    pageButtons: true              // Page number buttons (default count: 5)

    // Using object configuration (custom settings)
    firstLastButtons: {
        enabled: true              // First/Last page buttons
    },
    previousNextButtons: {
        enabled: true              // Previous/Next page buttons
    },
    pageButtons: {
        enabled: true,
        count: 5                   // Number of page number buttons to show
    }
```

## Public API Methods

The pagination instance provides several public methods that allow you to programmatically control pagination behavior:

### goToPage(pageNumber)

Navigates to a specific page in the grid.

```js
// Navigate to page 3
grid.pagination.goToPage(3);
```

**Parameters:**
- `pageNumber` (number): The page number to navigate to (starts from 1)

**Example:**
```js
const grid = Grid.grid('container', {
    pagination: { enabled: true }
});

// Navigate to page 2
await grid.pagination.goToPage(2);
```

### setPageSize(newPageSize)

Changes the number of items displayed per page.

```js
// Set page size to 25 items per page
grid.pagination.setPageSize(25);
```

**Parameters:**
- `newPageSize` (number): The new number of items to display per page

**Example:**
```js
const grid = Grid.grid('container', {
    dataTable: { /* your data */ },
    pagination: { enabled: true }
});

// Change page size to 50 items per page
await grid.pagination.setPageSize(50);
```

**Note:** When changing the page size, the pagination automatically resets to the first page.

## Events (Grid Pro)

Highcharts Grid Pro provides pagination events that allow you to respond to page changes and page size modifications. These events include:

- `beforePageChange`: Fired before a page change occurs
- `afterPageChange`: Fired after a page change occurs
- `beforePageSizeChange`: Fired before the page size setting changes
- `afterPageSizeChange`: Fired after the page size setting changes

For detailed information about pagination events and how to use them, see the [Events article](https://www.highcharts.com/docs/grid/events).

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/pagination?force-light-theme" allow="fullscreen"></iframe>
