// Create Dashboard
Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'EUR-USD',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv').innerText,
                firstRowAsNames: true,
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
