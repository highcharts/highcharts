const csvData = document.getElementById('csv').innerText.trim();

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true,
                dataTable: {
                    aliases: {
                        // Workaround for renamed series:
                        // set an alias that matches the series name
                        customName: 'water',
                        otherCustomName: 'air'
                    }
                }
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
        layouts: [{
            id: 'layout-1',
            rowClassName: 'custom-row',
            cellClassName: 'custom-cell',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            },
            {
                id: 'dashboard-row-1',
                cells: [{
                    id: 'dashboard-col-2',
                    width: '1'
                }]
            }
            ]
        }]
    },
    components: [{
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Date: 'x',
            air: 'y',
            water: 'y'
        },
        chartOptions: {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            xAxis: {
                type: 'datetime'
            }
        },
        events: {
            afterRender(e) {
                try {
                    // Potential problem: setting custom name for series
                    e.target.chart.series[0].name = 'customName';
                    e.target.chart.series[1].name = 'otherCustomName';
                } catch {} // eslint-disable-line
            }
        }
    },
    {
        cell: 'dashboard-col-2',
        connector: {
            id: 'Vitamin'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            extremes: true
        },
        dataGridOptions: {
            columns: {
                Date: {
                    cellFormatter: function () {
                        return new Date(this.value)
                            .toISOString()
                            .substring(0, 10);
                    }
                }
            }
        }
    }
    ]
}, true);
