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


    // Zoom in
    chart.yAxis[0].setExtremes(50, 100);
    assert.strictEqual(
        chart.yAxis[0].min,
        50,
        'Soft min should allow zoom'
    );
    assert.strictEqual(
        chart.yAxis[0].max,
        100,
        'Soft max should allow zoom'
    );

});

QUnit.test('softMax combined with ceiling (#6359)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        yAxis: {
            softMax: 30,
            ceiling: 40
        },
        series: [{
            data: [6, 9, 2, 6, 9, 1, 2, 2, 4, 5],
            animation: false
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].max,
        30,
        'softMax takes effect'
    );

    chart.series[0].points[0].update(50, true, false);


    assert.strictEqual(
        chart.yAxis[0].max,
        40,
        'ceiling takes effect'
    );

    chart.yAxis[0].update({
        ceiling: 20 // lower than softMax
    });
    assert.strictEqual(
        chart.yAxis[0].max,
        20,
        'Conflicting settings, ceiling takes precedence'
    );

});
