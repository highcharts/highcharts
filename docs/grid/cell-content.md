---
tags: ["grid-pro"]
---

# Cell content

The data type determines how the cell content is rendered.

Note: Customizing cell content is not part of Highcharts Grid Lite, so refer to [install instructions](https://www.highcharts.com/docs/dashboards/grid-standalone) for the full version to enable this functionality.

For example, setting the type to boolean displays a interactive checkbox based on the value.

<iframe src="https://www.highcharts.com/samples/embed/grid-pro/demo/cell-editing" allow="fullscreen"></iframe>

## Disabled interactions 

End users disable the interactivity of form fields by can by setting the `columnDefaults.cells.editMode.enabled` and/or `columns[].cells.editMode.enabled` API options:

```js
columnDefaults: {
    cells: {
      editMode: {
        enabled: true
      }
    }
}
columns: [
  {
    id: "columnName",
    cells: {
      editMode: {
        enabled: false
      }
    }
  }
]
```

## Rendering

In the [renderer](https://api.highcharts.com/dashboards/#interfaces/Grid_Options.ColumnOptions#renderer) API option you can customize content of the cell, based on dataType.

For instance, you can display string data as a select.

```js
{
    dataType: 'string',
    renderer: {
        type: 'select',
        options: [
            { value: 'NO', label: 'Norway' },
            { value: 'NL', label: 'Netherlands' },
            { value: 'PL', label: 'Poland' },
            { value: 'EC', label: 'Ecuador' },
        ]
    }
}
```

## Events
Cell content supports basic event handling triggered by end-user interactions with controls such as `checkbox` and `select`.

The following example demonstrates how to define and use event callbacks within the events object:

```js
dataType: 'boolean',
renderer: {
    type: 'checkbox',
    events: {
        change: function () {
            console.log('Cell`s value', this.value);
        }
    }
}
```
