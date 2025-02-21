import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import DataGrid from '../../../../code/datagrid/es-modules/masters/datagrid.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import '../../../../code/es-modules/masters/modules/draggable-points.src.js';


Highcharts.win.Highcharts = Highcharts;


Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

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
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
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
    components: [{
        renderTo: 'dashboard-col-0',
        connector: {
            id: 'connector-1',
            columnAssignment: [{
                seriesId: 'Vitamin A',
                data: ['Food', 'Vitamin A']
            }]
        },
        type: 'Highcharts',
        sync: {
            highlight: true,
            visibility: true,
            extremes: true
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
        renderTo: 'dashboard-col-1',
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
        dataGridOptions: {
            header: ['Food', 'Vitamin A'],
            columnDefaults: {
                cells: {
                    editable: true
                }
            },
            columns: [{
                id: 'Vitamin A',
                header: {
                    format: '{id} (IU)'
                }
            }]
        }
    }]
}, true);
