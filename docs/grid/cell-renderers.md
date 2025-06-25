---
tags: ["grid-pro"]
---

# Cell renderers

The data type determines how the cell content is rendered.

Note: Customizing cell content is not part of Highcharts Grid Lite, so refer to [install instructions](https://www.highcharts.com/docs/dashboards/grid-standalone) for the full version to enable this functionality.

Highcharts Grid supports different cell renderers to provide interactive data presentation inside table cells. You can define the renderer property for each column in the `columns[].cells` configuration object to specify how each cell should be displayed or interacted with.

Renderers can be used to control how values are displayed `cells.renderer` and how they behave in [edit mode](https://www.highcharts.com/docs/grid/cell-editing) `cells.editMode.renderer`. This allows you to, for example, show plain text by default and present a checkbox or input field when a cell becomes editable.

## Renderers types

In the [renderer](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ColumnOptions#renderer) API option, you can set the default cell renderer for view and edit modes. If not specified, it is determined by the `dataType` option.

Some renderers can be used specifically as cell edit mode renderers, which is recommended because they also support [validation](https://www.highcharts.com/docs/grid/cell-editing#validation) in such cases.
For example, you can render a date as text in view mode, and use the `dateInput` renderer only when the cell is in edit mode.

| Renderer Key | Description | Edit Mode |
|---|---|---|
| [`checkbox`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_CheckboxRenderer.CheckboxRenderer-1) | Checkbox input element | ✅ |
| [`dateInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_DateInputRenderer.DateInputRenderer-1) | Date input element | ✅ |
| [`select`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_SelectRenderer.SelectRenderer-1) | Select element | ✅ |
| [`sparkline`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_SparklineRenderer.SparklineRenderer-1) | Highcharts minified chart | ❌ |
| [`text`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_TextRenderer.TextRenderer-1) | Text or custom static html content, default for most data types | ❌ |
| [`textInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_TextInputRenderer.TextInputRenderer-1) | Text input element | ✅ |

### Text input
Renders an editable text field for the value. It can also render static HTML elements. This is the default renderer for most cases.

```js
{
    id: 'username', // column id
    dataType: 'string',
    cells: {
        renderer: {
            type: 'input'
        },
        editable: true
    }
}
```

### Checkbox input
Renders a native checkbox input element.

```js
{
    id: 'active', // column id
    dataType: 'boolean',
    cells: {
        renderer: {
            type: 'checkbox'
        }
    }
}
```

### Date input
Renders a native date input that supports HTML datepicker.

```js
{
    id: 'date_date', // column id
    dataType: 'datetime',
    cells: {
        renderer: {
            type: 'dateInput'
        }
    }
}
```

### Select
Renders a dropdown select menu for predefined options.

```js
{
    id: 'country', // column id
    dataType: 'string',
    cells: {
        renderer: {
            type: 'select',
            options: [
                { value: 'NO', label: 'Norway' },
                { value: 'NL', label: 'Netherlands' },
                { value: 'PL', label: 'Poland' },
                { value: 'EC', label: 'Ecuador' }
            ]
        }
    }
}
```

### Sparkline
Renders an inline miniature chart (e.g. bar, line) inside a cell using Highcharts.

You can configure chart by the `chartOptions` API option, that supports all Highcharts configurations.

```js
{
    id: 'trend', // column id
    cells: {
        renderer: {
            type: 'sparkline',
            chartOptions: {
                chart: {
                    type: 'bar'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        },
                        negativeColor: "#f00"
                    }
                }
            }
        }
    }
}
```

Please note that you should include the `highcharts.js` file before including the Grid library. If you do it the other way around, or use ES Modules, you should connect Highcharts manually using: `Grid.CellRendererRegistry.types.sparkline.useHighcharts(Highcharts);`

Go to [Sparkline](https://www.highcharts.com/docs/grid/sparkline) to read more about Grid Sparkline structure and configuration options.


## Writing custom renderers

You can also write a custom renderer. To do so, define:

1. A class for the specific Cell Content (it should extend the abstract [`CellContent`](https://api.highcharts.com/grid/#classes/Grid_Core_Table_CellContent_CellContent.CellContent) or [`CellContentPro`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_CellContentPro.CellContentPro) class). It must implement lifecycle methods: `add`, `update`, `delete`.

    ```ts
    class CustomCellContent extends CellContentPro {

        constructor(cell: TableCell, renderer: CustomCellRenderer) {
            super(cell, renderer);
            this.add();
        }

        protected override add(): void {
            // create your content here
        }

        public override update(): void {
            // update your content here, when the cell value has changed
        }

        public override dalete(): void {
            // remove the element from DOM, clear event listeners, etc.
        }

    }
    ```

2. A class representing your Renderer, which inherits from the abstract [`CellRenderer`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_CellRenderer.CellRenderer-1) class. It should implement:
    - `options` – an abstract property holding the renderer’s unique configuration options
    - `render` – a method that creates and returns a new instance of CellContent

    ```ts
    export interface CustomRendererOptions extends CellRenderer.Options {
        type: 'customRenderer';
        additionalOptions: unknown;
    }

    class CustomRenderer extends CellRenderer {

        public options: CustomRendererOptions;

        constructor(column: Column, options: CustomRendererOptions) {
            super(column);
            this.options = options;
        }

        public render(cell: TableCell): CustomCellContent {
            return new CustomCellContent(cell, this);
        }
    }
    ```

3. Add the renderer type to [`CellRendererRegistry`](https://api.highcharts.com/grid/#modules/Grid_Pro_CellRendering_CellRendererRegistry.CellRendererRegistry) so it can be used in Grid Options.

    ```ts
    declare module 'highcharts/datagrid/es-modules/Grid/Pro/CellRendering/CellRendererType' {
        interface CellRendererTypeRegistry {
            customRenderer: typeof CustomRenderer;
        }
    }

    CellRendererRegistry.registerRenderer('customRenderer', CustomRenderer);
    ```

If you want your custom renderer to be usable in cell edit mode, you need to implement additionally the following interfaces:
- [`EditModeContent`](https://api.highcharts.com/grid/#interfaces/Grid_Pro_CellEditing_CellEditMode.EditModeContent) - it should extend the custom cell content class.
- [`EditModeRenderer`](https://api.highcharts.com/grid/#interfaces/Grid_Pro_CellEditing_CellEditMode.EditModeRenderer) - it should extend the custom cell renderer class.
