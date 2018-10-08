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

    chart.yAxis[0].update({
        tickAmount: 10
    });
    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'When softThreshold is true (by default), tick amount should not ' +
        'extend the ticks below 0'
    );


    chart.series[0].points[0].update(10);
    assert.strictEqual(
        chart.yAxis[0].min < 7 && chart.yAxis[0].max > 14,
        true,
        'ticks added via tickAmount increase both min and max (#3965)'
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

QUnit.test('The tickPositions option', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },

        xAxis: [{
            tickmarkPlacement: 'on',
            startOnTick: false,
            categories: ['Jan 2011', 'Feb 2011', 'Mar 2011', 'Apr 2011',
                'May 2011', 'Jun 2011', 'Jul 2011', 'Aug 2011', 'Sep 2011',
                'Oct 2011', 'Nov 2011', 'Dec 2011', 'Jan 2012', 'Feb 2012',
                'Mar 2012', 'Apr 2012', 'May 2012', 'Jun 2012', 'Jul 2012',
                'Aug 2012', 'Sep 2012', 'Oct 2012', 'Nov 2012', 'Dec 2012',
                'Jan 2013'],
            tickPositions: [0, 7, 15, 24]

        }],

        series: [{
            data: [134002, 135188, 135647, 136552, 166109, 166769, 141139,
                141879, 140443, 141188, 178745, 179790, 141385, 142161, 143365,
                144679, 175150, 141385, 142161, 143365, 144679, 175150, 144679,
                175150, 175150]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].tickPositions.toString(),
        '0,7,15,24',
        'Rendered positions should respect the given option'
    );

    // Zoom between two ticks
    chart.xAxis[0].setExtremes(8, 14);

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        0,
        'No extra ticks should be inserted when zooming between explicit ' +
        'ticks (#7463)'
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

QUnit.test(
    'tickPixelInterval option',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                height: 300
            },
            subtitle: {
                text: 'test'
            },
            yAxis: {
                tickPixelInterval: 1
            },
            series: [{
                data: [6, -8.4, 6.5, 4]
            }]
        });

        assert.ok(
            chart.yAxis[0].tickPositions.indexOf(0) !== -1,
            '0-tick on yAxis exists (#8129)'
        );
    }
);
// Highcharts v4.0.1, Issue #3195
// No ticks on a short axis with startOnTick and endOnTick = false
QUnit.test('No ticks on short axis (#3195)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 180
        },
        yAxis: {
            minorTickInterval: 'auto',
            endOnTick: false,
            startOnTick: false,
            title: {
                text: ''
            }
        },
        series: [{
            data: [380884, 380894, 380894.19, 381027.93, 386350.57, 381027.93, 343328.53, 343560.03, 343364.04, 343364.04, 343364.04, 343364.04]
        }, {
            data: [370207, 367742, 367309, 370140, 374598, 369605, 332312, 330942.6462461687, 331200, 333260, 332632, 329863]
        }, {
            data: [217020, 217020, 217020, 217020, 217020, 217020, 217020, 217020.83795782478, 217020, 217020, 217020, 217020]
        }]
    });

    var yAxis = chart.yAxis[0],
        yAxisTick = yAxis.ticks,
        tickText = yAxis.labelGroup.element.childNodes[0].textContent,
        listOfGridNodes = yAxis.gridGroup.element.childNodes;

    assert.notStrictEqual(
        yAxisTick,
        undefined,
        "No tick is showing"
    );
    assert.strictEqual(
        tickText,
        "300k",
        "The content of the tick should be 300k"
    );
    assert.ok(
        listOfGridNodes.length > 0,
        "Grid lines is not visible"
    );
});