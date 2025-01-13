# Columns options

Many of the available configuration options in DataGrid apply to the columns and their corresponding row and header cells.

## Defaults

```js
{
    columnDefaults: {
        cells: {
            editable: true
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

The ' columnDefaults ' object defines default options for all columns in the DataGrid, such as the column sorter, column resizer, value editor, cell format, etc., and the `columns[]` array of objects can be used to override defaults in selected columns if needed.

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

You can exclude the column, including its header, from the DataGrid by setting `enabled` to false. For an alternative approach to header configuration, including grouped headers, see the [article on Header](https://www.highcharts.com/docs/datagrid/header).

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

The end user can edit each cell in a column directly by setting the `editable` option to true.

Note that `className` and `format` support templating as described in [Templating](https://www.highcharts.com/docs/chart-concepts/templating), and `{value}` references the cell value.

Suppose you need more advanced formatting that is not supported through templating. Use the `formatted` callback function instead. As in **Highcharts Core**, we always recommend `format` if possible. [Read more here...](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#formatter-callbacks)

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

See the [API reference](https://api.highcharts.com/dashboards/#interfaces/DataGrid_Options.ColumnOptions#sorting).

When the `sortable` option is enabled, clicking the header will toggle the sorting order.

The sorting options are available for individual columns, but the default value for `sortable` can also be set in `columnDefaults.sorting.sortable`.

Alternatively, you can programmatically sort a column using the `column.sorting.setOrder` method, even if the sortable option is turned off.
