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
                    cellClassName: 'custom-1',
                    rows: [
                        {
                            id: 'dashboard-row-1',
                            cells: [
                                {
                                    id: 'dashboard-col-0'
                                },
                                {
                                    id: 'dashboard-col-1'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'layout-2',
                    rows: [
                        {
                            id: 'dashboard-row-2',
                            cells: [
                                {
                                    id: 'dashboard-col-2'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'layout-3',
                    rows: [
                        {
                            id: 'dashboard-row-3',
                            cells: [
                                {
                                    id: 'dashboard-col-3'
                                }
                            ]
                        }
                    ]
                }
            ],
            layoutOptions: {
                cellClassName: 'custom-rest'
            }
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
                editable: true,
                title: {
                    text: 'Grid component'
                },
                sync: {
                    highlight: true
                }
            },
            {
                cell: 'dashboard-col-2',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'h1',
                        style: {
                            height: '5rem',
                            'text-align': 'center'
                        },
                        textContent: 'HTML Component 1'
                    }
                ]
            },
            {
                cell: 'dashboard-col-3',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'h1',
                        style: {
                            height: '5rem',
                            'text-align': 'center'
                        },
                        textContent: 'HTML Component 2'
                    }
                ]
            }
        ]
    },
    true
);
