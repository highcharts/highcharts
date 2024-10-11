Highcharts Component
===

The Highcharts Component allows the end-user to define a chart in the dashboard. Charts are most often used to visualize data that changes over time.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts allow="fullscreen"></iframe>

## How to start
To get started quickly we need to load the JavaScript and CSS files in the following order.

1. To be able to use Highcharts Component you first have to load [Highcharts](https://code.highcharts.com/highcharts.js) as usual and the [Dashboards](https://code.highcharts.com/dashboards/dashboards.js) to bind them together.
    The order of the imports is important, so make sure that the Dashboards module is imported after the Highcharts module.

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

2. From version v3.0.0 the Highcharts Component does not use [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default, no need to load the set of CSS styles to display Highcharts properly.
Importing only dashboards CSS file is enough:
    ```css
    @import url("https://code.highcharts.com/dashboards/css/dashboards.css");
    ```

    At any time you can enable the styled mode by setting the `styledMode` option to `true` in your chart options and style it accordingly to the [Highcharts styling guide](https://www.highcharts.com/docs/chart-design-and-style/style-by-css).

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

### Assigning column data to series data

The data can be parsed through the [columnAssignment](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.ConnectorOptions#columnAssignment) option to map correct values from the connector to reflect them in the series.
You can declare which columns will be parameter of the point as well. Specifically, it is useful for series like OHLC, candlestick, columnrange or arearange. The `seriesId` field is mandatory for displaying series (for instance in the legend) properly.
[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts-columnassignment). 

The `data` option can take three different types:
1. `string` - name of the column that contains the one-dimensional data.
```js
columnAssignment: [{
    seriesId: 'mySeriesId',
    data: 'myData'
}]
```
<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/highcharts-column-assignment-1d-data allow="fullscreen"></iframe>

2. `string[]` - names of the columns that data will be used in the two-dimensional format.
```js
columnAssignment: [{
    seriesId: 'mySeriesId',
    data: ['myX', 'myY']
}]
```
<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/highcharts-column-assignment-2d-data allow="fullscreen"></iframe>

3. `Record<string, string>` - the object with the keys as series data key names and column names that will be used for the key-defined two-dimensional series data.
```js
columnAssignment: [{
    seriesId: 'myStockSeriesId',
    data: {
        x: 'myX',
        open: 'myOpen',
        high: 'myHigh',
        low: 'myLow',
        close: 'myClose'
    },
}, {
    seriesId: 'myColumnSeriesId',
    data: {
        name: 'myNamesColumn',
        y: 'myYColumn',
        'dataLabels.style.visibility': 'myDataLabelVisibilityColumn'
    }
}]
```
<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/highcharts-column-assignment-keys-data allow="fullscreen"></iframe>

### Multiple connectors

The Highcharts Component also supports more than one data source. That means the connector option should then be configured as an array of objects rather than a single object.

Code sample:
```js
components: [{
    type: 'Highcharts',
    connector: [{
        id: 'connector-1',
        columnAssignment: [ ... ]
    }, {
        id: 'connector-2',
        columnAssignment: [ ... ]
    }]
}]
```

Example:
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/highcharts-components/multiple-connectors" allow="fullscreen"></iframe>


## Components synchronization

One of the many available options for the Highcharts Component is the [`sync` option](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.Options#sync), which allows setting the synchronization of component states with each other. You can find more information about it in the [sync article](https://www.highcharts.com/docs/dashboards/synchronize-components).

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/component-options/sync-highlight" allow="fullscreen"></iframe>

The sync can be an object configuration containing: `highlight`, `visibility` and `extremes`, which allow enabling or disabling the types of synchronization by passing the value `true` or `false`.

See demos of `sync` types below:
* [Extremes Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/)
* [Highlight Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/)
* [Visibility Sync](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/)


### Highlight sync options

Highlight sync can have additional options:
```js
sync: {
    highlight: {
        enabled: true,
        affectedSeriesId: 'series-1',
        highlightPoint: true,
        showTooltip: false,
        showCrosshair: true
    }
}
```

If you want to force highlight sync to always affect one specific series, use the [`affectedSeriesId`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.HighchartsHighlightSyncOptions#affectedSeriesId) option in the argument specifying the ID of that series. When undefined, empty or set to null, option assignment works by default based on the hovered column and column assignment.

Demo:
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/sync/highcharts-highlight-affected-series allow="fullscreen"></iframe>

If you want to determine how the highlight of points on the chart should work (i.e. whether the hover state should be set for a marker, whether the crosshair should be synced and whether the tooltip should be shown), use the `highlightPoint`, `showCrosshair` and `showTooltip` options. Read more in the [API docs](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.HighchartsHighlightSyncOptions#affectedSeriesId).

Demo:
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/sync/sync-highlight-options allow="fullscreen"></iframe>



## API options
For the full set of available options, see the [API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.ConnectorOptions).

## Highcharts Compatibility
The Highcharts component is compatible with all Highcharts modules in v10 or higher.



