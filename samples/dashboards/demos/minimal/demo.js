const csvData = document.getElementById('csv').innerText,
    dataPool = new Dashboards.DataPool();

async function setupDashboard() {
    await dataPool.loadConnector({
        name: 'Vitamin',
        type: 'CSVConnector',
        options: {
            csv: csvData,
            firstRowAsNames: true
        }
    });
    dataPool.setConnectorOptions({
        name: 'Vitamin',
        type: 'CSVConnector',
        options: {
            csv: csvData,
            firstRowAsNames: true
        }
    });

    console.log(dataPool.getConnectorsNames());

    const dataConnector = await dataPool.getConnector('Vitamin');

    Dashboards.board('container', {
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
        components: [
            {
                connector: dataConnector,
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
                connector: dataConnector,
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
                connector: dataConnector,
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
                connector: dataConnector,
                editable: true,
                sync: {
                    highlight: true
                }
            }
        ]
    });
}

setupDashboard();
