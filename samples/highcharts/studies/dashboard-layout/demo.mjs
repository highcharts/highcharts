import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import Bindings from  '../../../../code/es-modules/Dashboard/Actions/Bindings.js';

// Bring in other forms of Highcharts
import Highcharts from 'https://code.highcharts.com/stock/es-modules/masters/highcharts.src.js';

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
                        flex: 2
                    }
                }, {
                    id: 'dashboard-col-1',
                    style: {
                        color: 'orange'
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
            type: 'pie',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        },
        /*dimensions: {
            width: 400,
            height: 400
        },*/
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-0 mount event');
            },
            unmount: function () {
                console.log('dashboard-col-0 unmount event');
            }
        }
    }, {
        column: 'dashboard-col-1',
        type: 'html',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                title: 'I heard you like components'
            }
        }, {
            textContent: 'Loreum ipsum'
        }]
    }, {
        column: 'dashboard-col-2',
        type: 'chart',
        chartOptions: {
            type: 'column',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        },
        dimensions: {
            width: 400
            // height: 400
        },
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-2 mount event');
            }
        }
    }, {
        column: 'dashboard-col-3',
        type: 'chart',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        },
        dimensions: {
            width: '100%'
            //height:  400
        },
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-3 mount event');
            }
        }
    }]
});

console.log(dashboard);

console.group('Bindings get GUI element by ID or HTML element (getColumn, getRow, getLayout)');
console.log('column: ', Bindings.getColumn('dashboard-col-0'));
console.log('row: ', Bindings.getRow(dashboard.layouts[0].rows[0].container));
console.log('layout: ', Bindings.getLayout('layout-1'));
console.groupEnd();

debugger;
var dashboardJSON = dashboard.toJSON();
console.log('dashboard JSON: ', dashboard.toJSON());

var dashboardFromJSON = Dashboard.fromJSON(dashboardJSON);
console.log('dashboard from a JSON: ', dashboardFromJSON);

/*
  Bind import layouts btn
*/
Highcharts.addEvent(
    document.getElementById('export'),
    'click',
    function () {
        console.log('Export');
        dashboard.exportLocal();
    }
);

/*
  Bind export layouts btn
*/
Highcharts.addEvent(
    document.getElementById('import'),
    'click',
    function () {
        console.log('Import');
        dashboard.importLocal();
    }
);

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
        chartOptions: {
            type: 'column',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false
            }
        },
        /*dimensions: {
            width: 400,
            height: 400
        },*/
        events: {
            mount: function () {
                // call action
                console.log('chart-1 mount event');
            }
        }
    }, {
        column: 'chart-2',
        type: 'html',
        /*config: {
            title: 'Sample layout 1',
            description: 'Lorem ipsum'
        }*/
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                title: 'I heard you like components'
            }
        }]
    }]
});

console.log(dashboardBootstrap);