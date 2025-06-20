import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import PluginHandler from  '../../../../code/dashboards/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

const chartDemo = {
    type: 'Highcharts',
    chartOptions: {
        series: [{
            name: 'Series from options',
            data: [1, 2, 3, 4]
        }],
        chart: {
            type: 'pie',
            animation: false,
            height: 150
        },
        plotOptions: {
            series: {
                animation: false
            }
        }
    }
};

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            icon: 'https://code.highcharts.com/dashboards/gfx/' +
                'dashboards-icons/menu.svg',
            items: ['editMode', {
                id: 'delete-layout',
                text: 'Delete 1 layout',
                events: {
                    click: function () {
                        board.layouts[0].destroy();
                    }
                }
            }]
        }
    },
    gui: {
        enabled: true,
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-1'
                }, {
                    id: 'cell-2'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'cell-1',
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
            plotOptions: {
                series: {
                    animation: false
                }
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
        renderTo: 'cell-2',
        ...chartDemo
    }]
});
