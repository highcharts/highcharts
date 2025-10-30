const csvData = document.getElementById('csv').innerText;

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'Vitamin',
            type: 'CSV',
            csv: csvData,
            firstRowAsNames: true
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
                                id: 'dashboard-col-0'
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
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'pie'
            }
        }
    },
    {
        renderTo: 'dashboard-col-1',
        sync: {
            visibility: true,
            highlight: true,
            extremes: true
        },
        connector: {
            id: 'Vitamin'
        },
        type: 'Highcharts',
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
        renderTo: 'dashboard-col-12',
        connector: {
            id: 'Vitamin'
        },
        type: 'Grid',
        sync: {
            highlight: true
        }
    }]
}, true);
