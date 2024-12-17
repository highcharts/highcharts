Navigator Component
===================



## Overview

The `NavigatorComponent` is part of the **Dashboards** plugins. It utilizes the
navigator of [Highcharts Stock](https://www.highcharts.com/docs/stock/navigator) to provide an overview of the values of a table
column. Users can set a range in the Navigator, which can be synchronized as
extremes with other Dashboard components for data inspection.



## Example

A typical use case for the synchronization of extremes can be seen in the
[climate demo](https://highcharts.com/demo/dashboards/climate).
In the demo, the NavigatorComponent shows the timeline of the selected climate
indicator for the active city.

``` JavaScript
Dashboard.board('container', {
  components: [
    {
      renderTo: 'time-range-selector'
      type: 'Navigator',
      connector: {
        id: 'Range Selection'
      },
      columnAssignment: {
        'TXC': 'y'
      },
      sync: {
        extremes: true
      }
    },
    // ...
  ],
  // ...
});
```



## Components synchronization

The Navigator Component can be synced with other components in Dashboards. Two synchronization types are predefined for the Navigator Component: [`crossfilter`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_NavigatorComponent_NavigatorComponentOptions.SyncOptions#crossfilter) and [`extremes`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_NavigatorComponent_NavigatorComponentOptions.SyncOptions#extremes). You can find more information about it in the [sync article](https://www.highcharts.com/docs/dashboards/synchronize-components).

`Crossfilter` sync is specific to the `NavigatorComponent`. You can learn more about this below.

## Crossfilter


Alternatively, the `NavigatorComponent` can
synchronize extremes in a shared `crossfilter`. The crossfilter is managed by 
a `RangeModifier`, which sources the connector's data table. All components must
share the same connector and table to make the `crossfilter` work.

For `crossfilter` sync, the `affectNavigators` option must be enabled, which
causes, in addition to changing the content of the table, the content of
other crossfilters. See the demo [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/crossfilter-affecting-navigators).

Read more about components synchronization [here](https://www.highcharts.com/docs/dashboards/synchronize-components).

### Crossfilter Example

<iframe style="width: 100%; height: 600px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/demo/crossfilter" allow="fullscreen"></iframe>

In the [crossfilter demo](https://highcharts.com/demo/dashboards/crossfilter)
you see the setup to limit the amount of data points. You have to define column
ranges with the help of the NavigatorComponent and a shared DataConnector.

```js
Dashboard.board('container', {
  components: [
    {
      renderTo: 'Top-left'
      type: 'Navigator',
      connector: {
        id: 'Economy'
      },
      columnAssignment: {
        'Agriculture': 'y'
      },
      sync: {
        crossfilter: true
      }
    },
    {
      renderTo: 'Top-left'
      type: 'Navigator',
      connector: {
        id: 'Economy'
      },
      columnAssignment: {
        'Industry': 'y'
      },
      sync: {
        crossfilter: true
      }
    },
    // ...
  ],
  // ...
});
```
