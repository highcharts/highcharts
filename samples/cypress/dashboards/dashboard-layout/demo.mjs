import Dashboards from '../../../../code/es-modules/masters/dashboards.src.js';
import PluginHandler from  '../../../../code/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

let exportedLayoutId;

const chartDemo = {
    type: 'Highcharts',
    chartOptions: {
        type: 'line',
        series: [{
            name: 'Series from options',
            data: [1, 2, 3, 4]
        }],
        chart: {
            animation: false,
            height: 150
        }
    }
};

const board = Dashboards.board('container-nested-layout', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            icon: 'https://code.highcharts.com/gfx/dashboard-icons/menu.svg',
            items: ['editMode']
        },
        resize: {
            enabled: true,
            styles: {
                minWidth: 20,
                minHeight: 50
            },
            type: 'xy',
            snap: {
                width: 20,
                height: 20
            }
        }
    },
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-in-1', // mandatory
            rows: [{
                cells: [{
                    id: 'dashboard-col-nolayout-0'
                }, {
                    id: 'dashboard-col-layout-0'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-nolayout-0',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                animation: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            credits: {
                enabled: false
            }
        }
    }, {
        cell: 'dashboard-col-layout-0',
        ...chartDemo
    }]
});
