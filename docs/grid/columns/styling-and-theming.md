---
sidebar_label: "Styling and Theming"
---

# Column styling and theming

For columns, you can customize appearance in two ways:

1. Styling: CSS classes and per-column style options.
2. Theming: CSS variables for reusable, global design.

## CSS classes

Use classes when you want to keep visual rules in your stylesheet.

Relevant options:

1. `columns[].className` for the whole column (header and body cells).
2. `columns[].header.className` for header-only classes.

```js
Grid.grid('container', {
    columns: [{
        id: 'price',
        className: 'col-price',
        header: {
            className: 'col-price-header'
        }
    }]
});
```

## Inline styles

Use `style` when you need inline styles from configuration.

Relevant options:

1. `columns[].style`: base style for header and body cells in the column.
2. `columns[].header.style`: header-only override for that column.

```js
Grid.grid('container', {
    columns: [{
        id: 'stock',
        style: {
            textAlign: 'right',
            fontWeight: '600'
        },
        header: {
            style: {
                backgroundColor: '#1f2937',
                color: '#ffffff'
            }
        }
    }]
});
```

`style` also supports callbacks for dynamic behavior. In callback form, `this` is the column instance:

```js
columns: [{
    id: 'delta',
    style: function (column) {
        return column.dataType === 'number' ?
            { fontWeight: '700' } :
            { fontWeight: '200' };
    }
}]
```

## Theming

Use theming when you want consistent design across the whole grid or theme classes instead of per-column exceptions. You can also use conditional theming, but it is limited to string comparison.

1. [Theming overview](https://www.highcharts.com/docs/grid/theming/index)
2. [Conditional theming](https://www.highcharts.com/docs/grid/theming/conditional)
