import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import Bindings from  '../../../../code/es-modules/Dashboard/Actions/Bindings.js';

// Bring in other forms of Highcharts
import Highcharts from 'https://code.highcharts.com/stock/es-modules/masters/highcharts.src.js';

let exportedLayoutId;

const chartDemo = {
    type: 'chart',
    chartOptions: {
        type: 'line',
        series: [{
            name: 'Series from options',
            data: [1, 2, 3, 4]
        }],
        chart: {
            animation: false,
            height: 150
        }
    }
};

let dashboard = new Dashboard('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/menu.svg',
            enabled: true,
            items: [{
                id: 'saveLocal',
                className: 'test-test-test',
                events: {
                    click: function() {
                        console.log('save local');
                    }
                }
            }, 'verticalSeparator', 'editMode', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                events: {
                    click: function () {
                        dashboard.exportLocal();
                    }
                }
            }, {
                id: 'delete-dashboard',
                text: 'Delete current dashboard',
                events: {
                    click: function () {
                        dashboard.destroy();
                    }
                }
            }, {
                id: 'import-dashboard',
                text: 'Import saved dashboard',
                events: {
                    click: function () {
                        dashboard = Dashboard.importLocal();
                    }
                }
            }, {
                id: 'export-layout',
                text: 'Export 1 layout',
                events: {
                    click: function () {
                        exportedLayoutId = dashboard.layouts[0].options.id;
                        dashboard.layouts[0].exportLocal();
                    }
                }
            }, {
                id: 'delete-layout',
                text: 'Delete 1 layout',
                events: {
                    click: function () {
                        dashboard.layouts[0].destroy();
                    }
                }
            }, {
                id: 'import-layout',
                text: 'Import saved layout',
                events: {
                    click: function () {
                        const layout = dashboard.importLayoutLocal(
                            exportedLayoutId
                        );
                        console.log('Imported layout: ', layout);
                    }
                }
            }]
        },
        toolbars: {
            cell: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'my-option-1',
                        text: 't1',
                        events: {
                            click: function() {
                                console.log('hello world!');
                            }
                        }
                    }, {
                        id: 'destroy',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            row: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'destroy',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            settings: {
                closeIcon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/close.svg',
                dragIcon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
            }
        },
        lang: {
            editMode: 'My edit mode',
            saveLocal: 'Save locally 1',
            chartOptions: 'Chart options EN'
        },
        tools: {
            addComponentBtn: {
                icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/add.svg'
            },
            rwdIcons: {
                small: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/smartphone.svg',
                medium: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/tablet.svg',
                large: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/computer.svg'
            }
        },
        confirmationPopup: {
            close: {
                icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/close.svg'
            }
        },
        resize: {
            enabled: true,
            styles: {
                minWidth: 50,
                minHeight: 50
            },
            type: 'xy',
            snap: {
                width: 20,
                height: 20
            }
        }
    },
    gui: {
        enabled: true,
        // layoutOptions: {
        //     resize: {
        //         cells: true,
        //         rows: true,
        //         snap: {
        //             width: 20
        //         }
        //     }
        // },
        layouts: [{
            id: 'layout-1', // mandatory
            rowClassName: 'custom-row', // optional
            cellClassName: 'custom-cell', // optional
            style: {
            // fontSize: '1.5em',
            // color: 'blue'
            },
            rows: [{
                // id: 'dashboard-row-0',
                cells: [{
                    id: 'dashboard-col-0',
                    width: '50%',
                    style: {
                        color: 'yellow'
                    }
                }, {
                    id: 'dashboard-col-1',
                    width: '1/2',
                    style: {
                    // color: 'orange'
                    }
                }]
            }, {
                id: 'dashboard-row-1',
                style: {
                    // color: 'red'
                },
                cells: [{
                    id: 'dashboard-col-2',
                    width: '2/3',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '100%'
                        }
                    }
                }, {
                    id: 'dashboard-col-21',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '2/3'
                        }
                    }
                }, {
                    id: 'dashboard-col-22',
                    width: '1/6',
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '1/3'
                        }
                    }
                }]
            }, {
                id: 'dashboard-row-3',
                style: {
                    // color: 'red'
                },
                cells: [{
                    id: 'dashboard-col-3'
                }, {
                    id: 'dashboard-col-31'
                }, {
                    id: 'dashboard-col-32'
                }]
            }, {
                id: 'dashboard-row-4',
                cells: [{
                    id: 'dashboard-col-add-component'
                }]
            }]
        }, {
            id: 'layout-2', // mandatory
            rows: [{
                id: 'dashboard-row-2',
                cells: [{
                    id: 'dashboard-col-4'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
        isResizable: true,
        type: 'chart',
        chartOptions: {
            series: [{
                name: 'Series from options',
                data: [1, 2, 1, 4]
            }],
            chart: {
                animation: false,
                type: 'pie'
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
        dimensions: {
            width: 200,
            height: 200
        },
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'data:image/png;base64,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'
            }
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
            // width: '100%'
        },
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-2 mount event');
            }
        }
    }, {
        cell: 'dashboard-col-21',
        type: 'chart',
        chartOptions: {
            type: 'cell',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false,
                type: 'pie'
            }
        },
        dimensions: {
            // width: '100%'
        },
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-2 mount event');
            }
        }
    }, {
        cell: 'dashboard-col-22',
        type: 'chart',
        chartOptions: {
            type: 'cell',
            series: [{
                name: 'Series from options',
                data: [1, 2, 3, 4]
            }],
            chart: {
                animation: false,
                type: 'column'
            }
        },
        dimensions: {
            // width: '100%'
        },
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-2 mount event');
            }
        }
    }, {
        cell: 'dashboard-col-3',
        type: 'html',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/docs/assets/images/understanding_highcharts-3dbd4054b7e9c028f2613529ffa7bdaa.png'
            }
        }]
    }, {
        cell: 'dashboard-col-31',
        type: 'html',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/docs/assets/images/titleandsubtitle-6658386ccc86d7ceb7d2bd173ae88e8e.png'
            }
        }]
    }, {
        cell: 'dashboard-col-32',
        type: 'html',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/docs/assets/images/axis_description-a5a5c48c754b2eb89d105edfb07b24f2.png'
            }
        }]
    }, {
        cell: 'dashboard-col-5',
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
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-3 mount event');
            }
        }
    }, {
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
            // width: '100%'
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
/*Highcharts.addEvent(
    document.getElementById('export-dashboard'),
    'click',
    function () {
        dashboard.exportLocal();
    }
);*/

/*
  Bind delete dashboard btn
*/
/*Highcharts.addEvent(
    document.getElementById('delete-dashboard'),
    'click',
    function () {
        dashboard.destroy();
    }
);*/

/*
  Bind import dashboard btn
*/
/*Highcharts.addEvent(
    document.getElementById('import-dashboard'),
    'click',
    function () {
        dashboard = Dashboard.importLocal();
        console.log('Imported dashboard: ', dashboard);
    }
);*/

/* ==== LAYOUTS BUTTONS ==== */
/*
  Bind export layout btn
*/
/*
Highcharts.addEvent(
    document.getElementById('export-layout'),
    'click',
    function () {
        console.log('Export layout');
        exportedLayoutId = dashboard.layouts[0].options.id;
        dashboard.layouts[0].exportLocal();
    }
);*/

/*
  Bind delete layout btn
*/
/*
Highcharts.addEvent(
    document.getElementById('delete-layout'),
    'click',
    function () {
        console.log('Delete layout');
        dashboard.layouts[0].destroy();
    }
);*/

/*
  Bind import layout btn
*/
/*
Highcharts.addEvent(
    document.getElementById('import-layout'),
    'click',
    function () {
        const layout = dashboard.importLayoutLocal(exportedLayoutId);
        console.log('Imported layout: ', layout);
    }
);*/


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
        events: {
            mount: function () {
                // call action
                console.log('chart-1 mount event');
            }
        }
    }, {
        cell: 'chart-2',
        type: 'html',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                title: 'I heard you like components'
            }
        }]
    }, {
        cell: 'chart-3',
        ...chartDemo
    }, {
        cell: 'title-1',
        ...chartDemo
    }, {
        cell: 'title-2',
        ...chartDemo
    }, {
        cell: 'chart-4',
        ...chartDemo
    }, {
        cell: 'chart-5',
        ...chartDemo
    }, {
        cell: 'chart-6',
        ...chartDemo
    }, {
        cell: 'chart-7',
        ...chartDemo
    }]
});

