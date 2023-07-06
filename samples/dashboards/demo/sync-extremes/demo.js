const chartOptions = {
    xAxis: {
        type: 'category'
    },
    chart: {
        type: 'column',
        zoomType: 'x'
    },
    title: {
        text: ''
    }
};

const csv = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Population',
            type: 'CSV',
            options: {
                csv,
                firstRowAsNames: true
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0',
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    }
                }, {
                    id: 'dashboard-col-1',
                    responsive: {
                        small: {
                            width: '100%'
                        }

                    }
                }, {
                    id: 'dashboard-col-2',
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    }
                }]
            }, {
                cells: [
                    { id: 'dashboard-col-3' }
                ]
            }]
        }]
    },
    components: [{
        title: {
            text: 'Population'
        },
        sync: {
            extremes: true
        },
        connector: {
            id: 'Population'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            Population: 'y',
            'Metro Area(km2)': null,
            'Highest Elevation(m)': null
        },
        chartOptions
    },
    {
        cell: 'dashboard-col-1',
        title: {
            text: 'Metropolitan area'
        },
        sync: {
            extremes: true
        },
        connector: {
            id: 'Population'
        },
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            Population: null,
            'Metro Area(km2)': 'y',
            'Highest Elevation(m)': null
        },
        chartOptions: Highcharts.merge(chartOptions, {
            plotOptions: {
                series: {
                    colorIndex: 3
                }
            }
        })
    },
    {
        cell: 'dashboard-col-2',
        connector: {
            id: 'Population'
        },
        title: {
            text: 'Highest Elevation'
        },
        sync: {
            extremes: true
        },
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            Population: null,
            'Metro Area(km2)': null,
            'Highest Elevation(m)': 'y'
        },
        chartOptions: Highcharts.merge(chartOptions, {
            plotOptions: {
                series: {
                    colorIndex: 2
                }
            }
        })
    },
    {
        cell: 'dashboard-col-3',
        connector: {
            id: 'Population'
        },
        type: 'DataGrid',
        sync: {
            extremes: true
        },
        dataGridOptions: {
            editable: false
        }
    }]
}, true);