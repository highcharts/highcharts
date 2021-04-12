import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import Bindings from  '../../../../code/es-modules/Dashboard/Actions/Bindings.js';

// Bring in other forms of Highcharts
import Highcharts from 'https://code.highcharts.com/stock/es-modules/masters/highcharts.src.js';

let dashboard = new Dashboard('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            icon: '/code/gfx/dashboard-icons/menu.svg',
            enabled: true,
            items: [{
                id: 'saveLocal',
                className: 'test-test-test',
                events: {
                    click: function () {
                        console.log(this);
                    }
                }
            }, 'verticalSeparator', 'editMode', {
                id: 'my-export',
                text: 'My export',
                events: {
                    click: function () {
                        console.log('my export!');
                    }
                }
            }]
        },
        toolbars: {
            cell: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: '/code/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: '/code/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'my-option-1',
                        text: 'o1',
                        events: {
                            click: function () {
                                console.log('hello world!');
                            }
                        }
                    }, {
                        id: 'my-button',
                        text: 'pl',
                        events: {
                            click: function () {
                                console.log('hello world!');
                            }
                        }
                    }, {
                        id: 'destroy',
                        icon: '/code/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            row: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: '/code/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: '/code/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'destroy',
                        icon: '/code/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            settings: {

            }
        },
        lang: {
            editMode: 'My edit mode',
            saveLocal: 'Save locally 1'
        }
    },
    gui: {
        enabled: true,
        layoutOptions: {
            resize: {
                cells: true,
                rows: true,
                snap: {
                    width: 20
                }
            }
        },
        layouts: [{
            id: 'layout-1', // mandatory
            rowClassName: 'custom-row', // optional
            cellClassName: 'custom-cell', // optional
            style: {
                fontSize: '1.5em',
                color: 'blue'
            },
            rows: [{
                // id: 'dashboard-row-0',
                cells: [{
                    width: 0.7,
                    id: 'dashboard-col-0',
                    style: {
                        color: 'yellow'
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
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }, {
                id: 'dashboard-row-3',
                cells: [{
                    id: 'dashboard-col-add-component'
                }]
            }]
        }, {
            id: 'layout-2', // mandatory
            rows: [{
                id: 'dashboard-row-2',
                cells: [{
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
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
        cell: 'dashboard-col-1',
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
        cell: 'dashboard-col-2',
        type: 'chart',
        chartOptions: {
            type: 'cell',
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
        cell: 'dashboard-col-3',
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
    },  {
        cell: 'dashboard-col-add-component',
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

console.group('Bindings get GUI element by ID or HTML element (getcell, getRow, getLayout)');
console.log('cell: ', Bindings.getCell('dashboard-col-0'));
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
            cellClassName: 'col' // optional

        },
        layouts: [{
            id: 'layout-bt-1' // mandatory
        }, {
            id: 'layout-bt-2', // mandatory
            rowClassName: 'row-test', // optional
            cellClassName: 'col-test' // optional
        }]
    },
    components: [{
        cell: 'chart-1',
        type: 'chart',
        chartOptions: {
            type: 'cell',
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
        cell: 'chart-2',
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

const dashboardLayout = new Dashboard('container-nested-layout', {
    editMode: {
        enabled: true,
        contextMenu: {
            icon: '/code/gfx/dashboard-icons/menu.svg',
            enabled: true,
            menuItems: [{
                type: 'saveLocal',
                className: 'test-test-test',
                events: {
                    click: function () {
                        console.log(this);
                    }
                }
            }, 'separator', {
                type: 'editMode',
                text: 'Edit on/off'
            }]
        },
        /*
        * TODO consider use toolbarEdit
        */
        toolbar: {
            dragIcon: '/code/gfx/dashboard-icons/drag.svg',
            settingsIcon: '/code/gfx/dashboard-icons/edit.svg',
            trashIcon: '/code/gfx/dashboard-icons/destroy.svg'
        }
        /* TODO add when needed
        toolbarOptions: {

        }
        */
    },
    gui: {
        enabled: true,
        layoutOptions: {
            resize: {
                cells: {
                    enabled: true,
                    minSize: 70
                },
                rows: {
                    enabled: true,
                    minSize: 70
                }
            }
        },
        layouts: [{
            id: 'layout-in-1', // mandatory
            rows: [{
                cells: [{
                    id: 'dashboard-col-nolayout-0'
                }, {
                    id: 'dashboard-col-layout-0',
                    layout: {
                        rows: [{
                            cells: [{
                                id: 'dashboard-col-layout-1'
                            }, {
                                id: 'dashboard-col-layout-2'
                            }, {
                                id: 'dashboard-col-layout-4'
                            }, {
                                id: 'dashboard-col-layout-5'
                            }]
                        }, {
                            cells: [{
                                id: 'dashboard-col-layout-3'
                            }]
                        }]
                    }
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-nolayout-0',
        type: 'chart',
        chartOptions: {
            chart: {
                animation: false
            },
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }
        /*type: 'html',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                title: 'I heard you like components'
            }
        }, {
            textContent: 'Loreum ipsum'
        }]*/
    }, {
        cell: 'dashboard-col-layout-1',
        /*type: 'chart',
        chartOptions: {
            type: 'cell',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }*/
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
        cell: 'dashboard-col-layout-2',
        /*type: 'chart',
        chartOptions: {
            type: 'cell',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }*/
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
        cell: 'dashboard-col-layout-3',
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
        /*type: 'chart',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }*/
    }, {
        cell: 'dashboard-col-layout-4',
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
        /*type: 'chart',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }*/
    }, {
        cell: 'dashboard-col-layout-5',
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
        /*type: 'chart',
        chartOptions: {
            type: 'line',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }]
        }*/
    }]
});

console.log(dashboardLayout);

/*
 * Destroy resizer
 */
Highcharts.addEvent(
    document.getElementById('destroy-resizer'),
    'click',
    function () {
        dashboard.layouts.forEach(layout => {
            layout.resizer.destroy();
            console.log(layout.resizer);
        });

        dashboardLayout.layouts.forEach(layout => {
            layout.resizer.destroy();
            console.log(layout.resizer);
        });
    }
);