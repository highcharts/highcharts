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
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [
        {
            renderTo: 'dashboard-col-1',
            type: 'Highcharts',
            connector: {
                id: 'EUR-USD',
                columnAssignment: [{
                    seriesId: 'EUR',
                    data: ['Day', 'EUR']
                }, {
                    seriesId: 'Rate',
                    data: ['Day', 'Rate']
                }, {
                    seriesId: 'USD',
                    data: ['Day', 'USD']
                }]
            },
            sync: {
                highlight: true
            },
            title: {
                text: 'Chart',
                style: {
                    textAlign: 'center'
                }
            },
            chartOptions: {
                chart: {
                    animation: false,
                    type: 'line',
                    zooming: false
                },
                plotOptions: {
                    series: {
                        animation: false,
                        dragDrop: {
                            draggableY: true
                        }
                    }

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
            renderTo: 'dashboard-col-2',
            type: 'DataGrid',
            connector: {
                id: 'EUR-USD'
            },
            dataGridOptions: {
                columnDefaults: {
                    cells: {
                        editable: true
                    }
                },
                columns: [{
                    id: 'USD',
                    cells: {
                        editable: false
                    }
                }]
            },
            sync: {
                highlight: true
            }
        }
    ]
});
