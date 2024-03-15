const data = [
    ['Food', 'Vitamin A'],
    ['Beef Liver', 6421],
    ['Lamb Liver', 2122],
    ['Cod Liver Oil', 1350],
    ['Mackerel', 388],
    ['Tuna', 214]
];

const chartOptions = {
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
    accessibility: {
        point: {
            descriptionFormat: 'Vitamin A content in {name}: {y} micrograms.'
        },
        description: `The first bar chart uses some example data to present
        the ability to edit the connector values by manually changing the height
        of the bars in the series, which is possible with allowConnectorUpdate
        option set to true.`
    },
    tooltip: {
        stickOnContact: true,
        valueSuffix: ' mcg'
    },
    yAxis: {
        title: {
            text: ''
        },
        accessibility: {
            description: 'amount of Vitamin A in micrograms'
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
            type: 'JSON',
            id: 'synchro-data',
            options: {
                data
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
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        connector: {
            id: 'synchro-data'
        },
        sync: {
            highlight: true
        },
        chartOptions: chartOptions
    }, {
        renderTo: 'dashboard-col-1',
        connector: {
            id: 'synchro-data'
        },
        type: 'Highcharts',
        sync: {
            highlight: true
        },
        allowConnectorUpdate: false,
        chartOptions: Highcharts.merge(chartOptions, {
            title: {
                text: 'Dragging points does not affect other components'
            },
            subtitle: {
                useHTML: true,
                text: 'Dragging points <em>will not update</em> the grid'
            },
            accessibility: {
                description: `The second bar chart uses some example data to
                show disabled editing of connector values by manually changing
                the height of bars in a series; allowConnectorUpdate option set
                to false.`
            }
        })
    }, {
        renderTo: 'dashboard-col-2',
        connector: {
            id: 'synchro-data'
        },
        type: 'DataGrid',
        sync: {
            highlight: true
        }
    }]
});
