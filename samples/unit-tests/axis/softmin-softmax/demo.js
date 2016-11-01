QUnit.test('softMin and softMax', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        yAxis: {
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        },
        series: [{
            data: [49, 50, 51],
            animation: false
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        49,
        'Basic min'
    );

    assert.strictEqual(
        chart.yAxis[0].max,
        51,
        'Basic max'
    );

    chart.yAxis[0].update({
        softMin: 0,
        softMax: 100
    });



    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'Soft min, padded'
    );

    assert.strictEqual(
        chart.yAxis[0].max,
        100,
        'Soft max, padded'
    );

    chart.series[0].setData([-50, 0, 150]);

    assert.strictEqual(
        chart.yAxis[0].min,
        -50,
        'Soft min, exceeded'
    );

    assert.strictEqual(
        chart.yAxis[0].max,
        150,
        'Soft max, exceeded'
    );

});
