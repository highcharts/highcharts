---
sidebar_label: "Formatting"
---

# Cell formatting

Use `cells.format` for template-based formatting and `cells.formatter` for callback-based formatting.

```js
Grid.grid('container', {
    columns: [{
        id: 'price',
        cells: {
            format: '${value}'
        }
    }, {
        id: 'updatedAt',
        cells: {
            format: '{value:%Y-%m-%d}'
        }
    }]
});
```

For editable input behavior, see [Editing / Renderers](https://www.highcharts.com/docs/grid/editing/renderers).
