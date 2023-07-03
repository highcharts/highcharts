const csvData = document.getElementById('csv').innerText;

let chartCount = 0;

const chartOptions = {
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: null
        }
    },
    chart: {
        animation: false,
        type: 'column',
        events: {
            load: function () {
                const chart = this;
                if (chartCount === 1) {
                    chart.update({
                        subtitle: {
                            useHTML: true,
                            text: 'Dragging points <em>will not update</em> the grid'
                        }
                    });
                }
                chartCount = chartCount + 1;
            }
        }
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Vitamin A in Various Foods'
    },
    subtitle: {
        text: 'Drag points to update the data grid'
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

const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'synchro-data',
            options: {
                csv: csvData,
                firstRowAsNames: true
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
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
            title: {
                text: 'allowConnectorUpdate: true'
            },
            chartOptions
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
            title: {
                text: 'allowConnectorUpdate: false'
            },
            allowConnectorUpdate: false,
            chartOptions
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
