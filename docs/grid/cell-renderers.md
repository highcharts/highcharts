---
tags: ["grid-pro"]
---

# Cell renderers

**Note:** Cell renderers are only available in Grid Pro. Grid Lite users can as an alternative use `formatter` and `format`to control [how data is rendered inside cells](https://www.highcharts.com/docs/grid/columns#cells).

Highcharts Grid Pro supports different cell renderers to provide interactive data presentation inside table cells. You can do this by setting the `columns[].cells.renderer` property for each column. This lets you control how each cell is displayed and interacted with, by e.g. turning a static value into an editable input field or a dropdown selector.

Cell renderers are also available in [edit mode](https://www.highcharts.com/docs/grid/cell-editing) by setting `columns[].cells.editMode.renderer`. This allows you to e.g. show plain text by default and present a checkbox or input field when a cell becomes editable.

## Default renderer

Unless specified the default renderer is [`text`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_TextRenderer.TextRenderer), and [`textInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_TextInputRenderer.TextInputRenderer) in `editMode`. This can be plain text, and HTML markup is also supported. If needed the text/markup can be formatted using `formatter` or `format`, and Grid Pro users can also use the built-in renderers as described below.

## Input renderers

Using specific input types is preferable to relying on complex validation logic for plain text inputs because it leverages built-in browser behavior to enforce correct data formats. This reduces the need for custom code, minimizes validation errors, and improves performance. If more specific validation is needed, for e.g. string validation, please [refer to `validationRules`](https://www.highcharts.com/docs/grid/cell-editing#validation).

From a user experience perspective, typed inputs provide clearer intent, better accessibility, and context-appropriate interfaces.

In the [renderer](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.ColumnOptions#renderer) API option, you can set the cell renderer for view and `editMode`. If not specified, the renderer for `editMode` is determined by `dataType`. When not in editMode it defaults to `text`.

Check out the [todo app demo](https://www.highcharts.com/demo/grid/todo-app) for how to implement renderers and read more below.

| renderer                                                                                                                                   | Description                                       | dataType        |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | --------------- |
| [`textInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_TextInputRenderer.TextInputRenderer)             | Text input that supports text/number and HTML     | string / number |
| [`numberInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_NumberInputRenderer.NumberInputRenderer)       | Number input element                              | number          |
| [`dateInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_DateInputRenderer.DateInputRenderer)             | Date input with datepicker                        | datetime        |
| [`dateTimeInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_DateTimeInputRenderer.DateTimeInputRenderer) | Date and time input with date/time picker         | datetime        |
| [`timeInput`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_TimeInputRenderer.TimeInputRenderer)             | Time input with time picker                       | datetime        |
| [`checkbox`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_CheckboxRenderer.CheckboxRenderer)                | Checkbox input element                            | boolean         |
| [`select`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_SelectRenderer.SelectRenderer)                      | Select element. Note that `options` are required. | string          |

You can further customize input renderers by using the `attributes` option. This allows you to pass additional HTML attributes to the underlying input element, such as `min`, `max`, `step`, `placeholder`, or any other valid attribute.
This is especially useful for number and date inputs, where you may want to restrict the allowed range or provide hints to users. For example:

```js
renderer: {
    type: 'numberInput',
    attributes: {
        min: 0,
        max: 100,
        step: 1
    }
}
```

### Text

Renders an editable text field for the value in editMode, and plain text/HTML when not in editMode. No specific configuration is needed since this is the default:

```js
columns: [{
    id: 'whatever', // column id
    cells: {
        editMode: {
            enabled: true
        }
    }
}]
```

### Date

Always renders a native date input. In `editMode` due to `dataType: 'datetime'`and is explicitly defined using `renderer` when not:

```js
columns: [{
    id: 'date', // column id
    dataType: 'datetime',
    cells: {
        renderer: {
            type: 'dateInput'
        }
    }
}]
```

### Checkbox

Renders a checkbox input element in `editMode` and uses `format` to display icons when not:

```js
columns: [{
    id: 'done', // column id
    cells: {
        dataType: 'boolean',
        format: '{#if value}✓{else}✗{/if}',
        editMode: {
            enabled: true
            renderer: {
                type: 'checkbox'
            }
        }
    }
}]
```

### Select

Renders a select element for predefined options in `editMode`. When not in `editMode` plain text is rendered:

```js
columns: [{
    id: 'country', // column id
    dataType: 'string',
    cells: {
        editMode: {
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
}]
```

### Number

Renders an editable number field for the value in editMode, and plain text when not in editMode.

```js
columns: [{
    id: 'age', // column id
    dataType: 'number',
    cells: {
        renderer: {
            type: 'numberInput',
            attributes: { // optional properties
                min: 0,
                max: 100,
                step: 1
            }
        }
    }
}]
```

### Mixed

Renders a select element for predefined options when not in `editMode`. When in `editMode` a text input is used. `dataType: 'number'` is set to make sure number and not string is written to `DataTable` on updates, and `validationRules` is also applied to provide user feedback:

```js
columns: [{
    id: 'size', // column id
    dataType: 'number',
    cells: {
        renderer: {
            type: 'select',
            options: [
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 }
            ]
        },
        editMode: {
            renderer: {
                type: 'textInput'
            },
            validationRules: ['notEmpty', 'number']
        }
    }
}]
```

## Sparkline renderer

A [`sparkline`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_Renderers_SparklineRenderer.SparklineRenderer) is a small, inline chart, typically a line, bar, or area chart, embedded within a cell to visually represent trends or patterns in data at a glance. Unlike full-size charts, sparklines are minimal and non-intrusive, making them ideal for showing changes over time or comparing values directly within rows of a grid, without leaving the context of the table.

In its simplest form, given that cell data is an array of numbers, a line sparkline can be rendered using:

```js
columns: [{
    id: 'trend', // column id
    cells: {
        renderer: {
            type: 'sparkline',
        }
    }
}]
```

Line, bar, column, area and pie are preconfigured as generic, minimalistic sparklines in Highcharts Grid Pro, but you can use `chartConfig` to configure these further or use other chart types. All chart types and configuration options from the [Highcharts Core](https://www.highcharts.com/products/highcharts/) charting library are available.

Go to the [Sparkline documentation article](https://www.highcharts.com/docs/grid/sparklines) to read more about sparklines and configuration options.

## Custom renderers

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

     public override delete(): void {
       // remove the element from DOM, clear event listeners, etc.
     }
   }
   ```

2. A class representing your Renderer, which inherits from the abstract [`CellRenderer`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_CellRenderer.CellRenderer) class. It should implement:

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
   declare module 'highcharts/grid/es-modules/Grid/Pro/CellRendering/CellRendererType' {
     interface CellRendererTypeRegistry {
       customRenderer: typeof CustomRenderer;
     }
   }

   CellRendererRegistry.registerRenderer('customRenderer', CustomRenderer);
   ```

If you want your custom renderer to be usable in cell edit mode, you need to implement additionally the following interfaces:

- [`EditModeContent`](https://api.highcharts.com/grid/#interfaces/Grid_Pro_CellEditing_CellEditMode.EditModeContent) - it should extend the custom cell content class.
- [`EditModeRenderer`](https://api.highcharts.com/grid/#interfaces/Grid_Pro_CellEditing_CellEditMode.EditModeRenderer) - it should extend the custom cell renderer class.

## Custom Textarea Renderer

This section demonstrates how to create a custom **Textarea** cell renderer for the Grid. The custom renderer will display a `<textarea>` element inside the cell, allowing for multi-line text editing.

<iframe style="width: 100%; height: 590px; border: none;" src="https://www.highcharts.com/samples/embed/grid/basic/custom-renderer?force-light-theme" allow="fullscreen"></iframe>

1. We start by importing the default [`CellRenderer`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_CellRenderer.CellRenderer) and `CellContentPro` classes and [`CellRendererRegistry`](https://api.highcharts.com/grid/#modules/Grid_Pro_CellRendering_CellRendererRegistry.CellRendererRegistry) from the `Grid` namespace.

```js
const {
  CellRenderer,
  CellContentPro,
  CellRendererRegistry
} = Grid;

class TextareaContent extends CellContentPro {}
```

2. The next step is to create a new class, such as **TextareaContent**, which extends the imported `CellContentPro` class and is responsible for creating and managing the `<textarea>` element.

```js
class TextareaContent extends CellContentPro {
  constructor(cell, renderer) {
    super(cell, renderer);
    this.add();
  }

  // Required by the interface
  add(parentElement = this.cell.htmlElement) {
    const textarea = this.textarea = document.createElement('textarea');
    this.update();
    parentElement.appendChild(textarea);
    return textarea;
  }

  // Required by the interface
  update() {
    this.textarea.value = this.cell.value;
  }

  // Required by the interface
  destroy() {
    this.textarea.remove();
  }
}
```

3. The **TextareaRenderer** class is responsible for integrating the custom textarea content into the grid. By extending the [`CellRenderer`](https://api.highcharts.com/grid/#classes/Grid_Pro_CellRendering_CellRenderer.CellRenderer) base class, it provides a `render`
   method that creates and returns a new instance of `TextareaContent` for each cell.

```js
class TextareaRenderer extends CellRenderer {
  constructor(column, options) {
    super(column);
    this.options = options;
  }

  render(cell) {
    return new TextareaContent(cell, this);
  }
}
```

4. Register the new renderer type with the [`CellRendererRegistry`](https://api.highcharts.com/grid/#modules/Grid_Pro_CellRendering_CellRendererRegistry.CellRendererRegistry) so it can be used in the Grid configuration.

```js
CellRendererRegistry.registerRenderer('textarea', TextareaRenderer);
```

Once registered, you can use the custom `textarea` renderer in your column configuration:

```js
columns: [{
    id: 'description',
    cells: {
        renderer: {
            type: 'textarea'
        }
    }
}]
```
