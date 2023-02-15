import Board from  '../../../../code/es-modules/Dashboards/Board.js';
import PluginHandler from  '../../../../code/es-modules/Dashboards/PluginHandler.js';

// Bring in other forms of Highcharts
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

let board = new Board('container-nested-layout', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                events: {
                    click: function () {
                        board.exportLocal();
                    }
                }
            }, {
                id: 'delete-dashboard',
                text: 'Delete current dashboard',
                events: {
                    click: function () {
                        board.destroy();
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
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        cell: 'dashboard-col-layout-0',
        ...chartDemo
    }]
});