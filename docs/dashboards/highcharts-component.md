Highcharts Component
===

The Highcharts Component allows the end-user to define a chart in the dashboard. Charts are most often used to visualize data that changes over time.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts allow="fullscreen"></iframe>

## How to start
To get started quickly we need to load the JavaScript and CSS files in the following order.

1. To be able to use Highcharts Component you first have to load [Highcharts](https://code.highcharts.com/highcharts.js) as usual and the [Dashboards](https://code.highcharts.com/dashboards/dashboards.js) to bind them together.
    Order of the imports is important, so make sure that the Dashboards module is imported after the Highcharts module.

    ```html
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
    <script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
    ```

    Alternatively, you can also use the NPM package.

    ```bash
    npm install highcharts
    ```

    Then import the package and the dedicated plug to connect it to the Dashboards.

    ```typescript
    import * as Highcharts from 'highcharts';
    import * as Dashboards from '@highcharts/dashboards';
    import LayoutModule from '@highcharts/dashboards/modules/layout';

    LayoutModule(Dashboards);

    Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
    Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
    ```

2. The Highcharts Component uses [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default, so you need to load also the set of CSS styles to display Highcharts properly.
    ```css
    @import url("https://code.highcharts.com/dashboards/css/dashboards.css");
    @import url("https://code.highcharts.com/css/highcharts.css");
    ```
    More information about styling charts, you can find in our [docs](https://www.highcharts.com/docs/chart-design-and-style/style-by-css).

3. After loading the necessary files, define a cell using a unique identifier for example `renderTo: 'dashboard-col-0'`.

    You can find more information how to create a layout in dashboard [here](https://www.highcharts.com/docs/dashboards/your-first-dashboard).

4. Declare all of the chart options in the `chartOptions` object.
For the full set of available options, see the [Highcharts API](https://api.highcharts.com/highcharts/)

    ```js
    chartOptions: {
        series: [{
            data: [1, 2, 3, 4]
        }]
    }
    ```

5. The last thing that you have to do is to specify the `type: 'Highcharts'` in the component’s config and that’s it. See the full example below.

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
            type: 'Highcharts',
            chartOptions: {
                series: [{
                    data: [1, 2, 3, 4]
                }]
            }
        }]
    });
    ```

## Working with data
You can either define static data, as you would do in the basic highcharts chart, or use the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling) to connect some dynamic data.
[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts). If data connector is connected, you can load the Highcharts' `dragDrop` module, to allow the user to change the value and sync the changes of this value with other components. Also, the editing is disabled by default, if the series data is based on the columns in the connector, which were created by `mathModifier`. You can read more in the `dataPool` section.

Example of working with connector.
```js
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            options: {
                csv: `Food,Vitamin A,Iron
                Beef Liver,6421,6.5
                Lamb Liver,2122,6.5
                Cod Liver Oil,1350,0.9
                Mackerel,388,1
                Tuna,214,0.6`,
            },
        }]
    },
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
        type: 'Highcharts',
        connector: {
            id: 'Vitamin'
        },
        chartOptions: {
            title: {
                text: 'Example chart'
            }
        }
    }]
});
```

The data can be parsed through the [columnAssignment](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_HighchartsComponent.HighchartsComponent.Options#columnAssignment) option to map correct values from the connector to reflect them in the series.
You can declare which columns will be parameter of the point as well. Specifically, it is useful for series like OHLC, candlestick, columnrange or arearange. The `seriesName` field is mandatory for displaying series (for instance in the legend) properly.
[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts-columnassignment). 

Example of using `columnAssignment`:
```js
    columnAssignment: {
        x: 'x',
        mySeries: 'value'
    }
```

or when you use mapping columns to point

```js
    columnAssignment: {
        x: 'x',
        mySeries: 'value',
        mySeriesName: {
            high: 'myHigh',
            low: 'myLow'
        }
    },
    chartOptions: {
        series: [{
            name: 'mySeriesName',
            type: 'columnrange'
        }, {
            name: 'mySeries',
            type: 'line'
        }]
    }

```

## API options
For the full set of available options, see the [API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_HighchartsComponent.HighchartsComponent.Options).

## Highcharts Compatibility
The Highcharts component is compatible with all Highcharts modules in v10 or higher.



