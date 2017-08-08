

QUnit.test('Gap unit', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            data: [
                [0, 0],
                [10, 1],
                [20, 2],
                [60, 6],
                [70, 7]
            ]
        }]
    });

    var series = chart.series[0];
    assert.strictEqual(
        series.graph.attr('d').lastIndexOf('M'),
        0,
        'No gap'
    );


    series.update({
        gapSize: 2
    });
    assert.notEqual(
        series.graph.attr('d').lastIndexOf('M'),
        0,
        'Has gap'
    );

    series.update({
        gapUnit: 'value'
    });

    assert.strictEqual(
        series.graph.attr('d').lastIndexOf('L'),
        -1,
        'All gaps'
    );

});