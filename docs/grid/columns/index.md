---
sidebar_label: "Overview"
---

# Columns overview

Columns define how Grid renders headers, cells, layout, and per-column
interactions. Use `columnDefaults` to define shared behavior and `columns[]`
to override individual columns when needed.

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

The `columnDefaults` object defines shared options for all columns in the
Grid. The `columns[]` array is used to override those defaults or add
column-specific behavior where needed.

Most options in `columnDefaults` are mirrored 1:1 in `columns[]`.

## Styling and Theming

Use column-level classes, inline styles, and theme variables to control how
headers and body cells look. See
[Styling and Theming](https://www.highcharts.com/docs/grid/columns/styling-and-theming).

## Header

Headers can be configured per column with `columns[].header` or structurally
with the root `header[]` option for order, inclusion, and grouped headers.
See [Column headers](https://www.highcharts.com/docs/grid/columns/header).

## Grouping

Use grouped headers when several columns belong under a shared label.
Grouping is defined in the root `header[]` option and can be nested. See
[Column grouping](https://www.highcharts.com/docs/grid/columns/grouping).

## Width and resizing

Columns can use fixed widths, percentages, or automatic distribution, and end
users can optionally resize them from the header. See
[Column width and resizing](https://www.highcharts.com/docs/grid/columns/resizing-and-width).

## Sorting

Sorting can be enabled per column or globally, with support for initial
ordering, custom compare logic, and multicolumn sorting. See
[Column sorting](https://www.highcharts.com/docs/grid/columns/sorting).

## Filtering

Filtering adds popup or inline filter controls to individual columns, with
conditions based on each column's data type. See
[Column filtering](https://www.highcharts.com/docs/grid/columns/filtering).

## Cell formatting

Cell output is configured through `columns[].cells`, including template
formatting, formatter callbacks, and edit-mode behavior. See
[Cell formatting](https://www.highcharts.com/docs/grid/cells/formatting).

## Formatting

### Time formatting
Time formatting is handled by the [Intl.DateTimeFormat.prototype.format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format) and can be aware of the locale of the user.
Priority is given to the locale set in the `lang.locale` option, then the `lang` attribute of the closest parent is considered. If neither is set, the browser's locale is used.
To set the `locale`, use the `setOptions` method shown in the snippet below:

```js
Grid.setOptions({
    lang: {
        locale: 'en-US'
    }
});
```
To format dates and times, use one of [the supported formats](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat).
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

For more advanced formatting, the formatter callback function can be used.

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

The [dataType](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.ColumnOptions#dataType) option specifies how the Grid should interpret a column's values.
The data type determines how the cell content is rendered. For example, setting the type to boolean displays a check or cross symbol based on the value.

If this property is not defined, the data type is automatically inferred from the first cell in the column.

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/column-data-type?force-light-theme" allow="fullscreen"></iframe>

For more details on customizing cell content, refer to the [cell content section](https://www.highcharts.com/docs/grid/editing/renderers).
