import Board from '../../../../code/es-modules/Dashboards/Board.js';
import PluginHandler from '../../../../code/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

const board = new Board('container', {
    editMode: {
        enabled: true
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
    components: [
        {
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
            }
        },
        {
            cell: 'dashboard-col-3',
            isResizable: true,
            type: 'html',
            elements: [{
                tagName: 'img',
                attributes: {
                    src: 'https://www.highcharts.com/docs/assets/images/titleandsubtitle-6658386ccc86d7ceb7d2bd173ae88e8e.png'
                }
            }]
        }
    ]
});
