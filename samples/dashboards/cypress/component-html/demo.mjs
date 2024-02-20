import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';

Dashboards.board('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-1'
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        cell: 'dashboard-1',
        caption: 'Caption (original)',
        title: 'Title (original)',
    }]
});
