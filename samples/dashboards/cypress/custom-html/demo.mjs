// Bring in other forms of Highcharts
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import Grid from '../../../../code/grid/es-modules/masters/grid-pro.src.js';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(Grid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'connector-1',
            type: 'CSV',
            csv: `ABC,DEF
                    4,5
                    1,5
                    41,23`
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'connector-1'
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'HTML',
        html: '<div>HTML component</div>'
    }, {
        renderTo: 'dashboard-col-2',
        connector: {
            id: 'connector-1'
        },
        type: 'Grid'
    }]
}, true);
