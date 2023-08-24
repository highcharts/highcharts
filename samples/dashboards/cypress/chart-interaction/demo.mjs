import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import PluginHandler from '../../../../code/dashboards/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);


Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    dataPool: {
        connectors: [{
            id: 'connector-1',
            type: 'CSV',
            options: {
                csv: `$GME,$AMC,$NOK
                    4,5,6
                    1,5,2
                    41,23,2`
            }
        }]
    },
    gui: {
        enabled: true,
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
        events: {
            mount: function () {
                document.getElementById('mount').value = 'mount';
            },
            unmount: function () {
                document.getElementById('unmount').value = 'unmount';
            },
            resize: function () {
                document.getElementById('resize').value = 'resize';
            },
            update: function () {
                document.getElementById('update').value = 'update';
            }
        },
        connector: {
            id: 'connector-1'
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
        connector: {
            id: 'connector-1'
        },
        sync: {
            visibility: true,
            highlight: true
        }
    }]
}, true);