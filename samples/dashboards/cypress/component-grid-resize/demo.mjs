import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import Grid from '../../../../code/grid/es-modules/masters/grid-pro.src.js';

Dashboards.GridPlugin.custom.connectGrid(Grid);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            data: [
                ['Product Name', 'Quantity'],
                ['Laptop', 100],
                ['Smartphone', 150],
                ['Desk Chair', 120]
            ]
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-1'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'cell-1',
        type: 'Grid',
        connector: {
            id: 'data'
        }
    }]
});
