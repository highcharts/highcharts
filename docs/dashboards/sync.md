## Setting up sync between two components via config

Sync works by [groups](#groups), which are set up by default for components sharing the same DataStore


```js
    components: [{
        cell: 'dashboard-col-0',
        isResizable: true,
        type: 'Highcharts',
        store,
        syncEvents: ['visibility', 'tooltip']
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        store,
        syncEvents: ['visibility', 'tooltip']
    }]
```

## Custom SyncHandlers

```js
    const altSyncHandler = [
        'altSelectionHandler', // a cute name
        'afterSelectionChange', // the event
        function (e) {
        // Callback for modifying the component
        }
    ];
    
    /* *
     * [name:string, callback: function]
     * /
    const altSyncEmitter  = [
      'selectionEmitter',
      function (this: ComponentTypes): Function | void {
          if (this instanceof HighchartsComponent) {
              const {
                  chart,
                  store,
                  id,
                  options: {
                      tableAxisMap
                  }
              } = this;

              const getX = (): string | undefined => {
                  if (tableAxisMap) {
                      const keys = Object.keys(tableAxisMap);

                      let i = 0;
                      while (i < keys.length) {
                          const key = keys[i];
                          if (tableAxisMap[key] === 'x') {
                              return key;
                          }

                          i++;
                      }
                  }
              };

              if (store && chart) {
                  return addEvent(chart, 'selection', (e): void => {
                      const groups = ComponentGroup.getGroupsFromComponent(id);
                      if ((e as any).resetSelection) {
                          const selection: SharedState.SelectionObjectType = {};
                          chart.axes.forEach((axis): void => {
                              selection[axis.coll] = {
                                  columnName: axis.coll === 'xAxis' ? getX() : void 0
                              };
                          });

                          groups.forEach((group): void => {
                              group.getSharedState().setSelection(selection, true, {
                                  sender: id
                              });
                          });

                          if (chart.resetZoomButton) {
                              chart.resetZoomButton = chart.resetZoomButton.destroy();
                          }
                          return;
                      }

                      // Smooth it out a bit
                      requestAnimationFrame((): void => {
                          const minMaxes = getAxisMinMaxMap(chart);
                          minMaxes.forEach((minMax): void => {
                              const { coll, extremes } = minMax;
                              groups.forEach((group): void => {
                                  group.getSharedState().setSelection(
                                      { [coll]: { ...extremes, columnName: coll === 'xAxis' ? getX() : void 0 } },
                                      false,
                                      {
                                          sender: id
                                      }
                                  );
                              });
                          });
                      });
                  });
              }
          }
      }
    ]
    ...

    syncHandlers: {
        selection: {
            handler: altSyncHandler,
            emitter: altSyncEmitter
        }
    }
```


## PresentationModifier

## Component groups

Components can be assigned to groups

via
```
group.addComponents(...componentIDs);
```

or

```
component.setActiveGroup(groupOrGroupIDOrNull)
```


Groups have a shared state that is accessible via

```js
component.activeGroup.getSharedState()
```


## component.postMessage
can be used to post data between several components

```ts
    public postMessage(
        message: Component.MessageType, // string or callback function
        target: Component.MessageTarget = { // target by type, groupID or componentID
            type: 'componentType',
            target: 'all'
        }
    ): void {

```
