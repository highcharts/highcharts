Highcharts Component
===

The Highcharts Component allows the end-user to define a chart in the dashboard. Charts are most often used to visualize data that changes over time.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts allow="fullscreen"></iframe>

## How to start
To get started quickly we need to load the JavaScript and CSS files in the following order.

1. To be able to use Highcharts Component you first have to load [Highcharts](https://code.highcharts.com/highcharts.js) as usual and load the additional [Dashboards plugin](https://code.highcharts.com/dashboards/modules/dashboards-plugin.js).

```html
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/dashboards-plugin.js"></script>
```

Alternatively, you can also use the NPM package.

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

2. The Highcharts Component uses [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default, so you need to load also the set of CSS styles to display Highcharts properly.
```css
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/css/highcharts.css");
```
More information about styling charts, you can find in our [docs](https://www.highcharts.com/docs/chart-design-and-style/style-by-css).

3. After loading the necessary files, define a cell using a unique identifier for example `cell: 'dashboard-col-0'`.

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
        cell: 'dashboard-col-0',
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
You can either define static data, as you would do in the basic highcharts chart, or use the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling) to connect some dynamic data. The data gets parsed through the `columnAssignment` option to map correct values from the connector to reflect them in the series.
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
        cell: 'dashboard-col-0',
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

## API options
For the full set of available options, see the [API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Plugins_HighchartsComponent.HighchartsComponent.Options).





