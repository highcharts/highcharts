# Columns options

Many of the available configuration options in Grid apply to the columns and their corresponding row and header cells.

## Defaults

```js
{
    columnDefaults: {
        cells: {
            format: "<span>{value}</span>"
        },
        sorting: {
            enabled: false
        }
    },
    columns: [
        {
            id: "product",
            sorting: {
                enabled: true
            }
        }
    ]
}
```

The ' columnDefaults ' object defines default options for all columns in the Grid, such as the column sorter, column resizer, value editor, cell format, etc., and the `columns[]` array of objects can be used to override defaults in selected columns if needed.

Note that most options in `columnDefaults` are mirrored 1:1 in the `columns[]` array of objects.

## Header

```js
{
  columns: [
    {
      id: "product",
      header: {
        className: "custom_header_class",
        format: "Fruit ({id})"
      },
      enabled: false,
    }
  ]
}
```

The `columns[].header` option can be used to configure the header for individual columns. If needed, you can set defaults for all columns in `columnDefaults.header`.

Note that `className` and `format` support templating as described in [Templating](https://www.highcharts.com/docs/chart-concepts/templating), and `{id}` references the key in the DataTable.

Suppose you need more advanced formatting that is not supported through templating. Use the `formatted` callback function instead. As in Highcharts Core, we always recommend `format` if possible. [Read more here...](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#formatter-callbacks)

You can exclude the column, including its header, from the Grid by setting `enabled` to false. For an alternative approach to header configuration, including grouped headers, see the [article on Header](https://www.highcharts.com/docs/grid/header).

## Cells

```js
columns: [{
    id: "price",
    cells: {
        className: "custom_cell_class",
        format: "${value}",
        editMode: {
            enabled: true
        }
    }
}]
```

The `columns[].cells` option can configure the cells in individual columns. If needed, you can set defaults for all columns in `columnDefaults.cells`.

The end user can edit each cell in a column directly by setting the `editMode.enabled` option to true. Read more in the [Cell editing](https://www.highcharts.com/docs/grid/cell-editing) article.

Note that `className` and `format` support templating as described in [Templating](https://www.highcharts.com/docs/chart-concepts/templating), and `{value}` references the cell value.

Suppose you need more advanced formatting that is not supported through templating. Use the `formatted` callback function instead. As in **Highcharts Core**, we always recommend `format` if possible. [Read more here...](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#formatter-callbacks)


## Width

Column widths are configured using the `columns[].width` option. Widths can be
defined as pixels (e.g. `150` or `'150px'`), percentages (e.g. `'20%'`), or
`'auto'`. Percentage values are always calculated relative to the **total table
width**.

A width of `'auto'` is equivalent to an undefined width, but it takes
precedence over `columnDefaults.width`.

### Example 1

```js
columns: [{
    id: 'column_1',
    width: 150 // fixed at 150px
}, {
    id: 'column_2',
    width: '20%' // 20% of the table width
}, {
    id: 'column_3' // no width, so expands to share remaining space
}]
```

### Example 2

```js
columnDefaults: {
    width: 50 // all columns will be 50px wide
},
columns: [{
    id: 'column_1' // no width set, take the default value (50px)
}, {
    id: 'column_2',
    width: 'auto' // opt out of the default and take remaining space
}]
```

### Column resizing

End users can resize columns by dragging the handle on the right edge of each header. There are three main [resizing modes](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ResizingOptions#mode):

- **`adjacent`**: Adjusts both the column being resized and its neighbor, so the columns to the right remain in their original positions.
- **`independent`**: Only the column being resized changes its width; columns to the right are shifted and their widths become fixed in pixels.
- **`distributed`**: Only the column being resized is directly affected. Other columns without a fixed width automatically adjust to fill the remaining space, so the overall table layout is preserved.

To disable column resizing entirely, set [`resizing.enabled`](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ResizingOptions#enabled) to `false`.

Try out [this interactive sample](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/column-resizing/) to see how the different column resizing modes work in practice.

## Sorting
```js
columns: [{
    id: "weight",
    sorting: {
        enabled: true,
        order: "desc",
        compare: (a, b) => ... // optionally, custom sorting logic
    }
}]
```

The optional `sorting` object consists of four configuration options:

- **`enabled`**: A boolean that determines whether the end user can sort a column by clicking on the column header.

- **`order`**: Specifies the initial sorting order for a column. It can be set to `'asc'` (ascending) or `'desc'` (descending).

- **`priority`**: Sets the priority of the column when sorting is defined for multiple columns, where lower numbers have higher priority (1 is primary, 2 is secondary, and so on). When no priority is set, the last column in the options list with `sorting.order` becomes the primary sort.

    ```js
    columns: [{
        id: "group",
        sorting: {
            order: "asc",
            priority: 2 // secondary sort
        }
    }, {
        id: "score",
        sorting: {
            order: "asc",
            priority: 1 // primary sort
        }
    }]
    ```

- **`compare`**: Custom compare function to sort the column values. If not set, the default sorting behavior is used. It should return a negative number if `a < b`, `0` if `a === b`, and a positive number if `a > b`.

See the [API reference](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.ColumnOptions#sorting).

When the `enabled` option is `true`, clicking the header will toggle the sorting order.

To build a multi-column sort, hold Shift while clicking additional headers. The order is shown as a priority indicator when more than one column is active. You can also set multi-column sorting programmatically, where the order in the array determines the priority (the first element is the primary sort):

```js
grid.setSorting([
    { columnId: "group", order: "asc" }, // priority 1
    { columnId: "score", order: "asc" } // priority 2
]);
```

The sorting options are available for individual columns, but the default value for `enabled` can also be set in `columnDefaults.sorting.enabled`.

Alternatively, you can programmatically sort a column using the `column.sorting.setOrder` method, even when `enabled=false`.

## Filtering
Column filtering in Highcharts Grid allows users to filter data based on specific conditions and values for each column. This feature enhances data exploration and helps users focus on relevant information within large datasets.

The main options include:
* `enabled`: Set to `true` to activate filtering for the column.
* `inline`: Set to `true` to render filter inputs directly in the header row, or `false` (default) to use a popup interface.
* `condition`: The initial filtering condition (e.g., 'contains', 'equals', 'greaterThan').
* `value`: The initial filter value to apply.

```js
columns: [{
    id: "product",
    filtering: {
        enabled: true,
        inline: true,
        condition: "contains",
        value: "Apple"
    }
}]
```

The `columns[].filtering` property can be used to enable/disable filtering, configure the filtering interface (inline or dropdown), and set initial filter conditions for individual columns. Use `columnDefaults.filtering` to set the default configuration for all columns.

For more information on filtering options and events, see the [Column filtering article](https://www.highcharts.com/docs/grid/column-filtering) or the [API reference](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ColumnFilteringOptions).

## Formatting

### Time formatting
Time formatting is handled by the [Intl.DateTimeFormat.prototype.format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format) and can be aware of the locale of the user.
Priority is given to the locale set in the `lang.locale` option, next the lang attribute of the closes parent is considered. But if that is not set, the browser's locale is used.
To set the `locale` use the `setOptions` method shown in the snippet below:

```js
Grid.setOptions({
    lang: {
        locale: 'en-US'
    }
});
```
To properly format the time use one of [the supported formats](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat)
For example:
```js
columns: [{
    id: 'date',
    header: {
        format: 'Date of purchase'
    },
    cells: {
        format: '{value:%[dbY]}'
    }
}, ...]
```

For more advanced formatting the formatter callback function can be used.

### Number formatting

The number formatting is handled by [the template engine](https://www.highcharts.com/docs/chart-concepts/templating). The following example shows how to format numbers with thousands separators:

```js
columns: [{
    id: 'weight',
    className: 'custom-column-class-name',
    cells: {
        format: '{value:,.1f} kg'
    }
}, ...]
```

## Data type

The [dataType](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.ColumnOptions#dataType) specifies the type of the column (`string`, `number`, `boolean` or `date`).
The data type determines how the cell content is rendered. For example, setting the type to boolean displays a check or cross symbol based on the value.

If this property is not defined, the data type is automatically inferred from the first cell in the column.

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-data-type?force-light-theme" allow="fullscreen"></iframe>

For more details on customizing cell content, refer to the [cell content section](https://www.highcharts.com/docs/grid/cell-renderers).
