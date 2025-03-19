import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';

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
            }]
        }]
    },
    components: [{
        type: 'HTML',
        renderTo: 'dashboard-1',
        title: 'HTML Component',
        elements: [{
            tagName: 'div',
            children: [{
                tagName: 'p',
                textContent: 'Lorem ipsum...',
                attributes: {
                    d: 'description'
                }
            }]
        }],
        editableOptions: [{
            name: 'ComponentTitle',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'Text',
            propertyPath: ['elements', 0, 'children', 0, 'textContent'],
            type: 'textarea'
        }]
    }]
});
