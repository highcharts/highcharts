---
sidebar_label: "Filtering"
---

# Column filtering

Column filtering allows end users to narrow down visible rows by applying filter conditions to individual columns.

Each column filter operates independently. When multiple columns have active filters, only rows that satisfy **all** filter conditions are shown (logical **AND** across columns).

## Enabling filtering

Filtering is configured per column using the `filtering` option. By default, filtering is disabled.

You can enable filtering on individual columns:

```js
columns: [{
    id: 'price',
    filtering: {
        enabled: true
    }
}]
```

Or enable it for all columns using `columnDefaults`:

```js
columnDefaults: {
    filtering: {
        enabled: true
    }
}
```

Filtering can still be disabled for specific columns even when enabled globally.

## Filter UI modes

The Grid provides two user interface modes for column filtering.

### Popup mode (default)

By default, a filter icon is shown in the column header. Clicking the icon opens a popup where users can select a condition and enter a value.

This mode keeps the table compact and is suitable when filtering is used occasionally.

```js
columnDefaults: {
    filtering: {
        enabled: true,
    }
}
```

### Inline mode

When `inline` is set to `true`, filter controls are rendered in a dedicated row below the column headers. Filters are always visible and immediately accessible.

```js
columnDefaults: {
    filtering: {
        enabled: true,
        inline: true
    }
}
```

Inline mode works well for data-heavy tables where filtering is a primary interaction.

## Filter conditions by data type

Available filter conditions depend on the column’s `dataType`.
If not specified, the data type is inferred automatically.

### String columns

* `contains`
* `doesNotContain`
* `equals`
* `doesNotEqual`
* `beginsWith`
* `endsWith`
* `empty`
* `notEmpty`

```js
columns: [{
    id: "product",
    dataType: "string", // in most cases not needed
    filtering: {
        condition: "contains",
        value: "Apple"
    }
}]
```

### Number columns

* `equals`
* `doesNotEqual`
* `greaterThan`
* `greaterThanOrEqualTo`
* `lessThan`
* `lessThanOrEqualTo`
* `empty`
* `notEmpty`

```js
columns: [{
    id: "price",
    dataType: "number", // in most cases not needed
    filtering: {
        condition: "greaterThan",
        value: 2.0
    }
}]
```

### DateTime columns

* `equals`
* `doesNotEqual`
* `before`
* `after`
* `empty`
* `notEmpty`

```js
columns: [{
    id: "date",
    dataType: "datetime", // in most cases not needed
    filtering: {
        condition: "after",
        value: "2023-01-01"
    }
}]
```

### Boolean columns

* `all`
* `true`
* `false`
* `empty`

```js
columns: [{
    id: "inStock",
    dataType: "boolean",
    filtering: {
        enabled: true,
        condition: "equals",
        value: true
    }
}]
```

## Initial filters

You can define initial filter conditions and values in the grid configuration. These filters are applied immediately when the grid is rendered.

```js
columns: [{
    id: 'product',
    filtering: {
        enabled: true,
        condition: 'contains',
        value: 'Apple'
    }
}, {
    id: 'price',
    filtering: {
        enabled: true,
        condition: 'greaterThanOrEqualTo',
        value: 2
    }
}]
```

This example shows:

* A text filter on the `product` column
* A numeric filter on the `price` column
* Both filters applied together (AND logic)

## Mixing filter UI modes

You can mix inline and popup filtering across columns:

```js
columns: [{
    id: 'product',
    filtering: {
        enabled: true,
        inline: true
    }
}, {
    id: 'price',
    filtering: {
        enabled: true
        // popup mode
    }
}]
```

This allows you to prioritize frequently used filters while keeping others compact.

## Disabling filtering per column

Filtering can be disabled for specific columns even when enabled globally:

```js
columnDefaults: {
    filtering: {
        enabled: true
    }
},
columns: [{
    id: 'id',
    filtering: {
        enabled: false
    }
}]
```

The filtering UI will not be rendered for disabled columns.

## Programmatic filtering

Filters can also be controlled programmatically through the API.

```js
const grid = Highcharts.Grid('container', options);
const productColumn = grid.getColumn('product');

// Apply a filter
productColumn.filtering.set('Apple', 'contains');

// Clear the filter
productColumn.filtering.set();
```

This makes it easy to integrate column filtering with external UI controls, such as search fields or custom buttons.

## Filter events __grid_pro__

Filtering triggers two lifecycle events:

* **`beforeFilter`** – fired before filtering is applied
* **`afterFilter`** – fired after the grid has updated

```js
columnDefaults: {
    filtering: {
        enabled: true
    },
    events: {
        beforeFilter() {
            console.log('Filtering column:', this.id);
        },
        afterFilter() {
            console.log('Filter applied:', this.id);
        }
    }
}
```

These events can be used for logging, analytics, UI feedback etc.

## Summary

* Filtering is configured per column using `filtering`
* Multiple active filters are combined using AND logic
* UI can be inline or popup, and mixed per column
* Filter behavior depends on column data type
* Filters can be set initially or controlled programmatically

## Demo

This example creates a grid with filtering enabled for all columns through `columnDefaults`. The grid displays various fruit data with different data types including strings, numbers, booleans, and dates. The weight column has an initial filter set to show only items weighing more than 1000 units, demonstrating how to pre-configure filtering conditions. The grouped header structure shows how filtering works with complex column layouts.

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-filtering?force-light-theme" allow="fullscreen"></iframe>

