QUnit.test('Boosted series show/hide', function (assert) {
    var chart = Highcharts.chart('container', {
        boost: {
            // Do not allow the chart to force chart-wide boosting
            allowForce: false
        },
        plotOptions: {
            series: {
                boostThreshold: 1
            }
        },
        series: [
            {
                data: [1, 3, 2, 4],
                visible: false
            },
            {
                data: [4, 2, 5, 3]
            }
        ]
    });

    const s = chart.series[0],
        blankPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    assert.strictEqual(
        s.boost.target.attr('href'),
        blankPixel,
        'Empty image for the initially hidden series'
    );

    s.show();

    assert.notStrictEqual(
        s.boost.target.attr('href'),
        blankPixel,
        'Painted image for the visible series'
    );

    s.hide();
    assert.strictEqual(
        s.boost.target.attr('href'),
        blankPixel,
        'Empty image for the dynamically hidden series'
    );
});

QUnit.test('Boosted and not boosted series - visibility', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    boostThreshold: 1000,
                    data: [10, 3]
                },
                {
                    boostThreshold: 1,
                    data: [5, 10]
                }
            ]
        }),
        series = chart.series[0];

    series.hide();
    series.show();
    series.hide();

    assert.strictEqual(
        series.markerGroup.attr('visibility'),
        'hidden',
        'Markers are hidden altogether with series even in the not boosted ' +
        'series (#10013).'
    );
});

QUnit.test('Marker group zooming and visibility', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'xy'
        },
        boost: {
            enabled: true
        },
        plotOptions: {
            series: {
                boostThreshold: 25,
                cropThreshold: 1
            }
        },
        series: [{
            data: [
                62, 10, 50, 41, 31, 80, 49, 90,
                84, 85, 61, 25, 67, 96, 25, 46,
                10, 11, 10, 67, 89, 16, 82, 23,
                99, 70, 34, 49, 90, 73, 56, 76,
                35, 58
            ]
        }, {
            data: [
                33, 78, 67, 46, 81, 88, 47, 74,
                78, 74, 47, 64, 79, 69, 64, 96,
                47, 76, 79, 70, 71, 32, 24, 84,
                26, 61, 76, 88, 35, 84, 72, 79,
                86, 95
            ]
        }]
    });

    const series1 = chart.series[0],
        series2 = chart.series[1],
        controller = new TestController(chart);

    controller.pan([150, 150], [300, 300]);

    assert.notStrictEqual(
        series1.markerGroup,
        undefined,
        'First series should have markerGroups'
    );

    assert.notStrictEqual(
        series2.markerGroup,
        undefined,
        'Second series should have markerGroups'
    );

    assert.notStrictEqual(
        series1.markerGroup,
        series2.markerGroup,
        'Both series should have unique markerGroups'
    );

    series2.setVisible(false);

    assert.strictEqual(
        series2.markerGroup.visibility,
        'hidden',
        'Second series markerGroup should be hidden'
    );
});
