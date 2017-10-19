QUnit.test('Legacy - null', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            //minorTickInterval: null // default
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
        chart: {
            width: 600,
            height: 250
        },
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
        chart: {
            width: 600,
            height: 250
        },
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
        chart: {
            width: 600,
            height: 250,
            marginTop: 40,
            marginBottom: 60
        },
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
        series: [{
            "data": [1.001, 1.002, 1.003, 1.004]
        }]
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

// /////////////////////////////////////////////////////////////////////////////
QUnit.test('Typed - null', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        yAxis: {
            //minorTickInterval: null // default
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
        series: [{
            "data": [1, 2, 3, 4]
        }]
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
            height: 250
        },
        yAxis: {
            minorTicks: true
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


QUnit.test('Typed - auto, log', function (assert) {

    var chart;

    chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250,
            marginTop: 40,
            marginBottom: 60
        },
        yAxis: {
            minorTicks: true,
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
        series: [{
            "data": [1.001, 1.002, 1.003, 1.004]
        }]
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
