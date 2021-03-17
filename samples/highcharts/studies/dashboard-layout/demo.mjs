import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import Bindings from  '../../../../code/es-modules/Dashboard/Actions/Bindings.js';

// Bring in other forms of Highcharts
import Highcharts from 'https://code.highcharts.com/stock/es-modules/masters/highcharts.src.js';

let dashboard = new Dashboard('container', {
    gui: {
        enabled: true,
        layoutOptions: {
            resize: {
                columns: true,
                rows: true
            }
        },
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
            }, {
                id: 'dashboard-row-3',
                columns: [{
                    id: 'dashboard-col-add-component'
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

/* ==== DASHBOARD BUTTONS ==== */
/*
  Bind export dashboard btn
*/
Highcharts.addEvent(
    document.getElementById('export-dashboard'),
    'click',
    function () {
        dashboard.exportLocal();
    }
);

/*
  Bind delete dashboard btn
*/
Highcharts.addEvent(
    document.getElementById('delete-dashboard'),
    'click',
    function () {
        dashboard.destroy();
    }
);

/*
  Bind import dashboard btn
*/
Highcharts.addEvent(
    document.getElementById('import-dashboard'),
    'click',
    function () {
        dashboard = Dashboard.importLocal();
        console.log('Imported dashboard: ', dashboard);
    }
);

/* ==== LAYOUTS BUTTONS ==== */
/*
  Bind export layout btn
*/
let exportedLayoutId;

Highcharts.addEvent(
    document.getElementById('export-layout'),
    'click',
    function () {
        console.log('Export layout');
        exportedLayoutId = dashboard.layouts[0].options.id;
        dashboard.layouts[0].exportLocal();
    }
);

/*
  Bind delete layout btn
*/
Highcharts.addEvent(
    document.getElementById('delete-layout'),
    'click',
    function () {
        console.log('Delete layout');
        dashboard.layouts[0].destroy();
    }
);

/*
  Bind import layout btn
*/
Highcharts.addEvent(
    document.getElementById('import-layout'),
    'click',
    function () {
        const layout = dashboard.importLayoutLocal(exportedLayoutId);
        console.log('Imported layout: ', layout);
    }
);

const dashboardBootstrap = new Dashboard('container-bootstrap', {
    gui: {
        enabled: false,
        layoutOptions: {
            rowClassName: 'row', // optional
            columnClassName: 'col' // optional

        },
        layouts: [{
            id: 'layout-bt-1' // mandatory
        }, {
            id: 'layout-bt-2', // mandatory
            rowClassName: 'row-test', // optional
            columnClassName: 'col-test' // optional
        }]
    },
    components: [{
        column: 'chart-1',
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

console.log('========= Layout in layout =========');

let dashboardLayout = new Dashboard('container-nested-layout', {
    gui: {
        enabled: true,
        layoutOptions: {
            resize: {
                columns: true,
                rows: true
            }
        },
        layouts: [{
            id: 'layout-in-1', // mandatory
            rows: [{
                columns: [{
                    id: 'dashboard-col-nolayout-0',
                }, {
                    id: 'dashboard-col-layout-0',
                    layout: {
                        rows: [{
                            columns: [{
                                id: 'dashboard-col-layout-1'
                            }, {
                                id: 'dashboard-col-layout-2'
                            }]
                        }, {
                            columns: [{
                                id: 'dashboard-col-layout-3'
                            }]
                        }]
                    }
                }]
            }]
        }]
    },
    components: [{
        column: 'dashboard-col-nolayout-0',
        type: 'chart',
        chartOptions: {
            type: 'pie',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        },
    }, {
        column: 'dashboard-col-layout-1',
        type: 'chart',
        chartOptions: {
            type: 'column',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        column: 'dashboard-col-layout-2',
        type: 'chart',
        chartOptions: {
            type: 'column',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        column: 'dashboard-col-layout-3',
        type: 'chart',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }
    }]
});

console.log(dashboardLayout);