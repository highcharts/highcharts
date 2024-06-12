const chartComponentOptions = {
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

Dashboards.board('container', {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    gui: {
        layouts: [{
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
                                width: '1/2',
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
        renderTo: 'dashboard-col-nolayout-0',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-1',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-2a',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-2b',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-2c',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-2d',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-3',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-4',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-5',
        ...chartComponentOptions
    }, {
        renderTo: 'dashboard-col-layout-2f',
        ...chartComponentOptions
    }]
});
