Navigator Component
===================



## Overview

The NavigatorComponent is part of the Dashboards plugins. It utilizes the
navigator of Highcharts Stock to provide an overview over the values of a table
column. Users can set a range in the Navigator, which can be synchronized as
extremes with other Dashboard components for data inspection.



## Example

A typical use case for the synchronization of extremes can be seen in the
[climate demo](https://highcharts.com/demo/dashboards/climate).
In the demo the NavigatorComponent shows the timeline of the selected climate
indicator for the active city.

``` JavaScript
Dashboard.board('container', {
  components: [
    {
      cell: 'time-range-selector'
      type: 'Navigator',
      connector: {
        id: 'Range Selection'
      },
      columnAssignments: {
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



## Crossfilter

Alternatively to the synchronization of extremes the NavigatorComponent can
synchronize extremes in a shared crossfilter. This crossfilter is managed by a
a RangeModifier which sources the table of a connector. All components have to
share the same connector and table to make the crossfilter work.

Read more about components synchronization [here](https://www.highcharts.com/docs/dashboards/synchronize-components).

### Crossfilter Example

<iframe style="width: 100%; height: 600px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/demo/crossfilter" allow="fullscreen"></iframe>

In the
[crossfilter demo](https://highcharts.com/demo/dashboards/crossfilter)
you see the setup to limit the amount of data points. You have to define column
ranges with the help of the NavigatorComponent and a shared DataConnector.

``` JavaScript
Dashboard.board('container', {
  components: [
    {
      cell: 'Top-left'
      type: 'Navigator',
      connector: {
        id: 'Economy'
      },
      columnAssignments: {
        'Agriculture': 'y'
      },
      sync: {
        crossfilter: true
      }
    },
    {
      cell: 'Top-left'
      type: 'Navigator',
      connector: {
        id: 'Economy'
      },
      columnAssignments: {
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
