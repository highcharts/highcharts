import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import Dashboard from  '../../../../code/es-modules/Dashboards/Dashboard.js';
import PluginHandler from  '../../../../code/es-modules/Dashboards/PluginHandler.js';
import Highcharts from  '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from  '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

// A shared store
const store = new CSVStore(undefined, {
    csv: `$GME,$AMC,$NOK
 4,5,6
 1,5,2
 41,23,2`,
    firstRowAsNames: true
});
store.load();

console.log(store);

const dashboard = new Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1', // mandatory
            rowClassName: 'custom-row', // optional
            columnClassName: 'custom-column', // optional
            style: {
                fontSize: '1.5em',
                color: 'blue'
            },
            rows: [{
                // id: 'dashboard-row-0',
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                id: 'dashboard-row-1',
                style: {
                    color: 'red'
                },
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }, {
            id: 'layout-2', // mandatory
            rows: [{
                id: 'dashboard-row-2',
                cells: [{
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
        isResizable: true,
        type: 'Highcharts',
        chartOptions: {
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false,
                type: 'column'
            }
        },
        events: {},
        store,
        sync: {
          'visibility' : true, 
          'tooltip': true
        }
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            type: 'column',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        },
        events: {},
        store,
        sync: {
          'visibility' : true, 
          'tooltip': true
        }
    }]
});

window.addEventListener('resize', e => {
    dashboard.mountedComponents.forEach(({ component }) => {
        component.resize();
    });
});
