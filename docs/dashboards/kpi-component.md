KPI Component
===

The KPIComponent allows you to visualize key performance indicators.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/component-kpi allow="fullscreen"></iframe>

## How to start
1. To be able to use KPIComponent you first have to load the main [Dashboards](https://code.highcharts.com/dashboards/dashboards.js) package.

2. Define a cell using a unique identifier for example `renderTo: 'dashboard-col-0'`.  
You can find more information how to create a layout in dashboard [here](https://www.highcharts.com/docs/dashboards/your-first-dashboard).

3. The last thing that you have to do is to specify the `type: 'KPI'` and `value: <value>` in the component’s config. See the full example below.

    ```js
    Dashboards.board('container', {
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'dashboard-col-0'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'dashboard-col-0',
            type: 'KPI',
            title: 'My KPI',
            value: 10
        }]
    });
    ```

## KPI with chart
KPIComponent allows end-user including the extra chart.

1. To be able to use Highcharts in KPI you first have to load [Highcharts](https://code.highcharts.com/highcharts.js) as usual.

    ```html
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
    <script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
    ```

    Alternatively, you can also use the NPM package.

    ```bash
    npm install highcharts @highcharts/dashboards
    ```

    and import it in your project like:
    ```js
    import * as Dashboards from '@highcharts/dashboards';
    import * as Highcharts from 'highcharts';
    import LayoutModule from '@highcharts/dashboards/modules/layout';

    LayoutModule(Dashboards);

    Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
    Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
    ```

2. From version v3.0.0 the KPIComponent with chart does not use [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default, no need to load the set of CSS styles to display Highcharts properly.
Importing only dashboards CSS file is enough:
    ```css
    @import url("https://code.highcharts.com/dashboards/css/dashboards.css");
    ```

    Also, be aware that we prepared the component so it was minimalist.  
    To achieve that, some of the chart options are already set. You can find the `defaultChartOptions` in the [API](https://api.highcharts.com/dashboards/#classes/Dashboards_Components_KPIComponent_KPIComponent.KPIComponent-1#defaultChartOptions).

3. Define chart options for the KPI.
For the full set of available chart options, see the [Highcharts API](https://api.highcharts.com/highcharts/)

    ```js
    Dashboards.board('container', {
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'dashboard-col-0'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'dashboard-col-0',
            title: 'My KPI',
            type: 'KPI',
            value: 10,
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
            series: [{
                data: [734, 244, 685, 250, 920, 320, 200, 150]
            }]
            }
        }]
    });
    ```

    By default, the KPI value is synchronized with the Y value of the first point in the first series. To turn off the synchronization, disable the [linkedValueTo](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_KPIComponent_KPIComponentOptions.Options#linkedValueTo) option as in the example above.

    You can also use this option to change the point to be synchronized with the value, setting its index and the index of the series it belongs to.

## Working with data
You can either define static data, as you would do in the basic KPI Component (the `value` parameter), or use the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling) to connect some dynamic data. The KPIComponent reflects the last value from the column (declared by `columnName` param) as a value itself.

[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/kpi-with-connector).
Example of working with connector.
```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'value',
            type: 'CSV',
            options: {
                csv: `Date,Value
                2019-01-01,100
                2019-01-02,200
                2019-01-03,300
                2019-01-04,400`
            }
        }]
    },
    components: [{
        renderTo: 'kpi',
        type: 'KPI',
        title: 'Last day\'s value',
        columnName: 'Value',
        connector: {
            id: 'value'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'kpi'
                }]
            }]
        }]
    }
});
```

## Configuring options
The `value` can be customized by:
- `valueFormat` - a format string for the value text.
    ```
        valueFormat: '{value} km/h',
    ```
- `valueFormatter` - a function to format the text of the value from scratch.
    ```
        valueFormatter: function () {
            return this.options.value + ' km/h';
        },
    ```

## Sync with other components
The KPI Component allows users to sync the component with other components in Dashboards. You can find more information about it in the [sync article](https://www.highcharts.com/docs/dashboards/synchronize-components).

## API options
For the full set of available options, see the [API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_KPIComponent_KPIComponentOptions.Options).



