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
{
  columns: [
    {
      id: "price",
      cells: {
        className: "custom_cell_class",
        format: "${value}",
        editable: true
      }
    }
  ]
}
```

The `columns[].cells` option can configure the cells in individual columns. If needed, you can set defaults for all columns in `columnDefaults.cells`.

The end user can edit each cell in a column directly by setting the `editable` option to true. Read more in the [Cell editing](https://www.highcharts.com/docs/grid/cell-editing) article.

Note that `className` and `format` support templating as described in [Templating](https://www.highcharts.com/docs/chart-concepts/templating), and `{value}` references the cell value.

Suppose you need more advanced formatting that is not supported through templating. Use the `formatted` callback function instead. As in **Highcharts Core**, we always recommend `format` if possible. [Read more here...](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#formatter-callbacks)

## Width

Column widths in **Highcharts Grid** are controlled by the distribution strategy. This strategy, set through the [`rendering.columns.distribution`](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ColumnsSettings) option, defines how columns should be sized and how they behave when resizing the grid. The distribution can be explicitly set to `'mixed'`, `'full'`, or `'fixed'`. If not set, the grid automatically selects a suitable strategy based on column configuration.

### Default Strategy Selection

When `rendering.columns.distribution` is left `undefined`:

- **`'full'`** is automatically selected if **no columns** specify a `width` option.
- **`'mixed'`** is automatically selected if **at least one column** specifies a `width` option.

This automatic selection simplifies configuration, as specifying widths for columns immediately enables mixed distribution.

### Mixed Distribution Strategy (`'mixed'`)

Use the mixed distribution when you want explicit control over individual column widths:

- **Defined via**: each column’s `columns[].width` option:
  - **Number or a string ending in `px`**: interpreted as pixels
  - **String ending in `%`**: percentage of the table width
- **Behavior**:
  - Columns with defined `width` use their specified pixel or percentage value.
  - Columns without defined `width` evenly share the remaining space, respecting each column’s `minWidth`.
  - **Resizing**: Drag-resizing converts the widths of both the column to the left and the column to the right of the drag handle to fixed pixel values.

```js
Grid.grid('container', {
  rendering: {
    columns: {
      resizing: 'mixed'
    }
  },
  columns: [{
    id: 'product',
    width: 150 // static 150 px
  }, {
    id: 'price',
    width: '20%' // 20% of table
  }, {
    id: 'stock'
    // no width set, covers remaining space
  }],
  ...
});
```

### Full Distribution Strategy (`'full'`)

Use the full distribution when columns should proportionally fill the available table width:

- **Defined via**: initial measurement of columns using CSS, stored as a ratio. Equally distributed if not defined.
- **Behavior**:
  - All columns proportionally share table width based on their initial CSS-measured widths.
  - The **last column** fills remaining space (logs a warning if CSS widths exceed 100%).
  - **Resizing**: Adjusting one column resizes both it and the adjacent column proportionally, while other columns maintain their positions and proportions.

```css
.hcg-column[data-column-id="product"] {
    width: 50%;
}
```

### Fixed Distribution Strategy (`'fixed'`)

Use fixed distribution to keep columns at strictly defined widths:

- **Defined via**: single-time measurement using CSS (defaults to 100 px).
- **Behavior**:
  - Columns retain their initial set pixel widths.
  - **Resizing**: Only the dragged column changes width, causing columns to the right to be moved accordingly.

```css
.hcg-column[data-column-id="product"] {
    width: 200px;
}
```

### Custom Distribution Strategy

If the provided distribution strategies do not meet your requirements, you can define a custom distribution strategy. You can achieve this by either modifying an existing strategy through inheritance or creating a completely new one by extending the abstract column strategy.

See an example of extending the existing `'mixed'` distribution strategy.

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/custom-column-distribution" allow="fullscreen"></iframe>

## Sorting

```js
{
  columns: [
    {
      id: "weight",
      sorting: {
        sortable: true,
        order: "desc",
      }
    }
  ]
}
```

The optional `sorting` object consists of two configuration options:

- **`sortable`**: A boolean that determines whether the end user can sort a column by clicking on the column header.

- **`order`**: Specifies the initial sorting order for a column. It can be set to `'asc'` (ascending) or `'desc'` (descending). Only the last one will be considered if `order` is defined in multiple columns.

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
columns: [
    {
        id: 'date',
        header: {
            format: 'Date of purchase'
        },
        cells: {
            format: '{value:%[dbY]}'
        }
    }
    ...
]
```

For more advanced formatting the formatter callback function can be used.

### Number formatting

The number formatting is handled by [the template engine](https://www.highcharts.com/docs/chart-concepts/templating). The following example shows how to format numbers with thousands separators:

```js
columns: [
    {
        id: 'weight',
        className: 'custom-column-class-name',
        cells: {
            format: '{value:,.1f} kg'
        }
    }
    ...
]
