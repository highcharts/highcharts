Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'csv-1',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv1').innerText
            }
        }, {
            id: 'csv-2',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv2').innerText
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: [{
            id: 'csv-1',
            columnAssignment: [{
                seriesId: 'Y2020',
                data: ['Name', 'Y2020']
            }, {
                seriesId: 'Y2021',
                data: ['Name', 'Y2021']
            }, {
                seriesId: 'Y2022',
                data: ['Name', 'Y2022']
            }]
        }, {
            id: 'csv-2',
            columnAssignment: [{
                seriesId: 'pieChart',
                data: {
                    name: 'Category',
                    y: 'Total'
                }
            }]
        }],
        sync: {
            highlight: true
        },
        chartOptions: {
            chart: {
                animation: false
            },
            xAxis: {
                type: 'category'
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            series: [{
                type: 'column',
                name: '2020',
                id: 'Y2020'
            }, {
                type: 'column',
                name: '2021',
                id: 'Y2021'
            }, {
                type: 'column',
                name: '2022',
                id: 'Y2022'
            }, {
                type: 'pie',
                name: 'pieChart',
                id: 'pieChart',
                center: [75, 65],
                size: 100,
                innerSize: '70%',
                dataLabels: {
                    enabled: false
                }
            }]
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'DataGrid',
        title: {
            text: 'csv 1'
        },
        connector: {
            id: 'csv-1'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            columnDefaults: {
                cells: {
                    editable: true
                }
            }
        }
    }, {
        renderTo: 'dashboard-col-2',
        type: 'DataGrid',
        title: {
            text: 'csv 2'
        },
        connector: {
            id: 'csv-2'
        },
        sync: {
            highlight: true
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
