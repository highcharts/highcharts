import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import PluginHandler from '../../../../code/dashboards/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);


Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
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
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                animation: false,
                type: 'column'
            },
            plotOptions: {
                series: {
                    animation: false
                }
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
            id: 'connector-1',
            columnAssignment: [{
                seriesId: '$NOK',
                data: '$NOK'
            }]
        },
        sync: {
            visibility: true,
            highlight: true
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            type: 'column',
            chart: {
                animation: false
            },
            plotOptions: {
                series: {
                    animation: false
                }
            }
        },
        connector: {
            id: 'connector-1',
            columnAssignment: [{
                seriesId: '$GME',
                data: '$GME'
            }, {
                seriesId: '$AMC',
                data: '$AMC'
            }]
        },
        sync: {
            visibility: true,
            highlight: true
        }
    }]
}, true);
