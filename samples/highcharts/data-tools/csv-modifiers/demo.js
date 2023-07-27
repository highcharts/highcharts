const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'counties-gdp',
            type: 'CSV',
            options: {
                csv: csvData,
                firstColumnsAsNames: true,
                dataModifier: {
                    type: 'Chain',
                    chain: [{
                        type: 'Invert'
                    }, {
                        type: 'Range',
                        ranges: [{
                            column: 'columnNames',
                            minValue: '1961',
                            maxValue: '2021'
                        }]
                    }]
                }
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{

        connector: {
            id: 'counties-gdp'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        _columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value',
            Iron: null
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'counties-gdp'
            }
        }
    },
    {
        cell: 'dashboard-col-1',

        connector: {
            id: 'counties-gdp'
        },
        type: 'Highcharts',
        _columnAssignment: {
            Food: 'x',
            'Vitamin A': null,
            Iron: 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            title: {
                text: 'Iron'
            },
            chart: {
                animation: false,
                type: 'column'
            }
        }
    }, {
        cell: 'dashboard-col-2',
        connector: {
            id: 'counties-gdp'
        },
        type: 'DataGrid',
        editable: true
    }]
}, true).then(board => console.log(board));
