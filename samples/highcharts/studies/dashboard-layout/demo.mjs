import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';

const dashboard = new Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1', // mandatory
            rowClassName: 'custom-row', // optional
            columnClassName: 'custom-column', // optional
            rows: [{
                id: 'dashboard-row-0',
                columns: [{
                    width: 0.7,
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                id: 'dashboard-row-1',
                columns: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }, {
            id: 'layout-2', // mandatory
            rows: [{
                id: 'dashboard-row-2',
                columns: [{
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    }
});

console.log(dashboard);

const dashboardBootstrap = new Dashboard('container-bootstrap', {
    gui: {
        enabled: false,
        layouts: [{
            id: 'layout-bt-1', // mandatory
            rowClassName: 'row', // optional
            columnClassName: 'col', // optional
            cardClassName: 'card' // optional
        }, {
            id: 'layout-bt-2', // mandatory
            rowClassName: 'row', // optional
            columnClassName: 'col', // optional
            cardClassName: 'card' // optional
        }]
    }
});

console.log(dashboardBootstrap);