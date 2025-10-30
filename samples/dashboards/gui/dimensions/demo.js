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
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'dashboard-col-0',
                                    width: '60%',
                                    height: 350
                                },
                                {
                                    id: 'dashboard-col-1',
                                    height: 450
                                }
                            ]
                        }
                    ]
                }
            ]
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
            }
        ]
    },
    true
);
