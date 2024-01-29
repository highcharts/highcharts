//@ts-check
import Highcharts from '../../../../code/es-modules/masters/highstock.src.js';
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/datagrid/es-modules/masters/datagrid.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid.DataGrid);

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
            cell: 'chart',
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
            cell: 'datagrid',
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
