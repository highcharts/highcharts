
// Bring in other forms of Highcharts
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugin/HighchartsPlugin.js';
import DataGrid from '../../../../code/es-modules/DataGrid/DataGrid.js';
import DataTable from '../../../../code/es-modules/Data/DataTable.js';

const {PluginHandler, Dashboard: dashboard} = Dashboard;
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);



const headers = ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Potatoes'];
const columns = (() => {
    const makeRandomRows = () => (new Array(60)).fill('').map(() => (10 * Math.random()).toFixed(2));
    const cols = {};
    for (let i = 0; i < headers.length; ++i) {
        cols[headers[i]] = makeRandomRows();
    }
    return cols;
})();

// let dashboard =  new Dashboard('container', {
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
                data: [1, 2, 1, 4]
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
            series: [{
                name: 'Series from options',
                data: [1, 2, 1, 4]
            }],
            chart: {
                animation: false,
                type: 'column'
            }
        },
    }, {
        cell: 'dashboard-col-2',
        type: 'html',
        dimensions: {
            // width: '100%'
        },
        events: {
            afterRender: function () {
                // call action
            const container = document.querySelector('#dashboard-col-2');
                new DataGrid(container,{
                    dataTable: new DataTable(columns)
                });
            }
        }
    }]
});