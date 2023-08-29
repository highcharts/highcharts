Synchronizing components
===

Components might need to work together to accomplish a specific task.
Synchronization involves making sure that these components interact seamlessly,
exchanging information at the right time.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/demo/minimal allow="fullscreen"></iframe>

## How to synchronize the components?
To synchronize components you have to specify which event you want to synchronize between each component, as well as they have to use the same connector defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling).

The events, that can be synchronized between components are:
* [visibility](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-visibility/)
* [extremes](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/sync-extremes/)
* [highlight](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/sync-highlight/)


### Sync declaration
```
sync: {
  highlight: true
}
```

The full example of synchronized components:

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
      }
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
      }
  }]
});
```

