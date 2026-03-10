---
sidebar_label: "Formatting"
---

# Cell formatting

Cell content is configured with `columns[].cells`, or shared across all
columns through `columnDefaults.cells`.

Use `cells.format` for template-based formatting and `cells.formatter` for
callback-based formatting.

## Basic configuration

```js
Grid.grid('container', {
    columnDefaults: {
        cells: {
            format: '{value}'
        }
    },
    columns: [{
        id: 'price',
        cells: {
            className: 'price-cell',
            format: '${value}',
            editMode: {
                enabled: true
            }
        }
    }]
});
```

`columnDefaults.cells` defines shared cell options for every column, while
`columns[].cells` overrides them for individual columns.

In addition to formatting, the `cells` object is also where you configure
options such as `className`, `style`, and `editMode`.

## Template formatting

Use `cells.format` when the output can be expressed with templating. This is
the recommended approach when possible.

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

`format` supports the same template syntax used elsewhere in Highcharts. In a
cell template, `{value}` references the cell value.

See [Templating](https://www.highcharts.com/docs/chart-concepts/templating)
for the available formatting syntax.

## Callback formatting

Use `cells.formatter` when you need formatting logic that cannot be expressed
through templating.

```js
Grid.grid('container', {
    columns: [{
        id: 'delta',
        cells: {
            formatter() {
                return this.value > 0 ?
                    '<span class="positive">+' + this.value + '</span>' :
                    String(this.value);
            }
        }
    }]
});
```

As in Highcharts Core, `format` is usually preferred when it is sufficient.

## Editable cells

Cell formatting and editing are often configured together. Enable direct cell
editing with `cells.editMode.enabled`.

```js
columns: [{
    id: 'price',
    cells: {
        format: '${value}',
        editMode: {
            enabled: true
        }
    }
}]
```

For editable input behavior and built-in renderers, see
[Editing / Renderers](https://www.highcharts.com/docs/grid/editing/renderers).
