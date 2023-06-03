const csvData = document.getElementById('csv').innerText;

async function setupDashboard() {
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
        }
    });

    const connector = await board.dataPool.getConnector('Vitamin');

    board.setComponents([{
        sync: {
            visibility: true
        },
        title: {
            text: 'visibility: true'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        connector,
        connectorName: 'Vitamin',
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
            visibility: true
        },
        title: {
            text: 'visibility: true'
        },
        type: 'Highcharts',
        connector,
        connectorName: 'Vitamin',
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
            visibility: true
        },
        title: {
            text: 'visibility: true'
        },
        type: 'Highcharts',
        connector,
        connectorName: 'Vitamin',
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
        connector,
        connectorName: 'Vitamin',
        editable: true,
        title: {
            text: 'visibility: true'
        },
        sync: {
            visibility: true
        }
    }]);

}

setupDashboard();
