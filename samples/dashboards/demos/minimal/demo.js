const csvData = document.getElementById('csv').innerText;

const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            name: 'Vitamin',
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
        layouts: [
            {
                id: 'layout-1',
                rowClassName: 'custom-row',
                cellClassName: 'custom-cell',
                rows: [
                    {
                        cells: [
                            {
                                id: 'dashboard-col-0',
                                width: '50%'
                            },
                            {
                                id: 'dashboard-col-1'
                            },
                            {
                                id: 'dashboard-col-12'
                            }
                        ]
                    },
                    {
                        id: 'dashboard-row-1',
                        cells: [
                            {
                                id: 'dashboard-col-2',
                                width: '1'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    components: [{
        sync: {
            visibility: true,
            highlight: true,
            selection: true
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnKeyMap: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            chart: {
                type: 'pie'
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            selection: true
        },
        type: 'Highcharts',
        columnKeyMap: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                animation: false,
                type: 'column'
            }
        }
    },
    {
        cell: 'dashboard-col-12',
        sync: {
            visibility: true,
            highlight: true,
            selection: true
        },
        type: 'Highcharts',
        columnKeyMap: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                animation: false,
                type: 'scatter'
            }
        }
    },
    {
        cell: 'dashboard-col-2',
        type: 'DataGrid',
        editable: true,
        sync: {
            highlight: true
        }
    }]
}, true);

for (let i = 0, iEnd = board.mountedComponents.length - 1; i < iEnd; i++) {
    board.mountedComponents[i].component.update({
        connector: {
            name: 'Vitamin'
        }
    });
}
board.mountedComponents[3].component.update({
    connector: {
        name: 'Vitamin'
    }
});
