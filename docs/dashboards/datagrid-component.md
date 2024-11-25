DataGrid Component
===

The DataGrid Component can be placed inside a dashboard's cell to allow users to visualize the data in the editable table.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/datagrid-component/datagrid-options" allow="fullscreen"></iframe>


## How to start

1. To use the DataGrid Component in Dashboards, you need to import the appropriate modules, namely the [Datagrid](https://code.highcharts.com/dashboards/datagrid.js) and the [Dashboards](https://code.highcharts.com/dashboards/dashboards.js), to bind them together.
The order of the imports is essential, so ensure the Dashboards module is imported after the DataGrid module.

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
```

Alternatively, you can also use NPM packages (see: [Installation](https://www.highcharts.com/docs/dashboards/installation)) and import to connect them to the Dashboards.

```typescript
import * as Dashboards from '@highcharts/dashboards';
import * as DataGrid from '@highcharts/dashboards/datagrid';

Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);
```

2. You must also import the styles in your main CSS file.
```css
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

3. After loading the necessary files, define a cell using a unique identifier for the cell, e.g. `dashboard-col-0`. This cell will be used to place the component in the dashboard.
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

4. You will also need some data to display in your DataGrid component. For this purpose, you can, for example, define a connector that, in this case, contains example data in the CSV format.
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

5. Once you have the data and where to place your component, you can define it as below. In the `renderTo` option, we're passing the ID of the cell, (which we described in point 3 or created in our layout), and the ID of the connector with the data in the `connector.id` option (point 4). For the component to be created as a DataGrid, it was set with the `type` option to `'DataGrid'`.
    ```js
    components: [{
        renderTo: 'dashboard-col-1',
        connector: {
            id: 'data'
        },
        type: 'DataGrid'
    }]
    ```
To see more options available for the DataGrid Component, click [here](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.Options).

See the summarized JS code needed to create a simple DataGrid:
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
        type: 'DataGrid'
    }]
});
```

## DataGrid options
See the [DataGrid documentation](https://www.highcharts.com/docs/datagrid/general) to read more about it
or use [the API documentation](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1) to see the available options for the DataGrid Component.


## Data modifiers

Data modifiers allow manipulation of data provided to connectors to be placed in a modified version, e.g. in the DataGrid Component.

There are different types of Data Modifiers:
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
<script src="https://code.highcharts.com/dashboards/modules/math-modifier.js"></script>
```

## Components synchronization

One of the many available options for the DataGrid Component is the [`sync` option](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.Options#sync), which allows setting the synchronization of component states with each other. You can find more information about it in the [sync article](https://www.highcharts.com/docs/dashboards/synchronize-components).

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/component-options/sync-highlight" allow="fullscreen"></iframe>

The sync can be an object configuration containing: `highlight`, `visibility` and `extremes`, which allow enabling or disabling the types of synchronization by passing the value `true` or `false`.

See demos of `sync` types below:
* [Extremes Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/)
* [Highlight Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/)
* [Visibility Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/)


### Highlight sync options

Highlight sync for the DataGrid Component can have additional options:

```js
sync: {
    highlight: {
        enabled: true,
        autoScroll: true
    }
}
```

If you want to scroll the DataGrid automatically to a highlighted row, turn on
the [`autoScroll`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.DataGridHighlightSyncOptions) option.

Demo:
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/sync/datagrid-highlight-sync-autoscroll" allow="fullscreen"></iframe>


## Custom styling

In addition to DataGrid-specific options, such as [`cellHeight`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#cellHeight), which allows setting the height of the row, you can use CSS to style the component. The [`dataGridClassName`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.Options#dataGridClassName) option can be very useful; it allows setting an additional class for a given DataGrid container, so you can style separate components in your CSS file.
