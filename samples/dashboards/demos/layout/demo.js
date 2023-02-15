let exportedLayoutId;
let board = new Dashboards.Board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode', 'viewFullscreen', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                events: {
                    click: function () {
                        board.exportLocal();
                    }
                }
            }, {
                id: 'delete-dashboard',
                text: 'Delete current dashboard',
                events: {
                    click: function () {
                        board.destroy();
                    }
                }
            }, {
                id: 'import-dashboard',
                text: 'Import saved dashboard',
                events: {
                    click: function () {
                        board = Dashboards.importLocal();
                    }
                }
            }, {
                id: 'export-layout',
                text: 'Export 1 layout',
                events: {
                    click: function () {
                        exportedLayoutId = board.layouts[0].options.id;
                        board.layouts[0].exportLocal();
                    }
                }
            }, {
                id: 'delete-layout',
                text: 'Delete 1 layout',
                events: {
                    click: function () {
                        board.layouts[0].destroy();
                    }
                }
            }, {
                id: 'import-layout',
                text: 'Import saved layout',
                events: {
                    click: function () {
                        const layout = board.importLayoutLocal(
                            exportedLayoutId
                        );
                        console.log('Imported layout: ', layout);
                    }
                }
            }]
        },
        lang: {
            editMode: 'My edit mode',
            chartOptions: 'Chart options EN'
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
        layouts: [{
            id: 'layout-1',
            rowClassName: 'custom-row',
            cellClassName: 'custom-cell',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0',
                    height: '400px'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                id: 'dashboard-row-1',
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
            id: 'layout-2',
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
        type: 'Highcharts',
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
                src: 'data:image/png;base64,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'
            }
        }]
    }, {
        cell: 'dashboard-col-2',
        type: 'Highcharts',
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
                console.log('dashboard-col-2 mount event');
            }
        }
    }, {
        cell: 'dashboard-col-21',
        type: 'Highcharts',
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
        events: {
            mount: function () {
                // call action
                console.log('dashboard-col-2 mount event');
            }
        }
    }, {
        cell: 'dashboard-col-22',
        type: 'Highcharts',
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
        type: 'Highcharts',
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
        type: 'Highcharts',
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
    }]
});
