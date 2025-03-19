# Grid Component

The **Grid Component** can be placed inside a dashboard's cell to allow users to visualize the data in the editable table.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/grid-component/grid-options" allow="fullscreen"></iframe>

## How to start

### 1. Import
To use the **Grid Component** in **Dashboards**, you need to import the required modules, namely the [datagrid](https://cdn.jsdelivr.net/npm/@highcharts/dashboards/datagrid.js) and the [Dashboards](https://cdn.jsdelivr.net/npm/@highcharts/dashboards/dashboards.js), to bind them together.
The order of the imports is essential, so ensure the **Dashboards** module is imported after the **Grid** module.

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/dashboards/datagrid.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@highcharts/dashboards/dashboards.js"></script>
```

Alternatively, you can also use NPM packages (see: [Installation](https://www.highcharts.com/docs/dashboards/installation)) and import to connect them to the Dashboards.

```typescript
import * as Dashboards from '@highcharts/dashboards';
import * as Grid from '@highcharts/dashboards/datagrid';

Dashboards.GridPlugin.custom.connectGrid(Grid);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);
```

### 2. CSS
You must also import the styles in your main CSS file.
```css
@import url("https://cdn.jsdelivr.net/npm/@highcharts/dashboards/css/dashboards.css");
@import url("https://cdn.jsdelivr.net/npm/@highcharts/dashboards/css/datagrid.css");
```

### 3. Cell identifier
After loading the necessary files, define a cell using a unique identifier for the cell, e.g. `dashboard-col-0`. This cell will be used to place the component in the dashboard and the content of the Grid is rendered here.
```js
gui: {
    layouts: [{
        id: 'layout-1',
        rows: [{
            cells: [{
                id: 'dashboard-col-0'
            }]
        }]
    }]
}
```

### 4. Data
You will also need some data to display in your **Grid Component**. For this purpose, you can, for example, define a connector that contains data in the CSV format.
```js
dataPool: {
    connectors: [{
        id: 'data',
        type: 'CSV',
        options: {
            csv: `Food,Vitamin A,Iron
            Beef Liver,6421,6.5
            Lamb Liver,2122,6.5
            Cod Liver Oil,1350,0.9
            Mackerel,388,1
            Tuna,214,0.6`
        }
    }]
}
```

Click [here](https://www.highcharts.com/docs/dashboards/data-handling) to read more about data handling.

### 5. Rendering
Once you have the data and where to place your component, you can define it as below. In the `renderTo` option, we're passing the ID of the cell, (which we described above or created in our layout), and the ID of the connector with the data in the `connector.id` option (point 4). For the component to be created as a Grid, it was set with the `type` option to `'Grid'`.
```js
components: [{
    renderTo: 'dashboard-col-1',
    connector: {
        id: 'data'
    },
    type: 'Grid'
}]
```
To see more options available for the Grid Component, click [here](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.Options).

See the summarized JS code needed to create a simple Grid:
```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'CSV',
            options: {
                csv: `Food,Vitamin A,Iron
                Beef Liver,6421,6.5
                Lamb Liver,2122,6.5
                Cod Liver Oil,1350,0.9
                Mackerel,388,1
                Tuna,214,0.6`
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-1',
        connector: {
            id: 'data'
        },
        type: 'Grid'
    }]
});
```

## Grid options
See the [Grid documentation](https://www.highcharts.com/docs/grid/general) to read more about it
or use [the API documentation](https://api.highcharts.com/grid/#interfaces/Grid_Core_Options.Options-1) to see the available options for the **Grid** component.


## Data modifiers

Data modifiers allow manipulation of data provided to connectors to be placed in a modified version, e.g. in the **Grid Component**.

There are different types of data modifiers:
* `Chain` - A chain of modifiers executed in a fixed order.
* `Invert` - The invert modifier reverses the order of displayed rows.
* `Range` - Range modifiers allow selecting rows to be displayed based on specific ranges regarding data from specific columns.
* `Sort` - Sort modifiers allow the display order of rows to be set based on the result of sorting the data in specific columns.
* `Math` - Math modifiers allow the creation of additional columns with data mathematically transformed from another column.

The [`dataModifier`](https://api.highcharts.com/dashboards/#interfaces/Data_Connectors_CSVConnectorOptions.CSVConnectorOptions-1#dataModifier) option can be used in the connectors options, as follows:
```js
connectors: [{
    id: 'data',
    type: 'CSV',
    options: {
        csv: `A,B
        1,3
        20,2
        100,2`,
        dataModifier: {
            type: 'Math',
            columnFormulas: [{
                column: 'Sum',
                formula: 'A1+B1'
            }]
        }
    }
}]
```
In this example, a column named `Sum` is created with data that is the sum of the numbers in the previous columns in the row.

Note that you also need to import modules to use the appropriate modifiers. For example:
```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/dashboards/modules/math-modifier.js"></script>
```

## Component synchronization

One of the many available options for the **Grid Component** is the [`sync` option](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.Options#sync), which allows setting the synchronization of component states with each other. You can find more information about it in the [sync article](https://www.highcharts.com/docs/dashboards/synchronize-components).

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/component-options/sync-highlight" allow="fullscreen"></iframe>

The sync can be an object configuration containing: `highlight`, `visibility` and `extremes`, which allow enabling or disabling the types of synchronization by passing the value `true` or `false`.

See demos of `sync` types below:
* [Extremes Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/)
* [Highlight Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/)
* [Visibility Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/)


### Highlight sync options

Highlight sync for the **Grid Component** can have additional options:

```js
sync: {
    highlight: {
        enabled: true,
        autoScroll: true
    }
}
```

If you want to scroll the **Grid Component** automatically to a highlighted row, turn on
the [`autoScroll`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.DataGridHighlightSyncOptions) option.

Demo:
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/sync/grid-highlight-sync-autoscroll" allow="fullscreen"></iframe>

