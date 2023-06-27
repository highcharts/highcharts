const csvData = document.getElementById('csv').innerText;

Highcharts.setOptions({
    title: {
        text: ''
    }
});

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'title'
                }]
            }, {
                cells: [{
                    layout: {
                        rows: [{
                            cells: [{
                                id: 'kpi-vitamin-a',
                                height: 214
                            }]
                        }, {
                            cells: [{
                                id: 'kpi-iron',
                                height: 214
                            }]
                        }]
                    }
                }, {
                    id: 'dashboard-col-0',
                    width: '1/2'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'KPI',
        cell: 'kpi-vitamin-a',
        value: 900,
        valueFormat: '{value} mcg',
        title: 'Recommended daily dose of Vitamin A'
    }, {
        type: 'KPI',
        cell: 'kpi-iron',
        value: 8,
        title: 'Recommended daily dose of Iron',
        valueFormat: '{value} mcg'
    }, {
        cell: 'title',
        type: 'HTML',
        elements: [{
            tagName: 'h1',
            textContent: 'MicroElement amount in Foods'
        }]
    }, {
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value',
            Iron: null
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Vitamin A'
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': null,
            Iron: 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            title: {
                text: 'Iron'
            },
            chart: {
                animation: false,
                type: 'column'
            }
        }
    }, {
        cell: 'dashboard-col-2',
        connector: {
            id: 'Vitamin'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            highlight: true
        }
    }]
}, true);
