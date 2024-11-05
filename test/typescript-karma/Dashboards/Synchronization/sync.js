//@ts-check
import Highcharts from '../../../../code/es-modules/masters/highstock.src.js';
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/datagrid/es-modules/masters/datagrid.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

const { test } = QUnit;


test('Sync events leak in updated components', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const dashboard = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'micro-element',
                type: 'JSON',
                options: {
                    data: [
                        ['Food', 'Vitamin A',  'Iron'],
                        ['Beef Liver', 6421, 6.5],
                        ['Lamb Liver', 2122, 6.5],
                        ['Cod Liver Oil', 1350, 0.9],
                        ['Mackerel', 388, 1],
                        ['Tuna', 214, 0.6]
                    ]
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'chart'
                    }, {
                        id: 'datagrid'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'chart',
            type: 'Highcharts',
            connector: {
                id: 'micro-element'
            },
            sync: {
                highlight: true,
                visibility: true,
                extremes: true
            }
        }, {
            renderTo: 'datagrid',
            type: 'DataGrid',
            connector: {
                id: 'micro-element'
            },
            sync: {
                highlight: true,
                visibility: true,
                extremes: true
            }
        }]
    }, true);

    const cChart = dashboard.mountedComponents[0].component;
    const cDataGrid = dashboard.mountedComponents[1].component;

    const testLeaks = async (component) => {
        // only the most important events, not all possible ones are checked
        const events = {
            setConnector: component.hcEvents.setConnector?.length,
            afterSetConnector: component.hcEvents.afterSetConnector?.length,
            afterRender: component.hcEvents.afterRender?.length
        };

        await component.update({});

        // Disconnect the resize observer to avoid errors in the test
        component.dataGrid?.viewport.resizeObserver.disconnect();

        return Object.keys(events).every((key) => (
            events[key] === component.hcEvents[key]?.length
        ));
    }

    assert.ok(
        await testLeaks(cChart),
        'Highcharts Component should not leak events when update.'
    );

    assert.ok(
        await testLeaks(cDataGrid),
        'DataGrid Component should not leak events when update.'
    );
});


test('Custom sync handler & emitter', function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    assert.timeout(1000);
    const done = assert.async(2);
    Dashboards.board('container', {
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-1'
                    }]
                }]
            }]
        },
        components: [{
            type: 'HTML',
            renderTo: 'dashboard-1',
            elements: [{
                tagName: 'h1',
                textContent: 'test'
            }],
            sync: {
                customSync: {
                    handler: function() {
                        assert.ok(
                            this.sync.registeredSyncHandlers.customSync,
                            'Custom sync handler should be registered.'
                        );
                        done();
                    },
                    emitter: function() {
                        assert.ok(
                            this.sync.registeredSyncEmitters.customSync,
                            'Custom sync emitter should be registered.'
                        );
                        done();
                    }
                }
            }
        }]
    });
});


test('There should be no errors when syncing with chart with different extremes', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const dashboard = await Dashboards.board('container', {
        dataPool: {
          connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
              data: Array.from(Array(200)).map((_, i) => {
                if (i === 0) {
                  return ['Series']
                }
                return [Math.random() * 10]
              })
            }
          }]
        },
        gui: {
          layouts: [{
            id: 'layout-1',
            rows: [{
              cells: [{
                id: 'dashboard-col-0'
              }, {
                id: 'dashboard-col-1'
              }]
            }]
          }]
        },
        components: [{
          renderTo: 'dashboard-col-0',
          type: 'Highcharts',
          chartConstructor: 'stockChart',
          chartOptions: {
            xAxis: {
                max: 100
            }
          },
          connector: {
            id: 'data'
          },
          sync: {
            highlight: true,
          }
        }, {
          renderTo: 'dashboard-col-1',
          type: 'Highcharts',
          connector: {
            id: 'data'
          },
          sync: {
            highlight: true,
          }
        }]
    }, true);

    assert.ok(
        dashboard.dataCursor.emitCursor(dashboard.dataPool.connectors.data.table, {
            type: 'position',
            row: 120,
            column: 'Series',
            state: 'point.mouseOver'
        }),
        'No errors should be thrown'
    );
});
