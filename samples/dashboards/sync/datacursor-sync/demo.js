const DataCursor = Dashboards.DataCursor;
const DataTable = Dashboards.DataTable;
const cursor = new DataCursor();
const vegeTable = buildVegeTable();

// Create Dashboards.Board
Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'dashboards-layout-1',
            rows: [{
                cells: [{
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '50%'
                        }
                    },
                    id: 'highcharts-dashboards-cell-a0'
                }, {
                    responsive: {
                        small: {
                            width: '100%'
                        },
                        medium: {
                            width: '50%'
                        },
                        large: {
                            width: '50%'
                        }

                    },
                    id: 'highcharts-dashboards-cell-b0'
                }]
            }, {
                cells: [{
                    id: 'highcharts-dashboards-cell-a1'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'highcharts-dashboards-cell-a0',
            type: 'Highcharts',
            chartOptions: buildChartOptions('bar', vegeTable, cursor)
        }, {
            cell: 'highcharts-dashboards-cell-b0',
            type: 'Highcharts',
            chartOptions: buildChartOptions('pie', vegeTable, cursor)
        }, {
            cell: 'highcharts-dashboards-cell-a1',
            type: 'Highcharts',
            chartOptions: buildChartOptions('line', vegeTable, cursor)
        }
    ]
});

function buildChartOptions(type, table, cursor) {

    const typeString = type.charAt(0).toUpperCase() + type.slice(1);

    return {
        chart: {
            events: {
                load: function () {
                    const chart = this;
                    const series = chart.series[0];
                    // react to table cursor
                    cursor.addListener(table.id, 'point.mouseOver', function (e) {
                        const point = series.data[e.cursor.row];

                        if (chart.hoverPoint !== point) {
                            chart.tooltip.refresh(point);
                        }
                    });
                    cursor.addListener(table.id, 'point.mouseOut', function () {
                        chart.tooltip.hide();
                    });
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            bar: {
                colorByPoint: true
            },
            pie: {
                colorByPoint: true,
                innerSize: '60%'
            }
        },
        series: [{
            type,
            name: table.id,
            data: table.getRowObjects(0, void 0, ['name', 'y']),
            point: {
                events: {
                    // emit table cursor
                    mouseOver: function () {
                        cursor.emitCursor(table, {
                            type: 'position',
                            row: this.x,
                            state: 'point.mouseOver'
                        });
                    },
                    mouseOut: function () {
                        cursor.emitCursor(table, {
                            type: 'position',
                            row: this.x,
                            state: 'point.mouseOut'
                        });
                    }
                }
            }
        }],
        title: {
            text: table.id  + ' ' + typeString
        },
        xAxis: {
            categories: table.getColumn('name')
        },
        yAxis: {
            title: {
                enabled: false
            }
        }
    };
}

// Build table with Highcharts.Series aliases
function buildVegeTable() {
    const table = new DataTable({
        aliases: {
            name: 'vegetable',
            y: 'amount'
        },
        columns: {
            vegetable: [
                'Broccoli',
                'Carrots',
                'Corn',
                'Cucumbers',
                'Onions',
                'Potatos',
                'Spinach',
                'Tomatos'

            ],
            amount: [
                44,
                51,
                38,
                45,
                57,
                62,
                35,
                61
            ]
        },
        id: 'Vegetables'
    });

    return table;
}
