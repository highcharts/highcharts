DataGrid Component
===

The DataGrid Component can be placed inside a dashboard's cell to allow users to visualize the data in the editable table.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/datagrid-component/datagrid-options" allow="fullscreen"></iframe>


## How to start

1. To use the DataGrid Component in Dashboards, you need to import the appropriate modules i.e. [Dashboards](https://code.highcharts.com/dashboards/dashboards.js) of course, but also [Dashboards Plugin](https://code.highcharts.com/dashboards/modules/dashboards-plugin.js) and [Datagrid](https://code.highcharts.com/dashboards/datagrid.js).
    ```html
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
    <script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
    <script src="https://code.highcharts.com/dashboards/modules/dashboards-plugin.js"></script>
    ```

    Alternatively, you can also use NPM packages (see: [Installation](https://www.highcharts.com/docs/dashboards/installation)) and import to connect them to the Dashboards.
    ```ts
    import * as Dashboards from '@highcharts/dashboards';
    import DataGrid from '@highcharts/dashboards/es-modules/DataGrid/DataGrid';
    import DataGridPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/DataGridPlugin';

    DataGridPlugin.custom.connectDataGrid(DataGrid);
    Dashboards.PluginHandler.addPlugin(DataGridPlugin);
    ```

2. You also need to import the styles in your main CSS file.
    ```css
    @import url("https://code.highcharts.com/dashboards/css/dashboards.css");
    @import url("https://code.highcharts.com/datagrid/css/datagrid.css");
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

4. You will also need some data that you could display in your DataGrid component. For this purpose, you can, for example, define a connector that, in this case, contains example data in the CSV format.
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

5. Once you have the data and where to place your component, you can define it as below. In the `cell` option, we're passing the ID of the cell, which we defined in point 3, and the ID of the connector with the data in the `connector.id` option (point 4). In order for the component to be created as a DataGrid, it was set with the `type` option to `'DataGrid'`.
    ```js
    components: [{
        cell: 'dashboard-col-1',
        connector: {
            id: 'data'
        },
        type: 'DataGrid'
    }]
    ```
    To see more options available for the DataGrid Component, click [here](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_DataGridComponent.DataGridComponent.ComponentOptions).

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
        cell: 'dashboard-col-1',
        connector: {
            id: 'data'
        },
        type: 'DataGrid'
    }]
});
```

## DataGrid options

In the [DataGrid Component](https://api.highcharts.com/dashboards/#modules/Dashboards_Plugins_DataGridComponent.DataGridComponent), you can define some specific options for the [DataGrid](https://api.highcharts.com/dashboards/#classes/DataGrid_DataGrid.DataGrid) itself. These options can be set in the [`dataGridOptions` option](https://api.highcharts.com/dashboards/typedoc/interfaces/Dashboards_Plugins_DataGridComponent.DataGridComponent.ComponentOptions.html#dataGridOptions).

For example, using the [`editable` option](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#editable) you can make all the cells in a DataGrid editable (`true`) or read-only (`false`):

Using [`columns`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#columns), you can format data and headers in cells, e.g. adding units to them. The key is the column name and the value is the object with the column-specific options.

Example:
```js
components: [{
    cell: 'dashboard-col-1',
    type: 'DataGrid'
    connector: {
        id: 'data'
    },
    dataGridOptions: {
        editable: false,
        columns: {
            product: {
                cellFormat: '{text} No. 1',
                headerFormat: '{text} name'
            },
            weight: {
                cellFormat: '{value} kg',
                headerFormat: '{text} (kg)'
            },
            price: {
                cellFormat: '{value} $',
                headerFormat: '($) {text}'
            },
            metaData: {
                show: false
            }
        }
    }
}]
```

There are more DataGrid-specific options that can be found in the [Dashboards API](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1).


## Data modifiers

Data modifiers allow manipulation of data provided to connectors to be placed in a modified version, e.g. in the DataGrid Component.

There are different types of Data Modifiers:
* `Chain` - A chain of modifiers executed in a fixed order.
* `Invert` - Invert modifier allows reversing the order of displayed rows.
* `Range` - Range modifiers allow selecting rows to be displayed based on specific ranges regarding data from specific columns.
* `Sort` - Sort modifiers allow setting the display order of rows based on the result of sorting the data in specific columns.
* `Math` - Math modifiers allow the creation of additional columns with data that is a mathematical transformation of data from another column.

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

One of the many available options for the DataGrid Component is the [`sync` option](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_DataGridComponent.DataGridComponent.ComponentOptions#sync), which allows setting the synchronization of component states with each other.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/component-options/sync-highlight" allow="fullscreen"></iframe>

The sync can be an object configuration containing: `highlight`, `visibility` and `extremes`, which allow enabling or disabling the types of synchronization by passing the value `true` or `false`.

See demos of `sync` types below:
* [Extremes Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/)
* [Highlight Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/)
* [Visibility Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/)


## Custom styling

In addition to DataGrid-specific options, such as [`cellHeight`](https://api.highcharts.com/dashboards/#interfaces/DataGrid_DataGridOptions.DataGridOptions-1#cellHeight), which allows setting the height of the row, you can use CSS to style the component. You can set the [`style` option](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_DataGridComponent.DataGridComponent.ComponentOptions#style) for a component, in which you can define a CSS object, which allows you to set a style for the component from the option level. The [`dataGridClassName`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_DataGridComponent.DataGridComponent.ComponentOptions#dataGridClassName) option can be very useful, it allows setting an additional class for a given DataGrid container, so you can style separate components in your CSS file.
