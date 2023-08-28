KPI Component
===

The KPIComponent allows you to visualize key performance indicators.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/components/component-kpi allow="fullscreen"></iframe>

## How to start
1. The KPIComponent is included in the Dashboard package, so nothing apart from the basic dashboards package needs to be imported.

2. Define a cell using a unique identifier for example `cell: 'dashboard-col-0'`.

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
        cell: 'dashboard-col-0',
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
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/dashboards-plugin.js"></script>
```

Alternatively, you can also use the NPM package.

```bash
npm install highcharts
```

2. The KPIComponent with chart uses [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default, so you need to load also the set of CSS styles to display Highcharts properly.
```css
@import url("https://code.highcharts.com/css/highcharts.css");
```
More information about styling charts, you can find in our [docs](https://www.highcharts.com/docs/chart-design-and-style/style-by-css).

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
        cell: 'dashboard-col-0',
        title: 'My KPI',
        type: 'KPI',
        value: 10,
        chartOptions: {
          series: [{
              data: [734, 244, 685, 250, 920, 320, 200, 150]
          }]
        }
    }]
});
```

## Working with data
You can either define static data, as you would do in the basic KPI Component (the `value` parameter), or use the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling) to connect some dynamic data. The data gets parsed through the `columnName` option to map correct value from the connector to reflect it in the KPI's value.
[Here is the example](https://www.highcharts.com/samples/embed/dashboards/components/kpi-with-connector)
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
        cell: 'kpi',
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

## API options
For the full set of available options, see the [API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_KPIComponent.KPIComponent.ComponentOptions).





