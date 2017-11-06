QUnit.test('Ticks for a single point.', function (assert) {
    var chart = Highcharts.chart('container', {
        yAxis: {
            tickPositioner: function () {
                return [0, 0.2, 0.4, 0.6, 0.8];
            }
        },
        series: [{
            data: [0.2]
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'multiple ticks from tickPositioner for a single point (#6897)'
    );

    chart.yAxis[0].update({
        tickPositioner: function () {
            return;
        }
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        -0.3,
        'single tick and increased extremes for a single point'
    );

    // Must be on init - redraw was fixing the issue
    chart = Highcharts.chart('container', {
        series: [{
            type: 'bar',
            data: [10]
        }],
        chart: {
            height: 30,
            inverted: true,
            spacing: [6, 10, 6, 10]
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        yAxis: [{
            visible: false
        }],
        xAxis: [{
            visible: false
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        1,
        'no doulbed tick for a small plot height (#7339)'
    );
});

QUnit.test(
    'Tick positions with small magnitude intervals (#6183)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 500,
                height: 400
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false
            },
            series: [{
                data: [700540999999.9757, 700541000000]
            }]

        });

        assert.ok(
            chart.yAxis[0].tickPositions.length >= 3,
            'Multiple ticks'
        );
    }
);
