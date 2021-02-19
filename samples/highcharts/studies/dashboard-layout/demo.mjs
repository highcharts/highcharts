import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';

const dashboard = new Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            rowClassName: 'custom-row',
            colClassName: 'custom-column',
            rows: [{
                id: 'dashboard-row-0',
                cols: [{
                    width: 0.7,
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                id: 'dashboard-row-1',
                cols: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }, {
            rows: [{
                id: 'dashboard-row-2',
                cols: [{
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    }
});

console.log(dashboard);
