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
            sortable: false
        }
    },
    columns: [
        {
            id: "product",
            sorting: {
                sortable: true
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

Column widths in **Highcharts Grid** are controlled via the `column.width` option. You can specify widths in pixels (e.g. `150`) or percentages (e.g. `'20%'`). If left `undefined`, the column will expand to fill any remaining space.

Example:
```ts
columns: [{
    id: 'product',
    width: 150 // fixed at 150px
}, {
    id: 'price',
    width: '20%' // 20% of the table width
}, {
    id: 'stock'
    // no width set - occupies remaining space
}]
```

### Column resizing

End users can resize columns by dragging the handle on the right edge of each header. There are two main [resizing modes](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ResizingOptions#mode):

- **`mixed`**: Adjusts both the column being resized and its neighbor to maintain overall table width.
- **`fixed`**: Only the dragged column changes width; columns to the right shift position accordingly.
- ~~**`full`**~~ (deprecated): Behaves like `mixed` when no columns have explicit widths; slated for removal in the next major release.

> **Note:** Resizing mode names will be updated to more descriptive terms in the forthcoming major version (breaking change incoming).

To disable column resizing entirely, set [`resizing.enabled`](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ResizingOptions#enabled) to `false`.


## Sorting
```js
columns: [{
    id: "weight",
    sorting: {
        sortable: true,
        order: "desc",
        compare: (a, b) => ... // optionally, custom sorting logic
    }
}]
```

The optional `sorting` object consists of three configuration options:

- **`sortable`**: A boolean that determines whether the end user can sort a column by clicking on the column header.

- **`order`**: Specifies the initial sorting order for a column. It can be set to `'asc'` (ascending) or `'desc'` (descending). Only the last one will be considered if `order` is defined in multiple columns.

- **`compare`**: Custom compare function to sort the column values. If not set, the default sorting behavior is used. It should return a number indicating whether the first value (`a`) is less than (`-1`), equal to (`0`), or greater than (`1`) the second value (`b`).

See the [API reference](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.ColumnOptions#sorting).

When the `sortable` option is enabled, clicking the header will toggle the sorting order.

The sorting options are available for individual columns, but the default value for `sortable` can also be set in `columnDefaults.sorting.sortable`.

Alternatively, you can programmatically sort a column using the `column.sorting.setOrder` method, even if the sortable option is turned off.

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