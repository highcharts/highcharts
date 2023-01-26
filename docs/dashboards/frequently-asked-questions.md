Frequently asked questions
===

* * *
How to connect store to the other components?
---------------------------------------------

First, you need to create the correct type of store using the right constructor, and pass the data reference. More about this topic [in the DataStore section](https://www.highcharts.com/docs/dashboards/data-store)

After that, you need to pass the store to the component config, and that’s it.
[Here is the demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/dashboard-minimal).

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

[Here is the demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/component-highcharts).

* * *

How to synchronize the components?
-----------------------------
To synchronize components you have to specify which event you want to synchronize between each component, as well as they have to use the same store.

Example of synchronized components

```js
    components: [{
        store,
        sync: {
            visibility: true,
            tooltip: true,
            selection: true
        },
        cell: 'dashboard-col-0',
        isResizable: true,
        type: 'Highcharts',
        tableAxisMap: {
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
        store,
        sync: {
            visibility: true,
            tooltip: true,
            selection: true
        },
        type: 'Highcharts',
        tableAxisMap: {
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



You can check how this synchronization works in our [minimal dashboard demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/dashboard-minimal).
See the next question for possible syncrhonization events.

* * *
What are the synchronization events available in Highcharts Dashboards?
-----------------------------------------------------------------------
You can check how this synchronization works in our [minimal dashboard demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/dashboard-minimal).

The events, that can be synchronized between components are:
* 'visibility’
* 'selection'
* 'tooltip'
* ‘panning'

* * *
What browsers are supported?
---------------
The layout of our library is based on flexbox, so in general all browsers, which support flexbox should also work fine with Highcharts Dashboards.
In particular, those are Chrome, Edge, Firefox, and Safari.

* * *
