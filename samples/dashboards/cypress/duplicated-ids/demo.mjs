
// Bring in other forms of Highcharts
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
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
        type: 'HTML',
        cell: 'dashboard-col-0',
        elements: [
            {
                tagName: 'h1',
                textContent: 'Your first dashboard'
            }
        ]
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});

Dashboards.board('container2', {
 gui: {
        layouts: [{
            id: 'layout-1',
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
        type: 'HTML',
        cell: 'dashboard-col-0',
        elements: [
            {
                tagName: 'h1',
                textContent: 'Your first dashboard'
            }
        ]
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
