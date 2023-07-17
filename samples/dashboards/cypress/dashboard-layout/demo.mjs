import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import PluginHandler from  '../../../../code/dashboards/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

let exportedLayoutId;

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
        }
    }
};

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            icon: 'https://code.highcharts.com/gfx/dashboards-icons/menu.svg',
            items: ['editMode', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                events: {
                    click: function () {
                        board.exportLocal();
                    }
                }
            }, {
                id: 'import-dashboard',
                text: 'Import saved dashboard',
                events: {
                    click: function () {
                        board = Board.importLocal();
                    }
                }
            }, {
                id: 'export-layout',
                text: 'Export 1 layout',
                events: {
                    click: function () {
                        exportedLayoutId = board.layouts[0].options.id;
                        board.layouts[0].exportLocal();
                    }
                }
            }, {
                id: 'delete-layout',
                text: 'Delete 1 layout',
                events: {
                    click: function () {
                        board.layouts[0].destroy();
                    }
                }
            }, {
                id: 'import-layout',
                text: 'Import saved layout',
                events: {
                    click: function () {
                        const layout = board.importLayoutLocal(
                            exportedLayoutId
                        );
                        console.log('Imported layout: ', layout);
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
        cell: 'cell-1',
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
        cell: 'cell-2',
        ...chartDemo
    }]
});
