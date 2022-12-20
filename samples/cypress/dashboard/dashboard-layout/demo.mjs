import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import PluginHandler from  '../../../../code/es-modules/Dashboard/PluginHandler.js';
import Bindings from  '../../../../code/es-modules/Dashboard/Actions/Bindings.js';

// Bring in other forms of Highcharts
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

let exportedLayoutId;

const chartDemo = {
    type: 'Highcharts',
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

let dashboard = new Dashboard('container-nested-layout', {
    editMode: {
        enabled: true,
        contextMenu: {
            icon: 'https://code.highcharts.com/gfx/dashboard-icons/menu.svg',
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
                        icon: 'https://code.highcharts.com/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: 'https://code.highcharts.com/gfx/dashboard-icons/settings.svg'
                    },
                    // {
                    //     id: 'my-option-1',
                    //     text: 't1',
                    //     events: {
                    //         click: function() {
                    //             console.log('hello world!');
                    //         }
                    //     }
                    // },
                    {
                        id: 'destroy',
                        icon: 'https://code.highcharts.com/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            row: {
                menu: {
                    items: [{
                        id: 'drag',
                        icon: 'https://code.highcharts.com/gfx/dashboard-icons/drag.svg'
                    }, {
                        id: 'settings',
                        icon: 'https://code.highcharts.com/gfx/dashboard-icons/settings.svg'
                    }, {
                        id: 'destroy',
                        icon: 'https://code.highcharts.com/gfx/dashboard-icons/destroy.svg'
                    }]
                }
            },
            settings: {
                closeIcon: 'https://code.highcharts.com/gfx/dashboard-icons/close.svg',
                dragIcon: 'https://code.highcharts.com/gfx/dashboard-icons/drag.svg'
            }
        },
        lang: {
            editMode: 'My edit mode',
            saveLocal: 'Save locally 1',
            chartOptions: 'Chart options EN'
        },
        tools: {
            addComponentBtn: {
                icon: 'https://code.highcharts.com/gfx/dashboard-icons/add.svg'
            }
        },
        confirmationPopup: {
            close: {
                icon: 'https://code.highcharts.com/gfx/dashboard-icons/close.svg'
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
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-nolayout-0',
        type: 'Highcharts',
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
        cell: 'dashboard-col-layout-0',
        ...chartDemo
    }]
});