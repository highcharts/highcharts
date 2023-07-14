
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import PluginHandler from '../../../../code/dashboards/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

Dashboards.board('container', {
    editMode: {
        enabled: true,
            dragDrop: {
                enabled: false
            },
            resize: {
                enabled: false
            },
        contextMenu: {
            enabled: true,
            items: ['editMode']
        },
    },

    gui: {
        layouts: [
            {
                rows: [{
                    cells: [{
                        id: 'dashboard-col-0'
                    }, {
                        id: 'dashboard-col-1'
                    }]
                }]
            }
        ]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            type: 'Highcharts',
            chartOptions: {
                series: [{
                    data: [1, 2, 1, 4]
                }]
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'HTML',
            elements: [{
                tagName: 'h1',
                textContent: 'Placeholder text'
            }]
        }
    ]
});