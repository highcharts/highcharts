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

const dashboardLayout = new Dashboard.Dashboard('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
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
        ...chartDemo
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
        cell: 'dashboard-col-layout-2c',
        ...chartDemo
    }, {
        cell: 'dashboard-col-layout-2d',
        ...chartDemo
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
