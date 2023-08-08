const csvData = document.getElementById('csv').innerText;

const chartOptions = {
    xAxis: {
        type: 'category'
    },
    chart: {
        animation: false,
        type: 'column'
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'allowConnectorUpdate: true'
    },
    subtitle: {
        text: 'Drag points to update the data grid'
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            colorByPoint: true,
            dragDrop: {
                draggableY: true,
                dragPrecisionY: 1
            }
        }
    }
};

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'synchro-data',
            options: {
                csv: csvData
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
                    id: 'dashboard-col-0'
                }, {
                    responsive: {
                        small: {
                            width: '100%'
                        }
                    },
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-0',
            type: 'Highcharts',
            connector: {
                id: 'synchro-data'
            },
            sync: {
                highlight: true
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            chartOptions: chartOptions
        }, {
            cell: 'dashboard-col-1',
            connector: {
                id: 'synchro-data'
            },
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnAssignment: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            allowConnectorUpdate: false,
            chartOptions: Highcharts.merge(chartOptions, {
                title: {
                    text: 'Dragging points does not affect other components'
                },
                subtitle: {
                    useHTML: true,
                    text: 'Dragging points <em>will not update</em> the grid'
                }
            })
        }, {
            cell: 'dashboard-col-2',
            connector: {
                id: 'synchro-data'
            },
            type: 'DataGrid',
            editable: true,
            sync: {
                highlight: true
            }
        }
    ]
}, true);
