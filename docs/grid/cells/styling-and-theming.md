---
sidebar_label: "Styling and Theming"
---

# Cell styling and theming

For cells, you can customize appearance in two ways:

1. Styling: CSS classes and per-cell style options.
2. Theming: CSS variables for reusable, global design.

## CSS classes

Use classes when you want style rules in CSS instead of inline configuration.

Relevant option:

1. `columns[].cells.className` for body cell classes.

```js
Grid.grid('container', {
    columns: [{
        id: 'score',
        cells: {
            className: 'score-cell'
        }
    }]
});
```

## Inline styles

Use `columns[].cells.style` for inline style configuration on body cells.

```js
Grid.grid('container', {
    columns: [{
        id: 'score',
        cells: {
            style: {
                textAlign: 'right',
                fontWeight: '600'
            }
        }
    }]
});
```

`cells.style` also supports callbacks. In callback form, `this` is the cell instance.

**Heat-map style color range example:**

```js
Grid.grid('container', {
    columns: [{
        id: 'score',
        cells: {
            style: function (cell) {
                const value = Number(cell.value);
                const min = 0;
                const max = 100;
                const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
                const hue = 120 - (120 * t); // green -> red

                return {
                    backgroundColor: 'hsl(' + hue + ' 80% 88%)',
                    color: '#1f2937',
                    fontWeight: '700'
                };
            }
        }
    }]
});
```

## Theming

Use theming when you want consistent styling for all cells and states through shared variables. You can also use conditional theming for specific rows or columns, but it is limited to string comparison.

1. [Theming overview](https://www.highcharts.com/docs/grid/theming/index)
2. [Conditional theming](https://www.highcharts.com/docs/grid/theming/conditional)
