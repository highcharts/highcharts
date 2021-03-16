import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';

// A shared store
const store = new CSVStore(undefined, {
    csv: `$GME,$AMC,$NOK
 4,5,6
 1,5,2
 41,23,2`,
    firstRowAsNames: true
});
store.load();

console.log(store);

const dashboard = new Dashboard('container', {
    gui: {
        enabled: true,
        layouts: [{
            id: 'layout-1', // mandatory
            rowClassName: 'custom-row', // optional
            columnClassName: 'custom-column', // optional
            style: {
                fontSize: '1.5em',
                color: 'blue'
            },
            rows: [{
                // id: 'dashboard-row-0',
                columns: [{
                    width: 0.7,
                    id: 'dashboard-col-0',
                    style: {
                        color: 'yellow',
                        flex: 2,
                        height: '250px'
                    }
                }, {
                    id: 'dashboard-col-1',
                    style: {
                        color: 'orange',
                        width: '400px'
                    }
                }]
            }, {
                id: 'dashboard-row-1',
                style: {
                    color: 'red'
                },
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
        chartOptions: {
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false,
                type: 'column',
                zoomType: 'x'
            }
        },
        events: {},
        store,
        syncEvents: ['visibility', 'tooltip']
    }, {
        column: 'dashboard-col-1',
        type: 'chart',
        chartOptions: {
            type: 'column',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false,
                zoomType: 'x',
                zoomBySingleTouch: true
            }
        },
        events: {},
        store,
        syncEvents: ['visibility', 'tooltip']
    }]
});

window.addEventListener('resize', e => {
    dashboard.mountedComponents.forEach(({ component }) => {
        component.resize();
    });
});
