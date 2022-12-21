import Dashboard from  '../../../../code/es-modules/Dashboard/Dashboard.js';
import PluginHandler from  '../../../../code/es-modules/Dashboard/PluginHandler.js';
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

const dashboardLayout = new Dashboard('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            icon: 'https://code.highcharts.com/gfx/dashboard-icons/menu.svg',
            enabled: true,
            items: ['editMode', {
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
        cell: 'dashboard-col-layout-1',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2a',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2b',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2c', ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2d', ...chartDemo
    }, {
        cell: 'dashboard-col-layout-3',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-4',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-5',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2f',
        ...chartDemo
    }]
});
