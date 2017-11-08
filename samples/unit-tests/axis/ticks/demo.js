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

QUnit.test(
    'Ticks should be visible, when xAxis is reversed (#4175)',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            xAxis: {
                reversed: true
            },
            rangeSelector: {
                selected: 1
            },
            navigator: {
                enabled: false
            },
            series: [{
                data: [
                    [Date.UTC(2007, 7, 29), 0.7311],
                    [Date.UTC(2007, 7, 30), 0.7331],
                    [Date.UTC(2007, 7, 31), 0.7337],
                    [Date.UTC(2007, 8, 3), 0.7342],
                    [Date.UTC(2007, 8, 4), 0.7349],
                    [Date.UTC(2007, 8, 5), 0.7326],
                    [Date.UTC(2007, 8, 6), 0.7306],
                    [Date.UTC(2007, 8, 7), 0.7263],
                    [Date.UTC(2007, 8, 10), 0.7247],
                    [Date.UTC(2007, 8, 11), 0.7227],
                    [Date.UTC(2007, 8, 12), 0.7191],
                    [Date.UTC(2007, 8, 13), 0.7209],
                    [Date.UTC(2007, 8, 14), 0.7207],
                    [Date.UTC(2007, 8, 17), 0.7211],
                    [Date.UTC(2007, 8, 18), 0.7153],
                    [Date.UTC(2007, 8, 19), 0.7165],
                    [Date.UTC(2007, 8, 20), 0.7107],
                    [Date.UTC(2007, 8, 21), 0.7097],
                    [Date.UTC(2007, 8, 24), 0.7098],
                    [Date.UTC(2007, 8, 25), 0.7069],
                    [Date.UTC(2007, 8, 26), 0.7078],
                    [Date.UTC(2007, 8, 27), 0.7066],
                    [Date.UTC(2007, 8, 28), 0.7006],
                    [Date.UTC(2007, 9, 1), 0.7027],
                    [Date.UTC(2007, 9, 2), 0.7067],
                    [Date.UTC(2007, 9, 3), 0.7097],
                    [Date.UTC(2007, 9, 4), 0.7074],
                    [Date.UTC(2007, 9, 5), 0.7075],
                    [Date.UTC(2007, 9, 8), 0.7114]
                ]
            }]
        });

        assert.strictEqual(
            chart.xAxis[0].tickPositions.length > 2,
            true,
            'Ticks exist'
        );

    }
);
