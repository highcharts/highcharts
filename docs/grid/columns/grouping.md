---
sidebar_label: "Grouping"
---

# Column grouping

Column grouping lets you organize columns under shared, higher-level headers. Grouped columns are defined using the root `header[]` option and can span multiple columns and multiple rows.

All general header configuration described in the [article on column headers](https://www.highcharts.com/docs/grid/column/headers), including formatting, classes, accessibility options, precedence rules etc., also applies when using grouped columns.

![An illustration showing a header group](ill_header.png)

## How column grouping works

Column grouping is defined by nesting headers inside the `header[]` option.

A column group header:

* Has no `columnId`
* Defines a label (for example via `format`)
* Contains a `columns[]` array with child headers

Child headers can be:

* Column IDs (strings)
* Header objects referencing a column (`columnId`)
* Other group headers (allowing unlimited nesting)

## Basic grouping example

```js
header: [{
    format: 'Product',
    columns: [
        'name'
    ]
}, {
    format: 'Details',
    columns: [
        'price',
        'stock'
    ]
}]
```

This produces two top-level headers:

* **Product**, spanning the `name` column
* **Details**, spanning `price` and `stock`

## Multi-level grouping

Groups can be nested to create multiple header rows. Leaf headers inside a group can be defined either as column IDs (strings) or as objects, allowing you to customize labels and other header options inline.

```js
header: [{
    format: 'Product',
    columns: [
        'name'
    ]
}, {
    format: 'Nutrition',
    columns: [{
        format: 'Vitamins',
        columns: [
            { columnId: 'vitamin_a', format: 'Vitamin A (IU)' },
            { columnId: 'vitamin_c', format: 'Vitamin C (mg)' }
        ]
    }, {
        format: 'Minerals',
        className: 'highlight',
        columns: [
            'iron',
            'calcium'
        ]
    }]
}]
```

In this example:

* The **Nutrition** header spans multiple subgroups
* **Vitamins** and **Minerals** form the second header row
* The **Minerals** header has a custom CSS class name
* **Vitamin A** and **Vitamin C** use object syntax to provide clearer labels
* String entries (`'iron'`, `'calcium'`) use default header behavior

This demonstrates how grouping defines structure, while still allowing inline customization where helpful.

## Order and exclusion

When using `header[]` for grouping:

* The order of entries defines the rendered column order
* Any column not referenced anywhere in the `header[]` tree is excluded from rendering

This applies to both grouped and ungrouped headers.

## Mixing grouping with per-column header configuration

Header grouping defines **structure only**. You can still configure individual leaf headers using `columns[].header` (or `columnDefaults.header`) for formatting, classes, and accessibility.

If the same column is configured in both places, the per-column configuration takes precedence.

## Key takeaways

* Header grouping is defined exclusively via `header[]`
* Groups are created by nesting `columns[]`
* Group headers have no `columnId`
* Grouping supports unlimited depth
* All standard header options and rules still apply

## Demo

<iframe src="https://www.highcharts.com/samples/embed/grid/basic/grouped-headers?force-light-theme" allow="fullscreen"></iframe>

