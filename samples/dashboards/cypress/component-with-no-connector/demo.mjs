import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/dashboards/es-modules/masters/datagrid.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';
import DataGridPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/DataGridPlugin.js';

Highcharts.win.Highcharts = Highcharts;

const { PluginHandler } = Dashboards;

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid.DataGrid);
PluginHandler.addPlugin(DataGridPlugin);

Dashboards.board(
    'container',
    {
        dataPool: {},
        gui: {
            layouts: [
                {
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'dashboard-col-1'
                                },
                                {
                                    id: 'dashboard-col-2'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'dashboard-col-1',
                type: 'Highcharts'
            },
            {
                cell: 'dashboard-col-2',
                type: 'DataGrid'
            }
        ]
    },
    true
).then(async dash => {
    const dataPool = dash.dataPool;

    await dataPool.loadConnector({
        id: 'updatedData',
        type: 'CSV',
        options: {
            csv: `Food,Vitamin A
            Beef Liver,6421
            Lamb Liver,2122
            Cod Liver Oil,1350
            Mackerel,388
            Tuna,214`
        }
    });

    await dash.mountedComponents[0].component.update({
        connector: {
            id: 'updatedData'
        },
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        sync: {
            highlight: true
        }
    });

    await dash.mountedComponents[1].component.update({
        connector: {
            id: 'updatedData'
        },
        sync: {
            highlight: true
        }
    });
});
