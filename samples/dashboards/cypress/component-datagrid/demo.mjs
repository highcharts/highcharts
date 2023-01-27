import Dashboard from '../../../../code/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/es-modules/masters/datagrid.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import '../../../../code/es-modules/masters/modules/draggable-points.src.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
import DataGridPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/DataGridPlugin.js';

Highcharts.win.Highcharts = Highcharts;

const { CSVStore, PluginHandler } = Dashboard;

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid.DataGrid);
PluginHandler.addPlugin(DataGridPlugin);

const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

store.load();

const dashboard = new Dashboard.Dashboard('container', {
    store: store,
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
    components: [
        {
            cell: 'dashboard-col-0',
            store,
            type: 'Highcharts',
            sync: {
                tooltip: true
            },
            tableAxisMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                chart: {
                    animation: false,
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        dragDrop: {
                            draggableY: true,
                            dragPrecisionY: 1
                        }
                    }
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            store,
            editable: true,
            sync: {
                tooltip: true
            }
        }
    ]
});
