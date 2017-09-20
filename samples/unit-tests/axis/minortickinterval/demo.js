QUnit.test('Legacy - null', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        yAxis: {
            minorTickInterval: null // default
        },
        series: [{
            "data": [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].tickPositions.toString(),
        '0,2,4,6',
        'Null'
    );
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        0,
        'Null'
    );
});

QUnit.test('Legacy - auto, linear', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        yAxis: {
            minorTickInterval: 'auto'
        },
        series: [{
            "data": [1, 2, 3, 4]
        }]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        15,
        'Auto'
    );
});

QUnit.test('Legacy - number, linear', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        yAxis: {
            minorTickInterval: 0.5
        },
        series: [{
            "data": [1, 2, 3, 4]
        }]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        13,
        'Number'
    );
});


QUnit.test('Legacy - auto, log', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        yAxis: {
            minorTickInterval: 'auto',
            type: 'logarithmic'
        },
        series: [{
            "data": [1, 2, 3, 4]
        }]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        11,
        'Auto'
    );
});

QUnit.test('Legacy - number, log', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        yAxis: {
            minorTickInterval: 0.5,
            type: 'logarithmic'
        },
        series: [{
            "data": [1, 2, 3, 4]
        }]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        2,
        'Number'
    );
});
