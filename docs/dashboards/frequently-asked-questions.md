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
1. Enabled layout creator (GUI)
To be able to use Dashboards with layout system and edit mode you first have to load the `layout` module.
The order of the imports is important, so make sure that the `layout` module is imported after the Dashboards module.

```html
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
```

Each cell must have an `id` field. The same id must be passed in the component config to the `renderTo` field. Example configuration of component and cell:

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
components: [{
    renderTo: 'dashboard-col-0',
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


2. Disabled default layout creator
You can create your own HTML structure of a layout, styled by CSS or other CSS framework (i.e Tailwind, Bootstrap).
Please remember that each container should have an unique `id` for rendered component.

```html
<div id="container">
<div>
    <div id="dashboard-col-0"></div>
</div>
</div>
```

```js
gui: {
    enabled: false
}
components: [{
    renderTo: 'dashboard-col-0',
    type: 'Highcharts',
    chartOptions: {
        chart: {
            type: 'pie'
        },
        series: [{data: [1,2,3]}]
    },
}]
```

[Here is the standalone demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout).
[Here is the tailwind demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout-tailwind).

*Please note that disabled GUI does not allow you to use the [Edit Mode](https://www.highcharts.com/docs/dashboards/edit-mode) module.

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
    renderTo: 'dashboard-col-0',
    type: 'Highcharts',
    chartOptions: {
        chart: {
            type: 'pie'
        }
    },
}, {
    renderTo: 'dashboard-col-1',
    connector: {
        id: 'Vitamin'
    },
    sync: {
        visibility: true,
        highlight: true,
        extremes: true
    },
    type: 'Highcharts',
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

* * *
How to style the Dashboard?
-----------------------------------------------------------------------
1. Enabled layout creator (GUI)
Dashboards has a default theme, which is applied to all of its components.
You need to import the default CSS stylesheet to your project, so that the dashboard displays correctly. You can do it by importing the following CSS files:

```css
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```


But you can also customize the style of the dashboard by adding your own CSS stylesheet.
More about this topic [in the Styling section](https://www.highcharts.com/docs/dashboards/style-by-css).

Use regular CSS media queries to adjust your layout to different screens.

Example:
```css
/* LARGE */
@media (max-width: 1200px) {
    #dashboard-cell-1 {
        flex: 1 1 33.333%;
    }
}

/* MEDIUM */
@media (max-width: 992px) {
    #dashboard-cell-1 {
        flex: 1 1 50%;
    }
}

/* SMALL */
@media (max-width: 576px) {
    #dashboard-cell-1 {
        flex: 1 1 100%;
    }
}
```

Note that each component which includes chart (Highcharts, KPI) uses [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) by default to style the chart. The CSS stylesheet needs to be imported, so that the Highcharts displays correctly.
To customize your chart styles, you can create your own themes, or just add your own individual CSS variables or rules found in our [docs.](https://www.highcharts.com/docs/chart-design-and-style/style-by-css).

2. Disabled default layout creator (GUI)
You can create your own HTML structure of a layout, styled by CSS or Tailwind.
Please remember that each container should have an unique `id` for rendered component.

[Here is the standalone demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout).
[Here is the tailwind demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout-tailwind).

*Please note that disabled GUI does not allow you to use the [Edit Mode](https://www.highcharts.com/docs/dashboards/edit-mode) module.
