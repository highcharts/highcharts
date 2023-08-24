import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/dashboards/es-modules/masters/datagrid.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import '../../../../code/es-modules/masters/modules/draggable-points.src.js';
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
        dataPool: {
            connectors: [
                {
                    id: 'data',
                    type: 'CSV',
                    options: {
                        csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv'
                    }
                }
            ]
        },
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
                connector: {
                    id: 'data'
                },
                type: 'Highcharts'
            },
            {
                cell: 'dashboard-col-2',
                connector: {
                    id: 'data'
                },
                type: 'DataGrid'
            }
        ]
    },
    true
);
