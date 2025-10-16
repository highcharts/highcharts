const csvData = document.getElementById('csv').innerText;

Dashboards.board(
    'container',
    {
        dataPool: {
            connectors: [
                {
                    id: 'sample',
                    type: 'CSV',
                    csv: csvData,
                    firstRowAsNames: true
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
                renderTo: 'dashboard-col-0',
                connector: {
                    id: 'sample'
                },
                type: 'Highcharts',
                sync: {
                    highlight: true
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
                renderTo: 'dashboard-col-1',
                type: 'Grid',
                connector: {
                    id: 'sample'
                },
                title: {
                    text: 'Grid component'
                },
                sync: {
                    highlight: true
                }
            },
            {
                renderTo: 'dashboard-col-2',
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
                renderTo: 'dashboard-col-3',
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
