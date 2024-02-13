Synchronizing components
===

Components may require synchronization that aids in visualizing, navigating
and highlighting specific data.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/demo/minimal allow="fullscreen"></iframe>

## How to synchronize the components?
To synchronize components you have to specify which event you want to synchronize between each component, as well as they have to use the same connector defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling).

The events, that can be synchronized between components are:
* [visibility](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Component.Component.SyncOptions#visibility)
* [extremes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Component.Component.SyncOptions#extremes)
* [highlight](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Component.Component.SyncOptions#highlight)
* [crossfilter](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Component.Component.SyncOptions#crossfilter) (Can be applied only to [Navigator Component](https://www.highcharts.com/docs/dashboards/navigator-component))

### Sync declaration

```js
sync: {
    crossfilter: true
}
```

The above is a shortened way that in which you cannot set additional options if
a given type of synchronization provides them. Only those enabled by default are
set.

If you would like to enable, for example, the `affectNavigator` option for the
crossfilter sync, you must use a declaration like this:

```js
sync: {
    crossfilter: {
        enabled: true,
        affectNavigator: true
    }
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
      renderTo: 'dashboard-col-0',
      type: 'Highcharts',
      columnAssignment: {
          Food: 'x',
          'Vitamin A': 'value'
      }
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
      columnAssignment: {
          Food: 'x',
          'Vitamin A': 'y'
      }
  }]
});
```

### Highlight sync options

Highlight sync can have additional options:
```js
sync: {
    highlight: {
        enabled: true,
        highlightPoint: true,
        showTooltip: false,
        showCrosshair: true
    }
}
```

Demo:
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/sync/sync-highlight-options allow="fullscreen"></iframe>



## Components sync compatibility

|Component's type|highlight|extremes|visibility|crossfilter
|---|---|---|---|---|
|[HTML](https://www.highcharts.com/docs/dashboards/html-component)|no|no|no|no|
|[Highcharts](https://www.highcharts.com/docs/dashboards/highcharts-component)|yes|yes|yes|no|
|[DataGrid](https://www.highcharts.com/docs/dashboards/datagrid-component)|yes|yes|yes|no|
|[KPI](https://www.highcharts.com/docs/dashboards/kpi-component)|no|yes|no|no|
|[Navigator](https://www.highcharts.com/docs/dashboards/navigator-component)|no|yes|no|yes|


## Custom synchronization

Each type of synchronization works thanks to defined functions such as `handler` and `emitter`. These functions are called when the component is loaded. Their main task is to register sending (`emitter`) and receiving (`handler`) events for a given component. The `this` keyword refers to the reference of the component for which sync is registered. The `emitter` and `handler` functions should return a function containing event unregistering to enable disabling sync or re-registering it with changed options after `component.update` method.

For each component, you can add or overwrite a custom [definition of the existing synchronization](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Sync_Sync.Sync.OptionsEntry) `handler` and/or `emitter` to expand its functionality. You can also define your own synchronization from scratch.

```js
sync: {
    customSync: {
        handler: function() {
            registerHandlerEvents();
            return () => {
                unregisterHandlerEvents();
            }
        }
        emitter: function() {
            registerEmitterEvents();
            return () => {
                unregisterEmitterEvents();
            }
        }
    }
}
```

Synchronization most often uses the `dataCursor` object, which is common to the entire board. It points to a data table and allows you to create a relationship between the states of the user interface and the table cells, columns, or rows. The cursor can emit and receive events.

To add synchronization to a [custom component](https://www.highcharts.com/docs/dashboards/custom-component), define the `sync` field by creating a new object of the `Component.Sync` class, where the component object (`this`) should be provided as the first argument of the constructor, and the second object with default handlers and emitters for predefined synchronizations for this component. Additionally, after the component has finished loading, you should run the `this.sync.start()` method to register handlers and emitters.

```js
class CustomComponent extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.sync = new Component.Sync(this, this.syncHandlers);
        return this;
    }

    async load() {
        await super.load();
        this.sync.start();
        return this;
    }
}
```

The demo below shows a custom sync connecting the Highcharts Component with a custom component called "Averages Mirror":
<iframe style="width: 100%; height: 651px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/sync/custom-component-sync allow="fullscreen"></iframe>
