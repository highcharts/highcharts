Synchronizing components
===

Components may require synchronization that aids in visualizing, navigating
and highlighting specific data.

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/demo/minimal allow="fullscreen"></iframe>


## How to synchronize the components?

To synchronize components, you need to specify the event you want to synchronize between each component.
Additionally, both components must use the same connector defined in the [dataPool](https://www.highcharts.com/docs/dashboards/data-handling), which is necessary for all predefined synchronization types to work.

List of synchronization types for each component type:

|Component's type|highlight|extremes|visibility|crossfilter
|---|---|---|---|---|
|[HTML](https://www.highcharts.com/docs/dashboards/html-component)|no|no|no|no|
|[Highcharts](https://www.highcharts.com/docs/dashboards/highcharts-component)|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.SyncOptions#highlight)|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.SyncOptions#extremes)|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HighchartsComponent_HighchartsComponentOptions.SyncOptions#visibility)|no|
|[DataGrid](https://www.highcharts.com/docs/dashboards/datagrid-component)|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.SyncOptions#highlight)|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.SyncOptions#extremes)|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_DataGridComponent_DataGridComponentOptions.SyncOptions#visibility)|no|
|[KPI](https://www.highcharts.com/docs/dashboards/kpi-component)|no|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_KPIComponent_KPIComponentOptions.SyncOptions#extremes)|no|no|
|[Navigator](https://www.highcharts.com/docs/dashboards/navigator-component)|no|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_NavigatorComponent_NavigatorComponentOptions.SyncOptions#extremes)|no|[yes](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_NavigatorComponent_NavigatorComponentOptions.SyncOptions#crossfilter)|

In addition to the predefined syncs, you can define your own custom synchronization. See [here](#custom-synchronization) how to do it.


### Sync declaration

```js
sync: {
    crossfilter: true
}
```

The above is a shortened way that in which you cannot set additional options if
a given type of synchronization provides them. Only those enabled by default are
set.

If you would like to enable, for example, the `affectNavigator` option for the crossfilter sync, you must use a declaration like this:

```js
sync: {
    crossfilter: {
        enabled: true,
        affectNavigator: true
    }
}
```

The options above are only available for the [Navigator Component](https://www.highcharts.com/docs/dashboards/navigator-component#crossfilter). Each component can have its own options for the predefined syncs. You can find their descriptions in the articles about these components (eg. the [Highlight Sync options for the Highcharts Component](https://www.highcharts.com/docs/dashboards/highcharts-component#highlight-sync-options)).

An example of synchronized components:

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
      type: 'Highcharts'
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
      type: 'Highcharts'
  }]
});
```

Each synchronization has also `handler` and `emitter` options. The `handler` handles events coming to the component, while the `emitter` sends events from the component. In the case of synchronization types that communicate bilaterally (e.g. highlight), you can disable `emitter` or `handler` by overwriting their value to `false`. You can read about it more in [API docs](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Sync_Sync.Sync.OptionsEntry).

For example, a component with this set of highlight options will cause other components with this synchronization enabled to respond to hover, but this component will not respond to the hover of the others:
```js
sync: {
    highlight: {
        enabled: true,
        handler: false
    }
}
```
Similarly, this set of options allows a component to have highlighted points, but it will not trigger highlighting in other components:
```js
sync: {
    highlight: {
        enabled: true,
        emitter: false
    }
}
```


### Sync groups

By default, all components with a given type of synchronization enabled and sharing the same connector are synchronized. If you want to divide synchronized components into groups, you can do so using the [`group`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Sync_Sync.Sync.OptionsEntry#group) option, which is available for each type of synchronization.

Example:
```js
sync: {
    visibility: {
        enabled: true,
        group: 'group-name'
    }
}
```

Demo:
<iframe style="width: 100%; height: 651px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/sync/groups allow="fullscreen"></iframe>


## Custom synchronization

Each type of synchronization works thanks to defined functions such as `handler` and `emitter`. These functions are called when the component is loaded. Their main task is to register sending (`emitter`) and receiving (`handler`) events for a given component. The `this` keyword refers to the reference of the component for which sync is registered. The `emitter` and `handler` functions should return a function containing event unregistering to enable disabling sync or re-registering it with changed options after `component.update` method.

For each component, you can add or overwrite a custom [definition of the existing synchronization](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_Sync_Sync.Sync.OptionsEntry) `handler` and/or `emitter` to expand its functionality. You can also define your own synchronization from scratch.

```js
sync: {
    customSync: {
        emitter: function() {
            registerEmitterEvents();
            return () => {
                unregisterEmitterEvents();
            }
        },
        handler: function() {
            registerHandlerEvents();
            return () => {
                unregisterHandlerEvents();
            }
        }
    }
}
```

Synchronization most often uses the `dataCursor` object, which is common to the entire board. It points to a data table and allows you to create a relationship between the states of the user interface and the table cells, columns, or rows. The cursor can emit and receive events.


To add synchronization to a [custom component](https://www.highcharts.com/docs/dashboards/custom-component), define a static field `predefinedSyncConfig` which should contain two options:
* `defaultSyncOptions` - a record of default options per synchronization type (can be empty if we do not want to define options).
* `defaultSyncPairs` - a record of default `emitter` and `handler` definitions per defined synchronization type.

Additionally, after the component has finished rendering, you should run the `this.sync.start()` method to register the options and run the handlers and emitters.


```js
class CustomComponent extends Component {
    static predefinedSyncConfig = {
        defaultSyncOptions: {
            customSync: {
                sampleOption: true
            }
        },
        defaultSyncPairs: {
            customSync: {
                emitter: function() {
                    ...
                },
                handler: function() {
                    ...
                }
            }
        }
    };

    constructor(cell, options) {
        super(cell, options);
        return this;
    }

    render() {
        super.render();
        this.sync.start();
        return this;
    }
}
```

The demo below shows a custom sync connecting the Highcharts Component with a custom component:
<iframe style="width: 100%; height: 651px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/sync/custom-component-sync allow="fullscreen"></iframe>
