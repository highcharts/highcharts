Synchronizing components
===

Components may require synchronization that aids in visualizing, navigating
and highlighting specific data.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/demo/minimal allow="fullscreen"></iframe>

## How to synchronize the components?
To synchronize components you have to specify which event you want to synchronize between each component, as well as they have to use the same data connector defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling).

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

## Components sync compatibility

|Component's type|highlight|extremes|visibility
|---|---|---|---|
|[HTML](https://www.highcharts.com/docs/dashboards/html-component)|no|no|no
|[Highcharts](https://www.highcharts.com/docs/dashboards/highcharts-component)|yes|yes|yes
|[DataGrid](https://www.highcharts.com/docs/dashboards/datagrid-component)|yes|yes|yes
|[KPI](https://www.highcharts.com/docs/dashboards/kpi-component)|no|yes|no

## Custom Synchronization
By default, Dashboards support three synchronization modes: `highlight`, `extremes` and `visibility`
in its components. However, there may be situations where you require custom functionality tailored to your specific needs. In such cases, you can define your own custom synchronization.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/component-options/custom-sync/ allow="fullscreen"></iframe>

## How to start
1. To enable custom synchronization, you must use the same data connector between synchronized components, just as you would with the other types of synchronization modes (`highlight`, `extremes`, `visibility`).

2. Define a unique event name within the sync object and reference the handler and emitter functions.

```js
sync: {
    highlightMarker: {
        handler: highlightMarkerHandler,
        emitter: highlightMarkerEmitter
    }
}
```

Please note that the `highlightMarkerHandler` and `highlightMarkerEmitter` should be references to your own functions. Examples of these functions will be provided in the next step.

3. Handler
The handler is responsible for receiving input from the connector and taking appropriate actions. The handler can be divided into three main parts.

First, the section where you register your syncs:

```js
if (board) {
    registerCursorListeners();

    this.on('setConnector', () => unregisterCursorListeners());
    this.on('afterSetConnector', () => registerCursorListeners());
}
```

Second, the definition of listeners:

```js
const { dataCursor: cursor } = board;
cursor.addListener(table.id, 'point.mouseOver', handleCursor);
cursor.addListener(table.id, 'point.mouseOut', handleCursorOut);
```

Listeners define the actions to be taken when a trigger event occurs.
Don't forget to unregister these events when necessary:

```js
board.dataCursor.removeListener(table.id, 'point.mouseOver', handleCursor);
board.dataCursor.removeListener(table.id, 'point.mouseOut', handleCursorOut);
```

The final step is to define your custom actions, which are triggered by the event listeners above.
In our example it's the `handleCursor` and `handleCursorOut`.

4. Emitter
The emitter generates the output to the connector.

To achieve this, you need to call the `emitCursor` function with the required parameters:

```js
const { dataCursor: cursor } = board;

cursor.emitCursor(table, {
    type: 'position',
    row: this.index,
    column: series.name,
    state: 'point.mouseOver'
});
```

More information about cursor you can refer to the [article](https://www.highcharts.com/docs/dashboards/data-handling)
