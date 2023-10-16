Highcharts Dashboards with React
===

To create a dashboard with React please follow the steps below: <br>

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

4. Add a div or any other HTML element where you want to render the dashboard.

    ```html
    <div id="dashboard"></div>
    ```

5. Create a dashboard using the factory function `Dashboards.board`. The function takes three arguments:
    - `container` - the element where the dashboard will be rendered, can be an id of the element or the direct reference to the element
    - `options` - the options object for the dashboard
    - `isAsync` - whether the dashboard should be rendered asynchronously or not- useful when using external data resources

See how it works in the [basic live example](https://stackblitz.com/edit/stackblitz-starters-fhbyc8)
or [component live example](https://stackblitz.com/edit/stackblitz-starters-jklu62).

