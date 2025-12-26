---
sidebar_label: "Headers"
---

# Column headers

Grid headers are generated from DataTable column IDs by default, and you can customize headers in two places:

* **Per column:** `columns[].header` (and defaults in `columnDefaults.header`)
* **At the root:** `header[]` (for order, inclusion/exclusion, grouping, and per-header options)

## Two ways to configure a header

You can configure individual header cells either:

1. **Globally via `header[]`**
   Each entry can be a string (column ID) or an object (for example `columnId`, `format`, `className`, accessibility options). This is useful when you also want to control **order** and ensure you explicitly include all visible columns.

2. **Per column via `columns[].header`**
   This is useful when you want to keep header structure simple and attach header configuration directly to a column.

Important: **If you use `header[]`, include all column IDs you want rendered**. Any column not referenced in `header[]` will be excluded.

### Example A: Configure headers using `header[]`

This example sets `format` and `className` for one column using `header[]`. The rest of the columns, except `discount`, are listed as strings to ensure they remain included.

```js
{
  dataTable: {
    columns: {
      price: [...],
      product: [...],
      stock: [...],
      discount: [...]
    }
  },
  header: [
    // Configure one header cell here:
    { columnId: 'price', format: 'Price (NOK)', className: 'hc-price' },

    // Include product and stock, but exclude discount:
    'product',
    'stock'
  ],
}
```

### Example B: Configure headers using `columns[].header`

This produces the same visual result as Example A, but moves the header configuration into `columns[].header`.

```js
{
  dataTable: {
    columns: {
      price: [...],
      product: [...],
      stock: [...],
      discount: [...]
    }
  },
  columns: [{
    id: 'price',
    header: {
      format: 'Price (NOK)',
      className: 'hc-price'
    }
  },{
    id: 'discount',
    enabled: false
  }]
}
```

## Header formatting

`className` and `format` support templating as described in [Templating](https://www.highcharts.com/docs/chart-concepts/templating), and `{id}` references the key in the DataTable.

If you need more advanced formatting that is not supported through templating, use the `formatter` callback function instead. As in Highcharts Core, we recommend `format` when possible. [Read more here...](https://www.highcharts.com/docs/chart-concepts/)

## Disabling the header

You can disable rendering of the entire header row by setting `rendering.header.enabled` to `false`. When disabled, no header cells are rendered, regardless of any configuration in `header[]` or `columns[].header`. Note that `header[]` can still be used for column exclusion and order.

This option applies globally and is part of the rendering configuration, since it affects the overall table layout.

### Example

```js
{
  rendering: {
      header: {
          enabled: false
      }
  },
  header: ['price', 'stock', 'product']
}
```

This is useful for:

* Compact or minimal table layouts
* Read-only or decorative grids
* Cases where column meaning is already conveyed elsewhere

### Accessibility considerations

Disabling headers removes semantic column headers from the table. This can negatively impact accessibility, particularly for screen reader users, who rely on headers to understand the relationship between cells and columns.

If headers are disabled:

* Ensure column meaning is conveyed through other accessible means (for example, surrounding text, captions, or ARIA labels)
* Avoid disabling headers in data-dense or interactive tables where column context is important
* In most cases, keeping headers enabled is recommended for accessibility.

## Precedence

When a column header is configured in both `header[]` and `columns[].header`, the configuration in `columns[].header` takes precedence.

This allows `header[]` to define the **overall structure** (order, inclusion, grouping), while `columns[].header` can safely be used to override or fine-tune the appearance and behavior of individual headers.

For example, if both specify a `format` for the same column, the value from `columns[].header` will be used.

## Summary

* Use **`header[]`** when you want to control **order**, ensure explicit **inclusion**, or prepare for **grouping**, and still want to customize header text/classes inline.
* Use **`columns[].header`** when you prefer header settings to live with the column definition (especially when column configuration is already centralized).
