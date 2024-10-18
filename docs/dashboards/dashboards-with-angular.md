Highcharts Dashboards with Angular
===

To create a dashboard with Angular please follow the steps below: <br>

1. Install the Dashboards package.

    ```bash
    npm install @highcharts/dashboards
    ```

2. Import the Dashboards package.

    ```typescript
    import * as Dashboards from '@highcharts/dashboards';
    ```

3. To fully utilize the Dashboards potential, consider additional packages like Highcharts or DataGrid.

    First install the package.
    ```bash
    npm install highcharts
    ```

    Then import the package and the dedicated plug to connect it to the Dashboards.

    ```typescript
    import Highcharts from 'highcharts';
    import Dashboards from '@highcharts/dashboards';
    import DataGrid from '@highcharts/dashboards/datagrid';

    Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
    Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

    Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
    Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);
    ```

4. Create a HTML structure for the dashboard.  
    You can use one of two ways to setup Dashboards:
    * Use the `dashboards` layout system.
    To do that first import the `layout` module and initialize it:

    ```typescript
    import LayoutModule from '@highcharts/dashboards/modules/layout';

    LayoutModule(Dashboards);
    ```
    Then add a div where you want to render the dashboard:
    ```html
    <div id="dashboard"></div>
    ```

    You can refer to the element by its id or you can use the `ElementRef` to get the element.
    
    * Declare your own HTML structure.
    Read more in the [documentation](https://www.highcharts.com/docs/dashboards/layout-description).

5. Create a dashboard using the factory function `Dashboards.board`. The function takes three arguments:
    - `container` - the element where the dashboard will be rendered, can be an id of the element or the direct reference to the element
    - `options` - the options object for the dashboard
    - `isAsync` - whether the dashboard should be rendered asynchronously or not- useful when using external data resources


## Demos
See how it works in the demos like below:
- [live example](https://stackblitz.com/edit/angular-pc4xsk)
- [custom layout live example](https://stackblitz.com/edit/dashboards-angular-custom-layout)
