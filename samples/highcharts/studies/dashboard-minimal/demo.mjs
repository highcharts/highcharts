
// Bring in other forms of Highcharts
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';

const { CSVStore, PluginHandler } = Dashboard;
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

store.load();

 new Dashboard.Dashboard('container', {
    store: store,
    editMode: {
        enabled: false
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
                    width: '50%',
                }, {
                    id: 'dashboard-col-1',
                    width: '1/2',
                }]
            }, {
                id: 'dashboard-row-1',
                cells: [{
                    id: 'dashboard-col-2',
                    width: '1',
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
        /*dimensions: {
            width: 400,
            height: 400
        },*/
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
        },
    }, {
        cell: 'dashboard-col-2',
        type: 'html',
        syncEvents: [
            'visibility',
            'selection',
            'tooltip'
        ],
        elements: [{
            tagName: 'div',
            id: 'datagrid'
        }],
        dimensions: {
            // width: '100%'
        height:'100%'
        },
        events: {
            mount: function () {
                // call action
                const container = document.querySelector('#datagrid');
                const datagrid = new Dashboard.DataGrid(container, {
                    editable: false,
                    dataTable: store.table.modified
                });
            }
        }
    }]
});
