const csvData = document.getElementById('csv').innerText;


const chartOptions = {
    xAxis: {
        type: 'category'
    },
    chart: {
        animation: false,
        type: 'column',
        zoomType: 'x'
    },
    title: {
        text: 'Drag points to update the data grid'
    },
    plotOptions: {
        series: {
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
            name: 'Population',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true
            }
        }]
    },
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        layouts: [
            {
                id: 'layout-1',
                rowClassName: 'custom-row',
                cellClassName: 'custom-cell',
                rows: [
                    {
                        cells: [
                            {
                                id: 'dashboard-col-0',
                                width: '50%'
                            },
                            {
                                id: 'dashboard-col-1'
                            },
                            {
                                id: 'dashboard-col-12'
                            }
                        ]
                    },
                    {
                        id: 'dashboard-row-1',
                        cells: [
                            {
                                id: 'dashboard-col-2',
                                width: '1'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    components: [{
        title: {
            text: 'extremes: true'
        },
        sync: {
            extremes: true
        },
        connector: {
            name: 'Population'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            Population: 'value'
        },
        chartOptions
    },
    {
        cell: 'dashboard-col-1',
        title: {
            text: 'extremes: true'
        },
        sync: {
            extremes: true
        },
        connector: {
            name: 'Population'
        },
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            Population: 'value'
        },
        chartOptions
    },
    {
        cell: 'dashboard-col-12',
        connector: {
            name: 'Population'
        },
        title: {
            text: 'extremes: true'
        },
        sync: {
            extremes: true
        },
        type: 'Highcharts',
        columnAssignment: {
            Town: 'x',
            Population: 'value'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                animation: false,
                type: 'scatter'
            }
        }
    },
    {
        cell: 'dashboard-col-2',
        connector: {
            name: 'Population'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            extremes: true
        }
    }]
}, true);