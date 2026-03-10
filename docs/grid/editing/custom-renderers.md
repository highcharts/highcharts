---
tags: ["grid-pro"]
---

# Custom renderers

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

See also [Editing / Renderers](https://www.highcharts.com/docs/grid/editing/renderers).
