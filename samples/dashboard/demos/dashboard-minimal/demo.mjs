
// Bring in other forms of Highcharts
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
import DataGridPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/DataGridPlugin.js';

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
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1', // mandatory
            rowClassName: 'custom-row', // optional
            cellClassName: 'custom-cell', // optional
            rows: [{
                // id: 'dashboard-row-0',
                cells: [{
                    id: 'dashboard-col-0',
                    width: '50%'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-12'
                }]
            }, {
                id: 'dashboard-row-1',
                cells: [{
                    id: 'dashboard-col-2',
                    width: '1'
                }]
            }]
        }]
    },
    components: [
        {
            store,
            syncEvents: [
                'visibility',
                'selection',
                'tooltip'
            ],
            cell: 'dashboard-col-0',
            isResizable: true,
            type: 'Highcharts',
            tableAxisMap: {
                Food: 'x',
                'Vitamin A': 'value'
            },
            chartOptions: {
                chart: {
                    type: 'pie'
                }
            },
            events: {
                mount: function () {
                    // call action
                    console.log('dashboard-col-0 mount event');
                },
                unmount: function () {
                    console.log('dashboard-col-0 unmount event');
                }
            }
        }, {
            cell: 'dashboard-col-1',
            store,
            syncEvents: [
                'visibility',
                'tooltip',
                'selection'
            ],
            type: 'Highcharts',
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
                }
            }
        }, {
            cell: 'dashboard-col-12',
            store,
            syncEvents: [
                'visibility',
                'tooltip',
                'selection'
            ],
            type: 'Highcharts',
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
                    type: 'scatter'
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            store,
            editable: true,
            syncEvents: ['tooltip']
        }]
});
