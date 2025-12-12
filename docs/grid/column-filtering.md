# Column Filtering

Column filtering in Highcharts Grid allows users to filter data based on specific conditions and values for each column. This powerful feature enhances data exploration and helps users focus on relevant information within large datasets.

## Basic setup

To enable column filtering, you need to set the `filtering.enabled` option to `true` for the columns you want to make filterable.

```js
{
    columns: [{
        id: "price",
        filtering: {
            enabled: true
        }
    }]
}
```

## Filtering Interface

Column filtering supports two different interface modes:

### Inline Filtering

When `inline` is set to `true`, filter inputs are rendered directly in a special header row below the column headers.

```js
{
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    }
}
```

### Popup Filtering

When `inline` is set to `false` (default), a filter icon is rendered in the column header, and clicking it opens a popup with the filtering interface.

```js
{
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: false
        }
    }
}
```

## Filtering Conditions by Data Type

The available filtering conditions depend on the column's data type. Highcharts Grid automatically detects the data type if possible, but you can also explicitly set it using the `dataType` option.

### String Columns

String columns support text-based filtering conditions:

| **Condition** | **Description** |
|---------------|-----------------|
| `contains` | Values that contain the specified text |
| `doesNotContain` | Values that do not contain the specified text |
| `equals` | Values that exactly match the specified text |
| `doesNotEqual` | Values that do not exactly match the specified text |
| `beginsWith` | Values that start with the specified text |
| `endsWith` | Values that end with the specified text |
| `empty` | Empty or null values (no value required) |
| `notEmpty` | Non-empty values (no value required) |

```js
{
    columns: [{
        id: "product",
        dataType: "string",
        filtering: {
            enabled: true,
            condition: "contains",
            value: "Apple"
        }
    }]
}
```

### Number Columns

Number columns support numeric comparison conditions:

| **Condition** | **Description** |
|---------------|-----------------|
| `equals` | Values equal to the specified number |
| `doesNotEqual` | Values not equal to the specified number |
| `greaterThan` | Values greater than the specified number |
| `greaterThanOrEqualTo` | Values greater than or equal to the specified number |
| `lessThan` | Values less than the specified number |
| `lessThanOrEqualTo` | Values less than or equal to the specified number |
| `empty` | Empty or null values (no value required) |
| `notEmpty` | Non-empty values (no value required) |

```js
{
    columns: [{
        id: "price",
        dataType: "number",
        filtering: {
            enabled: true,
            condition: "greaterThan",
            value: 2.0
        }
    }]
}
```

### DateTime Columns

DateTime columns support date-based filtering conditions:

| **Condition** | **Description** |
|---------------|-----------------|
| `equals` | Values equal to the specified date |
| `doesNotEqual` | Values not equal to the specified date |
| `before` | Values before the specified date |
| `after` | Values after the specified date |
| `empty` | Empty or null values (no value required) |
| `notEmpty` | Non-empty values (no value required) |

```js
{
    columns: [{
        id: "date",
        dataType: "datetime",
        filtering: {
            enabled: true,
            condition: "after",
            value: "2023-01-01"
        }
    }]
}
```

### Boolean Columns

Boolean columns support boolean-specific filtering conditions:

| **Condition** | **Description** |
|---------------|-----------------|
| `all` | Show all values (no filtering) |
| `true` | Show only true values |
| `false` | Show only false values |
| `empty` | Show only empty or null values |

```js
{
    columns: [{
        id: "inStock",
        dataType: "boolean",
        filtering: {
            enabled: true,
            condition: "equals",
            value: true
        }
    }]
}
```

## Advanced Configuration

### Setting Initial Filter Values

You can set initial filter conditions and values when configuring the grid:

```js
{
    columns: [{
        id: "product",
        filtering: {
            enabled: true,
            condition: "contains",
            value: "Apple"
        }
    }, {
        id: "price",
        filtering: {
            enabled: true,
            condition: "greaterThanOrEqualTo",
            value: 2.0
        }
    }, {
        id: "inStock",
        filtering: {
            enabled: true,
            condition: "equals",
            value: true
        }
    }]
}
```

### Mixed Interface Modes

You can use different interface modes for different columns:

```js
{
    columns: [{
        id: "product",
        filtering: {
            enabled: true,
            inline: true,
            condition: "contains",
            value: "Apple"
        }
    }, {
        id: "price",
        filtering: {
            enabled: true,
            condition: "greaterThan",
            value: 2.0
        }
    }]
}
```

### Disabling Filtering for Specific Columns

You can disable filtering for specific columns while keeping it enabled globally:

```js
{
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    columns: [{
        id: "id",
        filtering: {
            enabled: false
        }
    }]
}
```

## Events __grid_pro__

Column filtering supports two events that you can use to respond to filtering actions:

### beforeFilter

Triggered before filtering is applied to the data:

```js
{
    columnDefaults: {
        filtering: {
            enabled: true
        },
        events: {
            beforeFilter: function () {
                console.log('About to filter column:', this.id);
            }
        }
    }
}
```

### afterFilter

Triggered after filtering has been applied and the grid has been updated:

```js
{
    columnDefaults: {
        filtering: {
            enabled: true
        },
        events: {
            afterFilter: function () {
                console.log('Column filtered:', this.id);
            }
        }
    }
}
```

## Programmatic Filtering

You can also control filtering programmatically using the column's filtering methods:

```js
// Get the grid instance
const grid = Highcharts.Grid('container', options);

// Get a specific column
const productColumn = grid.getColumn('product');

// Set a filter programmatically
productColumn.filtering.set('Apple', 'contains');

// Clear a filter
productColumn.filtering.set();
```

## Example

Here's a complete example showing column filtering in action:

```js
{
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    columns: [{
        id: 'weight',
        filtering: {
            condition: 'greaterThan',
            value: 1000
        }
    }]
}
```

This example creates a grid with filtering enabled for all columns through `columnDefaults`. The grid displays various fruit data with different data types including strings, numbers, booleans, and dates. The weight column has an initial filter set to show only items weighing more than 1000 units, demonstrating how to pre-configure filtering conditions. The grouped header structure shows how filtering works with complex column layouts.

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-filtering?force-light-theme" allow="fullscreen"></iframe>
