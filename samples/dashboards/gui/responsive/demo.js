const csvData = document.getElementById('csv').innerText;

Dashboards.board(
    'container',
    {
        dataPool: {
            connectors: [
                {
                    id: 'sample',
                    type: 'CSV',
                    options: {
                        csv: csvData,
                        firstRowAsNames: true
                    }
                }
            ]
        },

        gui: {
            layouts: [
                {
                    id: 'layout-1',
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'dashboard-col-0'
                                },
                                {
                                    id: 'dashboard-col-1',
                                    responsive: {
                                        small: {
                                            width: '50%'
                                        },
                                        medium: {
                                            width: '40%'
                                        },
                                        large: {
                                            width: '30%'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'dashboard-col-0',
                connector: {
                    id: 'sample'
                },
                type: 'Highcharts',
                sync: {
                    highlight: true
                },
                columnAssignment: {
                    Food: 'x',
                    'Vitamin A': 'y'
                },
                title: {
                    text: 'Column chart'
                },
                chartOptions: {
                    xAxis: {
                        type: 'category'
                    },
                    title: {
                        text: ''
                    },
                    chart: {
                        type: 'column'
                    }
                }
            },
            {
                cell: 'dashboard-col-1',
                type: 'DataGrid',
                connector: {
                    id: 'sample'
                },
                title: {
                    text: 'Grid component'
                },
                sync: {
                    highlight: true
                }
            }
        ]
    },
    true
);
