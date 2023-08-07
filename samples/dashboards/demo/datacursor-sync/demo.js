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
                    id: 'highcharts-dashboards-cell-a0'
                }, {
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
            chartOptions: buildChartOptions('line', vegeTable, cursor)
        }, {
            cell: 'highcharts-dashboards-cell-a1',
            type: 'Highcharts',
            chartOptions: buildChartOptions('pie', vegeTable, cursor)
        }
    ]
});

// Build chart options for each HighchartsComponent
function buildChartOptions(type, table, cursor) {
    const typeString = type.charAt(0).toUpperCase() + type.slice(1);

    return {
        chart: {
            spacing: [20, 20, 0, 20],
            margin: [50, 50, 80, 100],
            events: {
                load: function () {
                    const chart = this;
                    const series = chart.series[0];
                    if (series.userOptions.type === 'pie') {

                        chart.update({
                            chart: {
                                margin: 50,
                                spacing: 30
                            },
                            legend: {
                                enabled: true,
                                layout: 'vertical',
                                align: 'center',
                                x: -200,
                                verticalAlign: 'middle'
                            }
                        }, false);
                        series.update({
                            showInLegend: true,
                            innerSize: '60%',
                            dataLabels: {
                                enabled: false
                            }
                        });
                    }

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
            series: {
                colorByPoint: true
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

    table.setColumnAlias('name', 'vegetable');
    table.setColumnAlias('y', 'amount');

    return table;
}
