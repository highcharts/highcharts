// Import Highcharts module
import * as Highcharts from 'highcharts';
import * as Dashboards from '@highcharts/dashboards/dashboards';
import DataGrid from '@highcharts/dashboards/es-modules/DataGrid/DataGrid';
import HighchartsPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin';
import DataGridPlugin from '@highcharts/dashboards/es-modules/Dashboards/Plugins/DataGridPlugin';

HighchartsPlugin.custom.connectHighcharts(Highcharts as any);
(Dashboards.PluginHandler as any).addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid);
(Dashboards.PluginHandler as any).addPlugin(DataGridPlugin);


// Create a chart
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
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-cell-1',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }]
});
