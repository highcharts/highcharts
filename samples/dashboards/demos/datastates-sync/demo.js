const DataStates = Dashboards.DataStates;
const DataTable = Dashboards.DataTable;
const states = new DataStates();
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
            chartOptions: buildChartOptions('bar', vegeTable, states)
        }, {
            cell: 'highcharts-dashboards-cell-b0',
            type: 'Highcharts',
            chartOptions: buildChartOptions('line', vegeTable, states)
        }, {
            cell: 'highcharts-dashboards-cell-a1',
            type: 'Highcharts',
            chartOptions: buildChartOptions('pie', vegeTable, states)
        }
    ]
});

// Build chart options for each HighchartsComponent
function buildChartOptions(type, table, states) {
    return {
        chart: {
            events: {
                load: function () {
                    const chart = this;
                    const series = chart.series[0];

                    // react to table states
                    states.addListener(table.id, 'point.mouseOver', function (e) {
                        const point = series.data[e.cursor.row];

                        if (chart.hoverPoint !== point) {
                            chart.tooltip.refresh(point);
                        }
                    });
                    states.addListener(table.id, 'point.mouseOut', function () {
                        chart.tooltip.hide();
                    });
                }
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            type,
            name: table.id,
            data: table.getRowObjects(0, void 0, ['name', 'y']),
            point: {
                events: {
                    // emit table states
                    mouseOver: function () {
                        states.emitCursor(table, {
                            type: 'position',
                            row: this.x,
                            state: 'point.mouseOver'
                        });
                    },
                    mouseOut: function () {
                        states.emitCursor(table, {
                            type: 'position',
                            row: this.x,
                            state: 'point.mouseOut'
                        });
                    }
                }
            }
        }],
        title: {
            text: table.id
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
    }, 'Vegetables');

    table.setColumnAlias('name', 'vegetable');
    table.setColumnAlias('y', 'amount');

    return table;
}
