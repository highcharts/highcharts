QUnit.skip('Column chart', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Column chart with implicit X data'
        },
        series: [{
            name: 'Column series',
            dataTable: {
                columns: {
                    y: [1, 3, 2, 4]
                }
            }
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].dataMax,
        3,
        'The series should add missing X values'
    );
});

QUnit.test('Pie chart', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        series: [{
            name: 'Pie series',
            dataTable: {
                columns: {
                    name: ['Ein', 'To', 'Tre'],
                    y: [1, 2, 3]
                }
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].name,
        'Ein',
        'The first point should pick up the name'
    );
});

QUnit.test('Waterfall chart', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        series: [{
            name: 'Waterfall',
            colorByPoint: true,
            dataTable: {
                columns: {
                    x: [0, 1, 2, 3, 4, 5, 6],
                    y: [1, 4, 2, null, 5, -7, null],
                    isIntermediateSum: [
                        false, false, false, true, false, false, false
                    ],
                    isSum: [false, false, false, false, false, false, true],
                    color: [
                        'green', 'green', 'green', 'blue',
                        'green', 'red', 'blue'
                    ]
                }
            }
        }]
    });

    assert.ok(
        chart.series[0].points[3].isIntermediateSum,
        'The fourth point should be an intermediate sum'
    );
    assert.strictEqual(
        chart.series[0].points[3].color,
        'blue',
        'The color column should be picked up'
    );
});
