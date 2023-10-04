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

const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'connector-1',
            type: 'CSV',
            options: {
                csv: csvData
            }
        }]
    },
    gui: {
        layouts: [{
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
            connector: {
                id: 'connector-1'
            },
            type: 'Highcharts',
            sync: {
                highlight: true,
                visibility: true,
                extremes: true
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'y',
                hiddenColumn: null
            },
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                chart: {
                    animation: false,
                    type: 'column',
                    zoomType: 'x'
                },
                plotOptions: {
                    series: {
                        animation: false,
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
            connector: {
                id: 'connector-1'
            },
            editable: true,
            sync: {
                highlight: true,
                visibility: true,
                extremes: true
            },
            visibleColumns: ['Food', 'Vitamin A'],
            dataGridOptions: {
                columns: {
                    'Vitamin A': {
                        headerFormat: '{text} (IU)'
                    }
                }
            }
        }
    ]
}, true);
