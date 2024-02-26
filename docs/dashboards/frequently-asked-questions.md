Frequently asked questions
===

* * *
How to connect dataPool to the other components?
---------------------------------------------

First, you need to create the dataPool, define a connector and pass the data reference. More about this topic [in the DataPool section](https://www.highcharts.com/docs/dashboards/data-handling)

After that, you need to pass the connector to the component config, and that’s it.
[Here is the demo](https://www.highcharts.com/samples/embed/dashboards/demo/minimal).

* * *

How to connect component to a cell?
----------------------------------
Each cell must have an `id` field. The same id must be passed in the component config to the `cell` field. Example configuration of component and cell:

```js
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'pie'
                },
                series: [{data: [1,2,3]}]
            },
        }]
```

[Here is the demo](https://www.highcharts.com/samples/embed/dashboards/components/component-highcharts).

* * *

How to synchronize the components?
-----------------------------
To synchronize components you have to specify which event you want to synchronize between each component, as well as they have to use the same connector.

Example of synchronized components

```js
    components: [{
        connector: {
            id: 'Vitamin'
        },
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            chart: {
                type: 'pie'
            }
        },
    }, {
        cell: 'dashboard-col-1',
        connector: {
            id: 'Vitamin'
        },
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                animation: false,
                type: 'column'
            }
        }
    }]
```



You can check how this synchronization works in our [minimal dashboard demo](https://www.highcharts.com/samples/embed/dashboards/demo/minimal).
See the next question for possible synchronization events.

* * *
What are the synchronization events available in Highcharts Dashboards?
-----------------------------------------------------------------------
You can check how this synchronization works in our [minimal dashboard demo](https://www.highcharts.com/samples/embed/dashboards/demo/minimal).

The events, that can be synchronized between components are:
* 'visibility’
* 'extremes'
* 'highlight'

* * *
What browsers are supported?
---------------
Highcharts Dashboards supports the following browsers:

|  Browser |    Version    |
|----------|:-------------:|
| Firefox  | 52.0+ (2017+) |
| Chrome   | 55.0+ (2016+) |
| Safari   | 11.0+ (2017+) |
| Opera    | 42.0+ (2016+) |
| Edge     | 16.0+ (2017+) |

* * *
What versions of Highcharts are supported?
---------------
The Highcharts Dashboards is compatible with all Highcharts modules in v10 or higher.

* * *

## I modified series names in a chart, and now sync is not working? What can I do?

Sync to other components may not work if you modify certain series properties. For instance modifying series names in the chart `afterRender` event callback:

```js
afterRender(e) {
    // Potential problem: setting custom name for series
    e.target.chart.series[0].name = 'customName'
    e.target.chart.series[1].name = 'otherCustomName'
}
```

If you have to change the displayed name in the chart options (and wish to sync with other components), make sure to set an alias to the corresponding column in the dataTable:

```js
  dataPool: {
    connectors: [{
      id: 'Vitamin',
      type: 'CSV',
      options: {
        csv: csvData,
        firstRowAsNames: true,
        dataTable: {
          aliases: {
            // Workaround for renamed series:
            // set an alias that matches the series name
            'customName': 'water',
            'otherCustomName': 'air'
          }
        }
      }
    }]
  }
```
See [this link](https://www.highcharts.com/samples/dashboards/issues/sync-aliases) for a live example
* * *
How to style the Dashboard?
-----------------------------------------------------------------------
Dashboards has a default theme, which is applied to all of its components.
You need to import the default CSS stylesheet to your project, so that the dashboard displays correctly. You can do it by importing the following CSS files:

```css
@import url("https://code.highcharts.com/css/highcharts.css");
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/datagrid/css/datagrid.css");
```


But you can also customize the style of the dashboard by adding your own CSS stylesheet.
More about this topic [in the Styling section](https://www.highcharts.com/docs/dashboards/style-by-css).



Note that each component which includes chart (Highcharts, KPI) uses [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default to style the chart. The CSS stylesheet needs to be imported, so that the Highcharts displays correctly.
To customize your chart styles, you can create your own themes, or just add your own individual CSS variables or rules found in our [docs.](https://www.highcharts.com/docs/chart-design-and-style/style-by-css)
