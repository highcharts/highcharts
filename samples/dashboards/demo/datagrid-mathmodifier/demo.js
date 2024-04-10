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
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
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
        chartOptions: {
            chart: {
                animation: false,
                type: 'line'
            },
            title: {
                text: 'EUR to USD'
            },
            subtitle: {
                text: 'Euro foreign exchange reference rate to US dollar'
            },
            series: [{
                id: 'Rate',
                name: 'Rate',
                yAxis: 1
            }],
            tooltip: {
                shared: true,
                split: true,
                stickOnContact: true
            },
            lang: {
                accessibility: {
                    chartContainerLabel: `Euro foreign exchange reference rate
                    to US dollar`
                }
            },
            accessibility: {
                description: `The chart is displaying the 3 linear series, the
                first of which corresponds to a certain value on a given day in
                Euro, the second to the Euro to US Dollar exchange rate, and
                the third to the same amount converted to US Dollars according
                to the given exchange rate.`
            },
            xAxis: {
                type: 'datetime',
                accessibility: {
                    description: 'Date and time',
                    rangeDescription: 'Range: Monday, 14 Aug to Friday, 18 Aug'
                }
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
        renderTo: 'dashboard-col-2',
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
    }]
});
