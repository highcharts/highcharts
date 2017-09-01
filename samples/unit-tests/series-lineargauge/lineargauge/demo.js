QUnit.test('Linearguage', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'lineargauge'
        },
        series: [{
            data: [5, 7, 2, null, 9]
        }]
    });

    assert.deepEqual(
        chart.series[0].points.length,
        5,
        'Series successfully added'
    );

    chart.series[0].addPoint({
        y: 20
    });

    assert.deepEqual(
        chart.series[0].points.length,
        6,
        'addPoint'
    );

    chart.series[0].removePoint(0);
    assert.deepEqual(
        chart.series[0].points.length,
        5,
        'removePoint'
    );
});