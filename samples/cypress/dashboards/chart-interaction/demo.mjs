import PluginHandler from  '../../../../code/es-modules/Dashboards/PluginHandler.js';
import Highcharts from  '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from  '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
import Dashboards from '../../../../code/es-modules/masters/dashboards.src.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);


const board = Dashboards.boardAsync('container', {
    editMode: {
        enabled: true
    },
    dataPool: {
        connectors: [{
            name: 'connector-1',
            type: 'CSV',
            options: {
                csv: `$GME,$AMC,$NOK
                    4,5,6
                    1,5,2
                    41,23,2`,
                firstRowAsNames: true
            }
        }]
    },
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
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
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
        connector: {
            name: 'connector-1'
        },
        sync: {
            visibility: true,
            highlight: true
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
        connector: {
            name: 'connector-1'
        },
        sync: {
            visibility: true,
            highlight: true
        }
    }]
});

window.addEventListener('resize', e => {
    board.mountedComponents.forEach(({ component }) => {
        component.resize();
    });
});
