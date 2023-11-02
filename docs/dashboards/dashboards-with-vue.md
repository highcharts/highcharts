Highcharts Dashboards with Vue
===

To create a dashboard with Vue, please follow the steps below: <br>

1. Install the Dashboards package.

    ```bash
    npm install @highcharts/dashboards
    ```

2. Import the Dashboards package.

    ```typescript
    import * as Dashboards from '@highcharts/dashboards/dashboards';
    ```

3. To fully utilize the Dashboards potential, consider additional packages like Highcharts or DataGrid.

    First install the package.
    ```bash
    npm install highcharts
    ```

    Then import the package and the dedicated plug to connect it to the Dashboards.

    ```typescript
    import * as Highcharts from 'highcharts';
    import HighchartsPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin';

    HighchartsPlugin.custom.connectHighcharts(Highcharts);
    Dashboards.PluginHandler.addPlugin(HighchartsPlugin);
    ```

    __Please Note:__ If you are using the Visual Studio Code editor with the
    Volar extension, you should change the extension setting
    `"vue.server.maxFileSize"` to a value of at least `25000000` bytes to get
    full editor support for all Highcharts modules. You find it in the menu
    `File` -> `Preferences` -> `Settings`, where you have to scroll to the
    `Vue: Max File Size` value.

4. Add a div or any other HTML element where you want to render the dashboard.

    ```html
    <div ref="dashboardContainer"></div>
    ```

5. Create a dashboard using the factory function `Dashboards.board`. The function takes three arguments:
    - `container` - the element where the dashboard will be rendered, can be an id of the element or the direct reference to the element
    - `options` - the options object for the dashboard
    - `isAsync` - whether the dashboard should be rendered asynchronously or not - useful when using external data resources

See how it works in this [basic live example](https://stackblitz.com/edit/dashboards-vue3-urkttx?file=src%2FApp.vue).
