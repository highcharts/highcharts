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
    },
    components: [{
        column: 'dashboard-col-0',
        isResizable: true,
        type: 'chart',
        events: {
            onLoad: function () {
                // call action		
            }
        }
    }, {
        column: 'dashboard-col-1',
        type: 'description',
        config: {
            title: 'Sample layout 1',
            description: 'Lorem ipsum'
        }
    }, {
        column: 'dashboard-col-2',
        type: 'chart',
        events: {
            onLoad: function () {
                // call action		
            }
        }
    }, {
        column: 'dashboard-col-3',
        type: 'chart',
        events: {
            onLoad: function () {
                // call action		
            }
        }
    }]
});

console.log(dashboard);

const dashboardBootstrap = new Dashboard('container-bootstrap', {
    gui: {
        enabled: false,
        layoutOptions: {
            rowClassName: 'row', // optional
            columnClassName: 'col', // optional
            cardClassName: 'card' // optional
        },
        layouts: [{
            id: 'layout-bt-1' // mandatory
        }, {
            id: 'layout-bt-2', // mandatory
            rowClassName: 'row-test', // optional
            columnClassName: 'col-test', // optional
            cardClassName: 'card-test' // optional
        }]
    },
    components: [{
        column: 'chart-1',
        isResizable: true,
        type: 'chart',
        events: {
            onLoad: function () {
                // call action		
            }
        }
    }, {
        column: 'chart-2',
        type: 'description',
        config: {
            title: 'Sample layout 1',
            description: 'Lorem ipsum'
        }
    }]
});

console.log(dashboardBootstrap);