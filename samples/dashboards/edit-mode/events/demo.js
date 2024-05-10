// eslint-disable-next-line no-underscore-dangle
const U = Dashboards._modules['Core/Utilities.js'];

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
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
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
}, true).then(board => {
    const editMode = board.editMode;

    U.addEvent(editMode, 'componentChanged', e => {
        console.log('Component Changed', e);
    });

    U.addEvent(editMode, 'componentChangesDiscarded', e => {
        console.log('Component Changes Discarded', e);
    });

    U.addEvent(editMode, 'layoutChanged', e => {
        console.log('Layout Changed', e);
    });
});
