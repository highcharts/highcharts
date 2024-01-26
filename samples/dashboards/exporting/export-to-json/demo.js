const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
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
            items: ['editMode', {
                id: 'export-dashboard',
                text: 'Export dashboard',
                type: 'button',
                events: {
                    click: function () {
                        document.querySelectorAll('#output')[0].value =
                            JSON.stringify(
                                this.menu.editMode.board.getOptions(),
                                null,
                                2
                            );
                    }
                }
            }]
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
                    }
                ]
            }
        ]
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
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            chart: {
                type: 'pie'
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'y'
        },
        chartOptions: {
            xAxis: {
                type: 'category'
            },
            chart: {
                animation: false,
                type: 'column'
            }
        }
    },
    {
        cell: 'dashboard-col-12',
        connector: {
            id: 'Vitamin'
        },
        type: 'DataGrid',
        editable: true,
        sync: {
            highlight: true
        }
    }]
}, true);
