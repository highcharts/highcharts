QUnit.test('Legacy - null', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            // minorTickInterval: null // default
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
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
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 'auto'
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
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
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 0.5
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
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
        chart: {
            width: 600,
            height: 250,
            marginTop: 40,
            marginBottom: 60,
            style: {
                fontFamily: 'Helvetica, Arial, sans-serif'
            }
        },
        yAxis: {
            minorTickInterval: 'auto',
            type: 'logarithmic'
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        11,
        'Auto'
    );
});

QUnit.test('Legacy - auto, deep log', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 'auto',
            type: 'logarithmic'
        },
        series: [
            {
                data: [1.001, 1.002, 1.003, 1.004]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        13,
        'Auto'
    );
});

QUnit.test('Legacy - number, log', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 0.5,
            type: 'logarithmic'
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        2,
        'Number'
    );
});

// /////////////////////////////////////////////////////////////////////////////
QUnit.test('Typed - null', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            // minorTickInterval: null // default
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
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

QUnit.test('Typed - minorTicks false', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 0.5,
            minorTicks: false
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        0,
        'False'
    );
});

QUnit.test('Typed - auto, linear', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400,
            style: {
                fontFamily: 'Helvetica, Arial, sans-serif'
            }
        },
        yAxis: {
            minorTicks: true
        },
        series: [
            {
                data: [1, 5, 2, 4, 3, 6]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        35,
        'Auto'
    );

    chart.update({
        yAxis: {
            tickAmount: 5
        }
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].ticks).length,
        5,
        'The major tick amount should match `tickAmount` option'
    );
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        20,
        'The minor tick amount should match `tickAmount` option'
    );
});

QUnit.test('Typed - number, linear', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 0.5,
            minorTicks: true
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        13,
        'Number'
    );
});

QUnit.test('Typed - auto, log', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250,
            marginTop: 40,
            marginBottom: 60,
            style: {
                fontFamily: 'Helvetica, Arial, sans-serif'
            }
        },
        yAxis: {
            minorTicks: true,
            type: 'logarithmic'
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        11,
        'Auto'
    );
});

QUnit.test('Typed - auto, deep log', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTicks: true,
            type: 'logarithmic'
        },
        series: [
            {
                data: [1.001, 1.002, 1.003, 1.004]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        13,
        'Auto'
    );
});

QUnit.test('Typed - number, log', function (assert) {
    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            minorTickInterval: 0.5,
            minorTicks: true,
            type: 'logarithmic'
        },
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });
    assert.strictEqual(
        Object.keys(chart.yAxis[0].minorTicks).length,
        2,
        'Number'
    );
});

QUnit.test('Minor ticks per major', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            animation: false
        },
        yAxis: {
            minorTicks: true,
            minorTicksPerMajor: 3
        },
        series: [{
            data: [1, 4, 3, 5]
        }]
    });

    const yAxis = chart.yAxis[0],
        xAxis = chart.xAxis[0];

    assert.strictEqual(
        yAxis.minorTickInterval,
        yAxis.tickInterval / 3,
        'Minor tick interval should be correctly calculated on linear axes'
    );

    chart.yAxis[0].update({
        tickInterval: 1,
        type: 'logarithmic'
    });

    assert.strictEqual(
        yAxis.minorTickInterval,
        yAxis.tickInterval / 3,
        'Minor tick interval should be correctly calculated on logarithmic axes'
    );

    chart.update({
        xAxis: {
            minorTicks: true,
            tickInterval: 3600000 * 24,
            minorTicksPerMajor: 3,
            type: 'datetime'
        },
        series: [{
            data: [
                [Date.UTC(2020, 0, 1), 1],
                [Date.UTC(2020, 0, 2), 2],
                [Date.UTC(2020, 0, 3), 3]
            ]
        }]
    });

    assert.strictEqual(
        xAxis.minorTickInterval,
        xAxis.tickInterval / 3,
        'Minor tick interval should be correctly calculated on datetime axes'
    );
});
