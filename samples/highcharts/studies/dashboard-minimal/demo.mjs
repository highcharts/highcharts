
// Bring in other forms of Highcharts
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugin/HighchartsPlugin.js';
import DataGrid from '../../../../code/es-modules/DataGrid/DataGrid.js';
import GoogleStore from '../../../../code/es-modules/Data/Stores/GoogleSheetsStore.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const {PluginHandler, Dashboard: dashboard} = Dashboard;
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);


const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

store.load();

// let dashboard =  new dashboard('container', {
 new dashboard('container', {
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
        cell: 'dashboard-col-0',
        isResizable: true,
        type: 'Highcharts',
        chartOptions: {
            series: [{
                name: 'Series from options',
                data: store.table.modified.getRows()
            }],
            chart: {
                animation: false,
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
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            series: [{
                name: 'Series from options',
                data: store.table.modified.getRows()

            }],
            chart: {
                animation: false,
                type: 'column'
            }
        },
    }, {
        cell: 'dashboard-col-2',
        type: 'html',
        elements: [{

            tagName: 'div',
            id: 'datagrid'
        }
        ],
        dimensions: {
            // width: '100%'
        },
        events: {
            mount: function () {
                // call action
            const container = document.querySelector('#datagrid');
                new DataGrid(container, {
                    dataTable: store.table.modified
                    // columnHeaders: ['Apples', 'Plums', 'Bananas', 'Pears', 'Oranges', 'Potatoes'],
                });
            }
        }
    }]
});