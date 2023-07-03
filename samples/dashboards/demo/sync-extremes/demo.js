const chartOptions = {
    xAxis: {
        type: 'category'
    },
    chart: {
        type: 'bar',
        zoomType: 'x'
    },
    plotOptions: {
        series: {
            colorByPoint: true
        }
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
            rows: [
                {
                    cells: [
                        { id: 'dashboard-col-0' },
                        { id: 'dashboard-col-1' },
                        { id: 'dashboard-col-2' }
                    ]
                }, {
                    cells: [
                        {
                            id: 'dashboard-col-3',
                            height: 130
                        }
                    ]
                }, {
                    cells: [
                        { id: 'dashboard-col-4' }
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
        chartOptions: {
            xAxis: {
                type: 'category',
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'bar',
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    pointWidth: 6
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Millions',
                align: 'left',
                y: 0
            },
            legend: {
                enabled: false
            }
        }
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
        chartOptions: {
            xAxis: {
                type: 'category',
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Area km2'
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'pie',
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    innerSize: '50%',
                    colorByPoint: true,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'km2',
                align: 'left',
                y: 0
            },
            legend: {
                enabled: false
            }
        }
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
        chartOptions: {
            xAxis: {
                type: 'category',
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    marker: {
                        radius: 6,
                        enabledThreshold: 0
                    }
                },
                tooltip: {
                    headerFormat: '{point.key}',
                    format: '{y}'
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Meters',
                align: 'left',
                y: 0
            },
            legend: {
                enabled: false
            }
        }
    },
    {
        title: {
            text: ''
        },
        cell: 'dashboard-col-3',
        type: 'Highcharts',
        chartOptions: {
            xAxis: {
                visible: false
            },
            yAxis: {
                title: {
                    text: ''
                },
                height: 0
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'scatter',
                margin: 0,
                spacing: 0
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    marker: {
                        symbol: 'square'
                    }
                }
            },
            title: {
                text: ''
            },
            legend: {
                title: {
                    text: 'Cities'
                },
                enabled: true,
                padding: 0,
                floating: true,
                y: -30,
                navigation: {
                    enabled: false
                }
            },
            series: [{
                name: 'Tokyo',
                y: 5
            },
            {
                name: 'Delhi',
                y: 5
            },
            {
                name: 'Shanghai',
                y: 5
            },
            {
                name: 'Sao Paulo',
                y: 5
            },
            {
                name: 'Mexico City',
                y: 5
            },
            {
                name: 'Dhaka',
                y: 5
            },
            {
                name: 'Cairo',
                y: 5
            },
            {
                name: 'Beijing',
                y: 5
            },
            {
                name: 'Mumbai',
                y: 5
            },
            {
                name: 'Osaka',
                y: 5
            },
            {
                name: 'Karachi',
                y: 5
            },
            {
                name: 'Chongqing',
                y: 5
            },
            {
                name: 'Istanbul',
                y: 5
            },
            {
                name: 'Buenos Aires',
                y: 5
            },
            {
                name: 'Kolkata',
                y: 5
            },
            {
                name: 'Kinshasa',
                y: 5
            },
            {
                name: 'Lagos',
                y: 5
            },
            {
                name: 'Manila',
                y: 5
            },
            {
                name: 'Tianjin',
                y: 5
            },
            {
                name: 'Guangzhou',
                y: 5
            }
            ]
        }
    },
    {
        cell: 'dashboard-col-4',
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