# Highcharts Dashboards with Vue

To create a dashboard with Vue, please follow the steps below: <br>

1. Install the Dashboards package.

    ```bash
    npm install @highcharts/dashboards
    ```

2. Import the Dashboards package.

    ```typescript
    import * as Dashboards from '@highcharts/dashboards';
    ```

3. Consider additional packages like Highcharts or DataGrid to utilise the **Dashboards** potential fully.

    First, install the package.
    ```bash
    npm install highcharts
    ```

    Then, import the package and the dedicated plug to connect it to the Dashboards.

    ```typescript
    import Highcharts from 'highcharts';
    import Dashboards from '@highcharts/dashboards';
    import DataGrid from '@highcharts/dashboards/datagrid';

    Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
    Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

    Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
    Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);
    ```

    __Please Note:__ If you are using the Visual Studio Code editor with the
    Volar extension, you should change the extension setting
    `"vue.server.maxFileSize"` to a value of at least `25000000` bytes to get
    full editor support for all Highcharts modules. You will find it in the menu
    `File` -> `Preferences` -> `Settings`, where you have to scroll to the
    `Vue: Max File Size` value.

4. Create an HTML structure for the dashboard.  
    There are two ways to do it:
    #### Use the Dashboards layout system.  
    To do that, first import the `layout` module and initialize it:
    ```typescript
    import LayoutModule from '@highcharts/dashboards/modules/layout';

    LayoutModule(Dashboards);
    ```
    Then add a div where you want to render the dashboard:
    ```html
    <div ref="dashboardContainer"></div>
    ```
    #### Declare your HTML structure.
    Read more in the [documentation](https://www.highcharts.com/docs/dashboards/layout-description).

5. Create a dashboard using the factory function `Dashboards.board`. The function takes three arguments:
    - `container` - the element where the dashboard will be rendered, can be an id of the element or the direct reference to the element
    - `options` - the options object for the dashboard
    - `isAsync` - whether the dashboard should be rendered asynchronously or not - functional when using external data resources

## Demos
See how it works in the demos below:
- [basic live example](https://stackblitz.com/edit/dashboards-vue3-fcutdg)
- [custom layout live example](https://stackblitz.com/edit/dashboards-vue3-4qzk97)
