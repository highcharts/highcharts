/**
 * Unit tests for flat data, where one or more data points have the same value.
 */


QUnit.test('Line series', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        series: [{
            data: [1.333333333, 1.333333333]
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].tickPositions.length,
        1,
        'One tick in the middle'
    );

    chart.yAxis[0].update({
        allowDecimals: false
    });

    assert.strictEqual(
        chart.yAxis[0].tickPositions.toString(),
        '1,2',
        'Now two ticks (#6274)'
    );

    chart.series[0].setData([1, 1]);
    assert.strictEqual(
        chart.yAxis[0].tickPositions.toString(),
        '1',
        'Now one tick (#6563)'
    );

});

QUnit.test('Column series, inferred threshold', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 250
        },
        series: [{
            data: [1.333333333, 1.333333333],
            type: 'column'
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].tickPositions.toString(),
        '0,1,2',
        'Ticks from threshold through points'
    );

});
