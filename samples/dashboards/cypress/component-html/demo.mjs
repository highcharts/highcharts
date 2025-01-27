import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        renderTo: 'dashboard-1',
        caption: 'Caption (original)',
        title: 'Title (original)'
    }, {
        renderTo: 'dashboard-2',
        type: 'HTML',
        elements: [{
            tagName: 'h1',
            textContent: 'Loreum ipsum et omnia dolores, loreum ipsum'
        }, {
            tagName: 'div',
            children: [{
                tagName: 'span',
                class: 'subtitle',
                textContent: 'Loreum ipsum et omnia dolores'
            }]
        }]
    }]
});
