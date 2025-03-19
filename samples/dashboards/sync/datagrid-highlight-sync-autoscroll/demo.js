Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv').innerText
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-0'
                }, {
                    id: 'cell-1'
                }]
            }]
        }]
    },
    components: [{
        type: 'Highcharts',
        renderTo: 'cell-0',
        connector: {
            id: 'data',
            columnAssignment: [{
                seriesId: 'Exchange Rate',
                data: ['Date', 'Rate']
            }]
        },
        sync: {
            highlight: true
        },
        chartOptions: {
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            title: {
                text: 'USD to EUR Exchange Rate'
            }
        }
    }, {
        type: 'DataGrid',
        renderTo: 'cell-1',
        connector: {
            id: 'data'
        },
        sync: {
            highlight: {
                enabled: true,
                autoScroll: true
            }
        },
        dataGridOptions: {
            credits: {
                enabled: false
            },
            columns: [{
                id: 'Date',
                cells: {
                    formatter: function () {
                        return new Date(this.value)
                            .toISOString()
                            .substring(0, 10);
                    }
                }
            }]
        }
    }]
});
