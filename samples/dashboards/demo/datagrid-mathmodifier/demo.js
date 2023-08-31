// Create Dashboard
const data = [
    ['Day', 'EUR', 'Rate'],
    [15, 11, 1.0876],
    [16, 23, 1.0881],
    [17, 15, 1.0829],
    [18, 27, 1.0813],
    [19, 13, 1.0808]
];
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'EUR-USD',
            type: 'JSON',
            options: {
                data,
                // Add MathModifier to create USD column with exchange valuta
                dataModifier: {
                    type: 'Math',
                    columnFormulas: [{
                        column: 'USD',
                        formula: 'B1*C1' // Multiply EUR (B1) with the rate (C1)
                    }]
                }
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    },
                    id: 'dashboard-col-1'
                }, {
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    },
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-1',
            type: 'Highcharts',
            connector: {
                id: 'EUR-USD'
            },
            columnAssignment: {
                Day: 'x',
                EUR: 'custom.eur',
                Rate: 'y',
                USD: 'custom.usd'
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    animation: false,
                    type: 'line',
                    zooming: false
                },
                tooltip: {
                    shared: true,
                    split: true
                },
                xAxis: {
                    type: 'category'
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            connector: {
                id: 'EUR-USD'
            },
            sync: {
                highlight: true
            }
        }
    ]
});
