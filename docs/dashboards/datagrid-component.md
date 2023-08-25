DataGrid Component
===

The DataGrid Component can be placed inside a data cell to allow the data visualization in the form of an editable data grid.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/nonav/dashboards/datagrid-component/datagrid-options" allow="fullscreen"></iframe>


## How to start

1. To use the DataGrid Component in Dashboards, you need to import the appropriate modules.
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

2. You also need to import the styles.
    ```css
    @import url("https://code.highcharts.com/css/dashboards.css");
    @import url("https://code.highcharts.com/css/datagrid.css");
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

4. You will also need some data that you could display in your DataGrid component. For this purpose, you can, for example, define a connector that, in this case, downloads CSV data from the example URL.
    ```js
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'CSV',
            options: {
                csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv'
            }
        }]
    }
    ```
    Click [here](https://www.highcharts.com/docs/dashboards/data-handling) to read more about the data handling.

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
    To see more options available for the DataGrid Component, click [here](https://api.highcharts.com/dashboards/#modules/DataGrid_DataGridOptions#DataGridOptions). \
    You can also check the basic options common to all types of components, [here](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_DataGridComponent.DataGridComponent.ComponentOptions).

See the summarized JS code needed to create a simple DataGrid:
```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'CSV',
            options: {
                csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv'
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
