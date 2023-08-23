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
                cells: [
                    { id: 'dashboard-col-0' },
                    { id: 'dashboard-col-1' },
                    { id: 'dashboard-col-2' }
                ]
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
            Population: 'y'
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
            'Metro Area(km2)': 'y'
        },
        chartOptions
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
            'Highest Elevation(m)': 'y'
        },
        chartOptions
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