// Create Dashboard
const data = [
    ['Day', 'EUR', 'Rate'],
    [1691971200000, 11, 1.0930],
    [1692057600000, 23, 1.0926],
    [1692144000000, 15, 1.0916],
    [1692230400000, 27, 1.0900],
    [1692316800000, 13, 1.0867]
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
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '50%'
                        }
                    },
                    id: 'dashboard-col-1'
                }, {
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '50%'
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
                    zooming: false,
                    events: {
                        redraw: function () {
                            if (!this.series[1].options.yAxis) {
                                this.series[1].update({
                                    yAxis: 1
                                });
                            }
                        }
                    }
                },
                title: {
                    text: 'EUR to USD'
                },
                subtitle: {
                    text: 'Euro foreign exchange reference rate to US dollar'
                },
                tooltip: {
                    shared: true,
                    split: true
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: [{
                    title: {
                        text: 'EUR / USD'
                    }
                }, {
                    title: {
                        text: 'Rate'
                    },
                    opposite: true
                }]
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            connector: {
                id: 'EUR-USD'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: {
                editable: false,
                columns: {
                    Day: {
                        cellFormatter: function () {
                            return new Date(this.value)
                                .toISOString()
                                .substring(0, 10);
                        }
                    }
                }
            }
        }
    ]
});
