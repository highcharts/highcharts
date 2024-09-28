Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                data: [
                    ['First Column', 'Second Column'],
                    [1, 5],
                    [4, 2],
                    [3, 3],
                    [2, 4],
                    [5, 1]
                ]
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
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'data',
            columnAssignment: [{
                seriesId: 'series-0',
                data: 'First Column'
            }, {
                seriesId: 'series-1',
                data: 'Second Column'
            }]
        },
        chartOptions: {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            yAxis: [{
                reversed: true,
                max: 7,
                visible: false
            }, {
                opposite: true,
                max: 7,
                visible: false
            }],
            xAxis: [{
                categories: ['A', 'B', 'C', 'D', 'E']
            }, {
                categories: ['I', 'II', 'III', 'IV', 'V'],
                opposite: true
            }],
            plotOptions: {
                series: {
                    grouping: false
                }
            },
            series: [{
                id: 'series-0',
                name: 'First Series',
                xAxis: 1
            }, {
                id: 'series-1',
                name: 'Second Series',
                yAxis: 1
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'DataGrid',
        connector: {
            id: 'data'
        },
        dataGridOptions: {
            columnDefaults: {
                cells: {
                    editable: true
                }
            }
        }
    }]
});
