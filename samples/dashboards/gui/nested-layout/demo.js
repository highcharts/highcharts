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
                                    id: 'db-col-0-nolayout'
                                },
                                {
                                    id: 'db-col-1-layout',
                                    layout: {
                                        rows: [
                                            {
                                                cells: [
                                                    {
                                                        id: 'db-col-1-row-0'
                                                    }
                                                ]
                                            },
                                            {
                                                cells: [
                                                    {
                                                        id: 'db-col-1-row-1A',
                                                        width: '1/3'
                                                    },
                                                    {
                                                        id: 'db-col-1-row-1B-layout',
                                                        layout: {
                                                            rows: [
                                                                {
                                                                    cells: [
                                                                        {
                                                                            id: 'db-col-1-row-1B-row-0'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    cells: [
                                                                        {
                                                                            id: 'db-col-1-row-1B-row-1A'
                                                                        },
                                                                        {
                                                                            id: 'db-col-1-row-1B-row-1B'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                cells: [
                                                    {
                                                        id: 'db-col-1-row-2'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                },
                                {
                                    id: 'db-col-2-nolayout'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'db-col-0-nolayout',
                type: 'Highcharts',
                connector: {
                    id: 'sample'
                },
                sync: {
                    highlight: true
                },
                columnAssignment: {
                    Food: 'x',
                    'Vitamin A': 'y'
                },
                title: {
                    text: 'Column 0'
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
                cell: 'db-col-1-row-0',
                type: 'HTML',

                title: {
                    text: 'Column 1'
                },
                elements: [
                    {
                        tagName: 'p',
                        style: {
                            'text-align': 'center'
                        },
                        textContent: '1 x nested'
                    }
                ]
            },
            {
                cell: 'db-col-1-row-1A',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'p',
                        style: {
                            'text-align': 'center'
                        },
                        textContent: '1 x nested'
                    }
                ]
            },
            {
                cell: 'db-col-1-row-1B-row-0',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'p',
                        style: {
                            'text-align': 'center'
                        },
                        textContent: '2 x nested'
                    }
                ]
            },
            {
                cell: 'db-col-1-row-1B-row-1A',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'p',
                        style: {
                            'text-align': 'center'
                        },
                        textContent: '2 x nested'
                    }
                ]
            },
            {
                cell: 'db-col-1-row-1B-row-1B',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'p',
                        style: {
                            'text-align': 'center'
                        },
                        textContent: '2 x nested'
                    }
                ]
            },

            {
                cell: 'db-col-1-row-2',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'p',
                        style: {
                            'text-align': 'center'
                        },
                        textContent: '1 x nested'
                    }
                ]
            },
            {
                cell: 'db-col-2-nolayout',
                type: 'DataGrid',
                connector: {
                    id: 'sample'
                },
                title: {
                    text: 'Column 2'
                },
                sync: {
                    highlight: true
                }
            }
        ]
    },
    true
);
