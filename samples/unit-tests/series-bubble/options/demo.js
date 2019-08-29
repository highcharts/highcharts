QUnit.test('defaultOptions', function (assert) {
    var options = Highcharts.getOptions(),
        bubble = options.plotOptions.bubble;
    // stickyTracking is true to avoid hiding the tooltip when follow pointer is true.
    assert.strictEqual(
        bubble.stickyTracking,
        true,
        'stickyTracking should default to true.'
    );
});

QUnit.test('Axis extremes', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },
        xAxis: {
            min: 2
        },
        series: [{
            data: [{
                x: 1,
                y: 1,
                z: 1
            }]
        }, {
            data: [{
                x: 3,
                y: 3,
                z: 3
            }]
        }]
    });
    assert.strictEqual(
        chart.xAxis[0].min,
        2,
        'Axis min should be exactly 2.'
    );
    assert.ok(
        chart.xAxis[0].max > 3,
        'Axis max should be more than max data (#8902)'
    );
});

QUnit.test('Negative values', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble'
        },

        series: [{
            data: [
                [9, -10, -10],
                [58, 15, -5],
                [98, 5, 0],
                [68, -10, 5],
                [51, 50, 10]
            ],
            displayNegative: true,
            zThreshold: -7.5
        }]

    });

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.negative;
        }),
        [true, false, false, false, false],
        'Only points below zThreshold should have point.negative'
    );

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.graphic.hasClass('highcharts-negative');
        }),
        [true, false, false, false, false],
        'Only points below zThreshold should have negative class name'
    );
});