// console.log(dashboardBootstrap);

console.log('========= Layout in layout =========');

const dashboardLayout = new Dashboard('container-nested-layout', {
    editMode: {
        enabled: true,
        contextMenu: {
            icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/menu.svg',
            enabled: true,
            items: [{
                id: 'saveLocal',
                className: 'test-test-test',
                events: {
                    click: function() {
                        console.log('save local');
                    }
                }
            }, 'verticalSeparator', 'editMode', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                events: {
                    click: function () {
                        dashboard.exportLocal();
                    }
                }
            }, {
                id: 'delete-dashboard',
                text: 'Delete current dashboard',
                events: {
                    click: function () {
                        dashboard.destroy();
                    }
                }
            }, {
                id: 'import-dashboard',
                text: 'Import saved dashboard',
                events: {
                    click: function () {
                        dashboard = Dashboard.importLocal();
                    }
                }
            }, {
                id: 'export-layout',
                text: 'Export 1 layout',
                events: {
                    click: function () {
                        exportedLayoutId = dashboard.layouts[0].options.id;
                        dashboard.layouts[0].exportLocal();
                    }
                }
            }, {
                id: 'delete-layout',
                text: 'Delete 1 layout',
                events: {
                    click: function () {
                        dashboard.layouts[0].destroy();
                    }
                }
            }, {
                id: 'import-layout',
                text: 'Import saved layout',
                events: {
                    click: function () {
                        const layout = dashboard.importLayoutLocal(
                            exportedLayoutId
                        );
                        console.log('Imported layout: ', layout);
                    }
                }
            }]
        },
        toolbars: {
            cell: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'my-option-1',
                        text: 't1',
                        events: {
                            click: function() {
                                console.log('hello world!');
                            }
                        }
                    }, {
                        id: 'destroy',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            row: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'destroy',
                        icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            settings: {
                closeIcon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/close.svg',
                dragIcon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/drag.svg'
            }
        },
        lang: {
            editMode: 'My edit mode',
            saveLocal: 'Save locally 1',
            chartOptions: 'Chart options EN'
        },
        tools: {
            addComponentBtn: {
                icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/add.svg'
            }
        },
        confirmationPopup: {
            close: {
                icon: 'https://raw.githubusercontent.com/highcharts/highcharts/enhancement/layout-layer/gfx/dashboard-icons/close.svg'
            }
        },
        resize: {
            enabled: true,
            styles: {
                minWidth: 20,
                minHeight: 50
            },
            type: 'xy',
            snap: {
                width: 20,
                height: 20
            }
        }
    },
    gui: {
        enabled: true,
        // layoutOptions: {
        //     resize: {
        //         cells: {
        //             enabled: true,
        //             minSize: 70
        //         },
        //         rows: {
        //             enabled: true,
        //             minSize: 70
        //         }
        //     }
        // },
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
                                id: 'dashboard-col-layout-1',
                                width: '1/2'
                            }, {
                                id: 'dashboard-col-layout-2',
                                layout: {
                                    rows: [{
                                        cells: [{
                                            id: 'dashboard-col-layout-2a'
                                        }, {
                                            id: 'dashboard-col-layout-2b'
                                        }, {
                                            id: 'dashboard-col-layout-2f'
                                        }]
                                    }, {
                                        cells: [{
                                            id: 'dashboard-col-layout-2c'
                                        }, {
                                            id: 'dashboard-col-layout-2d'
                                        }]
                                    }]
                                }
                            }, {
                                id: 'dashboard-col-layout-4',
                                width: '1/2'
                            }, {
                                id: 'dashboard-col-layout-5',
                                width: '1/3'
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
    }, {
        cell: 'dashboard-col-layout-1',
        ...chartDemo
        // type: 'html',
        // elements: [{
        //     tagName: 'img',
        //     attributes: {
        //         src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
        //         title: 'I heard you like components'
        //     }
        // }, {
        //     textContent: 'Loreum ipsum'
        // }]
    }, {
        cell: 'dashboard-col-layout-2a',
        ...chartDemo
        // type: 'html',
        // elements: [{
        //     tagName: 'img',
        //     attributes: {
        //         src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
        //         title: 'I heard you like components'
        //     }
        // }, {
        //     textContent: 'Loreum ipsum'
        // }]
    }, {
        cell: 'dashboard-col-layout-2b',
        ...chartDemo
        // type: 'html',
        // elements: [{
        //     tagName: 'img',
        //     attributes: {
        //         src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
        //         title: 'I heard you like components'
        //     }
        // }, {
        //     textContent: 'Loreum ipsum'
        // }]
    }, {
        cell: 'dashboard-col-layout-2c', ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2d', ...chartDemo
    }, {
        cell: 'dashboard-col-layout-3',
        ...chartDemo
        // type: 'html',
        // elements: [{
        //     tagName: 'img',
        //     attributes: {
        //         src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
        //         title: 'I heard you like components'
        //     }
        // }, {
        //     textContent: 'Loreum ipsum'
        // }]
    }, {
        cell: 'dashboard-col-layout-4',
        ...chartDemo
        // type: 'html',
        // elements: [{
        //     tagName: 'img',
        //     attributes: {
        //         src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
        //         title: 'I heard you like components'
        //     }
        // }, {
        //     textContent: 'Loreum ipsum'
        // }]
    }, {
        cell: 'dashboard-col-layout-5',
        ...chartDemo
        // type: 'html',
        // elements: [{
        //     tagName: 'img',
        //     attributes: {
        //         src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
        //         title: 'I heard you like components'
        //     }
        // }, {
        //     textContent: 'Loreum ipsum'
        // }]
    }, {
        cell: 'dashboard-col-layout-2f',
        ...chartDemo
    }]
});

// console.log(dashboardLayout);

/*
 * Destroy resizer
 */
/*Highcharts.addEvent(
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
);*/