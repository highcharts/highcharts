---
sidebar_label: "Formatting"
---

# Cell formatting

Cell formatting is configured in `columnDefaults.cells` or `columns[].cells`.
Both options apply only to table body cells, not column headers.

## `format` vs `formatter`

Use `cells.format` when the output can be described with templating. Use
`cells.formatter` when the output depends on custom logic.

- `format`: A template string evaluated in the cell context.
- `formatter`: A callback function called with `this` bound to the cell.
- If neither option is set, Grid falls back to a default format based on the
  column `dataType`.

As in Highcharts Core, we recommend `format` when possible. Use `formatter`
when templating is not enough. Grid uses the same [templating engine as Core](https://www.highcharts.com/docs/chart-concepts/templating).

## Template-based formatting with `format`

`{value}` references the current cell value.

```js
Grid.grid('container', {
    columns: [{
        id: 'price',
        cells: {
            format: '${value:,.2f}'
        }
    }, {
        id: 'updatedAt',
        cells: {
            format: '{value:%Y-%m-%d}'
        }
    }]
});
```

You can also use other row values, expressions, and markup in the template
string:

```js
columns: [{
    id: 'firstName',
    cells: {
        format: '<a href="mailto:{row.data.email}">{value} {row.data.lastName}</a>'
    }
}, {
    id: 'salary',
    cells: {
        format: '<span class="salary">${(divide value 1000):.0f}k</span>'
    }
}]
```

See [Templating](https://www.highcharts.com/docs/chart-concepts/templating)
for the available syntax.

## Callback-based formatting with `formatter`

Use `formatter` for conditional logic, advanced markup, or cases where the
result depends on more than one cell property.

The callback is called with `this` bound to the cell instance, so you can use
properties such as `this.value`, `this.column`, `this.row`, and
`this.row.data`.

```js
Grid.grid('container', {
    columns: [{
        id: 'price',
        cells: {
            formatter: function () {
                const price = Number(this.value || 0);
                const discount = Number(this.row.data.discount || 0);
                const discountedPrice = price * (1 - discount / 100);

                if (!discount) {
                    return `$${price.toFixed(2)}`;
                }

                return (
                    `<span class="original">$${price.toFixed(2)}</span> ` +
                    `<strong>$${discountedPrice.toFixed(2)}</strong>`
                );
            }
        }
    }]
});
```

## Defaults and per-column overrides

Set shared formatting in `columnDefaults.cells`, and override it in
`columns[].cells` when a specific column needs different output.

```js
Grid.grid('container', {
    columnDefaults: {
        cells: {
            formatter: function () {
                return typeof this.value === 'number' ?
                    `<span class="box">${this.value}</span>` :
                    String(this.value ?? '');
            }
        }
    },
    columns: [{
        id: 'salary',
        cells: {
            format: '${(divide value 1000):.0f}k'
        }
    }]
});
```

In this example, the shared `formatter` applies to most columns, but the
`salary` column uses its own `format` instead.

## Related topics

For editable input behavior and built-in renderers, see
[Editing / Renderers](https://www.highcharts.com/docs/grid/editing/renderers).
