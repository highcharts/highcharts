// Import Highcharts module
import Highcharts from 'highcharts/es-modules/masters/highcharts.src';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src'
import DataGrid from '@highcharts/dashboards/es-modules/masters/datagrid.src'
import HighchartsPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin'
import DataGridPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/DataGridPlugin';

HighchartsPlugin.custom.connectHighcharts(Highcharts as any);
(Dashboards.PluginHandler as any).addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid as any);
(Dashboards.PluginHandler as any).addPlugin(DataGridPlugin);

// Create a new dashboard
Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-cell-1',
                }, {
                    id: 'dashboard-cell-2',
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-cell-1',
        type: 'KPI',
        value: 10
    }, {
        cell: 'dashboard-cell-2',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }]
});
